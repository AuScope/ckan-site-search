from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse


def mount_frontend(app: FastAPI, frontend_dir: str) -> None:
    """Serve the built Angular app, falling back to index.html for client-side routes."""
    root = Path(frontend_dir).resolve()
    index = root / "index.html"
    if not index.is_file():
        raise RuntimeError(f"Frontend index.html not found in {root}")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def frontend(full_path: str) -> FileResponse:
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404)
        candidate = (root / full_path).resolve()
        if candidate.is_file() and candidate.is_relative_to(root):
            return FileResponse(candidate)
        return FileResponse(index)
