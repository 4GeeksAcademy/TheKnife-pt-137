from flask import Blueprint, jsonify
from sqlalchemy import select

receta = Blueprint("receta", __name__)

### Endpoints
@receta.route("/prueba_receta")
def prueba():
    return jsonify({"message": "esto es una prueba de conexión desde receta"})