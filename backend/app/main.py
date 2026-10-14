from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import health, search
from app.core.config import settings
from app.core.logging import setup_logging
from app.frontend import mount_frontend
from app.sources.registry import source_registry

API_PREFIX = "/api/v1"


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging()
    source_registry.initialize(settings.sources)
    yield


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    lifespan=lifespan,
    docs_url=f"{API_PREFIX}/docs",
    redoc_url=f"{API_PREFIX}/redoc",
    openapi_url=f"{API_PREFIX}/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix=API_PREFIX)
app.include_router(search.router, prefix=API_PREFIX)

# Registered last so the catch-all route never shadows the API.
if settings.frontend_dir:
    mount_frontend(app, settings.frontend_dir)
