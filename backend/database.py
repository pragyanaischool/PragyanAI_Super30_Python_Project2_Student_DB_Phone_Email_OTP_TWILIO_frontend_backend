from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base,sessionmaker
from config import settings
url=settings.DATABASE_URL
if url.startswith('postgres://'): url=url.replace('postgres://','postgresql+psycopg://',1)
if url.startswith('postgresql://'): url=url.replace('postgresql://','postgresql+psycopg://',1)
if not url: raise ValueError('DATABASE_URL is required')
engine=create_engine(url,pool_pre_ping=True)
SessionLocal=sessionmaker(bind=engine,autocommit=False,autoflush=False)
Base=declarative_base()
def get_db():
    db=SessionLocal()
    try: yield db
    finally: db.close()
