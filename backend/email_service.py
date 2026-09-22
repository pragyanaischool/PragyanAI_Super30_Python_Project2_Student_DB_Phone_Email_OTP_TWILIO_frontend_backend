# backend/email_service.py

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from config import settings


# ============================================================
# SMTP CONFIGURATION
# ============================================================

SMTP_HOST = settings.smtp_host
SMTP_PORT = settings.smtp_port
EMAIL_ADDRESS = settings.email_address
EMAIL_APP_PASSWORD = settings.email_app_password


# ============================================================
# BASIC EMAIL SENDER
# ============================================================

def send_email(
    to_email: str,
    subject: str,
    body: str,
    html: bool = False,
) -> bool:
    """
    Send an email using Gmail SMTP.

    Parameters
    ----------
    to_email:
        Recipient email address.

    subject:
        Email subject.

    body:
        Email body.

    html:
        If True, body is treated as HTML.
        Otherwise it is treated as plain text.

    Returns
    -------
    bool
        True when the email is sent successfully.
    """

    if not EMAIL_ADDRESS:

        raise RuntimeError(
            "EMAIL_ADDRESS is not configured."
        )

    if not EMAIL_APP_PASSWORD:

        raise RuntimeError(
            "EMAIL_APP_PASSWORD is not configured."
        )

    if not to_email:

        raise ValueError(
            "Recipient email address is required."
        )

    # --------------------------------------------------------
    # Create message
    # --------------------------------------------------------

    message = MIMEMultipart("alternative")

    message["From"] = EMAIL_ADDRESS
    message["To"] = to_email
    message["Subject"] = subject

    # --------------------------------------------------------
    # Add body
    # --------------------------------------------------------

    if html:

        message.attach(
            MIMEText(
                body,
                "html",
                "utf-8",
            )
        )

    else:

        message.attach(
            MIMEText(
                body,
                "plain",
                "utf-8",
            )
        )

    # --------------------------------------------------------
    # Connect to SMTP server
    # --------------------------------------------------------

    try:

        with smtplib.SMTP(
            SMTP_HOST,
            SMTP_PORT,
            timeout=30,
        ) as server:

            server.ehlo()

            server.starttls()

            server.ehlo()

            server.login(
                EMAIL_ADDRESS,
                EMAIL_APP_PASSWORD,
            )

            server.sendmail(
                EMAIL_ADDRESS,
                [to_email],
                message.as_string(),
            )

        return True

    except Exception as exc:

        print(
            "Email sending failed:",
            str(exc),
        )

        raise RuntimeError(
            f"Unable to send email: {exc}"
        ) from exc


# ============================================================
# SEND EMAIL OTP
# ============================================================

def send_otp_email(
    to_email: str,
    otp: str,
) -> bool:
    """
    Send a six-digit OTP to the student's email.
    """

    subject = "PragyanAI Student Verification - Email OTP"

    body = f"""
PragyanAI Student Verification

Your email verification OTP is:

{otp}

This OTP is valid for approximately
{settings.otp_expire_minutes} minutes.

Please do not share this OTP with anyone.

If you did not request this verification,
please ignore this email.

Regards,
PragyanAI Team
"""


    return send_email(
        to_email=to_email,
        subject=subject,
        body=body,
        html=False,
    )


# ============================================================
# HTML EMAIL OTP
# ============================================================

def send_otp_email_html(
    to_email: str,
    otp: str,
) -> bool:
    """
    Send a formatted HTML OTP email.
    """

    subject = "PragyanAI Student Verification - Email OTP"

    body = f"""
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>PragyanAI Email Verification</title>

</head>

<body style="
    margin: 0;
    padding: 0;
    background: #f5f7fb;
    font-family: Arial, Helvetica, sans-serif;
">

<div style="
    max-width: 600px;
    margin: 40px auto;
    background: #ffffff;
    border-radius: 12px;
    padding: 35px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
">

    <h2 style="
        margin-top: 0;
        color: #1f2937;
    ">
        🎓 PragyanAI Student Verification
    </h2>

    <p style="
        color: #4b5563;
        font-size: 16px;
    ">
        Use the OTP below to verify your registered
        email address.
    </p>

    <div style="
        margin: 30px 0;
        text-align: center;
    ">

        <div style="
            display: inline-block;
            padding: 18px 35px;
            background: #f3f4f6;
            border-radius: 10px;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #111827;
        ">

            {otp}

        </div>

    </div>

    <p style="
        color: #6b7280;
        font-size: 14px;
    ">

        This OTP is valid for approximately
        <strong>
            {settings.otp_expire_minutes} minutes
        </strong>.

    </p>

    <p style="
        color: #6b7280;
        font-size: 14px;
    ">

        Please do not share this OTP with anyone.

    </p>

    <hr style="
        border: none;
        border-top: 1px solid #e5e7eb;
        margin: 30px 0;
    ">

    <p style="
        color: #9ca3af;
        font-size: 13px;
    ">

        Regards,<br>
        <strong>PragyanAI Team</strong>

    </p>

</div>

</body>

</html>
"""

    return send_email(
        to_email=to_email,
        subject=subject,
        body=body,
        html=True,
    )
    
