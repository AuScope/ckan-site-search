import asyncio
import logging

from ckanapi import RemoteCKAN

from app.core.config import SourceConfig
from app.models.search import FacetItem, SearchRequest, SearchResultItem, SourceMeta

logger = logging.getLogger(__name__)

FACET_FIELDS = ["organization", "res_format", "tags"]


class CkanSource(RemoteCKAN):
    def __init__(self, cfg: SourceConfig):
        super().__init__(cfg.base_url, apikey=cfg.api_key)
        self.cfg = cfg
        self.key = cfg.key
        self.label = cfg.label

    @property
    def meta(self) -> SourceMeta:
        return SourceMeta(key=self.key, label=self.label)

    def build_url(self, package_name: str) -> str:
        base = self.cfg.base_url.rstrip("/")
        return f"{base}/{self.cfg.dataset_type}/{package_name}"

    def build_doi_url(self, doi: str | None) -> str | None:
        if not doi or not self.cfg.base_doi_url:
            return None
        base = self.cfg.base_doi_url.rstrip("/")
        return f"{base}/{doi}"

    def _build_fq(self, request: SearchRequest) -> str:
        fq_parts: list[str] = []

        if request.date_from:
            fq_parts.append(f"metadata_created:[{request.date_from}T00:00:00Z TO *]")
        if request.date_to:
            fq_parts.append(f"metadata_created:[* TO {request.date_to}T23:59:59Z]")
        if request.location_choice:
            fq_parts.append(f'location_choice:"{request.location_choice}"')
        if request.sample_type:
            fq_parts.append(f'sample_type:"{request.sample_type}"')
        if request.resource_type:
            fq_parts.append(f'resource_type:"{request.resource_type}"')
        if request.fields_of_research:
            fq_parts.append(f'fields_of_research:"{request.fields_of_research}"')
        if request.instrument_classification:
            fq_parts.append(f'instrument_classification:"{request.instrument_classification}"')
        return " AND ".join(fq_parts) if fq_parts else ""

    def _search_sync(self, query: str, rows: int, start: int, fq: str) -> dict:
        data_dict: dict = {
            "q": query, "rows": rows, "start": start,
            "facet": "true", "facet.field": FACET_FIELDS, "facet.limit": 50,
        }
        if fq:
            data_dict["fq"] = fq
        return self.call_action("package_search", data_dict=data_dict)

    def _count_sync(self) -> int:
        result = self.action.package_search(q="*:*", rows=0)
        return result.get("count", 0)

    async def get_count(self) -> int:
        try:
            return await asyncio.to_thread(self._count_sync)
        except Exception:
            logger.exception("Count failed for source %s", self.key)
            return 0

    async def search(self, request: SearchRequest) -> tuple[list[SearchResultItem], int, dict[str, list[FacetItem]]]:
        start = (request.page - 1) * request.page_size
        fq = self._build_fq(request)
        try:
            result = await asyncio.to_thread(
                self._search_sync, request.q, request.page_size, start, fq
            )
        except Exception:
            logger.exception("CKAN search failed for source %s", self.key)
            return [], 0, {}

        total = result.get("count", 0)

        facets: dict[str, list[FacetItem]] = {}
        search_facets = result.get("search_facets", {})
        for field, facet_data in search_facets.items():
            items = facet_data.get("items", [])
            facets[field] = [FacetItem(name=i["name"], count=i["count"]) for i in items if i["count"] > 0]

        items: list[SearchResultItem] = []
        for pkg in result.get("results", []):
            doi = pkg.get("doi")
            items.append(
                SearchResultItem(
                    id=pkg.get("id", ""),
                    title=pkg.get("title", pkg.get("name", "")),
                    description=pkg.get("notes"),
                    url=self.build_url(pkg.get("name", "")),
                    doi=doi,
                    doi_url=self.build_doi_url(doi),
                    source=self.meta,
                    metadata={
                        "name": pkg.get("name"),
                        "organization": pkg.get("organization", {}).get("title")
                        if pkg.get("organization")
                        else None,
                        "metadata_created": pkg.get("metadata_created"),
                        "location_choice": pkg.get("location_choice"),
                        "tags": [t["name"] for t in pkg.get("tags", [])],
                    },
                )
            )
        return items, total, facets
