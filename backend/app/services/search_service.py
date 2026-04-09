import asyncio
import logging

from app.models.search import SearchRequest, SearchResponse, SearchResultItem
from app.sources.registry import source_registry

logger = logging.getLogger(__name__)


class SearchService:
    async def search(self, request: SearchRequest) -> SearchResponse:
        sources = source_registry.get_sources(key=request.source)

        tasks = [source.search(request) for source in sources]
        results_per_source: list[list[SearchResultItem]] = await asyncio.gather(
            *tasks, return_exceptions=True
        )

        all_results: list[SearchResultItem] = []
        for result in results_per_source:
            if isinstance(result, Exception):
                logger.error("Source search failed: %s", result)
                continue
            all_results.extend(result)

        total = len(all_results)
        start = (request.page - 1) * request.page_size
        end = start + request.page_size
        page_results = all_results[start:end]

        return SearchResponse(
            query=request.q,
            total=total,
            page=request.page,
            page_size=request.page_size,
            results=page_results,
        )


search_service = SearchService()
