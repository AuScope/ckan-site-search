# Backend — CKAN Site Search API

FastAPI application providing a unified search API across multiple CKAN data portals.

## Quick Start

```bash
uv sync
uv run uvicorn app.main:app --reload --port 8080
```

API: http://localhost:8080/api/v1  
Docs: http://localhost:8080/api/v1/docs

## Project Structure

```
backend/
├── pyproject.toml
├── app/
│   ├── main.py                # FastAPI app entry point
│   ├── core/
│   │   ├── config.py          # Settings and source definitions
│   │   └── logging.py         # Logging configuration
│   ├── api/routes/
│   │   ├── health.py          # Health check endpoints
│   │   └── search.py          # Search endpoints
│   ├── models/
│   │   └── search.py          # Pydantic models for search
│   ├── services/
│   │   └── search_service.py  # Unified search orchestration
│   ├── clients/
│   │   ├── base.py            # Abstract HTTP client
│   │   └── ckan.py            # CKAN API client
│   └── sources/
│       ├── base.py            # Abstract source interface
│       ├── registry.py        # Source registry
│       └── ckan_source.py     # CKAN source implementation
```

## Configuration

Sources are defined in `app/core/config.py` and can be overridden via environment variables or a `.env` file.

### Environment Variables

| Variable       | Default                 | Description            |
|----------------|-------------------------|------------------------|
| `APP_NAME`     | CKAN Site Search API    | Application name       |
| `DEBUG`        | false                   | Enable debug mode      |
| `CORS_ORIGINS` | ["http://localhost:4200"]| Allowed CORS origins   |

Source configuration is loaded from `SOURCES` as a JSON list, or defaults are used.

## Adding a New Source

### CKAN Source

Add a new entry to the sources configuration:

```python
SourceConfig(
    key="my_new_repo",
    label="My New Repository",
    base_url="https://my-ckan-instance.org",
    source_type="ckan",
    enabled=True,
)
```

### Non-CKAN Source

1. Create a new source class implementing `BaseSource` in `app/sources/`.
2. Register the new source type in `SourceRegistry._create_source()`.
