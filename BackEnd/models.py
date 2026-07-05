# models.py

from sqlalchemy import Column , Integer , String
from database import Base


class Student(Base):
    __tablename__ = "StudentsAuth"
    id = Column(Integer , primary_key=True, index=True)
    fname = Column(String(100))
    email = Column(String(100), unique=True)
    password = Column(String(20))
    role = Column(String(20), default="students")


    
    
    
