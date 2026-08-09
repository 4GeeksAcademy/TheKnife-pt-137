from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required
from sqlalchemy import select
from api.models import db, Product, Order, OrderProduct, Table, Chef, Cook, Waiter, Manager

order_product = Blueprint("orderproductbp", __name__)

def get_current_user():
    email = get_jwt_identity()
    claims = get_jwt()
    role = claims["role"]
    models = {"chef": Chef, "cook": Cook, "waiter": Waiter, "manager": Manager}
    user_model = models[role]
    current_user = db.session.scalar(select(user_model).where(user_model.email == email))
    return current_user, role

def get_order_restaurant_id(order_id):
    order_obj = db.session.scalar(
        select(Order).join(Table, Order.table_id == Table.id).where(Order.id == order_id)
    )
    if not order_obj:
        return None, None
    return order_obj, order_obj.table.restaurant_id

# Endpoints
# GET Products
@order_product.route("/order_products")
@jwt_required()
def get_order_product():
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    all_order_products = db.session.scalars(select(OrderProduct)).all()
    all_order_products_dicts = [product.serialize() for product in all_order_products]
    return jsonify(list(all_order_products_dicts)), 200

# GET single order_product by id
@order_product.route("/order_products/<int:order_product_id>")
@jwt_required()
def get_single_order_product(order_product_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    single_order_product = db.session.scalar(
        select(OrderProduct).where(OrderProduct.id == order_product_id))
    if not single_order_product:
        return jsonify({"message": "OrderProduct not found"}), 404
    return jsonify(single_order_product.serialize()), 200

# Get all products of an order
@order_product.route("/orders/<int:order_id>/order_products")
@jwt_required()
def get_order_products_by_order(order_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    order_obj, order_restaurant_id = get_order_restaurant_id(order_id)
    if not order_obj:
        return jsonify({"message": "order not found"}), 404
    if role != "manager":
        if role not in ["chef", "cook", "waiter"]:
            return jsonify({"message": "Access forbidden"}), 403
        if current_user.restaurant_id != order_restaurant_id:
            return jsonify({"message": "Access forbidden"}), 403
    order_products = db.session.scalars(select(OrderProduct).where(
        OrderProduct.order_id == order_id
    )).all()
    order_products_dicts = map(lambda order_product: order_product.serialize(), order_products)
    return jsonify(list(order_products_dicts))

# POST create a order_product
@order_product.route("/order_products", methods=["POST"])
@jwt_required()
def create_order_product():
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    body = request.get_json()
    product_mandatory_schema = ["order_id", "product_id"]
    for key in product_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'order_id', 'product_id'. 'amount' is default 1 and 'comment' is optional, "}), 400
    order_obj, order_restaurant_id = get_order_restaurant_id(body.get("order_id"))
    if not order_obj:
        return jsonify({"message": "order not found"}), 404
    if role != "manager":
        if role != "waiter":
            return jsonify({"message": "Access forbidden"}), 403
        if current_user.restaurant_id != order_restaurant_id:
            return jsonify({"message": "Access forbidden"}), 403
    if order_obj.state == "closed":
        return jsonify({"message": "Order is closed"}), 400
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
@jwt_required()
def delete_order_product(order_product_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    order_product_to_delete = db.session.scalar(
        select(OrderProduct).where(OrderProduct.id == order_product_id))
    if not order_product_to_delete:
        return jsonify({"message": "Product not found"}), 404
    order_restaurant_id = order_product_to_delete.order.table.restaurant_id
    if role != "manager":
        if role != "waiter":
            return jsonify({"message": "Access forbidden"}), 403
        if current_user.restaurant_id != order_restaurant_id:
            return jsonify({"message": "Access forbidden"}), 403
    if order_product_to_delete.order.state == "closed":
        return jsonify({"message": "Order is closed"}), 400
    db.session.delete(order_product_to_delete)
    db.session.commit()
    return jsonify({"message": "OrderProduct deleted successfully"}), 200

# PUT: edit a order_product
@order_product.route("/order_products/<int:order_product_id>", methods=["PUT"])
@jwt_required()
def edit_order_product(order_product_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    order_product_to_edit = db.session.scalar(
        select(OrderProduct).where(OrderProduct.id == order_product_id))
    if not order_product_to_edit:
        return jsonify({"message": "OrderProduct not found"}), 404
    order_restaurant_id = order_product_to_edit.order.table.restaurant_id
    if role != "manager":
        if role != "waiter":
            return jsonify({"message": "Access forbidden"}), 403
        if current_user.restaurant_id != order_restaurant_id:
            return jsonify({"message": "Access forbidden"}), 403
    if order_product_to_edit.order.state == "closed":
        return jsonify({"message": "Order is closed"}), 400
    body = request.get_json()
    product_mandatory_schema = ["order_id", "product_id"]
    for key in product_mandatory_schema:
            if key not in body or body[key] == "":
                return jsonify({"message": "Some info is missing. Ensure body has 'order_id', 'product_id'. 'amount' is default 1 and 'comment' is optional, "}), 400
    for key in body:
        setattr(order_product_to_edit, key, body[key])
    db.session.commit()
    return jsonify(order_product_to_edit.serialize()), 200