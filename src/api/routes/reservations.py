from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from sqlalchemy import select, func
from datetime import datetime
from api.models import db, Reservation, Manager, Client, Host

reservation = Blueprint("reservationbp", __name__)

# Reservation statuses considered closed (not active): hidden from the default host view
CLOSED_STATUSES = ["cancelled", "completed"]
# Every valid reservation status
ALLOWED_STATUSES = ["waiting", "confirmed", "seated", "completed", "cancelled"]


def get_current_user():
    email = get_jwt_identity()
    claims = get_jwt()
    role = claims["role"]
    models = {"manager": Manager, "client": Client, "host": Host}
    user_model = models.get(role)
    if not user_model:
        return None, role
    current_user = db.session.scalar(
        select(user_model).where(user_model.email == email))
    return current_user, role

# Endpoints
# GET reservations
@reservation.route("/reservations")
@jwt_required()
def get_reservations():
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    all_reservations = db.session.scalars(select(Reservation)).all()
    all_reservations_dicts = [reservation_item.serialize() for reservation_item in all_reservations]
    return jsonify(list(all_reservations_dicts)), 200

# GET single reservation
@reservation.route("/reservations/<int:reservation_id>")
@jwt_required()
def get_single_reservation(reservation_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    single_reservation = db.session.scalar(
        select(Reservation).where(Reservation.id == reservation_id))
    if not single_reservation:
        return jsonify({"message": "Reservation not found"}), 404
    return jsonify(single_reservation.serialize()), 200

# POST create a reservation
@reservation.route("/reservations", methods=["POST"])
@jwt_required()
def create_reservation():
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    body = request.get_json()
    reservation_mandatory_schema = ["restaurant_id", "customer_name", "party_size"]

    for key in reservation_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'restaurant_id', 'customer_name' and 'party_size'."}), 400

    new_reservation = Reservation(
        restaurant_id=body.get("restaurant_id"),
        table_id=body.get("table_id"),
        customer_name=body.get("customer_name"),
        phone=body.get("phone"),
        party_size=body.get("party_size"),
        reservation_time=body.get("reservation_time"),
        status=body.get("status") or "waiting"
    )

    db.session.add(new_reservation)
    db.session.commit()
    return jsonify(new_reservation.serialize()), 200

# POST create a reservation as a logged-in client
@reservation.route("/restaurants/<int:restaurant_id>/reservations", methods=["POST"])
@jwt_required()
def create_client_reservation(restaurant_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "client":
        return jsonify({"message": "Access forbidden"}), 403
    body = request.get_json()
    reservation_mandatory_schema = ["customer_name", "party_size"]

    for key in reservation_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'customer_name' and 'party_size'."}), 400

    new_reservation = Reservation(
        restaurant_id=restaurant_id,
        client_id=current_user.id,
        customer_name=body.get("customer_name"),
        phone=body.get("phone"),
        party_size=body.get("party_size"),
        reservation_time=body.get("reservation_time"),
        status="waiting"
    )

    db.session.add(new_reservation)
    db.session.commit()
    return jsonify(new_reservation.serialize()), 201

# GET reservations belonging to the logged-in client
@reservation.route("/reservations/mine")
@jwt_required()
def get_my_reservations():
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "client":
        return jsonify({"message": "Access forbidden"}), 403
    my_reservations = db.session.scalars(
        select(Reservation).where(Reservation.client_id == current_user.id)).all()
    return jsonify([reservation_item.serialize() for reservation_item in my_reservations]), 200

# PUT: cancel a reservation (client cancels their own, manager can cancel any)
@reservation.route("/reservations/<int:reservation_id>/cancel", methods=["PUT"])
@jwt_required()
def cancel_reservation(reservation_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role not in ("client", "manager"):
        return jsonify({"message": "Access forbidden"}), 403
    reservation_to_cancel = db.session.scalar(
        select(Reservation).where(Reservation.id == reservation_id))
    if not reservation_to_cancel:
        return jsonify({"message": "Reservation not found"}), 404
    if role == "client" and reservation_to_cancel.client_id != current_user.id:
        return jsonify({"message": "Access forbidden"}), 403

    reservation_to_cancel.status = "cancelled"
    db.session.commit()
    return jsonify(reservation_to_cancel.serialize()), 200

# DELETE a reservation
@reservation.route("/reservations/<int:reservation_id>", methods=["DELETE"])
@jwt_required()
def delete_reservation(reservation_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    reservation_to_delete = db.session.scalar(
        select(Reservation).where(Reservation.id == reservation_id))
    if not reservation_to_delete:
        return jsonify({"message": "Reservation not found"}), 404

    db.session.delete(reservation_to_delete)
    db.session.commit()
    return jsonify({"message": "Reservation deleted successfully"}), 200

# PUT: edit a reservation
@reservation.route("/reservations/<int:reservation_id>", methods=["PUT"])
@jwt_required()
def edit_reservation(reservation_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role not in ("manager", "client"):
        return jsonify({"message": "Access forbidden"}), 403
    reservation_to_edit = db.session.scalar(
        select(Reservation).where(Reservation.id == reservation_id))
    if not reservation_to_edit:
        return jsonify({"message": "Reservation not found"}), 404
    if role == "client" and reservation_to_edit.client_id != current_user.id:
        return jsonify({"message": "Access forbidden"}), 403

    body = request.get_json()

    if role == "client":
        allowed_keys = {"customer_name", "phone", "party_size", "reservation_time"}
        body = {key: value for key, value in body.items() if key in allowed_keys}
        reservation_mandatory_schema = ["customer_name", "party_size"]
    else:
        reservation_mandatory_schema = ["restaurant_id", "customer_name", "party_size"]

    for key in reservation_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing"}), 400

    for key in body:
        setattr(reservation_to_edit, key, body[key])

    db.session.commit()
    return jsonify(reservation_to_edit.serialize()), 200

############################################################################
### HOST ###
# Host sees the reservations of his own restaurant
@reservation.route("/host/reservations")
@jwt_required()
def get_host_reservations():
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "host":
        return jsonify({"message": "Access forbidden"}), 403
    if not current_user.restaurant_id:
        return jsonify({"message": "Host doesn't have a restaurant assigned"}), 404
    query = select(Reservation).where(Reservation.restaurant_id == current_user.restaurant_id)
    # By default only active reservations are returned; the full history (including
    # cancelled and completed) is returned when the "history" arg is truthy.
    history = request.args.get("history")
    if history not in ("true", "1"):
        query = query.where(Reservation.status.notin_(CLOSED_STATUSES))
    # Optional filters: by customer name (partial, case-insensitive) and by reservation day
    name = request.args.get("name")
    date = request.args.get("date")
    if name:
        query = query.where(Reservation.customer_name.ilike(f"%{name}%"))
    if date:
        try:
            day = datetime.strptime(date, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"message": "The 'date' arg must be in YYYY-MM-DD format"}), 400
        query = query.where(func.date(Reservation.reservation_time) == day)
    restaurant_reservations = db.session.scalars(query).all()
    restaurant_reservations_dicts = [reservation_item.serialize() for reservation_item in restaurant_reservations]
    return jsonify(list(restaurant_reservations_dicts)), 200

# Host creates a manual reservation for a walk-in / unregistered client
@reservation.route("/host/reservations", methods=["POST"])
@jwt_required()
def host_create_reservation():
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "host":
        return jsonify({"message": "Access forbidden"}), 403
    if not current_user.restaurant_id:
        return jsonify({"message": "Host doesn't have a restaurant assigned"}), 404
    body = request.get_json()
    reservation_mandatory_schema = ["customer_name", "party_size"]
    for key in reservation_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'customer_name' and 'party_size'."}), 400
    new_reservation = Reservation(
        restaurant_id=current_user.restaurant_id,
        table_id=body.get("table_id"),
        client_id=None,
        customer_name=body.get("customer_name"),
        phone=body.get("phone"),
        party_size=body.get("party_size"),
        reservation_time=body.get("reservation_time"),
        status=body.get("status") or "waiting"
    )
    db.session.add(new_reservation)
    db.session.commit()
    return jsonify(new_reservation.serialize()), 200

# Host updates the status of a reservation of his own restaurant
@reservation.route("/host/reservations/<int:reservation_id>/status", methods=["PATCH"])
@jwt_required()
def host_update_reservation_status(reservation_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "host":
        return jsonify({"message": "Access forbidden"}), 403
    reservation_to_edit = db.session.scalar(
        select(Reservation).where(Reservation.id == reservation_id))
    if not reservation_to_edit:
        return jsonify({"message": "Reservation not found"}), 404
    if reservation_to_edit.restaurant_id != current_user.restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403
    body = request.get_json()
    status = body.get("status")
    if not status:
        return jsonify({"message": "The body must have a 'status'"}), 400
    if status not in ALLOWED_STATUSES:
        return jsonify({"message": f"Invalid status. Allowed: {', '.join(ALLOWED_STATUSES)}"}), 400
    reservation_to_edit.status = status
    db.session.commit()
    return jsonify(reservation_to_edit.serialize()), 200
