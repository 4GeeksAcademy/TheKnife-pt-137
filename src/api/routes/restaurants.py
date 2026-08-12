from flask import Blueprint, jsonify, request
from sqlalchemy import select
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required
from api.models import db, Product, Recipe, Restaurant, Chef, Cook, Waiter, Manager, Table, Client
from haversine import haversine

restaurant = Blueprint("restaurantbp", __name__)


def get_current_user():
    email = get_jwt_identity()
    claims = get_jwt()
    role = claims["role"]
    models = {"cook": Cook, "waiter": Waiter, "chef": Chef, "manager": Manager, "client": Client}
    user_model = models[role]
    current_user = db.session.scalar(
        select(user_model).where(user_model.email == email))
    return current_user, role

# BASIC MANAGER CRUD ENDPOINTS
# GET Restaurants
@restaurant.route("/restaurants")
@jwt_required()
def get_restaurants():
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    all_restaurants = db.session.scalars(select(Restaurant)).all()
    all_restaurants_dicts = [restaurant.serialize()
                             for restaurant in all_restaurants]
    return jsonify(list(all_restaurants_dicts)), 200

# GET single restaurant
@restaurant.route("/restaurants/<int:restaurant_id>")
@jwt_required()
def get_single_restaurant(restaurant_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    single_restaurant = db.session.scalar(
        select(Restaurant).where(Restaurant.id == restaurant_id))
    if not single_restaurant:
        return jsonify({"message": "Restaurant not found"}), 404
    return jsonify(single_restaurant.serialize()), 200

# POST create a restaurant
@restaurant.route("/restaurants", methods=["POST"])
@jwt_required()
def create_restaurant():
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    body = request.get_json()
    restaurant_mandatory_schema = ["name", "email", "phone", "address", "description", "food_type"]
    for key in restaurant_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'name', 'email', 'phone', 'address', 'description' and 'food_type', 'img_url is optional'."}), 400
    new_restaurant = Restaurant(
        name=body.get("name"),
        email=body.get("email"),
        phone=body.get("phone"),
        address=body.get("address"),
        img_url=body.get("img_url"),
        description=body.get("description"),
        food_type=body.get("food_type")
    )
    db.session.add(new_restaurant)
    db.session.commit()
    return jsonify(new_restaurant.serialize()), 200

# DELETE a restaurant
@restaurant.route("/restaurants/<int:restaurant_id>", methods=["DELETE"])
@jwt_required()
def delete_restaurant(restaurant_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
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
@jwt_required()
def edit_restaurant(restaurant_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    restaurant_to_edit = db.session.scalar(
        select(Restaurant).where(Restaurant.id == restaurant_id))
    if not restaurant_to_edit:
        return jsonify({"message": "Restaurant not found"}), 404
    body = request.get_json()
    restaurant_mandatory_schema = ["name", "email", "phone", "address", "description", "food_type"]
    for key in restaurant_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'name', 'email', 'phone', 'address', 'description' and 'food_type', 'img_url' is optional."}), 400
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
    restaurant_mandatory_schema = ["name", "email", "phone", "address", "description", "food_type"]
    for key in restaurant_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'name', 'email', 'phone', 'address', 'description' and 'food_type', 'img_url is optional'."}), 400
    new_restaurant = Restaurant(
        name=body.get("name"),
        email=body.get("email"),
        phone=body.get("phone"),
        address=body.get("address"),
        img_url=body.get("img_url"),
        description=body.get("description"),
        food_type=body.get("food_type")
    )
    db.session.add(new_restaurant)
    db.session.flush()
    user.restaurant_id = new_restaurant.id
    for number in range(1, 8):
        db.session.add(Table(
            number=number,
            status="free",
            location="Main hall",
            restaurant_id=new_restaurant.id
        ))
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
    restaurant_mandatory_schema = ["name", "email", "phone", "address", "description", "food_type"]
    for key in restaurant_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'name', 'email', 'phone', 'address', 'description' and 'food_type', 'img_url' is optional."}), 400
    for key in body:
        setattr(restaurant, key, body[key])
    db.session.commit()
    return jsonify(restaurant.serialize()), 200

# PATCH chef edits restaurant latitude and longitude
@restaurant.route("/restaurants/<int:restaurant_id>/location", methods=["PATCH"])
@jwt_required()
def chef_edit_restaurant_coordinates(restaurant_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "chef":
        return jsonify({"message": "Access forbidden"}), 403
    if current_user.restaurant_id != restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403
    restaurant = db.session.scalar(select(Restaurant).where(Restaurant.id == restaurant_id))
    if not restaurant:
        return jsonify({"message": "Restaurant not found"}), 404
    body = request.get_json()
    patch_mandatory_schema = ["address", "longitude", "latitude"]
    for key in patch_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing, body must have 'address', 'latitude' and 'longitude' "}), 400
    for key in patch_mandatory_schema:
        setattr(restaurant, key, body[key])
    db.session.commit()
    return jsonify({"message": "Restaurant coordinates successfully edited"}), 200

# Client gets close restaurants by location
@restaurant.route("/restaurants/nearby")
@jwt_required()
def get_restaurants_by_location():
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "client":
        return jsonify({"message": "Access forbidden"}), 403
    args_schema = ["latitude", "longitude", "radius"]
    for arg in args_schema:
        if arg not in request.args or request.args[arg] == "":
            return jsonify({"message": "The url args must have latitude, longitude and radius"}), 400
    try:
        latitude = float(request.args.get("latitude"))
        longitude = float(request.args.get("longitude"))
        radius = float(request.args.get("radius"))
    except ValueError:
        return jsonify({"message": "All args must be numbers"}), 400
    start_point = (latitude, longitude)
    restaurants = db.session.scalars(select(Restaurant)).all()
    close_restaurants = []
    for restaurant in restaurants:
        if restaurant.latitude is None or restaurant.longitude is None:
            continue
        distance_between = haversine(start_point, (restaurant.latitude, restaurant.longitude))
        if distance_between < radius:
            close_restaurants.append(restaurant)
    close_restaurant_dicts = [restaurant.serialize() for restaurant in close_restaurants]
    return jsonify(close_restaurant_dicts), 200
    