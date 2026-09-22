from datetime import datetime,timedelta
from fastapi import APIRouter,Depends,HTTPException
from database import get_db
from models import Student
from schemas import OTP,Message
from security import current_student
from email_service import otp,send_email
from otp_service import send_phone,verify_phone
store={};r=APIRouter(prefix='/otp')
@r.post('/email/send',response_model=Message)
def email_send(s:Student=Depends(current_student)):
    c=otp();store[s.email]=(c,datetime.utcnow()+timedelta(minutes=10));send_email(s.email,c);return {'message':'Email OTP sent'}
@r.post('/email/verify',response_model=Message)
def email_verify(d:OTP,s:Student=Depends(current_student),db=Depends(get_db)):
    x=store.get(s.email)
    if not x or datetime.utcnow()>x[1] or d.otp!=x[0]:raise HTTPException(400,'Invalid or expired OTP')
    s.email_verified=True;db.commit();store.pop(s.email,None);return {'message':'Email verified'}
@r.post('/phone/send',response_model=Message)
def phone_send(s:Student=Depends(current_student)):send_phone(s.phone);return {'message':'Phone OTP sent'}
@r.post('/phone/verify',response_model=Message)
def phone_verify(d:OTP,s:Student=Depends(current_student),db=Depends(get_db)):
    if not verify_phone(s.phone,d.otp):raise HTTPException(400,'Invalid phone OTP')
    s.phone_verified=True;db.commit();return {'message':'Phone verified'}
