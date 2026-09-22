# PragyanAI Student Verification Platform
Modern React + FastAPI + PostgreSQL replacement for the Streamlit Student DB / Email OTP / Twilio project.

## Flow
Registration -> Email OTP -> Phone OTP -> Admin Approval -> Student Login -> Student Dashboard.

## Structure
```text
PragyanAI_Student_Verification/
├── backend/
│   ├── main.py database.py models.py schemas.py crud.py security.py config.py
│   ├── email_service.py otp_service.py
│   ├── routers/{auth.py,otp.py,students.py,admin.py}
│   ├── requirements.txt .env.example render.yaml
└── frontend/
    ├── src/{App.jsx,main.jsx,api.js}
    ├── src/styles/global.css
    ├── package.json vite.config.js netlify.toml
```

## Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
```

## Frontend
```bash
cd frontend
npm install
npm run dev
```

## Render
Root: `backend` | Build: `pip install -r requirements.txt` | Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## Netlify
Base: `frontend` | Build: `npm run build` | Publish: `dist`
Set `VITE_API_BASE_URL` to the Render `/api` URL.

Never commit `.env` or secrets.
