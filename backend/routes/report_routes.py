from datetime import datetime
from flask import Blueprint, jsonify, send_file, request
import xml.etree.ElementTree as ET
from models import Company
from services import report_service
from models import db
from io import BytesIO


report_routes = Blueprint("report_routes", __name__)


@report_routes.route("/api/companies", methods=["POST"])
def create_company():
    data = request.json
    company = Company(name=data["name"], country=data.get("country"))
    db.session.add(company)
    db.session.commit()
    return jsonify({"id": company.id, "name": company.name})


@report_routes.route("/api/companies/<int:company_id>/reports/balance")
def get_company_balance(company_id):
    start = request.args.get("start")
    end = request.args.get("end")
    start_date = datetime.strptime(start, "%Y-%m-%d").date()
    end_date = datetime.strptime(end, "%Y-%m-%d").date()

    transactions = report_service.get_transactions_for_company(
        db.session, company_id, start_date, end_date
    )
    result = report_service.generate_balance_sheet(transactions)
    return jsonify(result)


@report_routes.route("/api/companies/<int:company_id>/reports/pnl")
def get_company_pnl(company_id):
    try:
        start = request.args.get("start")
        end = request.args.get("end")
        start_date = datetime.strptime(start, "%Y-%m-%d").date()
        end_date = datetime.strptime(end, "%Y-%m-%d").date()

        transactions = report_service.get_transactions_for_company(
            db.session, company_id, start_date, end_date
        )

        result = report_service.generate_pnl(transactions)
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
