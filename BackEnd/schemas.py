# schemas.py

from pydantic import BaseModel

class StudentCreate(BaseModel):
    fname:str
    email:str
    password:str
 
    
class Studentlogin(BaseModel):
    email:str
    password: str
    
    
    
    
    
    
