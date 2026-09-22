from twilio.rest import Client
from config import settings
def send_phone(phone):Client(settings.TWILIO_ACCOUNT_SID,settings.TWILIO_AUTH_TOKEN).verify.v2.services(settings.TWILIO_VERIFY_SERVICE_SID).verifications.create(to=phone,channel='sms')
def verify_phone(phone,code):return Client(settings.TWILIO_ACCOUNT_SID,settings.TWILIO_AUTH_TOKEN).verify.v2.services(settings.TWILIO_VERIFY_SERVICE_SID).verification_checks.create(to=phone,code=code).status=='approved'
