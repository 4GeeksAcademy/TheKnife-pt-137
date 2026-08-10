"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_cors import CORS
from api.utils import APIException, generate_sitemap
from api.models import db
# from api.routes4geeks import api
from api.admin import setup_admin
from api.commands import setup_commands

### Blueprints imports
from api.routes.products import product
from api.routes.recipes import recipe
from api.routes.tables import table
from api.routes.restaurants import restaurant
from api.routes.ingredients import ingredient
from api.routes.waiters import waiter
from api.routes.orders import order
from api.routes.chefs import chef
from api.routes.recipe_ingredient import recipe_ingredient
from api.routes.cooks import cook
from api.routes.order_products import order_product
from api.routes.managers import manager
from api.routes.hosts import host

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../dist/')
app = Flask(__name__)
CORS(app)
app.url_map.strict_slashes = False

# database configuration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)

# JWT config
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)

db.init_app(app)

# add the admin
setup_admin(app)

# add the commands
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
# app.register_blueprint(api, url_prefix='/api') vamos a usar blueprints propios para organizar en más archivos
app.register_blueprint(product)
app.register_blueprint(recipe)
app.register_blueprint(table)
app.register_blueprint(restaurant)
app.register_blueprint(ingredient)
app.register_blueprint(waiter)
app.register_blueprint(order)
app.register_blueprint(chef)
app.register_blueprint(recipe_ingredient)
app.register_blueprint(cook)
app.register_blueprint(order_product)
app.register_blueprint(manager)
app.register_blueprint(host)

# Handle/serialize errors like a JSON object
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response

# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
