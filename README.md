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

## Notes

- Business rules are kept in `Backend/applications/services.py`
- API handlers are intentionally thin in `Backend/applications/api.py`
- The frontend uses reusable UI and form components to keep pages small and readable
