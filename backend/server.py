from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
from pathlib import Path
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timezone

from seed_data import SEED_MAP, GALLERY

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


class RegistrationCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str
    country: str
    profession: Optional[str] = ""
    company: Optional[str] = ""
    category: str
    interests: List[str] = []
    pass_type: str = "visiteur"


class ContactCreate(BaseModel):
    name: str
    email: str
    organization: Optional[str] = ""
    request_type: str
    message: str


@api_router.get("/")
async def root():
    return {"message": "SEIM API", "status": "ok"}


async def list_collection(name):
    return await db[name].find({}, {"_id": 0}).to_list(500)


@api_router.get("/speakers")
async def get_speakers():
    return await list_collection("speakers")


@api_router.get("/program")
async def get_program():
    sessions = await db.program.find({}, {"_id": 0}).to_list(500)
    return sorted(sessions, key=lambda s: (s["day"], s["time"]))


@api_router.get("/exhibitors")
async def get_exhibitors():
    return await list_collection("exhibitors")


@api_router.get("/partners")
async def get_partners():
    return await list_collection("partners")


@api_router.get("/articles")
async def get_articles():
    articles = await db.articles.find({}, {"_id": 0}).to_list(100)
    return sorted(articles, key=lambda a: a["date"], reverse=True)


@api_router.get("/editions")
async def get_editions():
    editions = await db.editions.find({}, {"_id": 0}).to_list(100)
    return sorted(editions, key=lambda e: e["year"], reverse=True)


@api_router.get("/gallery")
async def get_gallery():
    return {"images": GALLERY}


@api_router.post("/registrations")
async def create_registration(data: RegistrationCreate):
    existing = await db.registrations.find_one({"email": data.email}, {"_id": 0})
    if existing:
        return existing
    doc = data.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["code"] = "SEIM26-" + uuid.uuid4().hex[:6].upper()
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.registrations.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.get("/registrations")
async def get_registrations_count():
    count = await db.registrations.count_documents({})
    return {"count": count}


@api_router.get("/registrations/{code}")
async def get_registration(code: str):
    reg = await db.registrations.find_one({"code": code}, {"_id": 0})
    if not reg:
        raise HTTPException(status_code=404, detail="Registration not found")
    return reg


@api_router.post("/contacts")
async def create_contact(data: ContactCreate):
    doc = data.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.contacts.insert_one(doc)
    return {"status": "ok", "message": "Message received", "id": doc["id"]}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def seed_database():
    for name, docs in SEED_MAP.items():
        if await db[name].count_documents({}) == 0:
            await db[name].insert_many([dict(d) for d in docs])
            logger.info(f"Seeded {name}: {len(docs)} documents")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
