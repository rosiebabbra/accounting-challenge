# backend/utils/xml_importer.py

import xml.etree.ElementTree as ET
from datetime import datetime
from models import Transaction

def parse_xml_file(file_path: str):
    tree = ET.parse(file_path)
    root = tree.getroot()
    entries = root.findall(".//wsGeneralLedger")

    transactions = []

    for entry in entries:
        date_str = entry.findtext("date")
        credit_str = entry.findtext("credit") or "0"
        debit_str = entry.findtext("debit") or "0"

        try:
            date = datetime.strptime(date_str, "%Y-%m-%d").date()
            credit = float(credit_str)
            debit = float(debit_str)

            # We'll use the net amount and label whether it's a credit or debit
            amount = credit - debit  # Credit is positive, debit is negative

            transaction = Transaction(
                date=date,
                label="",
                amount=amount,
                account_code="000000",  # Dummy code, not used per Ludovik
                company_id=1  # For test purposes
            )
            transactions.append(transaction)
        except Exception as e:
            print(f"Skipping invalid entry: {e}")
            continue

    return transactions
