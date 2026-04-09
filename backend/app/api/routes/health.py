from fastapi import APIRouter

from app.sources.registry import source_registry

router = APIRouter(tags=["health"])


@router.get("/health")
async def health() -> dict:
    return {"status": "ok"}


@router.get("/health/sources")
async def source_readiness() -> dict:
    return {
        "sources": [
            {"key": key, "available": True}
            for key in source_registry.list_source_keys()
        ]
    }
