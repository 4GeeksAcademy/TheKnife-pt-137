from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, get_jwt_identity, create_access_token, jwt_required
from sqlalchemy import select
from api.models import db, Waiter, Restaurant, Chef, Cook, Manager

waiter = Blueprint("waiterbp", __name__)

def get_current_user():
    email = get_jwt_identity()
    claims = get_jwt()
    role = claims["role"]
    models = {"chef": Chef, "cook": Cook, "waiter": Waiter, "manager": Manager}
    user_model = models[role]
    current_user = db.session.scalar(select(user_model).where(user_model.email == email))
    return current_user, role

# Endpoints
# GET waiters
@waiter.route("/waiters")
@jwt_required()
def get_waiters():
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    all_waiters = db.session.scalars(select(Waiter)).all()
    all_waiters_dicts = [waiter.serialize() for waiter in all_waiters]
    return jsonify(list(all_waiters_dicts)), 200

# GET single waiter
@waiter.route("/waiters/<int:waiter_id>")
@jwt_required()
def get_single_waiter(waiter_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    single_waiter = db.session.scalar(
        select(Waiter).where(Waiter.id == waiter_id))
    if not single_waiter:
        return jsonify({"message": "Waiter not found"}), 404
    return jsonify(single_waiter.serialize()), 200

# POST register a waiter
@waiter.route("/waiters", methods=["POST"])
@jwt_required()
def waiter_register():
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    body = request.get_json()
    waiter_mandatory_schema = ["name", "email", "password", "restaurant_id"]
    for key in waiter_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'name', 'email', 'password' and 'restaurant_id'"}), 400
    new_waiter = Waiter(
        name=body.get("name"),
        email=body.get("email"),
        password=body.get("password"),
        restaurant_id=body.get("restaurant_id")
    )
    db.session.add(new_waiter)
    db.session.commit()
    return jsonify(new_waiter.serialize()), 200

# Waiter login
@waiter.route("/waiter_login", methods=["POST"])
def waiter_login():
    body = request.get_json()
    if "email" not in body or "password" not in body:
        return jsonify({"message": "Email or password is missing"}), 400
    waiter = db.session.scalar(select(Waiter).where(
        Waiter.email == body.get("email"),
        Waiter.password == body.get("password")
    ))
    if not waiter:
        return jsonify({"message": "Email or password incorrect"}), 400
    restaurant = db.session.scalar(select(Restaurant.name).where(Restaurant.id == waiter.restaurant_id))
    if not restaurant:
        return jsonify({"message": "Waiter doesn't have a restaurant asigned"}), 404
    jwtoken = create_access_token(identity=waiter.email, additional_claims={"role": "waiter"})
    return jsonify({"token": jwtoken, "waiter": waiter.serialize(), "waiter_restaurant": restaurant}), 200

# DELETE a waiter
@waiter.route("/waiters/<int:waiter_id>", methods=["DELETE"])
@jwt_required()
def delete_waiter(waiter_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    waiter_to_delete = db.session.scalar(
        select(Waiter).where(Waiter.id == waiter_id))
    if not waiter_to_delete:
        return jsonify({"message": "waiter not found"}), 404
    db.session.delete(waiter_to_delete)
    db.session.commit()
    return jsonify({"message": "Waiter deleted successfully"}), 200

# PUT: edit a waiter
@waiter.route("/waiters/<int:waiter_id>", methods=["PUT"])
@jwt_required()
def edit_waiter(waiter_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    waiter_to_edit = db.session.scalar(
        select(Waiter).where(Waiter.id == waiter_id))
    if not waiter_to_edit:
        return jsonify({"message": "Waiter not found"}), 404
    body = request.get_json()
    waiter_mandatory_schema = ["name", "email", "password"]
    for key in waiter_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'name', 'email', 'password'."}), 400
    for key in body:
        setattr(waiter_to_edit, key, body[key])
    db.session.commit()
    return jsonify(waiter_to_edit.serialize()), 200

############################################################################
### CHEFS #########
# Chef see the list of waiters of his restaurant
@waiter.route("/restaurants/<int:restaurant_id>/waiters")
@jwt_required()
def get_restaurant_waiters(restaurant_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "chef":
        return jsonify({"message": "Access forbidden"}), 403
    if current_user.restaurant_id != restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403
    all_restaurant_waiters = db.session.scalars(select(Waiter).where(Waiter.restaurant_id == restaurant_id)).all()
    all_restaurant_waiters_dicts = [waiter.serialize() for waiter in all_restaurant_waiters]
    return jsonify(list(all_restaurant_waiters_dicts)), 200

# Chef registers a waiter
@waiter.route("/restaurants/<int:restaurant_id>/waiter_register", methods=["POST"])
@jwt_required()
def chef_register_waiter(restaurant_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "chef":
        return jsonify({"message": "Access forbidden"}), 403
    if current_user.restaurant_id != restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403
    body = request.get_json()
    waiter_mandatory_schema = ["name", "email", "password"]
    for key in waiter_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'name', 'email', 'password'"}), 400
    new_waiter = Waiter(
        name=body.get("name"),
        email=body.get("email"),
        password=body.get("password"),
        restaurant_id=restaurant_id
    )
    db.session.add(new_waiter)
    db.session.commit()
    return jsonify(new_waiter.serialize()), 200

# Chef deletes a waiter
@waiter.route("/restaurants/<int:restaurant_id>/waiters/<int:waiter_id>", methods=["DELETE"])
@jwt_required()
def chef_or_waiter_delete_waiter(waiter_id, restaurant_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role not in ["chef", "waiter"]:
        return jsonify({"message": "Access forbidden"}), 403
    if current_user.restaurant_id != restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403
    waiter_to_delete = db.session.scalar(
        select(Waiter).where(Waiter.id == waiter_id))
    if role == "waiter":
        if waiter_to_delete.id != current_user.id:
            return jsonify({"message": "You don't have permissions to delete this waiter"})
    if waiter_to_delete.restaurant_id != restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403
    if not waiter_to_delete:
        return jsonify({"message": "waiter not found"}), 404
    db.session.delete(waiter_to_delete)
    db.session.commit()
    return jsonify({"message": "waiter deleted successfully"}), 200