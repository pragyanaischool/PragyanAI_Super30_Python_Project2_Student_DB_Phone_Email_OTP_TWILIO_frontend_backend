import os
from dotenv import load_dotenv
load_dotenv()
class Settings:
    DATABASE_URL=os.getenv('DATABASE_URL','')
    SECRET_KEY=os.getenv('SECRET_KEY','change-me')
    FRONTEND_URL=os.getenv('FRONTEND_URL','http://localhost:5173')
    EMAIL_ADDRESS=os.getenv('EMAIL_ADDRESS','')
    EMAIL_APP_PASSWORD=os.getenv('EMAIL_APP_PASSWORD','')
    TWILIO_ACCOUNT_SID=os.getenv('TWILIO_ACCOUNT_SID','')
    TWILIO_AUTH_TOKEN=os.getenv('TWILIO_AUTH_TOKEN','')
    TWILIO_VERIFY_SERVICE_SID=os.getenv('TWILIO_VERIFY_SERVICE_SID','')
    ADMIN_EMAIL=os.getenv('ADMIN_EMAIL','admin@example.com')
    ADMIN_PASSWORD=os.getenv('ADMIN_PASSWORD','change-me')
settings=Settings()
