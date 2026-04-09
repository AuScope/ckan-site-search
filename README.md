# CKAN Site Search

A unified search application that aggregates results from multiple CKAN data portals into a single interface.

## Architecture

```
┌──────────────┐       ┌──────────────┐       ┌──────────────────┐
│              │       │              │       │  CKAN Site A     │
│   Angular    │──────▶│   FastAPI    │──────▶│  CKAN Site B     │
│   Frontend   │◀──────│   Backend    │◀──────│  CKAN Site C     │
│              │       │              │       │  ...             │
└──────────────┘       └──────────────┘       └──────────────────┘
```

- **Frontend** (`frontend/`): Angular app providing a minimal search UI
- **Backend** (`backend/`): FastAPI app acting as a unified API layer

The frontend communicates exclusively with the backend. The backend fans out queries to configured CKAN sites, normalizes results, and returns a unified response.

## Monorepo Structure

```
ckan-site-search/
├── frontend/          # Angular application (npm)
├── backend/           # FastAPI application (uv)
├── .gitignore
└── README.md
```

## Getting Started

### Backend

```bash
cd backend
uv sync
uv run uvicorn app.main:app --reload
```

API available at http://localhost:8000. Docs at http://localhost:8000/docs.

### Frontend

```bash
cd frontend
npm install
npm start
```

App available at http://localhost:4200.

## Adding a New Source

1. Add a new entry to the `sources` list in `backend/app/core/config.py` (or via environment variables).
2. If the source is CKAN-based, no code changes are needed — the existing `CkanSource` handles it.
3. For a non-CKAN source, implement the `BaseSource` interface in a new module under `backend/app/sources/` and register it in the source registry.

## Configuration

CKAN sites are defined as configuration entries in `backend/app/core/config.py` and can be overridden via environment variables. Each source has:

| Field       | Description                        |
|-------------|------------------------------------|
| `key`       | Unique identifier                  |
| `label`     | Display name                       |
| `base_url`  | CKAN instance base URL             |
| `api_key`   | Optional API key for private data  |
| `enabled`   | Whether the source is active       |
