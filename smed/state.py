"""Session-state project model and helpers for the SMED Streamlit app."""
from __future__ import annotations

import uuid
from typing import Any

import streamlit as st

PROJECT_KEY = "project"


def _empty_project() -> dict:
    return {
        "name": "",
        "section_label": "",
        "basic": {
            "atividade": "",
            "aplicadores": "",
            "data_analise": "",
            "area": "",
            "gerencia": "",
            "supervisao": "",
            "revisao": "",
            "data_revisao": "",
        },
        "tasks": [],       # [{id, tarefa, task, descricao, inicio, fim}]
        "analysis": {},    # {task_id: {ie, e, c, r, s, ganho, kaizen, o_que_e}}
        "action_plan": [], # [{o_que, por_que, onde, quando, quem, como, quanto, matricula, email}]
    }


def new_id() -> str:
    return uuid.uuid4().hex[:8]


def ensure_project() -> dict:
    if PROJECT_KEY not in st.session_state:
        st.session_state[PROJECT_KEY] = _empty_project()
    return st.session_state[PROJECT_KEY]


def get_project() -> dict:
    return ensure_project()


def set_project(project: dict) -> None:
    st.session_state[PROJECT_KEY] = project


def reset_project() -> None:
    st.session_state[PROJECT_KEY] = _empty_project()


def ensure_analysis(project: dict, task_id: str) -> dict:
    a = project.setdefault("analysis", {})
    if task_id not in a:
        a[task_id] = {
            "ie": "",
            "e": False,
            "c": False,
            "r": False,
            "s": False,
            "ganho": 0,
            "kaizen": "",
            "o_que_e": "",
        }
    return a[task_id]


def prune_analysis(project: dict) -> None:
    """Drop analysis entries whose task no longer exists."""
    valid = {t.get("id") for t in project.get("tasks", [])}
    project["analysis"] = {
        k: v for k, v in project.get("analysis", {}).items() if k in valid
    }


def get(project: dict, *path: str, default: Any = "") -> Any:
    cur: Any = project
    for key in path:
        if not isinstance(cur, dict):
            return default
        cur = cur.get(key, default)
    return cur
