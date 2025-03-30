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


def generate_balance_sheet(transactions):
    """
    The amount is calculated as (credit - debit), so:
    - A negative amount implies a net debit → treated as increase in assets
    - A positive amount implies a net credit → treated as increase in liabilities
    This logic splits the values accordingly for the balance sheet.
    """

    assets_total = 0.0
    liabilities_total = 0.0

    for txn in transactions:
        if txn.amount < 0:
            assets_total += abs(txn.amount)
        else:
            liabilities_total += txn.amount

    equity_total = assets_total - liabilities_total

    return {
        "assets": {
            "fixed": 0.0,
            "current": assets_total,
            "total": assets_total,
        },
        "liabilities": {
            "short_term": 0.0,
            "long_term": liabilities_total,
            "total": liabilities_total,
        },
        "equity": {
            "retained_earnings": equity_total,
            "total": equity_total,
        },
        "balanced": round(assets_total, 2)
        == round(liabilities_total + equity_total, 2),
    }


def generate_pnl(transactions):
    """
    Assumes amounts are calculated as (credit - debit):
    - Positive amounts implies a net credit → treated as revenue
    - Negative amounts implies a net debit → treated as expenses
    Currently, revenue is entirely categorized as "product_sales",
    and all expenses are grouped under "external_services".
    Returns structured totals for revenue, expenses, and net profit.
    """

    total_revenue = 0.0
    total_expenses = 0.0

    for txn in transactions:
        if txn.amount > 0:
            total_revenue += txn.amount
        else:
            total_expenses += abs(txn.amount)

    return {
        "revenue": {
            "product_sales": total_revenue,
            "grants": 0.0,
            "total": total_revenue,
        },
        "expenses": {
            "payroll": 0.0,
            "maintenance": 0.0,
            "taxes": 0.0,
            "external_services": total_expenses,
            "total": total_expenses,
        },
        "profit": total_revenue - total_expenses,
    }
