from flask import Blueprint, jsonify
from sqlalchemy import select

table = Blueprint("tablebp", __name__)

### Endpoints
