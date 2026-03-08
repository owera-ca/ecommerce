import smtplib
from email.message import EmailMessage

MAILPIT_HOST = "localhost"
MAILPIT_PORT = 1025

def send_reset_password_email(email_to: str, token: str):
    msg = EmailMessage()
    msg.set_content(f"You requested a password reset. Use this token: {token}\n\nLink: http://localhost:5173/reset-password?token={token}")
    msg["Subject"] = "Password Reset Request"
    msg["From"] = "noreply@luxestore.local"
    msg["To"] = email_to

    try:
        with smtplib.SMTP(MAILPIT_HOST, MAILPIT_PORT) as server:
            server.send_message(msg)
    except Exception as e:
        print(f"Failed to send email to {email_to}: {e}")
