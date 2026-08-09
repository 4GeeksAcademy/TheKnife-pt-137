from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt, create_access_token
from sqlalchemy import select
from api.models import db, Chef, Restaurant, Cook, Waiter, Manager

chef = Blueprint("chefbp", __name__)


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
# GET chefs
@chef.route("/chefs")
@jwt_required()
def get_chefs():
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    all_chefs = db.session.scalars(select(Chef)).all()
    all_chefs_dicts = [chef.serialize() for chef in all_chefs]
    return jsonify(list(all_chefs_dicts)), 200

# GET single chef
@chef.route("/chefs/<int:chef_id>")
@jwt_required()
def get_single_chef(chef_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    single_chef = db.session.scalar(
        select(Chef).where(Chef.id == chef_id))
    if not single_chef:
        return jsonify({"message": "chef not found"}), 404
    return jsonify(single_chef.serialize()), 200

# POST register a chef
@chef.route("/chefs", methods=["POST"])
@jwt_required()
def chef_register():
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    body = request.get_json()
    chef_mandatory_schema = ["name", "email", "password"]
    for key in chef_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'name', 'email', 'password'"}), 400
    new_chef = Chef(
        name=body.get("name"),
        email=body.get("email"),
        password=body.get("password"),
    )
    db.session.add(new_chef)
    db.session.commit()
    return jsonify(new_chef.serialize()), 200

# Chef login
@chef.route("/chef_login", methods=["POST"])
def chef_login():
    body = request.get_json()
    if "email" not in body or "password" not in body:
        return jsonify({"message": "Email or password is missing"}), 400
    chef = db.session.scalar(select(Chef).where(
        Chef.email == body.get("email"),
        Chef.password == body.get("password")
    ))
    if not chef:
        return jsonify({"message": "Email or passowrd incorrect"}), 400
    jwtoken = create_access_token(identity=chef.email, additional_claims={"role": "chef"})
    return jsonify({"token": jwtoken, "chef": chef.serialize()}), 200

# Public chef self-registration (no manager needed)
@chef.route("/chef_register", methods=["POST"])
def chef_self_register():
    body = request.get_json()
    chef_mandatory_schema = ["name", "email", "password"]
    for key in chef_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'name', 'email', 'password'"}), 400
    existing_chef = db.session.scalar(
        select(Chef).where(Chef.email == body.get("email")))
    if existing_chef:
        return jsonify({"message": "A chef with this email already exists"}), 409
    new_chef = Chef(
        name=body.get("name"),
        email=body.get("email"),
        password=body.get("password"),
    )
    db.session.add(new_chef)
    db.session.commit()
    return jsonify(new_chef.serialize()), 200
    

# DELETE a chef
@chef.route("/chefs/<int:chef_id>", methods=["DELETE"])
@jwt_required()
def delete_chef(chef_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    chef_to_delete = db.session.scalar(
        select(Chef).where(Chef.id == chef_id))
    if not chef_to_delete:
        return jsonify({"message": "chef not found"}), 404
    db.session.delete(chef_to_delete)
    db.session.commit()
    return jsonify({"message": "chef deleted successfully"}), 200

# PUT: edit a chef
@chef.route("/chefs/<int:chef_id>", methods=["PUT"])
@jwt_required()
def edit_chef(chef_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    chef_to_edit = db.session.scalar(
        select(Chef).where(Chef.id == chef_id))
    if not chef_to_edit:
        return jsonify({"message": "chef not found"}), 404
    body = request.get_json()
    chef_mandatory_schema = ["name", "email", "password", "restaurant_id"]
    for key in chef_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'name', 'email', 'password', 'restaurant_id'."}), 400
    for key in body:
        setattr(chef_to_edit, key, body[key])
    db.session.commit()
    return jsonify(chef_to_edit.serialize()), 200