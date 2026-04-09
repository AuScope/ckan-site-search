import asyncio
import logging

from ckanapi import RemoteCKAN

from app.core.config import SourceConfig
from app.models.search import SearchRequest, SearchResultItem, SourceMeta

logger = logging.getLogger(__name__)


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

    def _search_sync(self, query: str, rows: int, start: int) -> dict:
        return self.action.package_search(q=query, rows=rows, start=start)

    async def search(self, request: SearchRequest) -> list[SearchResultItem]:
        start = (request.page - 1) * request.page_size
        try:
            result = await asyncio.to_thread(
                self._search_sync, request.q, request.page_size, start
            )
        except Exception:
            logger.exception("CKAN search failed for source %s", self.key)
            return []

        items: list[SearchResultItem] = []
        for pkg in result.get("results", []):
            items.append(
                SearchResultItem(
                    id=pkg.get("id", ""),
                    title=pkg.get("title", pkg.get("name", "")),
                    description=pkg.get("notes"),
                    url=self.build_url(pkg.get("name", "")),
                    source=self.meta,
                    metadata={
                        "name": pkg.get("name"),
                        "organization": pkg.get("organization", {}).get("title")
                        if pkg.get("organization")
                        else None,
                    },
                )
            )
        return items
