from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from sqlalchemy import select
from api.models import db, Manager, Chef, Cook, Waiter

manager = Blueprint("managerbp", __name__)


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
# GET managers
@manager.route("/managers")
@jwt_required()
def get_managers():
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    all_managers = db.session.scalars(select(Manager)).all()
    all_managers_dicts = [manager.serialize() for manager in all_managers]
    return jsonify(list(all_managers_dicts)), 200

# POST register a manager
@manager.route("/managers", methods=["POST"])
def manager_register():
    all_managers = db.session.scalars(select(Manager)).all()
    if len(all_managers) >= 2:
        return jsonify({"message": "Alredy 2 managers are registered. Reached max manager account number"}), 409
    body = request.get_json()
    manager_mandatory_schema = ["name", "email", "password"]
    for key in manager_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'name', 'email', 'password'"}), 400
    new_manager = Manager(
        name=body.get("name"),
        email=body.get("email"),
        password=body.get("password"),
    )
    db.session.add(new_manager)
    db.session.commit()
    return jsonify(new_manager.serialize()), 200

# Manager login
@manager.route("/manager_login", methods=["POST"])
def manager_login():
    body = request.get_json()
    if "email" not in body or "password" not in body:
        return jsonify({"message": "Email or password is missing"}), 400
    manager = db.session.scalar(select(Manager).where(
        Manager.email == body.get("email"),
        Manager.password == body.get("password")
    ))
    if not manager:
        return jsonify({"message": "Email or password incorrect"}), 400
    jwtoken = create_access_token(identity=manager.email, additional_claims={"role": "manager"})
    return jsonify({"token": jwtoken, "manager": manager.serialize()}), 200

# DELETE a manager
@manager.route("/managers/<int:manager_id>", methods=["DELETE"])
@jwt_required()
def delete_manager(manager_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    manager_to_delete = db.session.scalar(
        select(Manager).where(Manager.id == manager_id))
    if not manager_to_delete:
        return jsonify({"message": "manager not found"}), 404
    db.session.delete(manager_to_delete)
    db.session.commit()
    return jsonify({"message": "manager deleted successfully"}), 200

# PUT: edit a manager
@manager.route("/managers/<int:manager_id>", methods=["PUT"])
@jwt_required()
def edit_manager(manager_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    manager_to_edit = db.session.scalar(
        select(Manager).where(Manager.id == manager_id))
    if not manager_to_edit:
        return jsonify({"message": "manager not found"}), 404
    body = request.get_json()
    manager_mandatory_schema = ["name", "email", "password"]
    for key in manager_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'name', 'email', 'password'."}), 400
    for key in body:
        setattr(manager_to_edit, key, body[key])
    db.session.commit()
    return jsonify(manager_to_edit.serialize()), 200