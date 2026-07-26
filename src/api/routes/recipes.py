# Importamos cosas básicas de Flask:
# - Blueprint: para crear un "módulo" de rutas (como el de productos, pero de recetas)
# - jsonify: para devolver respuestas en formato JSON
# - request: para leer el cuerpo que nos manda el cliente (por ejemplo, al hacer POST o PUT)
from flask import Blueprint, jsonify, request

# Importamos 'select' para hacer consultas a la base de datos con SQLAlchemy
from sqlalchemy import select

# Importamos la base de datos y el modelo Recipe desde nuestros modelos
from api.models import db, Recipe

# Creamos el Blueprint de recetas.
# Es como decir: "estas rutas pertenecen al módulo de recetas"
recipe = Blueprint("recipebp", __name__)


# -----------------------------
# GET: obtener TODAS las recetas
# -----------------------------
@recipe.route("/recipes")
def get_recipes():
    # Pedimos a la base de datos todas las filas de la tabla Recipe
    all_recipes = db.session.scalars(select(Recipe)).all()

    # Convertimos cada objeto Recipe en un diccionario usando su método serialize()
    # Esto es necesario para poder devolverlo como JSON
    all_recipes_dicts = [rec.serialize() for rec in all_recipes]

    # Devolvemos la lista de recetas en formato JSON y el código 200 (todo OK)
    return jsonify(list(all_recipes_dicts)), 200


# --------------------------------
# GET: obtener UNA receta concreta
# --------------------------------
@recipe.route("/recipes/<int:recipe_id>")
def get_single_recipe(recipe_id):
    # Buscamos en la base de datos la receta cuyo id sea igual a recipe_id
    single_recipe = db.session.scalar(
        select(Recipe).where(Recipe.id == recipe_id)
    )

    # Si no encontramos ninguna receta con ese id, devolvemos error 404
    if not single_recipe:
        return jsonify({"message": "Recipe not found"}), 404

    # Si la encontramos, la convertimos a diccionario y la devolvemos como JSON
    return jsonify(single_recipe.serialize()), 200


# -----------------------------
# POST: crear una nueva receta
# -----------------------------
@recipe.route("/recipes", methods=["POST"])
def create_recipe():
    # Leemos el cuerpo (body) que nos manda el cliente en formato JSON
    body = request.get_json()

    # Definimos qué campos son obligatorios para crear una receta
    # En este caso: name (nombre de la receta) y steps (los pasos)
    recipe_mandatory_schema = ["name", "steps"]

    # Revisamos que esos campos existan en el body y que no estén vacíos
    for key in recipe_mandatory_schema:
        if key not in body or body[key] == "":
            # Si falta algo, devolvemos un mensaje de error y código 400 (petición incorrecta)
            return jsonify({
                "message": "Missing info. Body must include 'name' and 'steps'."
            }), 400

    # Si todo está bien, creamos un nuevo objeto Recipe con los datos del body
    new_recipe = Recipe(
        name=body.get("name"),
        steps=body.get("steps")
    )

    # Añadimos la nueva receta a la sesión de la base de datos
    db.session.add(new_recipe)
    # Guardamos los cambios en la base de datos
    db.session.commit()

    # Devolvemos la receta recién creada en formato JSON y código 200
    return jsonify(new_recipe.serialize()), 200


# -----------------------------
# DELETE: eliminar una receta
# -----------------------------
@recipe.route("/recipes/<int:recipe_id>", methods=["DELETE"])
def delete_recipe(recipe_id):
    # Buscamos la receta que queremos borrar por su id
    recipe_to_delete = db.session.scalar(
        select(Recipe).where(Recipe.id == recipe_id)
    )

    # Si no existe, devolvemos error 404
    if not recipe_to_delete:
        return jsonify({"message": "Recipe not found"}), 404

    # Si existe, la borramos de la base de datos
    db.session.delete(recipe_to_delete)
    db.session.commit()

    # Devolvemos un mensaje diciendo que se borró correctamente
    return jsonify({"message": "Recipe deleted successfully"}), 200


# -----------------------------
# PUT: editar una receta
# -----------------------------
@recipe.route("/recipes/<int:recipe_id>", methods=["PUT"])
def edit_recipe(recipe_id):
    # Buscamos la receta que queremos editar por su id
    recipe_to_edit = db.session.scalar(
        select(Recipe).where(Recipe.id == recipe_id)
    )

    # Si no existe, devolvemos error 404
    if not recipe_to_edit:
        return jsonify({"message": "Recipe not found"}), 404

    # Leemos el body que nos manda el cliente con los nuevos datos
    body = request.get_json()

    # Definimos los campos obligatorios para editar la receta
    recipe_mandatory_schema = ["name", "steps"]

    # Comprobamos que esos campos estén en el body y no estén vacíos
    for key in recipe_mandatory_schema:
        if key not in body or body[key] == "":
            return jsonify({
                "message": "Missing info. Body must include 'name' and 'steps'."
            }), 400

    # Recorremos cada clave del body y actualizamos el objeto recipe_to_edit
    # setattr(objeto, "campo", valor) es como hacer objeto.campo = valor
    for key in body:
        setattr(recipe_to_edit, key, body[key])

    # Guardamos los cambios en la base de datos
    db.session.commit()

    # Devolvemos la receta ya editada en formato JSON
    return jsonify(recipe_to_edit.serialize()), 200
