from flask import Blueprint, jsonify, request
from sqlalchemy import select
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required
from api.models import db, Product, Recipe, Restaurant, Chef, Cook, Waiter

restaurant = Blueprint("restaurantbp", __name__)


def get_current_user():
    email = get_jwt_identity()
    claims = get_jwt()
    role = claims["role"]
    models = {"cook": Cook, "waiter": Waiter, "chef": Chef}
    user_model = models[role]
    current_user = db.session.scalar(
        select(user_model).where(user_model.email == email))
    return current_user, role

# BASIC ADMIN CRUD ENDPOINTS
# GET Restaurants
@restaurant.route("/restaurants")
def get_restaurants():
    all_restaurants = db.session.scalars(select(Restaurant)).all()
    all_restaurants_dicts = [restaurant.serialize()
                             for restaurant in all_restaurants]
    return jsonify(list(all_restaurants_dicts)), 200

# GET single restaurant
@restaurant.route("/restaurants/<int:restaurant_id>")
def get_single_restaurant(restaurant_id):
    single_restaurant = db.session.scalar(
        select(Restaurant).where(Restaurant.id == restaurant_id))
    if not single_restaurant:
        return jsonify({"message": "Restaurant not found"}), 404
    return jsonify(single_restaurant.serialize()), 200

# POST create a restaurant
@restaurant.route("/restaurants", methods=["POST"])
def create_restaurant():
    body = request.get_json()
    restaurant_mandatory_schema = ["name", "email", "phone", "address"]
    for key in restaurant_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'name', 'email', 'phone' and 'address', 'img_url is optional'."}), 400
    new_restaurant = Restaurant(
        name=body.get("name"),
        email=body.get("email"),
        phone=body.get("phone"),
        address=body.get("address"),
        img_url=body.get("img_url")
    )
    db.session.add(new_restaurant)
    db.session.commit()
    return jsonify(new_restaurant.serialize()), 200

# DELETE a restaurant
@restaurant.route("/restaurants/<int:restaurant_id>", methods=["DELETE"])
def delete_restaurant(restaurant_id):
    restaurant_to_delete = db.session.scalar(
        select(Restaurant).where(Restaurant.id == restaurant_id))
    if not restaurant_to_delete:
        return jsonify({"message": "Restaurant not found"}), 404
    restaurant_chef = db.session.scalar(
        select(Chef).where(Chef.restaurant_id == restaurant_id))
    if restaurant_chef:
        db.session.delete(restaurant_chef)
    restaurant_cooks = db.session.scalars(
        select(Cook).where(Cook.restaurant_id == restaurant_id)).all()
    for cook in restaurant_cooks:
        db.session.delete(cook)
    restaurant_waiters = db.session.scalars(
        select(Waiter).where(Waiter.restaurant_id == restaurant_id)).all()
    for waiter in restaurant_waiters:
        db.session.delete(waiter)
    db.session.delete(restaurant_to_delete)
    db.session.commit()
    return jsonify({"message": "Restaurant deleted successfully"}), 200

# PUT: edit a restaurant
@restaurant.route("/restaurants/<int:restaurant_id>", methods=["PUT"])
def edit_restaurant(restaurant_id):
    restaurant_to_edit = db.session.scalar(
        select(Restaurant).where(Restaurant.id == restaurant_id))
    if not restaurant_to_edit:
        return jsonify({"message": "Restaurant not found"}), 404
    body = request.get_json()
    restaurant_mandatory_schema = ["name", "email", "phone", "address"]
    for key in restaurant_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'name', 'email', 'phone' and 'address', 'img_url' is optional."}), 400
    for key in body:
        setattr(restaurant_to_edit, key, body[key])
    db.session.commit()
    return jsonify(restaurant_to_edit.serialize()), 200

#######################################################################
# Chef GETS his restaurant
@restaurant.route("/my_restaurant/<int:restaurant_id>")
@jwt_required()
def get_chef_restaurant(restaurant_id):
    user, role = get_current_user()
    if not user:
        return jsonify({"message": "User not found"}), 404
    if role != "chef":
        return jsonify({"message": "Access forbidden"}), 403
    restaurant = db.session.scalar(select(Restaurant).where(Restaurant.id == restaurant_id))
    if not restaurant:
        return jsonify({"message": "Restaurant not found"}), 404
    if restaurant.id != user.restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403
    return jsonify(restaurant.serialize())

# Create restaurant by chef
@restaurant.route("/create_restaurant", methods=["POST"])
@jwt_required()
def chef_create_restaurant():
    user, role = get_current_user()
    if not user:
        return ({"message": "User not found"}), 404
    if role != "chef":
        return jsonify({"message": "Access forbidden"}), 403
    chef_restaurant = db.session.scalar(select(Restaurant).where(Restaurant.id == user.restaurant_id))
    if chef_restaurant:
        return jsonify({"message": "Chef already owns a restaurant"}), 409
    body = request.get_json()
    restaurant_mandatory_schema = ["name", "email", "phone", "address"]
    for key in restaurant_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'name', 'email', 'phone' and 'address', 'img_url is optional'."}), 400
    new_restaurant = Restaurant(
        name=body.get("name"),
        email=body.get("email"),
        phone=body.get("phone"),
        address=body.get("address"),
        img_url=body.get("img_url")
    )
    db.session.add(new_restaurant)
    db.session.flush()
    user.restaurant_id = new_restaurant.id
    db.session.commit()
    return jsonify(new_restaurant.serialize()), 200

# Chef deletes his own restaurant
@restaurant.route("/delete_restaurant/<int:restaurant_id>", methods=["DELETE"])
@jwt_required()
def chef_delete_restaurant(restaurant_id):
    user, role = get_current_user()
    if not user:
        return jsonify({"message": "User not found"}), 404
    if role != "chef":
        return jsonify({"message": "Access forbidden"}), 403
    restaurant_to_delete = db.session.scalar(select(Restaurant).where(
        Restaurant.id == restaurant_id
    ))
    if restaurant_to_delete.id != user.restaurant_id:
        return jsonify({"message": "You can't delete this restaurant"}), 403
    db.session.delete(restaurant_to_delete)
    db.session.commit()
    return jsonify({"message": "Restaurant deleted successfully"})

# Chef edit his own restaurant
@restaurant.route("/edit_restaurant/<int:restaurant_id>", methods=["PUT"])
@jwt_required()
def edit_chef_restaurant(restaurant_id):
    current_user, role = get_current_user()
    if role != "chef":
        return jsonify({"message": "Access forbidden"}), 403
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    restaurant = db.session.scalar(select(Restaurant).where(Restaurant.id == restaurant_id))
    if not restaurant:
        return jsonify({"message": "Restaurant not found"}), 404
    if restaurant.id != current_user.restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403
    body = request.get_json()
    restaurant_mandatory_schema = ["name", "email", "phone", "address"]
    for key in restaurant_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'name', 'email', 'phone' and 'address', 'img_url' is optional."}), 400
    for key in body:
        setattr(restaurant, key, body[key])
    db.session.commit()
    return jsonify(restaurant.serialize()), 200