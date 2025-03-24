from app import app
from models import db, Transaction
from services.xml_importer import parse_xml_file

XML_FILE_PATH = "./data/brignolles-gl.xml"

with app.app_context():
    print("Parsing XML file...")
    transactions = parse_xml_file(XML_FILE_PATH)

    print(f"Importing {len(transactions)} transactions into the database...")
    db.session.bulk_save_objects(transactions)
    db.session.commit()
    print("Import complete ✅")
