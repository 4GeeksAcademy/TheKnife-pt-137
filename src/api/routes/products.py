from flask import Blueprint, jsonify, request
from sqlalchemy import select
from api.models import db, Product, Recipe

product = Blueprint("productbp", __name__)

# Endpoints
# GET Products
@product.route("/products")
def get_products():
    all_products = db.session.scalars(select(Product)).all()
    all_products_dicts = [product.serialize() for product in all_products]
    return jsonify(list(all_products_dicts)), 200

# GET single product
@product.route("/products/<int:product_id>")
def get_single_product(product_id):
    single_product = db.session.scalar(
        select(Product).where(Product.id == product_id))
    if not single_product:
        return jsonify({"message": "Product not found"}), 404
    return jsonify(single_product.serialize()), 200

# POST create a product
@product.route("/products", methods=["POST"])
def create_product():
    body = request.get_json()
    product_mandatory_schema = ["name", "sell_price", "type"]
    for key in product_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'name', 'sell_price', 'type'. 'description' is optional for the product"}), 400
    new_product = Product(
        name=body.get("name"),
        description=body.get("description"),
        sell_price=body.get("sell_price"),
        type=body.get("type"),
        active=body.get("active")
    )
    # más adelante cuando haya restaurant_id hay que meter comprobación para que no haya dos productos iguales en un mismo restaurante
    db.session.add(new_product)
    db.session.commit()
    return jsonify(new_product.serialize()), 200

# DELETE a product
@product.route("/products/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    product_to_delete = db.session.scalar(
        select(Product).where(Product.id == product_id))
    if not product_to_delete:
        return jsonify({"message": "Product not found"}), 404
    db.session.delete(product_to_delete)
    db.session.commit()
    return jsonify({"message": "Product deleted successfully"}), 200

# PUT: edit a product
@product.route("/products/<int:product_id>", methods=["PUT"])
def edit_product(product_id):
    product_to_edit = db.session.scalar(
        select(Product).where(Product.id == product_id))
    if not product_to_edit:
        return jsonify({"message": "Product not found"}), 404
    body = request.get_json()
    product_mandatory_schema = ["name", "sell_price", "type", "active"]
    for key in product_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'name', 'sell_price', 'type'. 'description' is optional for the product"}), 400
    for key in body:
        setattr(product_to_edit, key, body[key])
    db.session.commit()
    return jsonify(product_to_edit.serialize()), 200