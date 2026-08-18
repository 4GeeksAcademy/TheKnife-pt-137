"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from datetime import date
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask.json.provider import DefaultJSONProvider
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_cors import CORS
from api.utils import APIException, generate_sitemap
from api.models import db
# from api.routes4geeks import api
from api.admin import setup_admin
from api.commands import setup_commands
from api.cloudinary_config import setup_cloudinary

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
from api.routes.reservations import reservation
from api.routes.ai_recipe import ai_recipe
from api.routes.clients import client

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../dist/')
app = Flask(__name__)
CORS(app)
app.url_map.strict_slashes = False

# All datetimes in this app (reservation_time, date_time, created_at...) are stored and
# read back as naive wall-clock time (there's no per-restaurant timezone concept). Flask's
# default JSON encoder serializes them with http_date(), which stamps them "GMT" — the
# frontend's `new Date(...)` then reads that as real UTC and re-converts to the browser's
# local timezone, shifting times that were never UTC to begin with. Emitting plain ISO
# format (no timezone suffix) makes `new Date(...)` parse it as local time, matching what
# was actually stored, with no shift.
class NaiveDateTimeJSONProvider(DefaultJSONProvider):
    @staticmethod
    def default(o):
        if isinstance(o, date):
            return o.isoformat()
        return DefaultJSONProvider.default(o)

app.json = NaiveDateTimeJSONProvider(app)

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

# configure the Cloudinary SDK (used to auto-generate ingredient images)
setup_cloudinary()

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
app.register_blueprint(reservation)
app.register_blueprint(ai_recipe)
app.register_blueprint(client)

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
