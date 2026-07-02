"""JSON backup: export/import the full project to continue on another machine."""
from __future__ import annotations

import json
from typing import Tuple

SCHEMA_VERSION = 1


def to_json_bytes(project: dict) -> bytes:
    payload = {"schema": SCHEMA_VERSION, "app": "SMED_Up", "project": project}
    return json.dumps(payload, ensure_ascii=False, indent=2).encode("utf-8")


def from_json_bytes(data: bytes) -> Tuple[dict, str]:
    """Return (project, error). error is '' on success."""
    try:
        payload = json.loads(data.decode("utf-8"))
    except (ValueError, UnicodeDecodeError) as exc:
        return {}, f"Arquivo inválido: {exc}"
    project = payload.get("project") if isinstance(payload, dict) else None
    if not isinstance(project, dict):
        return {}, "Estrutura de projeto não encontrada no arquivo."
    # Minimal shape guarantees
    project.setdefault("basic", {})
    project.setdefault("tasks", [])
    project.setdefault("analysis", {})
    project.setdefault("action_plan", [])
    return project, ""
