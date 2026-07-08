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

class Course(Base):
    __tablename__ = "Courses"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    icon = Column(String(10), nullable=False)
    tutor = Column(String(100), nullable=False)
    description = Column(String(255), nullable=False)
    progress = Column(Integer, default=0)
    hours = Column(Integer, default=0.0) # Actually Decimal in SQL, but Integer/Float works in SQLAlchemy

class StudentCourse(Base):
    __tablename__ = "StudentCourses"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, index=True)
    course_id = Column(Integer, index=True)
