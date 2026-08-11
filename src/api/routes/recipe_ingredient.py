from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from sqlalchemy import select
from api.models import db, RecipeIngredient, Recipe, Chef, Cook, Waiter
from api.routes.ingredients import ensure_ingredient_image

recipe_ingredient = Blueprint("recipeingredientbp", __name__)

def get_current_user():
    email = get_jwt_identity()
    claims = get_jwt()
    role = claims["role"]
    models = {"chef": Chef, "cook": Cook, "waiter": Waiter}
    user_model = models[role]
    current_user = db.session.scalar(select(user_model).where(user_model.email == email))
    return current_user, role

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


#####################################################################
##### CHEF / COOK #####
# GET the ingredients of a recipe of the restaurant (chef or cook)
@recipe_ingredient.route("/restaurants/<int:restaurant_id>/recipes/<int:recipe_id>/ingredients")
@jwt_required()
def get_restaurant_recipe_ingredients(restaurant_id, recipe_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role not in ["chef", "cook"]:
        return jsonify({"message": "Access forbidden"}), 403
    if current_user.restaurant_id != restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403
    recipe = db.session.scalar(select(Recipe).where(
        Recipe.id == recipe_id, Recipe.restaurant_id == restaurant_id
    ))
    if not recipe:
        return jsonify({"message": "Recipe not found"}), 404
    recipe_ingredients = db.session.scalars(
        select(RecipeIngredient).where(RecipeIngredient.recipe_id == recipe_id)
    ).all()
    for ri in recipe_ingredients:
        ensure_ingredient_image(ri.ingredient)
    return jsonify([ri.serialize() for ri in recipe_ingredients]), 200

# POST chef adds an ingredient to a recipe of his restaurant
@recipe_ingredient.route("/restaurants/<int:restaurant_id>/recipes/<int:recipe_id>/ingredients", methods=["POST"])
@jwt_required()
def chef_add_recipe_ingredient(restaurant_id, recipe_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "chef":
        return jsonify({"message": "Access forbidden"}), 403
    if current_user.restaurant_id != restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403
    recipe = db.session.scalar(select(Recipe).where(
        Recipe.id == recipe_id, Recipe.restaurant_id == restaurant_id
    ))
    if not recipe:
        return jsonify({"message": "Recipe not found"}), 404
    body = request.get_json()
    recipe_ingredient_mandatory_schema = ["ingredient_id", "amount"]
    for key in recipe_ingredient_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Missing info. Body must include 'ingredient_id' and 'amount'."}), 400
    new_recipe_ingredient = RecipeIngredient(
        ingredient_id=body.get("ingredient_id"),
        recipe_id=recipe_id,
        amount=body.get("amount")
    )
    db.session.add(new_recipe_ingredient)
    db.session.commit()
    return jsonify(new_recipe_ingredient.serialize()), 200

# PUT chef edits an ingredient of a recipe of his restaurant
@recipe_ingredient.route("/restaurants/<int:restaurant_id>/recipes/<int:recipe_id>/ingredients/<int:recipe_ingredient_id>", methods=["PUT"])
@jwt_required()
def chef_edit_recipe_ingredient(restaurant_id, recipe_id, recipe_ingredient_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "chef":
        return jsonify({"message": "Access forbidden"}), 403
    if current_user.restaurant_id != restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403
    recipe = db.session.scalar(select(Recipe).where(
        Recipe.id == recipe_id, Recipe.restaurant_id == restaurant_id
    ))
    if not recipe:
        return jsonify({"message": "Recipe not found"}), 404
    recipe_ingredient_to_edit = db.session.scalar(select(RecipeIngredient).where(
        RecipeIngredient.id == recipe_ingredient_id, RecipeIngredient.recipe_id == recipe_id
    ))
    if not recipe_ingredient_to_edit:
        return jsonify({"message": "Recipe ingredient not found"}), 404
    body = request.get_json()
    recipe_ingredient_mandatory_schema = ["ingredient_id", "amount"]
    for key in recipe_ingredient_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Missing info. Body must include 'ingredient_id' and 'amount'."}), 400
    for key in body:
        setattr(recipe_ingredient_to_edit, key, body[key])
    db.session.commit()
    return jsonify(recipe_ingredient_to_edit.serialize()), 200

# DELETE chef removes an ingredient from a recipe of his restaurant
@recipe_ingredient.route("/restaurants/<int:restaurant_id>/recipes/<int:recipe_id>/ingredients/<int:recipe_ingredient_id>", methods=["DELETE"])
@jwt_required()
def chef_delete_recipe_ingredient(restaurant_id, recipe_id, recipe_ingredient_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "chef":
        return jsonify({"message": "Access forbidden"}), 403
    if current_user.restaurant_id != restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403
    recipe = db.session.scalar(select(Recipe).where(
        Recipe.id == recipe_id, Recipe.restaurant_id == restaurant_id
    ))
    if not recipe:
        return jsonify({"message": "Recipe not found"}), 404
    recipe_ingredient_to_delete = db.session.scalar(select(RecipeIngredient).where(
        RecipeIngredient.id == recipe_ingredient_id, RecipeIngredient.recipe_id == recipe_id
    ))
    if not recipe_ingredient_to_delete:
        return jsonify({"message": "Recipe ingredient not found"}), 404
    db.session.delete(recipe_ingredient_to_delete)
    db.session.commit()
    return jsonify({"message": "Recipe ingredient deleted successfully"}), 200
