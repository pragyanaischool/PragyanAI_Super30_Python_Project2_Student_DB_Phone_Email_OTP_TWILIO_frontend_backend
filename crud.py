from sqlalchemy.orm import Session
from models import Student
from security import hash_password
def by_email(db,email):return db.query(Student).filter(Student.email==email.lower()).first()
def by_phone(db,phone):return db.query(Student).filter(Student.phone==phone).first()
def create(db,d):
    s=Student(full_name=d.full_name,college_name=d.college_name,degree=d.degree,branch=d.branch,tenth_cgpa=d.tenth_cgpa,twelfth_cgpa=d.twelfth_cgpa,be_cgpa=d.be_cgpa,phone=d.phone,email=str(d.email).lower(),password_hash=hash_password(d.password));db.add(s);db.commit();db.refresh(s);return s
def update(db,s,d):
    for k,v in d.model_dump(exclude_unset=True).items():setattr(s,k,v)
    db.commit();db.refresh(s);return s
