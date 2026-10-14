from pydantic import BaseModel
from pydantic_settings import BaseSettings
from enum import Enum

class Environment(str, Enum):
    DEV = "dev"
    STAGING = "staging"
    PROD = "prod"


class SourceConfig(BaseModel):
    key: str
    label: str
    base_url: str
    api_key: str | None = None
    source_type: str = "ckan"
    dataset_type: str | None = "dataset"
    base_doi_url: str | None = None
    enabled: bool = True
    environment: Environment = Environment.DEV


class Settings(BaseSettings):
    app_name: str = "CKAN Site Search API"
    debug: bool = False
    cors_origins: list[str] = ["http://localhost:4200"]
    # Directory containing the built Angular app. When set, the API also serves the frontend.
    frontend_dir: str | None = None

    sources: list[SourceConfig] = [
        SourceConfig(
            key="sample_repo",
            label="Sample Repository",
            base_url="https://sample.data.auscope.org.au/",
            dataset_type="dataset",
            base_doi_url="https://doi.org/",
            environment=Environment.PROD,
        ),
        SourceConfig(
            key="data_repo",
            label="Data Repository",
            base_url="https://repository.data.auscope.org.au/",
            dataset_type="dataset",
            base_doi_url="https://doi.org/",
            environment=Environment.PROD,
        ),
        SourceConfig(
            key="pidinst_repo",
            label="PIDInst Repository",
            base_url="https://pidinst.data.auscope.org.au/",
            dataset_type="instrument",
            base_doi_url="https://doi.org/",
            environment=Environment.PROD,
        ),
    ]

    model_config = {"env_file": ".env", "env_nested_delimiter": "__"}


settings = Settings()
