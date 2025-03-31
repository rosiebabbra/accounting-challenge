## Development

!! Ensure node version == v18.20.5 !!

# 1. Install Python deps
cd backend
pip install -r requirements.txt

# 2. Set up DB and import data
python import_transactions.py

This generates the accounting.db file. You should then run this command:

`railway up accounting.db`

And git push the new file to trigger a new railway deployment. You should see the updated data on the deployed app instance.

# 3. Run backend
flask run