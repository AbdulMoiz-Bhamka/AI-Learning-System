# BackEnd/main.py
# main.py

from fastapi import FastAPI, Depends
from database import engine
from models import Base
from sqlalchemy.orm import Session
from  schemas import StudentCreate , Studentlogin
from models import Student
from database import get_db
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers=["*"]
)

Base.metadata.create_all(bind=engine)

# @app.post("/")
# def Home():
#     conn = db_connection()
#     return {
#         "message" : "Db Connected!!"
#     }
    
@app.post("/signup")
def signup(student: StudentCreate , db: Session = Depends(get_db)):
    new_student = Student(
        fname = student.fname,
        email = student.email,
        password = student.password
    )
    
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    
    return{
        "message": "Student Created Successfully"
    }

@app.post("/login")
def loginForm(student: Studentlogin , db: Session = Depends(get_db)):
    user = db.query(Student).filter(
        Student.email == student.email
    ).first()
    
    if not user:
        return {"message": "User not found"}
    
    if user.password != student.password:
        return {"message": 'Invalid Password'}
    
    return {
        "message": "Login Successfully",
        "user": {
            "id": user.id,
            "fname": user.fname,
            "email": user.email,
            "role": user.role
        }
    }
    
@app.get("/students")
def get_students(db: Session = Depends(get_db)):
    students = db.query(Student).all()
    return students



    
    
