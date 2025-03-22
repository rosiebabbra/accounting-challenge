import xml.etree.ElementTree as ET
from datetime import datetime


def parse_xml_file(file_stream):
    tree = ET.parse(file_stream)
    root = tree.getroot()
    transactions = []

    for entry in root.findall(".//wsGeneralLedger"):
        date_str = entry.findtext("date", default=None)
        account_code = entry.findtext("collectif", default="000000")
        balance = float(entry.findtext("balance", default="0") or 0)
        label = entry.findtext("description", default="(no label)")

        print("🔎 Raw values:", date_str, account_code, balance)

        try:
            # Try flexible parsing
            from dateutil.parser import parse

            date = parse(date_str).date()

            transactions.append(
                {
                    "date": date,
                    "label": label,
                    "amount": balance,
                    "account_code": account_code,
                }
            )
        except Exception as e:
            print("⚠️ Skipping row due to error:", e)

    return transactions
