from fastapi import APIRouter,Depends
from database import get_db
from schemas import StudentOut,UpdateStudent
from security import current_student
import crud
r=APIRouter(prefix='/students')
@r.get('/me',response_model=StudentOut)
def me(s=Depends(current_student)):return s
@r.put('/me',response_model=StudentOut)
def update(d:UpdateStudent,s=Depends(current_student),db=Depends(get_db)):return crud.update(db,s,d)
