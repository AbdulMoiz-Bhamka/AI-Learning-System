# BackEnd/main.py
# main.py

from fastapi import FastAPI, Depends, UploadFile, File, Form, HTTPException
from database import engine
from models import Base
from sqlalchemy.orm import Session
from schemas import StudentCreate, Studentlogin, CourseResponse, AssignCourseRequest
from models import Student, Course, StudentCourse
from database import get_db
from fastapi.middleware.cors import CORSMiddleware
from document_processor import process_and_store_document


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

@app.get("/courses", response_model=list[CourseResponse])
def get_courses(db: Session = Depends(get_db)):
    courses = db.query(Course).all()
    return courses

@app.post("/students/{student_id}/courses")
def assign_courses(student_id: int, request: AssignCourseRequest, db: Session = Depends(get_db)):
    # Remove existing course assignments for this student
    db.query(StudentCourse).filter(StudentCourse.student_id == student_id).delete()
    
    # Add new ones
    for course_id in request.course_ids:
        new_assignment = StudentCourse(student_id=student_id, course_id=course_id)
        db.add(new_assignment)
    
    db.commit()
    return {"message": "Courses assigned successfully"}

@app.get("/students/{student_id}/courses", response_model=list[CourseResponse])
def get_student_courses(student_id: int, db: Session = Depends(get_db)):
    # Join StudentCourse and Course tables
    courses = db.query(Course).join(StudentCourse, Course.id == StudentCourse.course_id)\
              .filter(StudentCourse.student_id == student_id).all()
    return courses

@app.post("/admin/upload-book")
async def upload_book(
    file: UploadFile = File(...), 
    course_name: str = Form(...)
):
    try:
        file_bytes = await file.read()
        file_ext = file.filename.split(".")[-1].lower()
        if file_ext not in ["pdf", "txt"]:
            raise HTTPException(status_code=400, detail="Only PDF and TXT files are supported.")
            
        result = await process_and_store_document(
            file_bytes=file_bytes,
            filename=file.filename,
            course_name=course_name,
            file_type=file_ext
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
