"""SMED time and analysis computations (server-side, pure Python)."""
from __future__ import annotations

from datetime import time as _time
from typing import Optional


def parse_hm(value: Optional[str]) -> Optional[int]:
    """Parse a 'HH:MM' string into minutes since midnight. Returns None if invalid."""
    if value is None:
        return None
    if isinstance(value, _time):
        return value.hour * 60 + value.minute
    s = str(value).strip()
    if not s:
        return None
    parts = s.replace("h", ":").split(":")
    try:
        h = int(parts[0])
        m = int(parts[1]) if len(parts) > 1 and parts[1] != "" else 0
    except (ValueError, IndexError):
        return None
    if not (0 <= h <= 23) or not (0 <= m <= 59):
        return None
    return h * 60 + m


def duration_minutes(inicio: Optional[str], fim: Optional[str]) -> int:
    """Duration between two 'HH:MM' times. Same-day; if fim < inicio, adds 24h."""
    a = parse_hm(inicio)
    b = parse_hm(fim)
    if a is None or b is None:
        return 0
    diff = b - a
    if diff < 0:
        diff += 24 * 60
    return diff


def format_hms(minutes: Optional[float]) -> str:
    """Format a minute count as H:MM:SS (seconds always 00)."""
    if minutes is None:
        return "0:00:00"
    total = int(round(minutes))
    if total < 0:
        total = 0
    h = total // 60
    m = total % 60
    return f"{h}:{m:02d}:00"


def format_hm(minutes: Optional[float]) -> str:
    """Format a minute count as HH:MM."""
    if minutes is None:
        return "00:00"
    total = int(round(minutes))
    if total < 0:
        total = 0
    return f"{total // 60:02d}:{total % 60:02d}"


def compute_row(task: dict, analysis: dict) -> dict:
    """Compute derived SMED values for one task/analysis pair.

    Returns keys: diff, tempo_i, tempo_e, ganho, tempo_final (all minutes),
    plus the raw editable fields passed through.
    """
    diff = duration_minutes(task.get("inicio"), task.get("fim"))
    ie = (analysis.get("ie") or "").lower()
    tempo_i = diff if ie == "interna" else 0
    tempo_e = diff if ie == "externa" else 0
    ganho = analysis.get("ganho") or 0
    try:
        ganho = int(round(float(ganho)))
    except (TypeError, ValueError):
        ganho = 0
    ganho = max(0, min(ganho, diff))
    tempo_final = max(0, diff - ganho)
    return {
        "diff": diff,
        "tempo_i": tempo_i,
        "tempo_e": tempo_e,
        "ganho": ganho,
        "tempo_final": tempo_final,
    }


def compute_totals(project: dict) -> dict:
    """Aggregate totals across all tasks.

    Returns minute sums, the overall reduction ratio, and a detailed initial vs
    final Internal/External breakdown plus conversion metrics.
    """
    total_diff = total_i = total_e = total_ganho = total_final = 0
    init_i = init_e = init_none = 0          # initial time split (by ie_inicial)
    final_i = final_e = 0                     # final time split (by analysis ie)
    init_i_count = changed_count = conv_i_to_e = 0
    analysis_map = project.get("analysis", {})
    tasks = project.get("tasks", [])
    for task in tasks:
        a = analysis_map.get(task.get("id"), {})
        r = compute_row(task, a)
        total_diff += r["diff"]
        total_i += r["tempo_i"]
        total_e += r["tempo_e"]
        total_ganho += r["ganho"]
        total_final += r["tempo_final"]

        ie_init = (task.get("ie_inicial") or "").lower()
        ie_final = (a.get("ie") or "").lower()
        if ie_init == "interna":
            init_i += r["diff"]
            init_i_count += 1
        elif ie_init == "externa":
            init_e += r["diff"]
        else:
            init_none += r["diff"]
        if ie_final == "interna":
            final_i += r["tempo_final"]
        elif ie_final == "externa":
            final_e += r["tempo_final"]
        if ie_init and ie_final and ie_init != ie_final:
            changed_count += 1
            if ie_init == "interna" and ie_final == "externa":
                conv_i_to_e += 1

    reduction = (1 - (total_final / total_diff)) if total_diff > 0 else 0.0
    conversion_rate = (conv_i_to_e / init_i_count) if init_i_count > 0 else 0.0
    return {
        "diff": total_diff,
        "tempo_i": total_i,
        "tempo_e": total_e,
        "ganho": total_ganho,
        "tempo_final": total_final,
        "reduction": reduction,
        "init_i": init_i,
        "init_e": init_e,
        "init_none": init_none,
        "final_i": final_i,
        "final_e": final_e,
        "init_i_count": init_i_count,
        "changed_count": changed_count,
        "conv_i_to_e": conv_i_to_e,
        "conversion_rate": conversion_rate,
        "task_count": len(tasks),
    }
