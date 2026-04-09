from pydantic import BaseModel


class SearchRequest(BaseModel):
    q: str = "*:*"
    source: str | None = None
    page: int = 1
    page_size: int = 10
    date_from: str | None = None
    date_to: str | None = None
    location_choice: str | None = None
    sample_type: str | None = None
    resource_type: str | None = None
    fields_of_research: str | None = None
    instrument_classification: str | None = None


class SourceMeta(BaseModel):
    key: str
    label: str


class SearchResultItem(BaseModel):
    id: str
    title: str
    description: str | None = None
    url: str | None = None
    doi: str | None = None
    doi_url: str | None = None
    source: SourceMeta
    metadata: dict | None = None


class FacetItem(BaseModel):
    name: str
    count: int


class SearchResponse(BaseModel):
    query: str
    total: int
    page: int
    page_size: int
    results: list[SearchResultItem]
    facets: dict[str, list[FacetItem]] | None = None


class SourceStats(BaseModel):
    key: str
    label: str
    count: int


class StatsResponse(BaseModel):
    sources: list[SourceStats]
    total: int
