from flask import Blueprint, jsonify, request
from sqlalchemy import select
from api.models import db, Product, Recipe, Restaurant

restaurant = Blueprint("restaurantbp", __name__)

# Endpoints
# GET Restaurants
@restaurant.route("/restaurants")
def get_restaurants():
    all_restaurants = db.session.scalars(select(Restaurant)).all()
    all_restaurants_dicts = [restaurant.serialize() for restaurant in all_restaurants]
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