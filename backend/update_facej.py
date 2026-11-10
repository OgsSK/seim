"""
Script one-shot : ajoute le champ logo à FACEJ
"""
import os
from pathlib import Path
from dotenv import load_dotenv
from pymongo import MongoClient

# Charger le .env
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

client = MongoClient(os.environ['MONGO_URL'])
db = client[os.environ['DB_NAME']]

# Mettre à jour FACEJ (id = "p1")
result = db.partners.update_one(
    {"id": "p1"},
    {"$set": {"logo": "/assets/seim/logos/facej.png"}}
)

print(f"✅ Documents modifiés : {result.modified_count}")

# Vérifier
doc = db.partners.find_one({"id": "p1"}, {"_id": 0})
print("📄 FACEJ actuel :")
print(doc)

client.close()