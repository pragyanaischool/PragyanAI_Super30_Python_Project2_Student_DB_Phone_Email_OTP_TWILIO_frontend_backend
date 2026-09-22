import random,smtplib
from email.message import EmailMessage
from config import settings
def otp():return f'{random.randint(0,999999):06d}'
def send_email(to,code):
    m=EmailMessage();m['Subject']='PragyanAI Student Verification OTP';m['From']=settings.EMAIL_ADDRESS;m['To']=to;m.set_content(f'Your PragyanAI OTP is {code}. It is valid for 10 minutes.')
    with smtplib.SMTP('smtp.gmail.com',587) as s:s.starttls();s.login(settings.EMAIL_ADDRESS,settings.EMAIL_APP_PASSWORD);s.send_message(m)
