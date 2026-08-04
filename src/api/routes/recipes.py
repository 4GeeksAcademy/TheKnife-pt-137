from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt, create_access_token
from sqlalchemy import select
from api.models import db, Recipe, RecipeIngredient, Chef, Cook, Waiter

recipe = Blueprint("recipebp", __name__)

def get_current_user():
    email = get_jwt_identity()
    claims = get_jwt()
    role = claims["role"]
    models = {"chef": Chef, "cook": Cook, "waiter": Waiter}
    user_model = models[role]
    current_user = db.session.scalar(select(user_model).where(user_model.email == email))
    return current_user, role

@recipe.route("/recipes")
def get_recipes():
    all_recipes = db.session.scalars(select(Recipe)).all() 
    all_recipes_dicts = [rec.serialize() for rec in all_recipes]
    return jsonify(list(all_recipes_dicts)), 200

@recipe.route("/recipes/<int:recipe_id>")
def get_single_recipe(recipe_id):
    single_recipe = db.session.scalar(
        select(Recipe).where(Recipe.id == recipe_id)
    )
    if not single_recipe:
        return jsonify({"message": "Recipe not found"}), 404
    return jsonify(single_recipe.serialize()), 200

@recipe.route("/recipes", methods=["POST"])
def create_recipe():
    body = request.get_json()
    recipe_mandatory_schema = ["name", "steps", "restaurant_id"]
    for key in recipe_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({
                "message": "Missing info. Body must include 'name', 'steps' and 'restaurant_id', and optional 'img_url'"
            }), 400
    new_recipe = Recipe(
        name=body.get("name"),
        steps=body.get("steps"),
        img_url=body.get("img_url"),
        restaurant_id=body.get("restaurant_id")
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
    recipe_mandatory_schema = ["name", "steps", "restaurant_id"]
    for key in recipe_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({
                "message": "Missing info. Body must include 'name', 'steps' and 'restaurant_id'. 'img_url it's optional'"
            }), 400
    for key in body:
        setattr(recipe_to_edit, key, body[key])
    db.session.commit()
    return jsonify(recipe_to_edit.serialize()), 200

#####################################################################
##### CHEF
# GET all recipes of the restaurant (chef or cook)
@recipe.route("/restaurants/<int:restaurant_id>/recipes")
@jwt_required()
def get_all_restaurant_recipes(restaurant_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role not in ["chef", "cook"]:
        return jsonify({"message": "Access forbidden"}), 403
    if current_user.restaurant_id != restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403
    all_restaurant_recipes = db.session.scalars(select(Recipe).where(
        Recipe.restaurant_id == restaurant_id
    )).all()
    return jsonify([recipe.serialize() for recipe in all_restaurant_recipes]), 200

# GET one recipe of the restaurant (chef or cook)
@recipe.route("/restaurants/<int:restaurant_id>/recipes/<int:recipe_id>")
@jwt_required()
def get_one_restaurant_recipe(restaurant_id, recipe_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role not in ["chef", "cook"]:
        return jsonify({"message": "Access forbidden"}), 403
    if current_user.restaurant_id != restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403
    single_recipe = db.session.scalar(select(Recipe).where(
        Recipe.id == recipe_id
    ))
    if current_user.restaurant_id != single_recipe.restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403
    return jsonify(single_recipe.serialize()), 200

# Post create a recipe
@recipe.route("/restaurants/<int:restaurant_id>/create_recipe", methods=["POST"])
@jwt_required()
def chef_create_recipe(restaurant_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "chef":
        return jsonify({"message": "Access forbidden"}), 403
    if current_user.restaurant_id != restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403
    body = request.get_json()
    recipe_mandatory_schema = ["name", "steps"]
    for key in recipe_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({
                "message": "Missing info. Body must include 'name', 'steps', and optional 'img_url'"
            }), 400
    new_recipe = Recipe(
        name=body.get("name"),
        steps=body.get("steps"),
        img_url=body.get("img_url"),
        restaurant_id=restaurant_id
    )
    db.session.add(new_recipe)
    db.session.commit()
    return jsonify(new_recipe.serialize()), 200

# DELETE a recipe from the restaurant
@recipe.route("/restaurants/<int:restaurant_id>/recipes/<int:recipe_id>", methods=["DELETE"])
@jwt_required()
def chef_delete_recipe(recipe_id, restaurant_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "chef":
        return jsonify({"message": "Access forbidden"}), 403
    if current_user.restaurant_id != restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403
    recipe_to_delete = db.session.scalar(
        select(Recipe).where(Recipe.id == recipe_id)
    )
    if current_user.restaurant_id != recipe_to_delete.restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403
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

# PUT Edit a recipe from the restaurant
@recipe.route("/restaurants/<int:restaurant_id>/recipes/<int:recipe_id>", methods=["PUT"])
@jwt_required()
def chef_edit_recipe(recipe_id, restaurant_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "chef":
        return jsonify({"message": "Access forbidden"}), 403
    if current_user.restaurant_id != restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403
    recipe_to_edit = db.session.scalar(
        select(Recipe).where(Recipe.id == recipe_id)
    )
    if not recipe_to_edit:
        return jsonify({"message": "Recipe not found"}), 404
    if current_user.restaurant_id != recipe_to_edit.restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403
    body = request.get_json()
    recipe_mandatory_schema = ["name", "steps"]
    for key in recipe_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({
                "message": "Missing info. Body must include 'name', 'steps'. 'img_url it's optional'"
            }), 400
    for key in body:
        setattr(recipe_to_edit, key, body[key])
    db.session.commit()
    return jsonify(recipe_to_edit.serialize()), 200