from flask import Blueprint, jsonify, request
from sqlalchemy import select
from api.models import db, Ingredient   # <-- IMPORTANTE: usa tu modelo correcto

ingredient = Blueprint("ingredientbp", __name__)

# -----------------------------
# GET: obtener TODOS los ingredientes
# -----------------------------
@ingredient.route("/ingredients")
def get_ingredients():
    all_ingredients = db.session.scalars(select(Ingredient)).all()
    all_ingredients_dicts = [ing.serialize() for ing in all_ingredients]
    return jsonify(list(all_ingredients_dicts)), 200


# --------------------------------
# GET: obtener UN ingrediente concreto
# --------------------------------
@ingredient.route("/ingredients/<int:ingredient_id>")
def get_single_ingredient(ingredient_id):
    single_ingredient = db.session.scalar(
        select(Ingredient).where(Ingredient.id == ingredient_id)
    )

    if not single_ingredient:
        return jsonify({"message": "Ingredient not found"}), 404

    return jsonify(single_ingredient.serialize()), 200


# -----------------------------
# POST: crear un nuevo ingrediente
# -----------------------------
@ingredient.route("/ingredients", methods=["POST"])
def create_ingredient():
    body = request.get_json()

    ingredient_mandatory_schema = ["name"]

    for key in ingredient_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({
                "message": "Missing info. Body must include 'name'."
            }), 400

    new_ingredient = Ingredient(
        name=body.get("name")
    )

    db.session.add(new_ingredient)
    db.session.commit()

    return jsonify(new_ingredient.serialize()), 200


# -----------------------------
# DELETE: eliminar un ingrediente
# -----------------------------
@ingredient.route("/ingredients/<int:ingredient_id>", methods=["DELETE"])
def delete_ingredient(ingredient_id):
    ingredient_to_delete = db.session.scalar(
        select(Ingredient).where(Ingredient.id == ingredient_id)
    )

    if not ingredient_to_delete:
        return jsonify({"message": "Ingredient not found"}), 404

    db.session.delete(ingredient_to_delete)
    db.session.commit()

    return jsonify({"message": "Ingredient deleted successfully"}), 200


# -----------------------------
# PUT: editar un ingrediente
# -----------------------------
@ingredient.route("/ingredients/<int:ingredient_id>", methods=["PUT"])
def edit_ingredient(ingredient_id):
    ingredient_to_edit = db.session.scalar(
        select(Ingredient).where(Ingredient.id == ingredient_id)
    )

    if not ingredient_to_edit:
        return jsonify({"message": "Ingredient not found"}), 404

    body = request.get_json()
    ingredient_mandatory_schema = ["name", "active"]

    for key in ingredient_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({
                "message": "Missing info. Body must include 'name' and 'active'."
            }), 400

    for key in body:
        setattr(ingredient_to_edit, key, body[key])

    db.session.commit()

    return jsonify(ingredient_to_edit.serialize()), 200
