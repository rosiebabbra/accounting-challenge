import xml.etree.ElementTree as ET
from datetime import datetime
from models import Transaction


def parse_xml_file(file_path: str):
    tree = ET.parse(file_path)
    root = tree.getroot()
    entries = root.findall(".//wsGeneralLedger")

    transactions = []

    for entry in entries:
        try:
            date_str = entry.findtext("date")
            credit_str = entry.findtext("credit") or "0"
            debit_str = entry.findtext("debit") or "0"

            date = datetime.strptime(date_str, "%Y-%m-%d").date()
            credit = float(credit_str)
            debit = float(debit_str)
            amount = credit - debit

            # Get account code from <collectif>, fallback to <number>
            account_code = entry.findtext("collectif")
            if not account_code or account_code.strip() == "":
                account_code = entry.findtext("number") or "000000"

            transaction = Transaction(
                date=date,
                label="",
                amount=amount,
                account_code=account_code.strip(),
                company_id=1,
            )
            transactions.append(transaction)

        except Exception as e:
            print(f"Skipping invalid entry: {e}")
            continue

    return transactions
