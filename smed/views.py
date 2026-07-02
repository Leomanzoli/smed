"""Page render functions for the SMED Streamlit app."""
from __future__ import annotations

import os

import pandas as pd
import streamlit as st

from . import excel_action, excel_field, excel_smed
from .compute import compute_row, compute_totals, format_hms
from .i18n import get_lang, t
from .state import get_project, new_id, prune_analysis

ASSETS = "assets"


def _s(value) -> str:
    if value is None:
        return ""
    if isinstance(value, float) and pd.isna(value):
        return ""
    return str(value)


# --------------------------------------------------------------------------- #
# Home
# --------------------------------------------------------------------------- #
def home() -> None:
    st.title(t("app.title"))
    st.caption(t("app.subtitle"))
    st.write(t("home.lead"))
    c1, c2, c3 = st.columns(3)
    with c1:
        st.subheader(t("home.step1"))
        st.write(t("home.step1_desc"))
    with c2:
        st.subheader(t("home.step2"))
        st.write(t("home.step2_desc"))
    with c3:
        st.subheader(t("home.step3"))
        st.write(t("home.step3_desc"))


# --------------------------------------------------------------------------- #
# Collect (Step 1 + Step 2)
# --------------------------------------------------------------------------- #
def collect() -> None:
    project = get_project()
    basic = project.setdefault("basic", {})

    st.header(t("basic.title"))
    c1, c2 = st.columns(2)
    with c1:
        basic["atividade"] = st.text_input(t("basic.atividade"), value=_s(basic.get("atividade")))
        basic["aplicadores"] = st.text_input(t("basic.aplicadores"), value=_s(basic.get("aplicadores")))
        basic["data_analise"] = st.text_input(t("basic.data_analise"), value=_s(basic.get("data_analise")),
                                               placeholder="AAAA-MM-DD")
        basic["area"] = st.text_input(t("basic.area"), value=_s(basic.get("area")))
    with c2:
        basic["gerencia"] = st.text_input(t("basic.gerencia"), value=_s(basic.get("gerencia")))
        basic["supervisao"] = st.text_input(t("basic.supervisao"), value=_s(basic.get("supervisao")))
        basic["revisao"] = st.text_input(t("basic.revisao"), value=_s(basic.get("revisao")))
        basic["data_revisao"] = st.text_input(t("basic.data_revisao"), value=_s(basic.get("data_revisao")),
                                              placeholder="AAAA-MM-DD")
    project["section_label"] = st.text_input(
        t("basic.section_label"), value=_s(project.get("section_label")), help=t("basic.section_help"))

    st.divider()
    st.header(t("tasks.title"))
    st.caption(t("tasks.help"))

    tasks = project.setdefault("tasks", [])
    df = pd.DataFrame(tasks, columns=["id", "tarefa", "task", "descricao", "inicio", "fim"])
    edited = st.data_editor(
        df,
        num_rows="dynamic",
        hide_index=True,
        use_container_width=True,
        key="tasks_editor",
        column_config={
            "id": None,
            "tarefa": st.column_config.TextColumn(t("tasks.tarefa"), width="medium"),
            "task": st.column_config.TextColumn(t("tasks.task"), width="small"),
            "descricao": st.column_config.TextColumn(t("tasks.descricao"), width="large"),
            "inicio": st.column_config.TextColumn(t("tasks.inicio"), width="small"),
            "fim": st.column_config.TextColumn(t("tasks.fim"), width="small"),
        },
    )
    new_tasks = []
    for rec in edited.to_dict("records"):
        tid = _s(rec.get("id")) or new_id()
        new_tasks.append({
            "id": tid,
            "tarefa": _s(rec.get("tarefa")),
            "task": _s(rec.get("task")),
            "descricao": _s(rec.get("descricao")),
            "inicio": _s(rec.get("inicio")),
            "fim": _s(rec.get("fim")),
        })
    project["tasks"] = new_tasks
    prune_analysis(project)

    if new_tasks:
        preview = pd.DataFrame([
            {t("tasks.tarefa"): tk["tarefa"], t("tasks.tempo"): format_hms(
                compute_row(tk, {})["diff"])}
            for tk in new_tasks
        ])
        st.dataframe(preview, hide_index=True, use_container_width=True)
    else:
        st.info(t("tasks.empty"))

    st.divider()
    c1, c2 = st.columns(2)
    with c1:
        st.download_button(
            t("tasks.export_field"),
            data=excel_field.build_bytes(project),
            file_name="SMED_coleta.xlsx",
            mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            use_container_width=True,
        )
    with c2:
        up = st.file_uploader(t("tasks.import_field"), type=["xlsx"], key="field_up")
        if up is not None:
            partial, err = excel_field.parse_bytes(up.getvalue())
            if err:
                st.error(err)
            else:
                project["basic"] = {**basic, **partial.get("basic", {})}
                project["section_label"] = partial.get("section_label") or project.get("section_label", "")
                project["tasks"] = partial.get("tasks", [])
                project["analysis"] = partial.get("analysis", {})
                st.success(t("tasks.import_ok"))
                st.rerun()


