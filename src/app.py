"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
import json
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_cors import CORS

from api.utils import APIException, generate_sitemap
from api.models import db, User
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

# flask jwt paquete de instalacion
from flask_jwt_extended import JWTManager


# ------------------------------------------------------------
# APP
# ------------------------------------------------------------
app = Flask(__name__)
app.url_map.strict_slashes = False

ENV = os.getenv("FLASK_ENV", "production").strip().lower()

static_file_dir = os.path.join(
    os.path.dirname(os.path.realpath(__file__)),
    "../public/"
)


# ------------------------------------------------------------
# DATABASE CONFIGURATION
# ------------------------------------------------------------
db_url = os.getenv("DATABASE_URL", "").strip()

# Si estás en Render/producción, exige Postgres (más seguro que caer en sqlite sin querer)
if ENV in ("production", "prod"):
    if not db_url:
        raise RuntimeError("DATABASE_URL no está definida (o está vacía) en Render/producción")

    # Normaliza esquema antiguo
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)

    app.config["SQLALCHEMY_DATABASE_URI"] = db_url

else:
    # Dev/local: si no hay DATABASE_URL, usa sqlite temporal
    if db_url:
        if db_url.startswith("postgres://"):
            db_url = db_url.replace("postgres://", "postgresql://", 1)
        app.config["SQLALCHEMY_DATABASE_URI"] = db_url
    else:
        app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:////tmp/test.db"

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)


# ------------------------------------------------------------
# CORS
# ------------------------------------------------------------
cors_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3000,http://localhost:3001"
).split(",")

cors_origins = [o.strip() for o in cors_origins if o.strip()]

CORS(app, resources={
    r"/api/*": {
        "origins": cors_origins,
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True,
        "max_age": 3600
    }
})


# ------------------------------------------------------------
# JWT
# ------------------------------------------------------------
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "").strip()
if not app.config["JWT_SECRET_KEY"]:
    raise RuntimeError("JWT_SECRET_KEY environment variable is not set")

jwt = JWTManager(app)


# ------------------------------------------------------------
# ADMIN / COMMANDS / ROUTES
# ------------------------------------------------------------
setup_admin(app)
setup_commands(app)

# Add all endpoints from the API with a "api" prefix
app.register_blueprint(api, url_prefix="/api")


# ------------------------------------------------------------
# ERROR HANDLER
# ------------------------------------------------------------
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

@app.get("/health")
def health():
    return {"status": "ok"}, 200

# ------------------------------------------------------------
# ROUTES
# ------------------------------------------------------------
@app.route("/")
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, "index.html")


@app.route("/<path:path>", methods=["GET"])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = "index.html"
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response


# ------------------------------------------------------------
# MAIN
# ------------------------------------------------------------
if __name__ == "__main__":
    PORT = int(os.environ.get("PORT", 3001))
    app.run(host="0.0.0.0", port=PORT, debug=(ENV == "development"))
