from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from sqlalchemy import select
from api.models import db, Client, Manager

client = Blueprint("clientbp", __name__)


def get_current_user():
    email = get_jwt_identity()
    claims = get_jwt()
    role = claims["role"]
    models = {"manager": Manager, "client": Client}
    user_model = models.get(role)
    if not user_model:
        return None, role
    current_user = db.session.scalar(select(user_model).where(user_model.email == email))
    return current_user, role

# Endpoints
# GET clients
@client.route("/clients")
@jwt_required()
def get_clients():
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    all_clients = db.session.scalars(select(Client)).all()
    all_clients_dicts = [client_item.serialize() for client_item in all_clients]
    return jsonify(list(all_clients_dicts)), 200

# GET single client
@client.route("/clients/<int:client_id>")
@jwt_required()
def get_single_client(client_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    single_client = db.session.scalar(select(Client).where(Client.id == client_id))
    if not single_client:
        return jsonify({"message": "Client not found"}), 404
    return jsonify(single_client.serialize()), 200

# POST create a client
@client.route("/clients", methods=["POST"])
@jwt_required()
def create_client():
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    body = request.get_json()
    client_mandatory_schema = ["name", "email", "password"]
    for key in client_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'name', 'email', 'password'"}), 400
    new_client = Client(
        name=body.get("name"),
        email=body.get("email"),
        password=body.get("password"),
        phone=body.get("phone"),
    )
    db.session.add(new_client)
    db.session.commit()
    return jsonify(new_client.serialize()), 200

# Public client self-registration (no manager needed)
@client.route("/client_register", methods=["POST"])
def client_self_register():
    body = request.get_json()
    client_mandatory_schema = ["name", "email", "password"]
    for key in client_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'name', 'email', 'password'"}), 400
    existing_client = db.session.scalar(
        select(Client).where(Client.email == body.get("email")))
    if existing_client:
        return jsonify({"message": "A client with this email already exists"}), 409
    new_client = Client(
        name=body.get("name"),
        email=body.get("email"),
        password=body.get("password"),
        phone=body.get("phone"),
    )
    db.session.add(new_client)
    db.session.commit()
    return jsonify(new_client.serialize()), 200

# Client login
@client.route("/client_login", methods=["POST"])
def client_login():
    body = request.get_json()
    if "email" not in body or "password" not in body:
        return jsonify({"message": "Email or password is missing"}), 400
    client_account = db.session.scalar(select(Client).where(
        Client.email == body.get("email"),
        Client.password == body.get("password")
    ))
    if not client_account:
        return jsonify({"message": "Email or password incorrect"}), 400
    jwtoken = create_access_token(identity=client_account.email, additional_claims={"role": "client"})
    return jsonify({"token": jwtoken, "client": client_account.serialize()}), 200

# DELETE a client
@client.route("/clients/<int:client_id>", methods=["DELETE"])
@jwt_required()
def delete_client(client_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    client_to_delete = db.session.scalar(select(Client).where(Client.id == client_id))
    if not client_to_delete:
        return jsonify({"message": "client not found"}), 404
    db.session.delete(client_to_delete)
    db.session.commit()
    return jsonify({"message": "client deleted successfully"}), 200

# PUT: edit a client
@client.route("/clients/<int:client_id>", methods=["PUT"])
@jwt_required()
def edit_client(client_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    client_to_edit = db.session.scalar(select(Client).where(Client.id == client_id))
    if not client_to_edit:
        return jsonify({"message": "client not found"}), 404
    body = request.get_json()
    client_mandatory_schema = ["name", "email", "password"]
    for key in client_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'name', 'email', 'password'."}), 400
    for key in body:
        setattr(client_to_edit, key, body[key])
    db.session.commit()
    return jsonify(client_to_edit.serialize()), 200