# --------------------------------------------------------------------------- #
# Analyze (Step 3)
# --------------------------------------------------------------------------- #
def analyze() -> None:
    project = get_project()
    tasks = project.get("tasks", [])
    st.header(t("analyze.title"))
    st.caption(t("analyze.help"))

    if not tasks:
        st.info(t("analyze.no_tasks"))
        return

    analysis = project.setdefault("analysis", {})
    rows = []
    for task in tasks:
        a = analysis.get(task["id"], {})
        r = compute_row(task, a)
        rows.append({
            "id": task["id"],
            "tarefa": task.get("tarefa", ""),
            "descricao": task.get("descricao", ""),
            "tempo": format_hms(r["diff"]),
            "ie": a.get("ie", ""),
            "e": bool(a.get("e")),
            "c": bool(a.get("c")),
            "r": bool(a.get("r")),
            "s": bool(a.get("s")),
            "ganho": int(a.get("ganho", 0) or 0),
            "tempo_final": format_hms(r["tempo_final"]),
            "kaizen": a.get("kaizen", ""),
            "o_que_e": a.get("o_que_e", ""),
        })
    df = pd.DataFrame(rows)
    edited = st.data_editor(
        df,
        hide_index=True,
        use_container_width=True,
        key="analysis_editor",
        disabled=["tarefa", "descricao", "tempo", "tempo_final"],
        column_config={
            "id": None,
            "tarefa": st.column_config.TextColumn(t("tasks.tarefa")),
            "descricao": st.column_config.TextColumn(t("tasks.descricao")),
            "tempo": st.column_config.TextColumn(t("tasks.tempo"), width="small"),
            "ie": st.column_config.SelectboxColumn(
                t("analyze.ie"), options=["", "interna", "externa"], width="small"),
            "e": st.column_config.CheckboxColumn(t("ecrs.e"), width="small"),
            "c": st.column_config.CheckboxColumn(t("ecrs.c"), width="small"),
            "r": st.column_config.CheckboxColumn(t("ecrs.r"), width="small"),
            "s": st.column_config.CheckboxColumn(t("ecrs.s"), width="small"),
            "ganho": st.column_config.NumberColumn(t("analyze.ganho"), min_value=0, step=1, width="small"),
            "tempo_final": st.column_config.TextColumn(t("analyze.tempo_final"), width="small"),
            "kaizen": st.column_config.TextColumn(t("analyze.kaizen")),
            "o_que_e": st.column_config.TextColumn(t("analyze.o_que_e")),
        },
    )
    for rec in edited.to_dict("records"):
        tid = _s(rec.get("id"))
        if not tid:
            continue
        analysis[tid] = {
            "ie": _s(rec.get("ie")),
            "e": bool(rec.get("e")),
            "c": bool(rec.get("c")),
            "r": bool(rec.get("r")),
            "s": bool(rec.get("s")),
            "ganho": int(rec.get("ganho") or 0),
            "kaizen": _s(rec.get("kaizen")),
            "o_que_e": _s(rec.get("o_que_e")),
        }

    totals = compute_totals(project)
    st.subheader(t("analyze.totals"))
    m1, m2, m3 = st.columns(3)
    m1.metric(t("analyze.total_time"), format_hms(totals["diff"]))
    m2.metric(t("analyze.total_final"), format_hms(totals["tempo_final"]))
    m3.metric(t("analyze.reduction"), f"{totals['reduction'] * 100:.0f}%")

    st.download_button(
        t("analyze.export_smed"),
        data=excel_smed.build_bytes(project),
        file_name="SMED_formulario.xlsx",
        mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        use_container_width=True,
    )


# --------------------------------------------------------------------------- #
# 5W2H action plan
# --------------------------------------------------------------------------- #
def action_plan() -> None:
    project = get_project()
    st.header(t("action.title"))
    st.caption(t("action.help"))

    items = project.setdefault("action_plan", [])
    cols = ["o_que", "por_que", "onde", "quando", "quem", "como", "quanto", "matricula", "email"]
    df = pd.DataFrame(items, columns=cols)
    edited = st.data_editor(
        df,
        num_rows="dynamic",
        hide_index=True,
        use_container_width=True,
        key="action_editor",
        column_config={
            "o_que": st.column_config.TextColumn(t("action.o_que")),
            "por_que": st.column_config.TextColumn(t("action.por_que")),
            "onde": st.column_config.TextColumn(t("action.onde")),
            "quando": st.column_config.TextColumn(t("action.quando")),
            "quem": st.column_config.TextColumn(t("action.quem")),
            "como": st.column_config.TextColumn(t("action.como")),
            "quanto": st.column_config.TextColumn(t("action.quanto")),
            "matricula": st.column_config.TextColumn(t("action.matricula")),
            "email": st.column_config.TextColumn(t("action.email")),
        },
    )
    project["action_plan"] = [
        {k: _s(rec.get(k)) for k in cols} for rec in edited.to_dict("records")
    ]

    st.download_button(
        t("action.export"),
        data=excel_action.build_bytes(project),
        file_name="SMED_plano_5W2H.xlsx",
        mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        use_container_width=True,
    )


