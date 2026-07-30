from flask import Blueprint, jsonify, request
from sqlalchemy import select
from api.models import db, Waiter

waiter = Blueprint("waiterbp", __name__)

# Endpoints
# GET waiters
@waiter.route("/waiters")
def get_waiters():
    all_waiters = db.session.scalars(select(Waiter)).all()
    all_waiters_dicts = [waiter.serialize() for waiter in all_waiters]
    return jsonify(list(all_waiters_dicts)), 200

# GET single waiter
@waiter.route("/waiters/<int:waiter_id>")
def get_single_waiter(waiter_id):
    single_waiter = db.session.scalar(
        select(Waiter).where(Waiter.id == waiter_id))
    if not single_waiter:
        return jsonify({"message": "Waiter not found"}), 404
    return jsonify(single_waiter.serialize()), 200

# POST create a waiter
@waiter.route("/waiters", methods=["POST"])
def create_waiter():
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

# DELETE a waiter
@waiter.route("/waiters/<int:waiter_id>", methods=["DELETE"])
def delete_waiter(waiter_id):
    waiter_to_delete = db.session.scalar(
        select(Waiter).where(Waiter.id == waiter_id))
    if not waiter_to_delete:
        return jsonify({"message": "waiter not found"}), 404
    db.session.delete(waiter_to_delete)
    db.session.commit()
    return jsonify({"message": "Waiter deleted successfully"}), 200

# PUT: edit a waiter
@waiter.route("/waiters/<int:waiter_id>", methods=["PUT"])
def edit_waiter(waiter_id):
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