from flask import Blueprint, jsonify
from sqlalchemy import select

mesa = Blueprint("mesa", __name__)

### Endpoints
@mesa.route("/prueba_mesa")
def prueba():
    return jsonify({"message": "esto es una prueba de conexión desde mesa"})