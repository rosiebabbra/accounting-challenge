from flask import Blueprint, request, jsonify
from services.xml_importer import parse_xml_file
from models import Transaction, db

import_routes = Blueprint("import_routes", __name__)


@import_routes.route("/api/import/xml", methods=["POST"])
def import_xml():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    transactions_data = parse_xml_file(file.stream)

    for t in transactions_data:
        tx = Transaction(
            date=t["date"],
            label=t["label"],
            amount=t["amount"],
            account_code=t["account_code"],
            company_id=1,  # Temporary / test value
        )
        db.session.add(tx)

    db.session.commit()
    return jsonify(
        {"message": f"{len(transactions_data)} transactions imported successfully"}
    )
