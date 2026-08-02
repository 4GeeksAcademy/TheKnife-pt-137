import os
import inspect
# CAMBIO 1: Renombramos la clase de Flask-Admin para que no choque con tu tabla
from flask_admin import Admin as FlaskAdminApp
from . import models
from .models import db
from flask_admin.contrib.sqla import ModelView
from flask_admin.theme import Bootstrap4Theme


from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, get_jwt_identity, create_access_token, jwt_required
from sqlalchemy import select
# Tu modelo Admin de la base de datos se queda igual
from api.models import db, Admin

# CAMBIO 2: Renombramos el blueprint a admin_bp
admin_bp = Blueprint("adminbp", __name__)

# Endpoints
# GET admins
@admin_bp.route("/admins")
def get_admins():
    all_admins = db.session.scalars(select(Admin)).all()
    all_admins_dicts = [admin.serialize() for admin in all_admins]
    return jsonify(list(all_admins_dicts)), 200

# GET single admin
@admin_bp.route("/admins/<int:admin_id>")
def get_single_admin(admin_id):
    single_admin = db.session.scalar(
        select(Admin).where(Admin.id == admin_id))
    if not single_admin:
        return jsonify({"message": "Admin not found"}), 404
    return jsonify(single_admin.serialize()), 200

# POST register an admin
@admin_bp.route("/admins", methods=["POST"])
def admin_register():
    body = request.get_json()
    # Si tu admin no lleva restaurant_id, sácalo de esta lista
    admin_mandatory_schema = ["name", "email", "password", "restaurant_id"]
    for key in admin_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'name', 'email', 'password' and 'restaurant_id'"}), 400
    
    new_admin = Admin(
        name=body.get("name"),
        email=body.get("email"),
        password=body.get("password"), 
        restaurant_id=body.get("restaurant_id")
    )
    db.session.add(new_admin)
    db.session.commit()
    return jsonify(new_admin.serialize()), 200

# Admin login
@admin_bp.route("/admin_login", methods=["POST"])
def admin_login():
    body = request.get_json()
    if "email" not in body or "password" not in body:
        return jsonify({"message": "Email or password is missing"}), 400
    
    admin_obj = db.session.scalar(select(Admin).where(
        Admin.email == body.get("email"),
        Admin.password == body.get("password")
    ))
    if not admin_obj:
        return jsonify({"message": "Email or password incorrect"}), 404
    
    jwtoken = create_access_token(identity=admin_obj.email, additional_claims={"role": "admin"})
    return jsonify({"token": jwtoken})

# DELETE an admin
@admin_bp.route("/admins/<int:admin_id>", methods=["DELETE"])
def delete_admin(admin_id):
    admin_to_delete = db.session.scalar(
        select(Admin).where(Admin.id == admin_id))
    if not admin_to_delete:
        return jsonify({"message": "Admin not found"}), 404
    db.session.delete(admin_to_delete)
    db.session.commit()
    return jsonify({"message": "Admin deleted successfully"}), 200

# PUT: edit an admin
@admin_bp.route("/admins/<int:admin_id>", methods=["PUT"])
def edit_admin(admin_id):
    admin_to_edit = db.session.scalar(
        select(Admin).where(Admin.id == admin_id))
    if not admin_to_edit:
        return jsonify({"message": "Admin not found"}), 404
    
    body = request.get_json()
    admin_mandatory_schema = ["name", "email", "password"]
    for key in admin_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({"message": "Some info is missing. Ensure body has 'name', 'email', 'password'."}), 400
            
    for key in body:
        setattr(admin_to_edit, key, body[key])
    db.session.commit()
    return jsonify(admin_to_edit.serialize()), 200


def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    # CAMBIO 3: Usamos el alias FlaskAdminApp para evitar conflictos
    admin_panel = FlaskAdminApp(app, name='4Geeks Admin', theme=Bootstrap4Theme(swatch='cerulean'))

    # Dynamically add all models to the admin interface
    for name, obj in inspect.getmembers(models):
        # Verify that the object is a SQLAlchemy model before adding it to the admin. 
        if inspect.isclass(obj) and issubclass(obj, db.Model):
            admin_panel.add_view(ModelView(obj, db.session))