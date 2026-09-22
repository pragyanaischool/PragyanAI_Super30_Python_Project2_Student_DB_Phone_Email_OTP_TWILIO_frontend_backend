from datetime import datetime
from pydantic import BaseModel,ConfigDict,EmailStr,Field
class Register(BaseModel):
    full_name:str=Field(min_length=2,max_length=150); college_name:str; degree:str; branch:str
    tenth_cgpa:float|None=Field(None,ge=0,le=10); twelfth_cgpa:float|None=Field(None,ge=0,le=10); be_cgpa:float|None=Field(None,ge=0,le=10)
    phone:str=Field(min_length=8,max_length=30); email:EmailStr; password:str=Field(min_length=8,max_length=128)
class Login(BaseModel): email:EmailStr; password:str
class UpdateStudent(BaseModel):
    full_name:str|None=None; college_name:str|None=None; degree:str|None=None; branch:str|None=None
    tenth_cgpa:float|None=None; twelfth_cgpa:float|None=None; be_cgpa:float|None=None
class OTP(BaseModel): otp:str=Field(min_length=4,max_length=10)
class Reject(BaseModel): rejection_reason:str|None=None
class StudentOut(BaseModel):
    id:int; full_name:str; college_name:str; degree:str; branch:str; tenth_cgpa:float|None; twelfth_cgpa:float|None; be_cgpa:float|None
    phone:str; email:EmailStr; email_verified:bool; phone_verified:bool; approval_status:str; rejection_reason:str|None; created_at:datetime
    model_config=ConfigDict(from_attributes=True)
class Token(BaseModel): access_token:str; token_type:str='bearer'; user_type:str
class Message(BaseModel): message:str
