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
    assets_total = 0.0
    liabilities_total = 0.0

    for txn in transactions:
        if txn.amount < 0:
            assets_total += abs(txn.amount)  # Debit → Asset
        else:
            liabilities_total += txn.amount  # Credit → Liability

    equity_total = assets_total - liabilities_total

    return {
        "assets": {
            "fixed": 0.0,  # no breakdown info
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
        "balanced": round(assets_total, 2) == round(liabilities_total + equity_total, 2),
    }


def generate_pnl(transactions):
    total_revenue = 0.0
    total_expenses = 0.0

    for txn in transactions:
        if txn.amount > 0:
            total_revenue += txn.amount  # Credit → Revenue
        else:
            total_expenses += abs(txn.amount)  # Debit → Expense

    return {
        "revenue": {
            "product_sales": total_revenue,  # No breakdown
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