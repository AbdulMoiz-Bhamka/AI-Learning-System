# database.py

import pyodbc
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker , declarative_base


DATABASE_URL = (
    "mssql+pyodbc://@AbdulMoiz\\sqlserver16/StudentLLM?"
    "driver=ODBC+Driver+17+for+SQL+Server"
    "&trusted_connection=yes"
)


engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(
    autocommit = False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close
        




