from pydantic import BaseModel


class SearchRequest(BaseModel):
    q: str
    source: str | None = None
    page: int = 1
    page_size: int = 10


class SourceMeta(BaseModel):
    key: str
    label: str


class SearchResultItem(BaseModel):
    id: str
    title: str
    description: str | None = None
    url: str | None = None
    source: SourceMeta
    metadata: dict | None = None


class SearchResponse(BaseModel):
    query: str
    total: int
    page: int
    page_size: int
    results: list[SearchResultItem]
