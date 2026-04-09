from pydantic import BaseModel
from pydantic_settings import BaseSettings


class SourceConfig(BaseModel):
    key: str
    label: str
    base_url: str
    api_key: str | None = None
    source_type: str = "ckan"
    dataset_type: str | None = "dataset"
    enabled: bool = True


class Settings(BaseSettings):
    app_name: str = "CKAN Site Search API"
    debug: bool = False
    cors_origins: list[str] = ["http://localhost:4200"]

    sources: list[SourceConfig] = [
        SourceConfig(
            key="sample_repo",
            label="Sample Repository",
            base_url="https://sample-dev.data.auscope.org.au/",
            dataset_type="dataset",
        ),
        SourceConfig(
            key="data_repo",
            label="Data Repository",
            base_url="https://repository-dev.data.auscope.org.au/",
            dataset_type="dataset",
        ),
        SourceConfig(
            key="pidinst_repo",
            label="PIDInst Repository",
            base_url="https://pidinst-dev.data.auscope.org.au/",
            dataset_type="instrument",
        ),
    ]

    model_config = {"env_file": ".env", "env_nested_delimiter": "__"}


settings = Settings()
