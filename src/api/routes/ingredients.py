from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from sqlalchemy import select
from api.models import db, Ingredient, Chef, Cook, Waiter, Manager
from api.ingredient_image import generate_ingredient_image_url

ingredient = Blueprint("ingredientbp", __name__)

def get_current_user():
    email = get_jwt_identity()
    claims = get_jwt()
    role = claims["role"]
    models = {"chef": Chef, "cook": Cook, "waiter": Waiter, "manager": Manager}
    user_model = models[role]
    current_user = db.session.scalar(select(user_model).where(user_model.email == email))
    return current_user, role

# Si el ingrediente todavía no tiene imagen, la busca en TheMealDB a partir del
# nombre y la sube a Cloudinary. Así cualquier rol que vea un ingrediente lo ve
# automáticamente con su foto, sin tener que subirla a mano.
def ensure_ingredient_image(single_ingredient):
    if not single_ingredient.img_url:
        generated_url = generate_ingredient_image_url(single_ingredient.name)
        if generated_url:
            single_ingredient.img_url = generated_url
            db.session.commit()
    return single_ingredient

# -----------------------------
# GET: obtener TODOS los ingredientes
# -----------------------------
@ingredient.route("/ingredients")
@jwt_required()
def get_ingredients():
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    all_ingredients = db.session.scalars(select(Ingredient)).all()
    all_ingredients_dicts = [ensure_ingredient_image(ing).serialize() for ing in all_ingredients]
    return jsonify(list(all_ingredients_dicts)), 200


