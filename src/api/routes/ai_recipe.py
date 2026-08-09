import json
import anthropic
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from sqlalchemy import select
from api.models import db, Chef, Cook, Waiter, Manager, Recipe, RecipeIngredient

ai_recipe = Blueprint("airecipebp", __name__)

# El cliente lee la variable de entorno ANTHROPIC_API_KEY automáticamente
client = anthropic.Anthropic()

# Schema que fuerza a Claude a devolver siempre esta forma exacta de JSON
RECIPE_SCHEMA = {
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
            "description": "Nombre del plato identificado en la imagen"
        },
        "steps": {
            "type": "string",
            "description": "Pasos de preparación resumidos en un único texto, máximo 280 caracteres"
        },
        "ingredients": {
            "type": "array",
            "description": "Ingredientes identificados junto a su cantidad aproximada",
            "items": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "amount": {"type": "number"}
                },
                "required": ["name", "amount"],
                "additionalProperties": False
            }
        }
    },
    "required": ["name", "steps", "ingredients"],
    "additionalProperties": False
}

CALORIES_SCHEMA = {
    "type": "object",
    "properties": {
        "calories": {
            "type": "integer",
            "description": "Estimación del total de calorías (kcal) de la receta completa"
        }
    },
    "required": ["calories"],
    "additionalProperties": False
}

def get_current_user():
    email = get_jwt_identity()
    claims = get_jwt()
    role = claims["role"]
    models = {"chef": Chef, "cook": Cook, "waiter": Waiter, "manager": Manager}
    user_model = models[role]
    current_user = db.session.scalar(select(user_model).where(user_model.email == email))
    return current_user, role

#####################################################################
##### CHEF
# POST: el chef manda la img_url de Cloudinary y recibe una receta generada por IA.
# No se guarda en la base de datos aquí: el chef la revisa/edita y la guarda con
# el endpoint de crear receta que ya existe.
@ai_recipe.route("/restaurants/<int:restaurant_id>/generate_recipe", methods=["POST"])
@jwt_required()
def generate_recipe_from_image(restaurant_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "chef":
        return jsonify({"message": "Access forbidden"}), 403
    if current_user.restaurant_id != restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403

    body = request.get_json()
    if not body or "img_url" not in body or body["img_url"] == "":
        return jsonify({"message": "Missing info. Body must include 'img_url'"}), 400

    try:
        response = client.messages.create(
            model="claude-opus-5",
            max_tokens=1024,
            thinking={"type": "disabled"},
            output_config={"format": {"type": "json_schema", "schema": RECIPE_SCHEMA}},
            messages=[{
                "role": "user",
                "content": [
                    {"type": "image", "source": {"type": "url", "url": body["img_url"]}},
                    {
                        "type": "text",
                        "text": (
                            "Identifica el plato de comida de esta imagen y genera una receta en "
                            "español: un nombre, los pasos de preparación resumidos en un único "
                            "texto, y una lista de ingredientes con la cantidad aproximada de cada "
                            "uno (solo el número, sin unidad)."
                        )
                    }
                ]
            }]
        )
    except anthropic.APIStatusError as e:
        return jsonify({"message": f"Error calling Claude API: {e.message}"}), 502
    except anthropic.APIConnectionError:
        return jsonify({"message": "Could not reach the Claude API"}), 502

    if response.stop_reason == "refusal":
        return jsonify({"message": "The AI declined to process this image"}), 422

    generated_recipe = json.loads(response.content[0].text)
    return jsonify(generated_recipe), 200

#####################################################################
##### CHEF
# POST: el chef pide una estimación de calorías a partir de los ingredientes
# que la receta ya tiene guardados. El resultado se guarda en Recipe.calories.
@ai_recipe.route("/restaurants/<int:restaurant_id>/recipes/<int:recipe_id>/calculate_calories", methods=["POST"])
@jwt_required()
def calculate_recipe_calories(restaurant_id, recipe_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "chef":
        return jsonify({"message": "Access forbidden"}), 403
    if current_user.restaurant_id != restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403

    single_recipe = db.session.scalar(select(Recipe).where(
        Recipe.id == recipe_id, Recipe.restaurant_id == restaurant_id
    ))
    if not single_recipe:
        return jsonify({"message": "Recipe not found"}), 404

    recipe_ingredients = db.session.scalars(
        select(RecipeIngredient).where(RecipeIngredient.recipe_id == recipe_id)
    ).all()
    if not recipe_ingredients:
        return jsonify({"message": "This recipe has no ingredients yet. Add ingredients before calculating calories"}), 400

    ingredients_text = "\n".join(
        f"- {ri.ingredient.name}: {ri.amount}" for ri in recipe_ingredients
    )

    try:
        response = client.messages.create(
            model="claude-opus-5",
            max_tokens=2048,
            output_config={"format": {"type": "json_schema", "schema": CALORIES_SCHEMA}},
            messages=[{
                "role": "user",
                "content": (
                    f"Receta: {single_recipe.name}\n"
                    f"Ingredientes (nombre: cantidad, sin unidad explícita, asume la unidad "
                    f"más habitual para cada ingrediente):\n{ingredients_text}\n\n"
                    "Estima el total de calorías (kcal) de la receta completa."
                )
            }]
        )
    except anthropic.APIStatusError as e:
        return jsonify({"message": f"Error calling Claude API: {e.message}"}), 502
    except anthropic.APIConnectionError:
        return jsonify({"message": "Could not reach the Claude API"}), 502

    if response.stop_reason == "refusal":
        return jsonify({"message": "The AI declined to process this recipe"}), 422

    # Con el thinking activado, content[0] puede ser el bloque de pensamiento
    # interno en vez del texto con el JSON, así que buscamos el bloque de texto.
    text_block = next(block for block in response.content if block.type == "text")
    result = json.loads(text_block.text)
    single_recipe.calories = result["calories"]
    db.session.commit()

    return jsonify(single_recipe.serialize()), 200
