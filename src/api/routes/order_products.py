from flask import Blueprint, jsonify, request
from sqlalchemy import select
from api.models import db, Product, Order, OrderProduct

order_product = Blueprint("orderproductbp", __name__)

# Endpoints
# GET Products
@order_product.route("/order_products")
def get_order_product():
    all_order_products = db.session.scalars(select(OrderProduct)).all()
    all_order_products_dicts = [product.serialize() for product in all_order_products]
    return jsonify(list(all_order_products_dicts)), 200

# GET single order_product by id
@order_product.route("/order_products/<int:order_product_id>")
def get_single_order_product(order_product_id):
    single_order_product = db.session.scalar(
        select(OrderProduct).where(OrderProduct.id == order_product_id))
    if not single_order_product:
        return jsonify({"message": "OrderProduct not found"}), 404
    return jsonify(single_order_product.serialize()), 200

# Get all products of an order
@order_product.route("orders/<int:order_id>/order_products")
def get_order_products_by_order(order_id):
    order_products = db.session.scalars(select(OrderProduct).where(
        OrderProduct.order_id == order_id
    )).all()
    order_products_dicts = map(lambda order_product: order_product.serialize(), order_products)
    return jsonify(list(order_products_dicts))

# POST create a order_product
@order_product.route("/order_products", methods=["POST"])
def create_order_product():
    body = request.get_json()
    product_mandatory_schema = ["order_id", "product_id"]
    for key in product_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'order_id', 'product_id'. 'amount' is default 1 and 'comment' is optional, "}), 400
    product = db.session.scalar(select(Product).where(Product.id == body["product_id"]))
    if not product:
        return jsonify({"message": "Product not found"}), 404
    new_order_product = OrderProduct(
        order_id=body.get("order_id"),
        product_id=body.get("product_id"),
        amount=body.get("amount"),
        unit_price=product.sell_price,
        comment=body.get("comment")
    )
    db.session.add(new_order_product)
    db.session.commit()
    return jsonify(new_order_product.serialize()), 200

# DELETE a order_product
@order_product.route("/order_products/<int:order_product_id>", methods=["DELETE"])
def delete_order_product(order_product_id):
    order_product_to_delete = db.session.scalar(
        select(OrderProduct).where(OrderProduct.id == order_product_id))
    if not order_product_to_delete:
        return jsonify({"message": "Product not found"}), 404
    db.session.delete(order_product_to_delete)
    db.session.commit()
    return jsonify({"message": "OrderProduct deleted successfully"}), 200

# PUT: edit a order_product
@order_product.route("/order_products/<int:order_product_id>", methods=["PUT"])
def edit_order_product(order_product_id):
    order_product_to_edit = db.session.scalar(
        select(OrderProduct).where(OrderProduct.id == order_product_id))
    if not order_product_to_edit:
        return jsonify({"message": "OrderProduct not found"}), 404
    body = request.get_json()
    product_mandatory_schema = ["order_id", "product_id"]
    for key in product_mandatory_schema:
            if key not in body or body[key] == "":
                return jsonify({"message": "Some info is missing. Ensure body has 'order_id', 'product_id'. 'amount' is default 1 and 'comment' is optional, "}), 400
    for key in body:
        setattr(order_product_to_edit, key, body[key])
    db.session.commit()
    return jsonify(order_product_to_edit.serialize()), 200