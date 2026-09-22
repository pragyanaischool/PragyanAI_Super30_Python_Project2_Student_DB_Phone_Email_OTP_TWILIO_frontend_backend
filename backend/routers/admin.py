from fastapi import APIRouter,Depends,HTTPException
from database import get_db
from config import settings
from models import Student
from schemas import Login,Token,StudentOut,Reject
from security import token,admin,verify_password
r=APIRouter(prefix='/admin')
@r.post('/login',response_model=Token)
def login(d:Login):
    ok=d.email.lower()==settings.ADMIN_EMAIL.lower() and (d.password==settings.ADMIN_PASSWORD or (settings.ADMIN_PASSWORD.startswith('$2') and verify_password(d.password,settings.ADMIN_PASSWORD)))
    if not ok:raise HTTPException(401,'Invalid admin credentials')
    return {'access_token':token(0,'ADMIN'),'user_type':'ADMIN'}
@r.get('/students',response_model=list[StudentOut])
def students(status:str|None=None,db=Depends(get_db),_=Depends(admin)):
    q=db.query(Student);return q.filter(Student.approval_status==status.upper()).order_by(Student.created_at.desc()).all() if status else q.order_by(Student.created_at.desc()).all()
@r.put('/students/{sid}/approve',response_model=StudentOut)
def approve(sid:int,db=Depends(get_db),_=Depends(admin)):
    s=db.query(Student).filter(Student.id==sid).first()
    if not s:raise HTTPException(404,'Student not found')
    s.approval_status='APPROVED';s.rejection_reason=None;db.commit();db.refresh(s);return s
@r.put('/students/{sid}/reject',response_model=StudentOut)
def reject(sid:int,d:Reject,db=Depends(get_db),_=Depends(admin)):
    s=db.query(Student).filter(Student.id==sid).first()
    if not s:raise HTTPException(404,'Student not found')
    s.approval_status='REJECTED';s.rejection_reason=d.rejection_reason;db.commit();db.refresh(s);return s