# --------------------------------
# GET: obtener UN ingrediente concreto
# --------------------------------
@ingredient.route("/ingredients/<int:ingredient_id>")
@jwt_required()
def get_single_ingredient(ingredient_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    single_ingredient = db.session.scalar(
        select(Ingredient).where(Ingredient.id == ingredient_id)
    )

    if not single_ingredient:
        return jsonify({"message": "Ingredient not found"}), 404

    return jsonify(ensure_ingredient_image(single_ingredient).serialize()), 200


# -----------------------------
# POST: crear un nuevo ingrediente
# -----------------------------
@ingredient.route("/ingredients", methods=["POST"])
@jwt_required()
def create_ingredient():
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    body = request.get_json()

    ingredient_mandatory_schema = ["name"]

    for key in ingredient_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({
                "message": "Missing info. Body must include 'name', 'img_url' is optional."
            }), 400

    new_ingredient = Ingredient(
        name=body.get("name"),
        img_url=body.get("img_url")
    )

    db.session.add(new_ingredient)
    db.session.commit()

    return jsonify(new_ingredient.serialize()), 200


# -----------------------------
# DELETE: eliminar un ingrediente
# -----------------------------
@ingredient.route("/ingredients/<int:ingredient_id>", methods=["DELETE"])
@jwt_required()
def delete_ingredient(ingredient_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
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
@jwt_required()
def edit_ingredient(ingredient_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
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
                "message": "Missing info. Body must include 'name' and 'active', 'img_url' is optional."
            }), 400

    for key in body:
        setattr(ingredient_to_edit, key, body[key])

    db.session.commit()

    return jsonify(ingredient_to_edit.serialize()), 200


#####################################################################
##### CHEF #####
# Los ingredientes se comparten entre todos los restaurantes entonces la única restricción para acceder a ellos es tener rol de chef, ya que no hay relación con columna de restaurant_id

# GET all active ingredients (chef only)
@ingredient.route("/chef/ingredients")
@jwt_required()
def chef_get_active_ingredients():
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "chef":
        return jsonify({"message": "Access forbidden"}), 403
    active_ingredients = db.session.scalars(
        select(Ingredient).where(Ingredient.active == True)
    ).all()
    return jsonify([ensure_ingredient_image(ing).serialize() for ing in active_ingredients]), 200

# GET all inactive ingredients (chef only)
@ingredient.route("/chef/ingredients/inactive")
@jwt_required()
def chef_get_inactive_ingredients():
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "chef":
        return jsonify({"message": "Access forbidden"}), 403
    inactive_ingredients = db.session.scalars(
        select(Ingredient).where(Ingredient.active == False)
    ).all()
    return jsonify([ing.serialize() for ing in inactive_ingredients]), 200

# GET one ingredient (chef only)
@ingredient.route("/chef/ingredients/<int:ingredient_id>")
@jwt_required()
def chef_get_single_ingredient(ingredient_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "chef":
        return jsonify({"message": "Access forbidden"}), 403
    single_ingredient = db.session.scalar(
        select(Ingredient).where(Ingredient.id == ingredient_id)
    )
    if not single_ingredient:
        return jsonify({"message": "Ingredient not found"}), 404
    return jsonify(ensure_ingredient_image(single_ingredient).serialize()), 200

#####################################################################
##### COOK #####
# El cocinero solo necesita ver los ingredientes (con su imagen generada
# automáticamente), no gestionarlos: crear/editar/desactivar sigue siendo cosa del chef.

# GET all active ingredients (cook only)
@ingredient.route("/cook/ingredients")
@jwt_required()
def cook_get_active_ingredients():
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "cook":
        return jsonify({"message": "Access forbidden"}), 403
    active_ingredients = db.session.scalars(
        select(Ingredient).where(Ingredient.active == True)
    ).all()
    return jsonify([ensure_ingredient_image(ing).serialize() for ing in active_ingredients]), 200

# GET one ingredient (cook only)
@ingredient.route("/cook/ingredients/<int:ingredient_id>")
@jwt_required()
def cook_get_single_ingredient(ingredient_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "cook":
        return jsonify({"message": "Access forbidden"}), 403
    single_ingredient = db.session.scalar(
        select(Ingredient).where(Ingredient.id == ingredient_id)
    )
    if not single_ingredient:
        return jsonify({"message": "Ingredient not found"}), 404
    return jsonify(ensure_ingredient_image(single_ingredient).serialize()), 200

# POST create an ingredient (chef only)
@ingredient.route("/chef/create_ingredient", methods=["POST"])
@jwt_required()
def chef_create_ingredient():
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "chef":
        return jsonify({"message": "Access forbidden"}), 403
    body = request.get_json()
    if "name" not in body or body["name"] == "":
        return jsonify({
            "message": "Missing info. Body must include 'name', 'img_url' is optional."
        }), 400

    # Los ingredientes se comparten entre restaurantes: si ya existe uno con ese
    # nombre (por ejemplo, dos peticiones casi simultáneas al crear una receta
    # con ingredientes sugeridos por IA) lo reutilizamos en vez de romper por la
    # restricción unique_ingredient_name.
    existing_ingredient = db.session.scalar(
        select(Ingredient).where(Ingredient.name == body.get("name"))
    )
    if existing_ingredient:
        return jsonify(existing_ingredient.serialize()), 200

    new_ingredient = Ingredient(
        name=body.get("name"),
        img_url=body.get("img_url"),
        active=True
    )
    db.session.add(new_ingredient)
    db.session.commit()
    return jsonify(new_ingredient.serialize()), 200

# PUT edit an ingredient (chef only)
@ingredient.route("/chef/ingredients/<int:ingredient_id>", methods=["PUT"])
@jwt_required()
def chef_edit_ingredient(ingredient_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "chef":
        return jsonify({"message": "Access forbidden"}), 403
    ingredient_to_edit = db.session.scalar(
        select(Ingredient).where(Ingredient.id == ingredient_id)
    )
    if not ingredient_to_edit:
        return jsonify({"message": "Ingredient not found"}), 404
    body = request.get_json()
    if "name" not in body or body["name"] == "":
        return jsonify({
            "message": "Missing info. Body must include 'name', 'img_url' and 'active' is optional."
        }), 400
    for key in body:
        setattr(ingredient_to_edit, key, body[key])
    db.session.commit()
    return jsonify(ingredient_to_edit.serialize()), 200

# He puesto desactivar en vez de borrar por que se compaten ingredinetes entre restaurantes, así no puede dejar uno sin ingredientes que otro usa en una receta
@ingredient.route("/chef/deactivate_ingredient/<int:ingredient_id>", methods=["PUT"])
@jwt_required()
def chef_deactivate_ingredient(ingredient_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "chef":
        return jsonify({"message": "Access forbidden"}), 403
    ingredient_to_deactivate = db.session.scalar(
        select(Ingredient).where(Ingredient.id == ingredient_id)
    )
    if not ingredient_to_deactivate:
        return jsonify({"message": "Ingredient not found"}), 404
    ingredient_to_deactivate.active = False
    db.session.commit()
    return jsonify(ingredient_to_deactivate.serialize()), 200
