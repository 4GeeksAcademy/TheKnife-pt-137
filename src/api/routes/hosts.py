from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt, create_access_token
from sqlalchemy import select
from api.models import db, Host, Restaurant, Chef, Cook, Waiter, Manager

host = Blueprint("hostbp", __name__)


def get_current_user():
    email = get_jwt_identity()
    claims = get_jwt()
    role = claims["role"]
    models = {"chef": Chef, "cook": Cook, "waiter": Waiter, "manager": Manager, "host": Host}
    user_model = models[role]
    current_user = db.session.scalar(
        select(user_model).where(user_model.email == email))
    return current_user, role

# Endpoints
# GET hosts (manager)
@host.route("/hosts")
@jwt_required()
def get_hosts():
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    all_hosts = db.session.scalars(select(Host)).all()
    all_hosts_dicts = [host.serialize() for host in all_hosts]
    return jsonify(list(all_hosts_dicts)), 200

# GET single host (manager)
@host.route("/hosts/<int:host_id>")
@jwt_required()
def get_single_host(host_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    single_host = db.session.scalar(
        select(Host).where(Host.id == host_id))
    if not single_host:
        return jsonify({"message": "Host not found"}), 404
    return jsonify(single_host.serialize()), 200

# Host login
@host.route("/host_login", methods=["POST"])
def host_login():
    body = request.get_json()
    if "email" not in body or "password" not in body:
        return jsonify({"message": "Email or password is missing"}), 400
    host = db.session.scalar(select(Host).where(
        Host.email == body.get("email"),
        Host.password == body.get("password")
    ))
    if not host:
        return jsonify({"message": "Email or password incorrect"}), 400
    restaurant = db.session.scalar(select(Restaurant.name).where(Restaurant.id == host.restaurant_id))
    if not restaurant:
        return jsonify({"message": "Host doesn't have a restaurant asigned"}), 404
    jwtoken = create_access_token(identity=host.email, additional_claims={"role": "host"})
    return jsonify({"token": jwtoken, "host": host.serialize(), "host_restaurant": restaurant}), 200

# DELETE a host (manager or the host himself)
@host.route("/hosts/<int:host_id>", methods=["DELETE"])
@jwt_required()
def delete_host(host_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role not in ["manager", "host"]:
        return jsonify({"message": "Access forbidden"}), 403
    host_to_delete = db.session.scalar(
        select(Host).where(Host.id == host_id))
    if not host_to_delete:
        return jsonify({"message": "Host not found"}), 404
    if role == "host" and current_user.id != host_id:
        return jsonify({"message": "You don't have permissions to delete this host"}), 403
    db.session.delete(host_to_delete)
    db.session.commit()
    return jsonify({"message": "Host deleted successfully"}), 200

# PUT: edit a host (manager or the host himself)
@host.route("/hosts/<int:host_id>", methods=["PUT"])
@jwt_required()
def edit_host(host_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role not in ["manager", "host"]:
        return jsonify({"message": "Access forbidden"}), 403
    host_to_edit = db.session.scalar(
        select(Host).where(Host.id == host_id))
    if not host_to_edit:
        return jsonify({"message": "Host not found"}), 404
    if role == "host" and current_user.id != host_id:
        return jsonify({"message": "You don't have permissions to edit this host"}), 403
    body = request.get_json()
    host_mandatory_schema = ["name", "email", "password"]
    for key in host_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'name', 'email', 'password'."}), 400
    for key in body:
        setattr(host_to_edit, key, body[key])
    db.session.commit()
    return jsonify(host_to_edit.serialize()), 200

############################################################################
### CHEFS #########
# Chef sees the host of his restaurant
@host.route("/restaurants/<int:restaurant_id>/host")
@jwt_required()
def get_restaurant_host(restaurant_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "chef":
        return jsonify({"message": "Access forbidden"}), 403
    if current_user.restaurant_id != restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403
    restaurant_host = db.session.scalar(select(Host).where(Host.restaurant_id == restaurant_id))
    if not restaurant_host:
        return jsonify({"message": "Host not found"}), 404
    return jsonify(restaurant_host.serialize()), 200

# Chef registers a host in his restaurant
@host.route("/restaurants/<int:restaurant_id>/host_register", methods=["POST"])
@jwt_required()
def chef_register_host(restaurant_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "chef":
        return jsonify({"message": "Access forbidden"}), 403
    if current_user.restaurant_id != restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403
    existing_host = db.session.scalar(
        select(Host).where(Host.restaurant_id == restaurant_id))
    if existing_host:
        return jsonify({"message": "This restaurant already has a host"}), 409
    body = request.get_json()
    host_mandatory_schema = ["name", "email", "password"]
    for key in host_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'name', 'email', 'password'"}), 400
    existing_email = db.session.scalar(
        select(Host).where(Host.email == body.get("email")))
    if existing_email:
        return jsonify({"message": "A host with this email already exists"}), 409
    new_host = Host(
        name=body.get("name"),
        email=body.get("email"),
        password=body.get("password"),
        img_url=body.get("img_url"),
        restaurant_id=restaurant_id
    )
    db.session.add(new_host)
    db.session.commit()
    return jsonify(new_host.serialize()), 200
