from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from sqlalchemy import select
from api.models import db, Table, Chef, Cook, Waiter, Manager

table = Blueprint("tablebp", __name__)


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
# GET Tables
@table.route("/tables")
@jwt_required()
def get_tables():
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    all_tables = db.session.scalars(select(Table)).all()
    all_tables_dicts = [table_item.serialize() for table_item in all_tables]
    return jsonify(list(all_tables_dicts)), 200

# GET single table
@table.route("/tables/<int:table_id>")
@jwt_required()
def get_single_table(table_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    single_table = db.session.scalar(
        select(Table).where(Table.id == table_id))
    if not single_table:
        return jsonify({"message": "Table not found"}), 404
    return jsonify(single_table.serialize()), 200

# POST create a table
@table.route("/tables", methods=["POST"])
@jwt_required()
def create_table():
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    body = request.get_json()
    table_mandatory_schema = ["number", "status", "location", "restaurant_id"]
    
    for key in table_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'number', 'status', 'location', 'restaurant_id'."}), 400
            
    new_table = Table(
        number=body.get("number"),
        status=body.get("status"),
        location=body.get("location"),
        restaurant_id=body.get("restaurant_id")
    )
    
    db.session.add(new_table)
    db.session.commit()
    return jsonify(new_table.serialize()), 200

# DELETE a table
@table.route("/tables/<int:table_id>", methods=["DELETE"])
@jwt_required()
def delete_table(table_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    table_to_delete = db.session.scalar(
        select(Table).where(Table.id == table_id))
    if not table_to_delete:
        return jsonify({"message": "Table not found"}), 404
        
    db.session.delete(table_to_delete)
    db.session.commit()
    return jsonify({"message": "Table deleted successfully"}), 200

# PUT: edit a table
@table.route("/tables/<int:table_id>", methods=["PUT"])
@jwt_required()
def edit_table(table_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role != "manager":
        return jsonify({"message": "Access forbidden"}), 403
    table_to_edit = db.session.scalar(
        select(Table).where(Table.id == table_id))
    if not table_to_edit:
        return jsonify({"message": "Table not found"}), 404
        
    body = request.get_json()
    table_mandatory_schema = ["number", "status", "location", "restaurant_id"]
    
    for key in table_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'number', 'status', 'location', 'restaurant_id'"}), 400
            
    for key in body:
        setattr(table_to_edit, key, body[key])

    db.session.commit()
    return jsonify(table_to_edit.serialize()), 200


############################################################################
##### CHEF & WAITER #####
# GET all tables of the restaurant
@table.route("/restaurants/<int:restaurant_id>/tables")
@jwt_required()
def get_restaurant_tables(restaurant_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role not in ["chef", "waiter"]:
        return jsonify({"message": "Access forbidden"}), 403
    if current_user.restaurant_id != restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403
    restaurant_tables = db.session.scalars(select(Table).where(
        Table.restaurant_id == restaurant_id, Table.active == True
    )).all()
    return jsonify([t.serialize() for t in restaurant_tables]), 200

# GET inactive (deactivated) tables of the restaurant
@table.route("/restaurants/<int:restaurant_id>/tables/inactive")
@jwt_required()
def get_restaurant_inactive_tables(restaurant_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role not in ["chef", "waiter"]:
        return jsonify({"message": "Access forbidden"}), 403
    if current_user.restaurant_id != restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403
    inactive_tables = db.session.scalars(select(Table).where(
        Table.restaurant_id == restaurant_id, Table.active == False
    )).all()
    return jsonify([t.serialize() for t in inactive_tables]), 200

# POST create a table for the restaurant
@table.route("/restaurants/<int:restaurant_id>/tables", methods=["POST"])
@jwt_required()
def create_restaurant_table(restaurant_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role not in ["chef", "waiter"]:
        return jsonify({"message": "Access forbidden"}), 403
    if current_user.restaurant_id != restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403
    body = request.get_json()
    table_mandatory_schema = ["number", "status", "location"]
    for key in table_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'number', 'status', 'location'"}), 400
    new_table = Table(
        number=body.get("number"),
        status=body.get("status"),
        location=body.get("location"),
        restaurant_id=restaurant_id
    )
    db.session.add(new_table)
    db.session.commit()
    return jsonify(new_table.serialize()), 200

# PUT edit a table of the restaurant
@table.route("/restaurants/<int:restaurant_id>/tables/<int:table_id>", methods=["PUT"])
@jwt_required()
def edit_restaurant_table(restaurant_id, table_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role not in ["chef", "waiter"]:
        return jsonify({"message": "Access forbidden"}), 403
    if current_user.restaurant_id != restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403
    table_to_edit = db.session.scalar(select(Table).where(Table.id == table_id))
    if not table_to_edit:
        return jsonify({"message": "Table not found"}), 404
    if table_to_edit.restaurant_id != restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403
    body = request.get_json()
    table_mandatory_schema = ["number", "status", "location"]
    for key in table_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'number', 'status', 'location'"}), 400
    for key in body:
        setattr(table_to_edit, key, body[key])
    db.session.commit()
    return jsonify(table_to_edit.serialize()), 200

# Deactivate a table of the restaurant (soft delete: una mesa puede tener comandas
# asociadas, incluso cerradas, así que no se puede borrar de verdad sin romper ese historial)
@table.route("/restaurants/<int:restaurant_id>/tables/<int:table_id>", methods=["DELETE"])
@jwt_required()
def deactivate_restaurant_table(restaurant_id, table_id):
    current_user, role = get_current_user()
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    if role not in ["chef", "waiter"]:
        return jsonify({"message": "Access forbidden"}), 403
    if current_user.restaurant_id != restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403
    table_to_deactivate = db.session.scalar(select(Table).where(Table.id == table_id))
    if not table_to_deactivate:
        return jsonify({"message": "Table not found"}), 404
    if table_to_deactivate.restaurant_id != restaurant_id:
        return jsonify({"message": "Access forbidden"}), 403
    table_to_deactivate.active = False
    db.session.commit()
    return jsonify({"message": "Table deactivated successfully"}), 200