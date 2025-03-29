from flask import Blueprint, request, jsonify
from services.xml_importer import parse_xml_file
from models import Transaction, db

import_routes = Blueprint("import_routes", __name__)


@import_routes.route("/api/import/xml", methods=["POST"])
def import_xml():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    transactions = parse_xml_file(file.stream)

    for tx in transactions:
        db.session.add(tx)

    db.session.commit()
    return jsonify(
        {"message": f"{len(transactions)} transactions imported successfully"}
    )
