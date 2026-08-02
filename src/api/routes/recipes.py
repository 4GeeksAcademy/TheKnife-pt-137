from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt, create_access_token
from sqlalchemy import select
from api.models import db, Recipe, RecipeIngredient

recipe = Blueprint("recipebp", __name__)

@recipe.route("/recipes")
def get_recipes():
    all_recipes = db.session.scalars(select(Recipe)).all() # AQUÍ HAY QUE AÑADIR QUE SOLO DEVUELVA LAS DEL PROPIO RESTAURANTE
    all_recipes_dicts = [rec.serialize() for rec in all_recipes]
    return jsonify(list(all_recipes_dicts)), 200

@recipe.route("/recipes/<int:recipe_id>")
def get_single_recipe(recipe_id):
    single_recipe = db.session.scalar(
        select(Recipe).where(Recipe.id == recipe_id) # AQUÍ HAY QUE AÑADIR QUE SOLO DEVUELVA LAS DEL PROPIO RESTAURANTE
    )
    if not single_recipe:
        return jsonify({"message": "Recipe not found"}), 404
    return jsonify(single_recipe.serialize()), 200

@recipe.route("/recipes", methods=["POST"])
def create_recipe():
    body = request.get_json()
    recipe_mandatory_schema = ["name", "steps"]
    for key in recipe_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({
                "message": "Missing info. Body must include 'name' and 'steps', and optional 'img_url'"
            }), 400
    new_recipe = Recipe(
        name=body.get("name"),
        steps=body.get("steps"),
        img_url=body.get("img_url")
    )
    db.session.add(new_recipe)
    db.session.commit()
    return jsonify(new_recipe.serialize()), 200

@recipe.route("/recipes/<int:recipe_id>", methods=["DELETE"])
def delete_recipe(recipe_id):
    recipe_to_delete = db.session.scalar(
        select(Recipe).where(Recipe.id == recipe_id)
    )
    if not recipe_to_delete:
        return jsonify({"message": "Recipe not found"}), 404


    recipe_ingredients_to_delete = db.session.scalars(
        select(RecipeIngredient).where(RecipeIngredient.recipe_id == recipe_id)
    ).all()

    for ri in recipe_ingredients_to_delete:
        db.session.delete(ri)


    db.session.delete(recipe_to_delete)
    db.session.commit()
    return jsonify({"message": "Recipe deleted successfully"}), 200

@recipe.route("/recipes/<int:recipe_id>", methods=["PUT"])
def edit_recipe(recipe_id):
    recipe_to_edit = db.session.scalar(
        select(Recipe).where(Recipe.id == recipe_id)
    )
    if not recipe_to_edit:
        return jsonify({"message": "Recipe not found"}), 404
    body = request.get_json()
    recipe_mandatory_schema = ["name", "steps"]
    for key in recipe_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({
                "message": "Missing info. Body must include 'name' and 'steps'. 'img_url it's optional'"
            }), 400
    for key in body:
        setattr(recipe_to_edit, key, body[key])
    db.session.commit()
    return jsonify(recipe_to_edit.serialize()), 200

