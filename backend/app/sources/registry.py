import logging

from app.core.config import SourceConfig
from app.sources.base import BaseSource
from app.sources.ckan_source import CkanSource

logger = logging.getLogger(__name__)

SOURCE_TYPE_MAP: dict[str, type[BaseSource]] = {
    "ckan": CkanSource,
}


class SourceRegistry:
    def __init__(self) -> None:
        self._sources: dict[str, BaseSource] = {}

    def initialize(self, configs: list[SourceConfig]) -> None:
        for cfg in configs:
            if not cfg.enabled:
                logger.info("Source %s is disabled, skipping", cfg.key)
                continue
            source = self._create_source(cfg)
            if source:
                self._sources[cfg.key] = source
                logger.info("Registered source: %s (%s)", cfg.key, cfg.source_type)

    def _create_source(self, cfg: SourceConfig) -> BaseSource | None:
        if cfg.source_type == "ckan":
            return CkanSource(
                cfg=cfg,
            )
        logger.warning("Unknown source type: %s for %s", cfg.source_type, cfg.key)
        return None

    def get_sources(self, key: str | None = None) -> list[BaseSource]:
        if key:
            source = self._sources.get(key)
            return [source] if source else []
        return list(self._sources.values())

    def list_source_keys(self) -> list[str]:
        return list(self._sources.keys())


source_registry = SourceRegistry()
