from fastapi import APIRouter,Depends,HTTPException
from database import get_db
from schemas import Register,Login,Token,Message,StudentOut
from models import Student
from security import hash_password,verify_password,token,current_student
import crud
r=APIRouter(prefix='/auth')
@r.post('/register',response_model=Message)
def register(d:Register,db=Depends(get_db)):
    if crud.by_email(db,str(d.email)) or crud.by_phone(db,d.phone):raise HTTPException(409,'Email or phone already registered')
    s=crud.create(db,d);return {'message':'Account created. Verify email and phone, then wait for admin approval.'}
@r.post('/login',response_model=Token)
def login(d:Login,db=Depends(get_db)):
    s=crud.by_email(db,str(d.email))
    if not s or not verify_password(d.password,s.password_hash):raise HTTPException(401,'Invalid email or password.')
    if not s.email_verified:raise HTTPException(403,'Please verify your email.')
    if not s.phone_verified:raise HTTPException(403,'Please verify your phone.')
    if s.approval_status!='APPROVED':raise HTTPException(403,f'Account is {s.approval_status.lower()}.')
    return {'access_token':token(s.id),'user_type':'STUDENT'}
@r.get('/me',response_model=StudentOut)
def me(s=Depends(current_student)):return s
