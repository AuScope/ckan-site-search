from fastapi import APIRouter, Query

from app.models.search import SearchRequest, SearchResponse
from app.services.search_service import search_service

router = APIRouter(tags=["search"])


@router.get("/search", response_model=SearchResponse)
async def search(
    q: str = Query(..., min_length=1, description="Search query"),
    source: str | None = Query(None, description="Filter by source key"),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
) -> SearchResponse:
    request = SearchRequest(q=q, source=source, page=page, page_size=page_size)
    return await search_service.search(request)
