from datetime import datetime
from sqlalchemy import Boolean,DateTime,Integer,String,Text
from sqlalchemy.orm import Mapped,mapped_column
from database import Base
class Student(Base):
    __tablename__='students'
    id:Mapped[int]=mapped_column(Integer,primary_key=True,index=True)
    full_name:Mapped[str]=mapped_column(String(150),nullable=False)
    college_name:Mapped[str]=mapped_column(String(200),nullable=False)
    degree:Mapped[str]=mapped_column(String(100),nullable=False)
    branch:Mapped[str]=mapped_column(String(120),nullable=False)
    tenth_cgpa:Mapped[float|None]=mapped_column(nullable=True)
    twelfth_cgpa:Mapped[float|None]=mapped_column(nullable=True)
    be_cgpa:Mapped[float|None]=mapped_column(nullable=True)
    phone:Mapped[str]=mapped_column(String(30),unique=True,index=True,nullable=False)
    email:Mapped[str]=mapped_column(String(255),unique=True,index=True,nullable=False)
    password_hash:Mapped[str]=mapped_column(String(255),nullable=False)
    email_verified:Mapped[bool]=mapped_column(Boolean,default=False,nullable=False)
    phone_verified:Mapped[bool]=mapped_column(Boolean,default=False,nullable=False)
    approval_status:Mapped[str]=mapped_column(String(30),default='PENDING',index=True,nullable=False)
    rejection_reason:Mapped[str|None]=mapped_column(Text,nullable=True)
    created_at:Mapped[datetime]=mapped_column(DateTime,default=datetime.utcnow,nullable=False)
    updated_at:Mapped[datetime]=mapped_column(DateTime,default=datetime.utcnow,onupdate=datetime.utcnow,nullable=False)
