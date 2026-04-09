from typing import Protocol, runtime_checkable

from app.models.search import FacetItem, SearchRequest, SearchResultItem, SourceMeta


@runtime_checkable
class BaseSource(Protocol):
    key: str
    label: str

    @property
    def meta(self) -> SourceMeta: ...

    async def search(self, request: SearchRequest) -> tuple[list[SearchResultItem], int, dict[str, list[FacetItem]]]: ...

    async def get_count(self) -> int: ...
