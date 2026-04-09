from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import health, search
from app.core.config import settings
from app.core.logging import setup_logging
from app.sources.registry import source_registry


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging()
    source_registry.initialize(settings.sources)
    yield


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api/v1")
app.include_router(search.router, prefix="/api/v1")
