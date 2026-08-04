from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required
from sqlalchemy import select
from api.models import db, Order, Chef, Waiter, Cook, Table

order = Blueprint("orderbp", __name__)

def get_current_user():
    email = get_jwt_identity()
    claims = get_jwt()
    role = claims["role"]
    models = {"chef": Chef, "cook": Cook, "waiter": Waiter}
    user_model = models[role]
    current_user = db.session.scalar(select(user_model).where(user_model.email == email))
    return current_user, role

# Endpoints
# GET orders
@order.route("/orders")
def get_orders():
    all_orders = db.session.scalars(select(Order)).all()
    all_orders_dicts = [order.serialize() for order in all_orders]
    return jsonify(list(all_orders_dicts)), 200

# GET single order
@order.route("/orders/<int:order_id>")
def get_single_order(order_id):
    single_order = db.session.scalar(
        select(Order).where(Order.id == order_id))
    if not single_order:
        return jsonify({"message": "order not found"}), 404
    return jsonify(single_order.serialize()), 200

# POST create a order
@order.route("/orders", methods=["POST"])
def create_order():
    body = request.get_json()
    order_mandatory_schema = ["table_id", "waiter_id", "people"]
    for key in order_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'table_id', 'waiter_id' and 'people'"}), 400
    new_order = Order(
        table_id=body.get("table_id"),
        waiter_id=body.get("waiter_id"),
        people=body.get("people")
    )
    db.session.add(new_order)
    db.session.commit()
    return jsonify(new_order.serialize()), 200

# DELETE a order
@order.route("/orders/<int:order_id>", methods=["DELETE"])
def delete_order(order_id):
    order_to_delete = db.session.scalar(
        select(Order).where(Order.id == order_id))
    if not order_to_delete:
        return jsonify({"message": "order not found"}), 404
    db.session.delete(order_to_delete)
    db.session.commit()
    return jsonify({"message": "order deleted successfully"}), 200

# PUT: edit a order
@order.route("/orders/<int:order_id>", methods=["PUT"])
def edit_order(order_id):
    order_to_edit = db.session.scalar(
        select(Order).where(Order.id == order_id))
    if not order_to_edit:
        return jsonify({"message": "order not found"}), 404
    body = request.get_json()
    order_mandatory_schema = ["table_id", "waiter_id", "state", "people"]
    for key in order_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'table_id', 'waiter_id', 'state' and 'people'"}), 400
    for key in body:
        setattr(order_to_edit, key, body[key])
    db.session.commit()
    return jsonify(order_to_edit.serialize()), 200


############################################################################
##### CHEF ######
# Chef get the orders of his restaurant
@order.route("/restaurants/<int:restaurant_id>/orders")
@jwt_required()
def get_restaurant_orders(restaurant_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "chef":
        return jsonify({"message": "Access forbidden"}), 403
    if current_user.restaurant_id != restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403
    restaurant_orders = db.session.scalars(select(Order).join(Table, Order.table_id == Table.id).where(Table.restaurant_id == restaurant_id)).all()
    restaurant_orders_dicts = [order.serialize() for order in restaurant_orders]
    return jsonify(restaurant_orders_dicts)