import asyncio
import logging

from app.models.search import FacetItem, SearchRequest, SearchResponse, SearchResultItem, SourceStats, StatsResponse
from app.sources.registry import source_registry

logger = logging.getLogger(__name__)


class SearchService:
    async def search(self, request: SearchRequest) -> SearchResponse:
        sources = source_registry.get_sources(key=request.source)

        tasks = [source.search(request) for source in sources]
        raw_results = await asyncio.gather(*tasks, return_exceptions=True)

        all_results: list[SearchResultItem] = []
        total = 0
        merged_facets: dict[str, dict[str, int]] = {}

        for result in raw_results:
            if isinstance(result, Exception):
                logger.error("Source search failed: %s", result)
                continue
            items, count, facets = result
            all_results.extend(items)
            total += count
            for field, facet_items in facets.items():
                if field not in merged_facets:
                    merged_facets[field] = {}
                for fi in facet_items:
                    merged_facets[field][fi.name] = merged_facets[field].get(fi.name, 0) + fi.count

        facets_out: dict[str, list[FacetItem]] = {}
        for field, counts in merged_facets.items():
            facets_out[field] = sorted(
                [FacetItem(name=n, count=c) for n, c in counts.items()],
                key=lambda x: x.count, reverse=True,
            )

        return SearchResponse(
            query=request.q,
            total=total,
            page=request.page,
            page_size=request.page_size,
            results=all_results,
            facets=facets_out,
        )

    async def get_stats(self) -> StatsResponse:
        sources = source_registry.get_sources()
        tasks = [(s.key, s.label, s.get_count()) for s in sources]
        results = await asyncio.gather(*[t[2] for t in tasks], return_exceptions=True)

        stats: list[SourceStats] = []
        total = 0
        for i, result in enumerate(results):
            count = result if isinstance(result, int) else 0
            stats.append(SourceStats(key=tasks[i][0], label=tasks[i][1], count=count))
            total += count

        return StatsResponse(sources=stats, total=total)


search_service = SearchService()
