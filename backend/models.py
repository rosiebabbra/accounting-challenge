from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date)
    label = db.Column(db.String(256))
    amount = db.Column(db.Float)
    account_code = db.Column(db.String(20))
    company_id = db.Column(db.Integer, db.ForeignKey("company.id"))


class Company(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    country = db.Column(db.String(64), nullable=True)
