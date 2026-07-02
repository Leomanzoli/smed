"""5W2H action plan Excel export."""
from __future__ import annotations

import io

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill

TEAL = "FF007E7A"

COLUMNS = [
    ("o_que", "O quê?"),
    ("por_que", "Por quê?"),
    ("onde", "Onde?"),
    ("quando", "Quando?"),
    ("quem", "Quem?"),
    ("como", "Como?"),
    ("quanto", "Quanto?"),
    ("matricula", "Matrícula"),
    ("email", "E-mail"),
]


def build_bytes(project: dict) -> bytes:
    wb = Workbook()
    ws = wb.active
    ws.title = "5W2H"

    ws.merge_cells(start_row=1, start_column=1, end_row=1, end_column=len(COLUMNS))
    title = ws.cell(row=1, column=1, value="Plano de Ação 5W2H")
    title.font = Font(name="HELVETICA", size=13, bold=True, color="FFFFFFFF")
    title.fill = PatternFill("solid", fgColor=TEAL)
    title.alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[1].height = 24

    header_row = 3
    for idx, (_key, label) in enumerate(COLUMNS):
        cell = ws.cell(row=header_row, column=idx + 1, value=label)
        cell.font = Font(name="HELVETICA", size=10, bold=True, color="FFFFFFFF")
        cell.fill = PatternFill("solid", fgColor=TEAL)
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        letter = cell.column_letter
        ws.column_dimensions[letter].width = 26 if idx < 7 else 16

    r = header_row + 1
    for item in project.get("action_plan", []):
        for idx, (key, _label) in enumerate(COLUMNS):
            c = ws.cell(row=r, column=idx + 1, value=item.get(key, ""))
            c.font = Font(name="HELVETICA", size=10)
            c.alignment = Alignment(horizontal="left", vertical="top", wrap_text=True)
        r += 1

    buf = io.BytesIO()
    wb.save(buf)
    return buf.getvalue()
