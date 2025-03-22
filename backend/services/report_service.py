from typing import List, Dict
from datetime import date
from models import Transaction
from sqlalchemy.orm import Session
from sqlalchemy import func


def get_transactions_for_company(
    session: Session, company_id: int, start_date: date, end_date: date
) -> List[Transaction]:
    return (
        session.query(Transaction)
        .filter(
            Transaction.company_id == company_id,
            Transaction.date >= start_date,
            Transaction.date <= end_date,
        )
        .all()
    )


def summarize_by_account_prefix(transactions: List[Transaction]) -> Dict[str, float]:
    summary = {}
    for t in transactions:
        prefix = t.account_code[:2]  # e.g., '60', '70'
        summary[prefix] = summary.get(prefix, 0) + t.amount
    return summary


def generate_balance_sheet(transactions):
    result = {
        "assets": {"current": 0, "fixed": 0, "total": 0},
        "liabilities": {"short_term": 0, "long_term": 0, "total": 0},
        "equity": {"retained_earnings": 0, "total": 0},
    }

    for t in transactions:
        code = t.account_code.strip()
        amount = t.amount

        if code.startswith("1"):
            result["assets"]["fixed"] += amount
        elif code.startswith("2"):
            result["assets"]["current"] += amount
        elif code.startswith("4"):
            result["liabilities"]["short_term"] += amount
        elif code.startswith("5"):
            result["liabilities"]["long_term"] += amount

    result["assets"]["total"] = round(
        result["assets"]["current"] + result["assets"]["fixed"], 2
    )
    result["liabilities"]["total"] = round(
        result["liabilities"]["short_term"] + result["liabilities"]["long_term"], 2
    )
    result["balanced"] = result["assets"]["total"] == result["liabilities"]["total"]
    return result


def generate_pnl(transactions):
    revenue_categories = {
        "product_sales": 0.0,  # 706xxx
        "grants": 0.0,  # 74xxx
    }

    expense_categories = {
        "payroll": 0.0,  # 64xxx
        "maintenance": 0.0,  # 615xxx or 61xxx
        "taxes": 0.0,  # 63xxx
        "external_services": 0.0,  # 62xxx
    }

    for t in transactions:
        code = t.account_code.strip()
        amount = t.amount

        # Revenue
        if code.startswith("706"):
            revenue_categories["product_sales"] += amount
        elif code.startswith("74"):
            revenue_categories["grants"] += amount

        # Expenses
        elif code.startswith("64"):
            expense_categories["payroll"] += amount
        elif code.startswith("615") or code.startswith("61"):
            expense_categories["maintenance"] += amount
        elif code.startswith("63"):
            expense_categories["taxes"] += amount
        elif code.startswith("62"):
            expense_categories["external_services"] += amount

    revenue_total = sum(revenue_categories.values())
    expense_total = sum(expense_categories.values())
    profit = revenue_total - expense_total

    return {
        "revenue": {**revenue_categories, "total": round(revenue_total, 2)},
        "expenses": {**expense_categories, "total": round(expense_total, 2)},
        "profit": round(profit, 2),
    }
