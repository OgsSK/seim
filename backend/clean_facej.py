"""
Nettoie le nom de FACEJ + ajoute une description
"""
import os
from pathlib import Path
from dotenv import load_dotenv
from pymongo import MongoClient

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

client = MongoClient(os.environ['MONGO_URL'])
db = client[os.environ['DB_NAME']]

result = db.partners.update_one(
    {"id": "p1"},
    {"$set": {
        "name": "FACEJ",
        "role_fr": "Fonds d'Appui à la Création d'Entreprise par les Jeunes",
        "role_en": "Youth Enterprise Creation Support Fund",
        "logo": "/assets/seim/logos/facej.png"
    }}
)

print(f"✅ Documents modifiés : {result.modified_count}")

doc = db.partners.find_one({"id": "p1"}, {"_id": 0})
print("📄 FACEJ :", doc)

client.close()