from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base,engine
import models
from config import settings
from routers import auth,otp,students,admin
@asynccontextmanager
async def lifespan(app):Base.metadata.create_all(bind=engine);yield
app=FastAPI(title='PragyanAI Student Verification API',version='2.0.0',lifespan=lifespan)
app.add_middleware(CORSMiddleware,allow_origins=[settings.FRONTEND_URL,'http://localhost:5173'],allow_credentials=True,allow_methods=['*'],allow_headers=['*'])
app.include_router(auth.r,prefix='/api');app.include_router(otp.r,prefix='/api');app.include_router(students.r,prefix='/api');app.include_router(admin.r,prefix='/api')
@app.get('/')
def root():return {'service':'PragyanAI Student Verification API','docs':'/docs'}
@app.get('/health')
def health():return {'status':'healthy'}
