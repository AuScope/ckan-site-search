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
├── frontend/            # Angular application (npm)
├── backend/             # FastAPI application (uv)
│   └── .env.example     # Configuration template
├── .github/workflows/   # CI: build and publish the Docker image
├── Dockerfile           # Single image: frontend build + backend runtime
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Getting Started (local development)

To run the app without setting up Node or Python, see [Running with Docker](#running-with-docker).

### Backend

```bash
cd backend
cp .env.example .env   # optional, then edit as needed
uv sync
uv run uvicorn app.main:app --reload --port 8080
```

API available at http://localhost:8080. Docs at http://localhost:8080/api/v1/docs. (The frontend dev build expects the API on port 8080.)

### Frontend

```bash
cd frontend
npm install
npm start
```

App available at http://localhost:4200.

## Running with Docker

Docker runs the whole application in a single container: FastAPI serves the API at `/api/v1` and the built Angular app at `/`. Because both are on the same origin, no CORS configuration is needed.

### Prerequisites

- Docker Engine 24+ (or Docker Desktop) with the Compose plugin v2.24+ (`docker compose version`)

### 1. Configure

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` to choose which CKAN sites to search (`SOURCES`), enable `DEBUG` logging, and so on. The example contains both the production sites (active) and the dev/test sites (commented out). If `backend/.env` doesn't exist, the defaults in `backend/app/core/config.py` (the production sites) are used.

> `backend/.env` is git-ignored and excluded from the image. Never commit API keys.

### 2. Build and start

```bash
docker compose up --build -d
```

The first build takes a few minutes (it installs npm and Python dependencies).

### 3. Open the app

| URL                                   | What                     |
|---------------------------------------|--------------------------|
| http://localhost:8080                 | Search UI                |
| http://localhost:8080/api/v1/docs     | API docs (Swagger UI)    |
| http://localhost:8080/api/v1/health   | Health check             |

To use a different host port: `PORT=9000 docker compose up -d`.

### Common commands

```bash
docker compose logs -f                      # follow logs
docker compose ps                           # status, including health
docker compose up -d --force-recreate       # apply changes to backend/.env
docker compose up --build -d                # rebuild after code changes
docker compose down                         # stop and remove the container
```

### Using the published image

Instead of building locally, you can run the image published to GitHub Container Registry:

```bash
docker compose pull
docker compose up -d
```

If the package is private, log in first with a GitHub personal access token that has the `read:packages` scope:

```bash
echo <TOKEN> | docker login ghcr.io -u <github-username> --password-stdin
```

Without Compose:

```bash
docker run -d --name ckan-site-search -p 8080:8080 --env-file backend/.env ghcr.io/auscope/ckan-site-search:latest
```

### Publishing the image

The **Build and publish image** GitHub Actions workflow ([.github/workflows/docker-publish.yml](.github/workflows/docker-publish.yml)) is triggered manually from *Actions → Build and publish image → Run workflow*. It builds the image and pushes `ghcr.io/auscope/ckan-site-search:latest` plus a short commit-SHA tag (e.g. `sha-6a6878b`).

## Adding a New Source

1. Add a new entry to the `sources` list in `backend/app/core/config.py` (or via environment variables).
2. If the source is CKAN-based, no code changes are needed — the existing `CkanSource` handles it.
3. For a non-CKAN source, implement the `BaseSource` interface in a new module under `backend/app/sources/` and register it in the source registry.

## Configuration

Settings are read from environment variables or `backend/.env` (see [backend/.env.example](backend/.env.example)). CKAN sites default to the entries in `backend/app/core/config.py` and can be overridden with the `SOURCES` variable (a single-line JSON list). Each source has:

| Field          | Description                                                  |
|----------------|--------------------------------------------------------------|
| `key`          | Unique identifier                                            |
| `label`        | Display name                                                 |
| `base_url`     | CKAN instance base URL                                       |
| `api_key`      | Optional API key for private data                            |
| `source_type`  | Source implementation (default `ckan`)                       |
| `dataset_type` | CKAN dataset type to search (e.g. `dataset`, `instrument`)   |
| `base_doi_url` | Prefix for DOI links (e.g. `https://doi.org/`)               |
| `enabled`      | Whether the source is active                                 |
| `environment`  | `dev`, `staging` or `prod`; shown as a badge in the UI       |

Other settings: `APP_NAME`, `DEBUG` (debug logging), `CORS_ORIGINS` (JSON list, only needed for local frontend development), and `FRONTEND_DIR` (set automatically in the Docker image).
