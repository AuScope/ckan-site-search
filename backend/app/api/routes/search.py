from fastapi import APIRouter, Query

from app.models.search import SearchRequest, SearchResponse, StatsResponse
from app.services.search_service import search_service

router = APIRouter(tags=["search"])


@router.get("/search", response_model=SearchResponse)
async def search(
    q: str = Query("*:*", description="Search query"),
    source: str | None = Query(None, description="Filter by source key"),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    date_from: str | None = Query(None, description="Filter from date (YYYY-MM-DD)"),
    date_to: str | None = Query(None, description="Filter to date (YYYY-MM-DD)"),
    location_choice: str | None = Query(None, description="Filter by location type"),
    sample_type: str | None = Query(None, description="Filter by sample type"),
    resource_type: str | None = Query(None, description="Filter by resource type"),
    fields_of_research: str | None = Query(None, description="Filter by field of research"),
    instrument_classification: str | None = Query(None, description="Filter by instrument classification"),
) -> SearchResponse:
    request = SearchRequest(
        q=q, source=source, page=page, page_size=page_size,
        date_from=date_from, date_to=date_to,
        location_choice=location_choice, sample_type=sample_type,
        resource_type=resource_type, fields_of_research=fields_of_research,
        instrument_classification=instrument_classification,
    )
    return await search_service.search(request)


@router.get("/stats", response_model=StatsResponse)
async def stats() -> StatsResponse:
    return await search_service.get_stats()
