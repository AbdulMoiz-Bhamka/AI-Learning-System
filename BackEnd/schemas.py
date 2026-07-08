# schemas.py

from pydantic import BaseModel

class StudentCreate(BaseModel):
    fname:str
    email:str
    password:str
 
    
class Studentlogin(BaseModel):
    email:str
    password: str
    
class CourseResponse(BaseModel):
    id: int
    name: str
    icon: str
    tutor: str
    description: str
    progress: int
    hours: float

    class Config:
        orm_mode = True

class AssignCourseRequest(BaseModel):
    course_ids: list[int]