# --------------------------------------------------------------------------- #
# Help
# --------------------------------------------------------------------------- #
def help_page() -> None:
    st.header(t("help.title"))
    if get_lang() == "en":
        st.markdown(
            """
1. **Collect (field):** fill in the basic info (Step 1) and add one row per repeatable task
   with start/end times (Step 2). Export the field Excel to share or fill on-site.
2. **Import (optional):** bring a filled field Excel back with *Import field Excel*.
3. **Analysis:** classify each task as Internal/External, mark ECRS (Eliminate, Combine,
   Reduce, Simplify), estimate the time gain and describe the Kaizen. Totals and the overall
   reduction are computed automatically.
4. **SMED form:** download the Excel form, laid out like the standard template.
5. **5W2H plan:** register improvement actions and export the plan.
6. **Backup:** use *Export data (JSON)* in the sidebar to continue on another machine, and
   *Import data (JSON)* to restore it.
"""
        )
    else:
        st.markdown(
            """
1. **Coleta (campo):** preencha as informações básicas (Passo 1) e adicione uma linha por
   tarefa repetível com início/fim (Passo 2). Exporte o Excel de campo para levar a campo.
2. **Importar (opcional):** traga um Excel de campo preenchido em *Importar Excel de campo*.
3. **Análise:** classifique cada tarefa em Interna/Externa, marque ECRS (Eliminar, Combinar,
   Reduzir, Simplificar), estime o ganho de tempo e descreva o Kaizen. Os totais e a redução
   total são calculados automaticamente.
4. **Formulário SMED:** baixe o Excel no mesmo layout do modelo padrão.
5. **Plano 5W2H:** registre as ações de melhoria e exporte o plano.
6. **Backup:** use *Exportar dados (JSON)* na barra lateral para continuar em outra máquina e
   *Importar dados (JSON)* para restaurar.
"""
        )


# --------------------------------------------------------------------------- #
# Privacy / LGPD
# --------------------------------------------------------------------------- #
def privacy() -> None:
    st.header(t("privacy.title"))
    if get_lang() == "en":
        st.markdown(
            """
This application is hosted on **Streamlit Community Cloud** and runs on a server.

- **Transient processing:** the data you type is kept only in your current session (server
  memory) to render the pages and generate files. The app **does not save** your data to any
  database or disk, and it is discarded when the session ends.
- **Third-party hosting:** because processing happens on Streamlit's infrastructure, avoid
  entering sensitive personal data. Only include what is strictly necessary for the analysis.
- **Your control:** you can export/download all your data at any time and clear the session
  with *New / clear*.
- **No tracking:** the app does not create accounts or profiles of individuals.

For LGPD purposes, the responsible organization should assess the use of any personal data
(e.g. names, IDs, e-mails) entered into the 5W2H plan and minimize it where possible.
"""
        )
    else:
        st.markdown(
            """
Este aplicativo é hospedado no **Streamlit Community Cloud** e roda em servidor.

- **Processamento temporário:** os dados digitados ficam apenas na sua sessão atual (memória
  do servidor) para exibir as páginas e gerar os arquivos. O aplicativo **não armazena** seus
  dados em banco de dados ou disco, e eles são descartados ao encerrar a sessão.
- **Hospedagem por terceiro:** como o processamento ocorre na infraestrutura da Streamlit,
  evite inserir dados pessoais sensíveis. Informe apenas o estritamente necessário à análise.
- **Seu controle:** você pode exportar/baixar todos os seus dados a qualquer momento e limpar
  a sessão em *Novo / limpar*.
- **Sem rastreamento:** o aplicativo não cria contas nem perfis de pessoas.

Para fins de LGPD, a organização responsável deve avaliar o uso de dados pessoais (por
exemplo, nomes, matrículas, e-mails) inseridos no plano 5W2H e minimizá-los quando possível.
"""
        )


# --------------------------------------------------------------------------- #
# About / branding
# --------------------------------------------------------------------------- #
def _img(path: str):
    return path if os.path.exists(path) else None


def about() -> None:
    st.header(t("about.title"))
    c1, c2 = st.columns([1, 2])
    with c1:
        photo = _img(os.path.join(ASSETS, "leonardo.jpg"))
        if photo:
            st.image(photo, use_container_width=True)
    with c2:
        st.subheader(t("about.dev"))
        st.write(f"**{t('about.role')}**")
        st.write(t("about.context"))

    st.divider()
    st.subheader(t("about.partners"))
    p1, p2 = st.columns(2)
    sodexo = _img(os.path.join(ASSETS, "logo sodexo.png"))
    vale = _img(os.path.join(ASSETS, "Logo vale.png"))
    if sodexo:
        p1.image(sodexo, width=180)
    if vale:
        p2.image(vale, width=180)
