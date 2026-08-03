from flask import Blueprint, jsonify, request
from sqlalchemy import select
from api.models import db, RecipeIngredient   # <-- ajusta el import si tu modelo está en otro módulo

recipe_ingredient = Blueprint("recipeingredientbp", __name__)

# -----------------------------------------
# GET: obtener TODOS los recipe_ingredient
# -----------------------------------------
@recipe_ingredient.route("/recipe-ingredients")
def get_recipe_ingredients():
    all_recipe_ingredients = db.session.scalars(select(RecipeIngredient)).all()
    all_recipe_ingredients_dicts = [ri.serialize() for ri in all_recipe_ingredients]
    return jsonify(list(all_recipe_ingredients_dicts)), 200


# --------------------------------------------------
# GET: obtener UN recipe_ingredient concreto por id
# --------------------------------------------------
@recipe_ingredient.route("/recipe-ingredients/<int:recipe_ingredient_id>")
def get_single_recipe_ingredient(recipe_ingredient_id):
    single_recipe_ingredient = db.session.scalar(
        select(RecipeIngredient).where(RecipeIngredient.id == recipe_ingredient_id)
    )

    if not single_recipe_ingredient:
        return jsonify({"message": "Recipe ingredient not found"}), 404

    return jsonify(single_recipe_ingredient.serialize()), 200


# ---------------------------------------------------------
# GET (extra útil): obtener todos los ingredientes de una receta
# ---------------------------------------------------------
@recipe_ingredient.route("/recipes/<int:recipe_id>/ingredients")
def get_ingredients_by_recipe(recipe_id):
    recipe_ingredients = db.session.scalars(
        select(RecipeIngredient).where(RecipeIngredient.recipe_id == recipe_id)
    ).all()

    recipe_ingredients_dicts = [ri.serialize() for ri in recipe_ingredients]
    return jsonify(recipe_ingredients_dicts), 200


# -----------------------------------------
# POST: crear un nuevo recipe_ingredient
# -----------------------------------------
@recipe_ingredient.route("/recipe-ingredients", methods=["POST"])
def create_recipe_ingredient():
    body = request.get_json()

    recipe_ingredient_mandatory_schema = ["ingredient_id", "recipe_id", "amount"]

    for key in recipe_ingredient_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({
                "message": "Missing info. Body must include 'ingredient_id', 'recipe_id' and 'amount'."
            }), 400

    new_recipe_ingredient = RecipeIngredient(
        ingredient_id=body.get("ingredient_id"),
        recipe_id=body.get("recipe_id"),
        amount=body.get("amount")
    )

    db.session.add(new_recipe_ingredient)
    db.session.commit()

    return jsonify(new_recipe_ingredient.serialize()), 200


# -----------------------------------------
# DELETE: eliminar un recipe_ingredient
# -----------------------------------------
@recipe_ingredient.route("/recipe-ingredients/<int:recipe_ingredient_id>", methods=["DELETE"])
def delete_recipe_ingredient(recipe_ingredient_id):
    recipe_ingredient_to_delete = db.session.scalar(
        select(RecipeIngredient).where(RecipeIngredient.id == recipe_ingredient_id)
    )

    if not recipe_ingredient_to_delete:
        return jsonify({"message": "Recipe ingredient not found"}), 404

    db.session.delete(recipe_ingredient_to_delete)
    db.session.commit()

    return jsonify({"message": "Recipe ingredient deleted successfully"}), 200


# -----------------------------------------
# PUT: editar un recipe_ingredient
# -----------------------------------------
@recipe_ingredient.route("/recipe-ingredients/<int:recipe_ingredient_id>", methods=["PUT"])
def edit_recipe_ingredient(recipe_ingredient_id):
    recipe_ingredient_to_edit = db.session.scalar(
        select(RecipeIngredient).where(RecipeIngredient.id == recipe_ingredient_id)
    )

    if not recipe_ingredient_to_edit:
        return jsonify({"message": "Recipe ingredient not found"}), 404

    body = request.get_json()
    recipe_ingredient_mandatory_schema = ["ingredient_id", "recipe_id", "amount"]

    for key in recipe_ingredient_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({
                "message": "Missing info. Body must include 'ingredient_id', 'recipe_id' and 'amount'."
            }), 400

    for key in body:
        setattr(recipe_ingredient_to_edit, key, body[key])

    db.session.commit()

    return jsonify(recipe_ingredient_to_edit.serialize()), 200
