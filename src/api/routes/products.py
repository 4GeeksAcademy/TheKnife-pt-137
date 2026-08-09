from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from sqlalchemy import select
from api.models import db, Product, Recipe, Chef, Cook, Waiter, RecipeIngredient, Manager

product = Blueprint("productbp", __name__)


def get_current_user():
    email = get_jwt_identity()
    claims = get_jwt()
    role = claims["role"]
    models = {"chef": Chef, "cook": Cook, "waiter": Waiter, "manager": Manager}
    user_model = models[role]
    current_user = db.session.scalar(
        select(user_model).where(user_model.email == email))
    return current_user, role

# Endpoints
# GET Products
@product.route("/products")
@jwt_required()
def get_products():
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    all_products = db.session.scalars(select(Product)).all()
    all_products_dicts = [product.serialize() for product in all_products]
    return jsonify(list(all_products_dicts)), 200

# GET single product
@product.route("/products/<int:product_id>")
@jwt_required()
def get_single_product(product_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    single_product = db.session.scalar(
        select(Product).where(Product.id == product_id))
    if not single_product:
        return jsonify({"message": "Product not found"}), 404
    return jsonify(single_product.serialize()), 200

# POST create a product
@product.route("/products", methods=["POST"])
@jwt_required()
def create_product():
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    body = request.get_json()
    product_mandatory_schema = ["name", "sell_price", "type", "restaurant_id"]
    for key in product_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'name', 'sell_price', 'type', 'restaurant_id'. 'description' and 'img_url' are optional for the product"}), 400
    recipe_id = body.get("recipe_id")
    if recipe_id == "":
        recipe_id = None
    new_product = Product(
        name=body.get("name"),
        description=body.get("description"),
        sell_price=body.get("sell_price"),
        type=body.get("type"),
        active=body.get("active"),
        restaurant_id=body.get("restaurant_id"),
        recipe_id=recipe_id,
        img_url=body.get("img_url")
    )
    # más adelante cuando haya restaurant_id hay que meter comprobación para que no haya dos productos iguales en un mismo restaurante
    db.session.add(new_product)
    db.session.commit()
    return jsonify(new_product.serialize()), 200

# DELETE a product
@product.route("/products/<int:product_id>", methods=["DELETE"])
@jwt_required()
def delete_product(product_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    product_to_delete = db.session.scalar(
        select(Product).where(Product.id == product_id))
    if not product_to_delete:
        return jsonify({"message": "Product not found"}), 404
    db.session.delete(product_to_delete)
    db.session.commit()
    return jsonify({"message": "Product deleted successfully"}), 200

# PUT: edit a product
@product.route("/products/<int:product_id>", methods=["PUT"])
@jwt_required()
def edit_product(product_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    product_to_edit = db.session.scalar(
        select(Product).where(Product.id == product_id))
    if not product_to_edit:
        return jsonify({"message": "Product not found"}), 404
    body = request.get_json()
    product_mandatory_schema = ["name", "sell_price", "type", "active"]
    for key in product_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'name', 'sell_price', 'type'. 'description' and 'img_url' are optional for the product"}), 400
    for key in body:
        setattr(product_to_edit, key, body[key])
    db.session.commit()
    return jsonify(product_to_edit.serialize()), 200

#####################################################################
# CHEF
# GET all products of the restaurant (chef, waiter)
@product.route("/restaurants/<int:restaurant_id>/products")
@jwt_required()
def get_all_restaurant_products(restaurant_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role not in ["chef", "waiter"]:
        return jsonify({"message": "Access forbidden"}), 403
    if current_user.restaurant_id != restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403
    all_restaurant_products = db.session.scalars(select(Product).where(
        Product.restaurant_id == restaurant_id
    )).all()
    return jsonify([recipe.serialize() for recipe in all_restaurant_products]), 200

# GET one product of the restaurant (chef or waiter)
@product.route("/restaurants/<int:restaurant_id>/products/<int:product_id>")
@jwt_required()
def get_one_restaurant_product(restaurant_id, product_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role not in ["chef", "waiter"]:
        return jsonify({"message": "Access forbidden"}), 403
    if current_user.restaurant_id != restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403
    single_product = db.session.scalar(select(Product).where(
        Product.id == product_id
    ))
    if current_user.restaurant_id != single_product.restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403
    return jsonify(single_product.serialize()), 200

# Post create a product
@product.route("/restaurants/<int:restaurant_id>/create_product", methods=["POST"])
@jwt_required()
def chef_create_product(restaurant_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "chef":
        return jsonify({"message": "Access forbidden"}), 403
    if current_user.restaurant_id != restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403
    body = request.get_json()
    product_mandatory_schema = ["name", "sell_price", "type"]
    for key in product_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'name', 'sell_price', 'type'. 'description' and 'img_url' are optional for the product"}), 400
    recipe_id = body.get("recipe_id")
    if recipe_id == "":
        recipe_id = None
    new_product = Product(
        name=body.get("name"),
        description=body.get("description"),
        sell_price=body.get("sell_price"),
        type=body.get("type"),
        active=body.get("active"),
        restaurant_id=restaurant_id,
        recipe_id=recipe_id,
        img_url=body.get("img_url")
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify(new_product.serialize()), 200

# DELETE a product from the restaurant
@product.route("/restaurants/<int:restaurant_id>/products/<int:product_id>", methods=["DELETE"])
@jwt_required()
def chef_delete_product(product_id, restaurant_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "chef":
        return jsonify({"message": "Access forbidden"}), 403
    if current_user.restaurant_id != restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403
    product_to_delete = db.session.scalar(
        select(Product).where(Product.id == product_id)
    )
    if current_user.restaurant_id != product_to_delete.restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403
    if not product_to_delete:
        return jsonify({"message": "Product not found"}), 404
    db.session.delete(product_to_delete)
    db.session.commit()
    return jsonify({"message": "Product deleted successfully"}), 200

# PUT Edit a product from the restaurant
@product.route("/restaurants/<int:restaurant_id>/products/<int:product_id>", methods=["PUT"])
@jwt_required()
def chef_edit_recipe(product_id, restaurant_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "chef":
        return jsonify({"message": "Access forbidden"}), 403
    if current_user.restaurant_id != restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403
    product_to_edit = db.session.scalar(
        select(Product).where(Product.id == product_id))
    if not product_to_edit:
        return jsonify({"message": "Product not found"}), 404
    body = request.get_json()
    product_mandatory_schema = ["name", "sell_price", "type", "active"]
    for key in product_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'name', 'sell_price', 'type'. 'description' and 'img_url' are optional for the product"}), 400
    for key in body:
        setattr(product_to_edit, key, body[key])
    db.session.commit()
    return jsonify(product_to_edit.serialize()), 200