from flask import Blueprint, jsonify
from sqlalchemy import select

producto = Blueprint("producto", __name__)

### Endpoints
@producto.route("/prueba_producto")
def prueba():
    return jsonify({"message": "esto es una prueba de conexión desde producto"})