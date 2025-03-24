import os

from flask import Flask
from flask_cors import CORS

from models import db
from routes.report_routes import report_routes
from routes.import_routes import import_routes

app = Flask(__name__)

CORS(app)

basedir = os.path.abspath(os.path.dirname(__file__))

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///accounting.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
app.register_blueprint(report_routes)
app.register_blueprint(import_routes)

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
