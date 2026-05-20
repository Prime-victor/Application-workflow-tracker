# Mini Application Workflow Tracker

Name: Victor Kiptum  
Email: victorkiptum85@gmail.com

A full-stack take-home assignment project for managing a small application review workflow.

The system allows users to create draft applications, submit them for review, move them into review, and record reviewer decisions with backend-enforced workflow rules.

## Project Overview

This project includes:

- A Django backend with Django Ninja APIs and SQLite
- A React + TypeScript frontend with TailwindCSS
- Workflow validation enforced on the backend
- A clean responsive UI for applicants and reviewers

## Tech Stack

### backend

- Django
- Django Ninja
- SQLite
- django-cors-headers

### frontend

- React
- TypeScript
- Vite
- TailwindCSS
- React Router
- Axios

## Workflow Rules

Application statuses:

- Draft
- Submitted
- Under Review
- Need More Information
- Approved
- Rejected

Supported transitions:

- `Draft -> Submitted`
- `Submitted -> Under Review`
- `Under Review -> Approved`
- `Under Review -> Rejected`
- `Under Review -> Need More Information`
- `Need More Information -> Submitted`

Rules enforced by the backend:

- Only `Draft` applications can be edited initially
- Only `Draft` applications can be submitted initially
- Only `Submitted` applications can move to `Under Review`
- Only `Under Review` applications can receive a reviewer decision
- `Approved` and `Rejected` applications cannot be edited
- `Need More Information` applications can be edited and resubmitted
- `Rejected` and `Need More Information` decisions require a reviewer comment

## Project Structure

```text
Backend/
├── manage.py
├── requirements.txt
├── config/
└── applications/
    ├── api.py
    ├── models.py
    ├── schemas.py
    ├── services.py
    ├── utils.py
    └── migrations/

Frontend/
├── package.json
└── src/
    ├── api/
    ├── components/
    ├── hooks/
    ├── pages/
    ├── types/
    ├── utils/
    └── App.tsx
```

## Backend Setup

From the `Backend/` directory:

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The backend will run at:

```text
http://localhost:8000
```

API base path:

```text
http://localhost:8000/api/
```

## Frontend Setup

From the `Frontend/` directory:

```bash
npm install
npm run dev
```

The frontend will run at:

```text
http://localhost:5173
```

Environment variable for local frontend API:

```bash
VITE_API_BASE_URL=http://localhost:8000/api
```

## Running Migrations

If you make backend model changes later:

```bash
python manage.py makemigrations
python manage.py migrate
```

## Implemented API Endpoints

- `POST /api/applications/`
- `GET /api/applications/`
- `GET /api/applications/{id}`
- `PATCH /api/applications/{id}`
- `POST /api/applications/{id}/submit`
- `POST /api/applications/{id}/start-review`
- `POST /api/applications/{id}/decision`

## Tracking Number Format

Tracking numbers are generated automatically in the format:

```text
APP-2026-0001
```

The sequence resets each year and increments per created application.

## Assumptions Made

- This assignment does not require authentication or user roles
- Reviewer actions are exposed through the UI without login because auth was explicitly out of scope
- `submitted_at` is updated whenever a draft or `Need More Information` application is submitted again
- `reviewed_at` is set when a reviewer records a final decision or requests more information
- SQLite is sufficient for local development and assignment review

## Improvements With More Time

- Add automated backend tests for workflow transitions and error cases
- Add frontend integration tests for key pages and actions
- Add confirmation dialogs for submit and review actions
- Add filtering and search on the application list
- Add pagination for larger datasets
- Add richer audit history for every workflow transition
- Add environment-based API configuration

## Deployment

This project is set up to deploy with:

- Render for the Django backend
- Vercel for the React frontend

### Deploy Backend to Render

Render recommends binding your service to the platform port and using a production web server for Python web services. Render's Django guide also recommends using a build script and production dependencies such as Gunicorn and WhiteNoise:

- Render Django guide: https://render.com/docs/deploy-django
- Render web services docs: https://render.com/docs/web-services

Backend deployment files/config included:

- `Backend/build.sh`
- `Backend/.env.example`
- production-friendly settings in `Backend/config/settings.py`

Create a Render Web Service with:

- Root Directory: `Backend`
- Build Command: `./build.sh`
- Start Command: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`

Recommended Render environment variables:

```text
DJANGO_SECRET_KEY=<generate-a-secure-value>
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=<your-render-service>.onrender.com
CORS_ALLOWED_ORIGINS=https://<your-vercel-app>.vercel.app
CSRF_TRUSTED_ORIGINS=https://<your-vercel-app>.vercel.app
DATABASE_URL=<render-postgres-internal-url>
```

Notes:

- Render requires web services to bind to `0.0.0.0` and typically provides the port via `PORT`
- SQLite is fine for local development, but Render production should use PostgreSQL
- The backend now supports `DATABASE_URL` via environment variables and falls back to SQLite locally

### Deploy Frontend to Vercel

Vercel supports Vite projects directly, and its Vite docs note that SPA projects using client-side routing should add a rewrite to `index.html` for deep links:

- Vite on Vercel: https://vercel.com/docs/frameworks/frontend/vite

Frontend deployment files/config included:

- `Frontend/.env.example`
- `Frontend/vercel.json`

Create a Vercel project with:

- Root Directory: `Frontend`
- Framework Preset: `Vite`

Set this environment variable in Vercel:

```text
VITE_API_BASE_URL=https://<your-render-service>.onrender.com/api
```

Then redeploy the frontend after the backend URL is available.

## Notes

- Business rules are kept in `Backend/applications/services.py`
- API handlers are intentionally thin in `Backend/applications/api.py`
- The frontend uses reusable UI and form components to keep pages small and readable
