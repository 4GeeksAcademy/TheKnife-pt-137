from flask import Blueprint, jsonify, request
from sqlalchemy import select
from api.models import db, Table

table = Blueprint("tablebp", __name__)

# Endpoints
# GET Tables
@table.route("/tables")
def get_tables():
    all_tables = db.session.scalars(select(Table)).all()
    all_tables_dicts = [table_item.serialize() for table_item in all_tables]
    return jsonify(list(all_tables_dicts)), 200

# GET single table
@table.route("/tables/<int:table_id>")
def get_single_table(table_id):
    single_table = db.session.scalar(
        select(Table).where(Table.id == table_id))
    if not single_table:
        return jsonify({"message": "Table not found"}), 404
    return jsonify(single_table.serialize()), 200

# POST create a table
@table.route("/tables", methods=["POST"])
def create_table():
    body = request.get_json()
    table_mandatory_schema = ["number", "status", "location"]
    
    for key in table_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'number', 'status', 'location'."}), 400
            
    new_table = Table(
        number=body.get("number"),
        status=body.get("status"),
        location=body.get("location")
    )
    
    db.session.add(new_table)
    db.session.commit()
    return jsonify(new_table.serialize()), 200

# DELETE a table
@table.route("/tables/<int:table_id>", methods=["DELETE"])
def delete_table(table_id):
    table_to_delete = db.session.scalar(
        select(Table).where(Table.id == table_id))
    if not table_to_delete:
        return jsonify({"message": "Table not found"}), 404
        
    db.session.delete(table_to_delete)
    db.session.commit()
    return jsonify({"message": "Table deleted successfully"}), 200

# PUT: edit a table
@table.route("/tables/<int:table_id>", methods=["PUT"])
def edit_table(table_id):
    table_to_edit = db.session.scalar(
        select(Table).where(Table.id == table_id))
    if not table_to_edit:
        return jsonify({"message": "Table not found"}), 404
        
    body = request.get_json()
    table_mandatory_schema = ["number", "status", "location"]
    
    for key in table_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'number', 'status', 'location'."}), 400
            
    for key in body:
        setattr(table_to_edit, key, body[key])
        
    db.session.commit()
    return jsonify(table_to_edit.serialize()), 200