import json
import anthropic
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from sqlalchemy import select
from api.models import db, Chef, Cook, Waiter, Manager

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
