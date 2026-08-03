from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, get_jwt_identity, create_access_token, jwt_required
from sqlalchemy import select
from api.models import db, Cook, Restaurant

cook = Blueprint("cookbp", __name__)

# Endpoints
# GET cooks
@cook.route("/cooks")
def get_cooks():
    all_cooks = db.session.scalars(select(Cook)).all()
    all_cooks_dicts = [cook.serialize() for cook in all_cooks]
    return jsonify(list(all_cooks_dicts)), 200

# GET single cook
@cook.route("/cooks/<int:cook_id>")
def get_single_cook(cook_id):
    single_cook = db.session.scalar(
        select(Cook).where(Cook.id == cook_id))
    if not single_cook:
        return jsonify({"message": "cook not found"}), 404
    return jsonify(single_cook.serialize()), 200

# POST register a cook
@cook.route("/cooks", methods=["POST"])
def cook_register():
    body = request.get_json()
    cook_mandatory_schema = ["name", "email", "password", "restaurant_id"]
    for key in cook_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'name', 'email', 'password' and 'restaurant_id'"}), 400
    new_cook = Cook(
        name=body.get("name"),
        email=body.get("email"),
        password=body.get("password"),
        restaurant_id=body.get("restaurant_id")
    )
    db.session.add(new_cook)
    db.session.commit()
    return jsonify(new_cook.serialize()), 200

# cook login
@cook.route("/cook_login", methods=["POST"])
def cook_login():
    body = request.get_json()
    if "email" not in body or "password" not in body:
        return jsonify({"message": "Email or password is missing"}), 400
    cook = db.session.scalar(select(Cook).where(
        Cook.email == body.get("email"),
        Cook.password == body.get("password")
    ))
    if not cook:
        return jsonify({"message": "Email or password incorrect"}), 404
    jwtoken = create_access_token(identity=cook.email, additional_claims={"role": "cook"})
    return jsonify({"token": jwtoken, "cook": cook.serialize()})

# DELETE a cook
@cook.route("/cooks/<int:cook_id>", methods=["DELETE"])
def delete_cook(cook_id):
    cook_to_delete = db.session.scalar(
        select(Cook).where(Cook.id == cook_id))
    if not cook_to_delete:
        return jsonify({"message": "cook not found"}), 404
    db.session.delete(cook_to_delete)
    db.session.commit()
    return jsonify({"message": "cook deleted successfully"}), 200

# PUT: edit a cook
@cook.route("/cooks/<int:cook_id>", methods=["PUT"])
def edit_cook(cook_id):
    cook_to_edit = db.session.scalar(
        select(Cook).where(Cook.id == cook_id))
    if not cook_to_edit:
        return jsonify({"message": "cook not found"}), 404
    body = request.get_json()
    cook_mandatory_schema = ["name", "email", "password"]
    for key in cook_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'name', 'email', 'password'."}), 400
    for key in body:
        setattr(cook_to_edit, key, body[key])
    db.session.commit()
    return jsonify(cook_to_edit.serialize()), 200