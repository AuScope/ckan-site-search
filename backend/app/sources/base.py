from typing import Protocol, runtime_checkable

from app.models.search import SearchRequest, SearchResultItem, SourceMeta


@runtime_checkable
class BaseSource(Protocol):
    key: str
    label: str

    @property
    def meta(self) -> SourceMeta: ...

    async def search(self, request: SearchRequest) -> list[SearchResultItem]: ...
