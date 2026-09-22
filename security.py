from datetime import datetime,timedelta,timezone
from fastapi import Depends,HTTPException
from fastapi.security import HTTPBearer,HTTPAuthorizationCredentials
from jose import jwt,JWTError
from passlib.context import CryptContext
from database import get_db
from models import Student
from config import settings
pwd=CryptContext(schemes=['bcrypt'],deprecated='auto'); bearer=HTTPBearer(); ALG='HS256'
def hash_password(x): return pwd.hash(x)
def verify_password(x,h): return pwd.verify(x,h)
def token(sub,role='STUDENT'):
    return jwt.encode({'sub':str(sub),'role':role,'exp':datetime.now(timezone.utc)+timedelta(hours=2)},settings.SECRET_KEY,algorithm=ALG)
def payload(c):
    try:return jwt.decode(c.credentials,settings.SECRET_KEY,algorithms=[ALG])
    except JWTError:raise HTTPException(401,'Invalid or expired token')
def current_student(c:HTTPAuthorizationCredentials=Depends(bearer),db=Depends(get_db)):
    p=payload(c)
    if p.get('role')!='STUDENT':raise HTTPException(403,'Student access required')
    s=db.query(Student).filter(Student.id==int(p['sub'])).first()
    if not s:raise HTTPException(401,'Student not found')
    return s
def admin(c:HTTPAuthorizationCredentials=Depends(bearer)):
    p=payload(c)
    if p.get('role')!='ADMIN':raise HTTPException(403,'Admin access required')
    return p
