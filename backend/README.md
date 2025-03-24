## Development

!! Ensure node version == v18.20.5 !!

# 1. Install Python deps
cd backend
pip install -r requirements.txt

# 2. Set up DB and import data
python import_transactions.py

# 3. Run backend
flask run
