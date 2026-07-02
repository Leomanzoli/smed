"""Page render functions for the SMED Streamlit app."""
from __future__ import annotations

import os
import sys
from datetime import date, datetime, time as dtime, timedelta

import pandas as pd
import streamlit as st

from . import excel_action, excel_field, excel_smed
from .compute import compute_row, compute_totals, duration_minutes, format_hms
from .i18n import get_lang, t
from .state import get_project, new_id, prune_analysis

ASSETS = "assets"
TIME_STEP = timedelta(minutes=1)
# True when running client-side in the browser (stlite / Pyodide / WebAssembly).
IS_BROWSER = sys.platform == "emscripten"


def _s(value) -> str:
    if value is None:
        return ""
    if isinstance(value, float) and pd.isna(value):
        return ""
    return str(value)


def _parse_date(value):
    if not value:
        return None
    if isinstance(value, date):
        return value
    s = str(value).strip()
    try:
        return date.fromisoformat(s[:10])
    except ValueError:
        for fmt in ("%d/%m/%Y", "%m/%d/%Y", "%d-%m-%Y"):
            try:
                return datetime.strptime(s, fmt).date()
            except ValueError:
                continue
    return None


def _parse_time(value):
    if not value:
        return None
    if isinstance(value, dtime):
        return value
    s = str(value).strip().replace("h", ":")
    parts = s.split(":")
    try:
        h = int(parts[0])
        m = int(parts[1]) if len(parts) > 1 and parts[1] != "" else 0
        if 0 <= h <= 23 and 0 <= m <= 59:
            return dtime(h, m)
    except (ValueError, IndexError):
        return None
    return None


def _fmt_date(d) -> str:
    return d.isoformat() if isinstance(d, date) else ""


def _fmt_time(tv) -> str:
    return tv.strftime("%H:%M") if isinstance(tv, dtime) else ""


def _ie_label(value) -> str:
    v = (value or "").lower()
    if v == "interna":
        return t("analyze.interna")
    if v == "externa":
        return t("analyze.externa")
    return t("common.none")


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
# Collect (Step 1 + Step 2) — mobile-first
# --------------------------------------------------------------------------- #
def _task_form(project: dict, task: dict | None) -> None:
    """Render an add/edit task form. task=None means 'add new'."""
    editing = task is not None
    form_key = f"task_form_{task['id']}" if editing else "task_form_new"
    with st.form(form_key, clear_on_submit=not editing, border=not editing):
        tarefa = st.text_input(t("tasks.tarefa"), value=_s(task.get("tarefa")) if editing else "")
        numero = st.text_input(t("tasks.task"), value=_s(task.get("task")) if editing else "")
        descricao = st.text_area(
            t("tasks.descricao"), value=_s(task.get("descricao")) if editing else "", height=80)
        c1, c2 = st.columns(2)
        inicio = c1.time_input(
            t("tasks.inicio"), value=_parse_time(task.get("inicio")) if editing else None,
            step=TIME_STEP)
        fim = c2.time_input(
            t("tasks.fim"), value=_parse_time(task.get("fim")) if editing else None, step=TIME_STEP)
        ie_opts = ["", "interna", "externa"]
        cur_ie = _s(task.get("ie_inicial")) if editing else ""
        ie_idx = ie_opts.index(cur_ie) if cur_ie in ie_opts else 0
        ie_inicial = st.selectbox(
            t("tasks.ie"), options=ie_opts, index=ie_idx,
            format_func=_ie_label, help=t("tasks.ie_help"))

        if editing:
            b1, b2 = st.columns(2)
            save = b1.form_submit_button(t("common.save"), type="primary", width="stretch")
            cancel = b2.form_submit_button(t("common.cancel"), width="stretch")
        else:
            save = st.form_submit_button(
                "➕ " + t("tasks.add_title"), type="primary", width="stretch")
            cancel = False

        if cancel:
            st.session_state.pop("edit_task_id", None)
            st.rerun()
        if save:
            if not tarefa.strip() and not descricao.strip():
                st.warning(t("tasks.need_name"))
                return
            payload = {
                "tarefa": tarefa.strip(),
                "task": numero.strip(),
                "descricao": descricao.strip(),
                "inicio": _fmt_time(inicio),
                "fim": _fmt_time(fim),
                "ie_inicial": ie_inicial,
            }
            if editing:
                task.update(payload)
                st.session_state.pop("edit_task_id", None)
            else:
                project.setdefault("tasks", []).append({"id": new_id(), **payload})
            st.rerun()


def _task_card(project: dict, task: dict) -> None:
    tid = task["id"]
    with st.container(border=True):
        dur = format_hms(duration_minutes(task.get("inicio"), task.get("fim")))
        nome = task.get("tarefa") or t("tasks.no_name")
        num = f" · #{task['task']}" if task.get("task") else ""
        ini = task.get("inicio") or "--:--"
        fim = task.get("fim") or "--:--"
        ci, ce, cd = st.columns([8, 1, 1], vertical_alignment="center")
        ci.markdown(f"**{nome}**{num}")
        ci.caption(f"🕐 {ini} → {fim} · ⏱️ {dur} · I×E: {_ie_label(task.get('ie_inicial'))}")
        if ce.button("✏️", key=f"edit_{tid}", help=t("tasks.edit"), width="stretch"):
            st.session_state["edit_task_id"] = tid
            st.rerun()
        if cd.button("🗑️", key=f"del_{tid}", help=t("tasks.delete"), width="stretch"):
            project["tasks"] = [x for x in project.get("tasks", []) if x["id"] != tid]
            prune_analysis(project)
            st.session_state.pop("edit_task_id", None)
            st.rerun()


def collect() -> None:
    project = get_project()
    basic = project.setdefault("basic", {})

    st.header(t("basic.title"))
    basic["atividade"] = st.text_input(t("basic.atividade"), value=_s(basic.get("atividade")))
    r1c1, r1c2 = st.columns(2)
    basic["aplicadores"] = r1c1.text_input(
        t("basic.aplicadores"), value=_s(basic.get("aplicadores")))
    basic["area"] = r1c2.text_input(t("basic.area"), value=_s(basic.get("area")))
    r2c1, r2c2 = st.columns(2)
    basic["gerencia"] = r2c1.text_input(t("basic.gerencia"), value=_s(basic.get("gerencia")))
    basic["supervisao"] = r2c2.text_input(
        t("basic.supervisao"), value=_s(basic.get("supervisao")))
    basic["revisao"] = st.text_input(t("basic.revisao"), value=_s(basic.get("revisao")))
    r3c1, r3c2 = st.columns(2)
    d1 = r3c1.date_input(
        t("basic.data_analise"), value=_parse_date(basic.get("data_analise")),
        format="DD/MM/YYYY")
    basic["data_analise"] = _fmt_date(d1)
    d2 = r3c2.date_input(
        t("basic.data_revisao"), value=_parse_date(basic.get("data_revisao")),
        format="DD/MM/YYYY")
    basic["data_revisao"] = _fmt_date(d2)
    project["section_label"] = st.text_input(
        t("basic.section_label"), value=_s(project.get("section_label")), help=t("basic.section_help"))

    st.divider()
    st.header(t("tasks.title"))
    st.caption(t("tasks.help"))

    tasks = project.setdefault("tasks", [])
    edit_id = st.session_state.get("edit_task_id")

    # Add form (hidden while editing another task, to keep focus on one action)
    if not edit_id:
        _task_form(project, None)

    if tasks:
        st.markdown(f"**{t('tasks.list_title')}** ({len(tasks)})")
        for task in tasks:
            if edit_id == task["id"]:
                _task_form(project, task)
            else:
                _task_card(project, task)
    else:
        st.info(t("tasks.empty"))

    st.divider()
    st.download_button(
        "⬇️ " + t("tasks.export_field"),
        data=excel_field.build_bytes(project),
        file_name="SMED_coleta.xlsx",
        mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        width="stretch",
    )
    with st.expander(t("tasks.import_field")):
        up = st.file_uploader(t("tasks.import_field"), type=["xlsx"], key="field_up",
                              label_visibility="collapsed")
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
    ecrs_opts = ["e", "c", "r", "s"]
    ecrs_labels = {"e": t("ecrs.e"), "c": t("ecrs.c"), "r": t("ecrs.r"), "s": t("ecrs.s")}
    for task in tasks:
        tid = task["id"]
        a = analysis.get(tid, {})
        nome = task.get("tarefa", "") or t("tasks.no_name")
        with st.container(border=True):
            num = f" · #{task['task']}" if task.get("task") else ""
            st.markdown(f"**{nome}**{num}")
            dur = format_hms(duration_minutes(task.get("inicio"), task.get("fim")))
            st.caption(
                f"🕐 {task.get('inicio') or '--:--'} → {task.get('fim') or '--:--'}"
                f"  ·  ⏱️ {dur}  ·  {t('analyze.ie_inicial')}: {_ie_label(task.get('ie_inicial'))}"
            )
            # I x E (final): a two-option switch (not an on/off toggle).
            seed_ie = a.get("ie") or task.get("ie_inicial") or "interna"
            sel_ie = st.segmented_control(
                t("analyze.ie"), options=["interna", "externa"], format_func=_ie_label,
                default=seed_ie if seed_ie in ("interna", "externa") else "interna",
                key=f"an_ie_{tid}")
            ie = sel_ie if sel_ie in ("interna", "externa") else seed_ie
            # ECRS: pick a single option (no "none" pill; may be left unselected).
            cur_ecrs = next((k for k in ecrs_opts if a.get(k)), None)
            sel = st.radio(
                t("analyze.ecrs"), options=ecrs_opts,
                index=ecrs_opts.index(cur_ecrs) if cur_ecrs else None,
                format_func=lambda k: ecrs_labels[k], horizontal=True, key=f"an_ecrs_{tid}")
            e, c, r, s = sel == "e", sel == "c", sel == "r", sel == "s"
            ganho = st.number_input(
                t("analyze.ganho"), min_value=0, step=1,
                value=int(a.get("ganho", 0) or 0), key=f"an_ganho_{tid}")
            kaizen = st.text_input(
                t("analyze.kaizen"), value=_s(a.get("kaizen")), key=f"an_kaizen_{tid}")
            o_que_e = st.text_input(
                t("analyze.o_que_e"), value=_s(a.get("o_que_e")), key=f"an_oque_{tid}")
            analysis[tid] = {
                "ie": ie, "e": e, "c": c, "r": r, "s": s,
                "ganho": int(ganho or 0), "kaizen": kaizen, "o_que_e": o_que_e,
            }
            comp = compute_row(task, analysis[tid])
            st.caption(
                f"{t('tasks.tempo')}: {format_hms(comp['diff'])}"
                f"  ·  {t('analyze.tempo_final')}: {format_hms(comp['tempo_final'])}"
            )

    totals = compute_totals(project)
    st.subheader(t("analyze.totals"))
    m1, m2, m3, m4 = st.columns(4)
    m1.metric(t("analyze.total_time"), format_hms(totals["diff"]))
    m2.metric(t("analyze.total_final"), format_hms(totals["tempo_final"]))
    m3.metric(t("analyze.total_gain"), format_hms(totals["ganho"]))
    m4.metric(t("analyze.reduction"), f"{totals['reduction'] * 100:.0f}%")

    st.markdown(f"**{t('analyze.ie_split')}**")
    split_df = pd.DataFrame(
        {
            "": [t("analyze.internal"), t("analyze.external")],
            t("common.initial"): [format_hms(totals["init_i"]), format_hms(totals["init_e"])],
            t("common.final"): [format_hms(totals["final_i"]), format_hms(totals["final_e"])],
        }
    )
    st.dataframe(split_df, hide_index=True, width="stretch")
    c4, c5, c6 = st.columns(3)
    c4.metric(
        t("analyze.converted"), f"{totals['conversion_rate'] * 100:.0f}%",
        help=t("analyze.converted_help"))
    c5.metric(
        t("analyze.converted_ei"), f"{totals['conversion_rate_ei'] * 100:.0f}%",
        help=t("analyze.converted_ei_help"))
    c6.metric(t("analyze.changed"), f"{totals['changed_count']}/{totals['task_count']}")

    # Read-only preview of the SMED form that will be generated.
    st.markdown(f"**{t('analyze.preview')}**")
    st.caption(t("analyze.preview_help"))
    prev_rows = []
    for task in tasks:
        a = analysis.get(task["id"], {})
        cr = compute_row(task, a)
        ie = (a.get("ie") or "").lower()
        prev_rows.append({
            t("tasks.tarefa"): task.get("tarefa", "") or t("tasks.no_name"),
            t("tasks.task"): task.get("task", ""),
            t("tasks.inicio"): task.get("inicio", ""),
            t("tasks.fim"): task.get("fim", ""),
            t("tasks.tempo"): format_hms(cr["diff"]),
            t("analyze.interna"): "X" if ie == "interna" else "",
            t("analyze.externa"): "X" if ie == "externa" else "",
            t("analyze.tempo_i"): format_hms(cr["tempo_i"]),
            t("analyze.tempo_e"): format_hms(cr["tempo_e"]),
            "E": "X" if a.get("e") else "",
            "C": "X" if a.get("c") else "",
            "R": "X" if a.get("r") else "",
            "S": "X" if a.get("s") else "",
            t("analyze.ganho"): cr["ganho"],
            t("analyze.tempo_final"): format_hms(cr["tempo_final"]),
        })
    st.dataframe(pd.DataFrame(prev_rows), hide_index=True, width="stretch")

    st.download_button(
        t("analyze.export_smed"),
        data=excel_smed.build_bytes(project),
        file_name="SMED_formulario.xlsx",
        mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        width="stretch",
    )


# --------------------------------------------------------------------------- #
# 5W2H action plan
# --------------------------------------------------------------------------- #
_ACTION_FIELDS = [
    "o_que", "por_que", "onde", "quando", "quem", "como", "quanto", "matricula", "email"]


def _action_form(project: dict, item: dict | None) -> None:
    editing = item is not None
    form_key = f"action_form_{item['id']}" if editing else "action_form_new"

    def val(k):
        return _s(item.get(k)) if editing else ""

    with st.form(form_key, clear_on_submit=not editing, border=not editing):
        vals: dict[str, str] = {}
        vals["o_que"] = st.text_area(t("action.o_que"), value=val("o_que"), height=70)
        vals["por_que"] = st.text_area(t("action.por_que"), value=val("por_que"), height=70)
        c1, c2 = st.columns(2)
        vals["onde"] = c1.text_input(t("action.onde"), value=val("onde"))
        vals["quando"] = c2.text_input(t("action.quando"), value=val("quando"))
        c3, c4 = st.columns(2)
        vals["quem"] = c3.text_input(t("action.quem"), value=val("quem"))
        vals["quanto"] = c4.text_input(t("action.quanto"), value=val("quanto"))
        vals["como"] = st.text_area(t("action.como"), value=val("como"), height=70)
        c5, c6 = st.columns(2)
        vals["matricula"] = c5.text_input(t("action.matricula"), value=val("matricula"))
        vals["email"] = c6.text_input(t("action.email"), value=val("email"))

        if editing:
            b1, b2 = st.columns(2)
            save = b1.form_submit_button(t("common.save"), type="primary", width="stretch")
            cancel = b2.form_submit_button(t("common.cancel"), width="stretch")
        else:
            save = st.form_submit_button(
                "➕ " + t("action.add_title"), type="primary", width="stretch")
            cancel = False

        if cancel:
            st.session_state.pop("edit_action_id", None)
            st.rerun()
        if save:
            if not vals["o_que"].strip():
                st.warning(t("action.need"))
                return
            payload = {k: v.strip() for k, v in vals.items()}
            if editing:
                item.update(payload)
                st.session_state.pop("edit_action_id", None)
            else:
                project.setdefault("action_plan", []).append({"id": new_id(), **payload})
            st.rerun()


def _action_card(project: dict, item: dict) -> None:
    aid = item["id"]
    with st.container(border=True):
        st.markdown(f"**{item.get('o_que') or t('action.no_o_que')}**")
        rows = [(t(f"action.{k}"), item.get(k)) for k in _ACTION_FIELDS[1:]]
        lines = [f"**{lbl}:** {val}" for lbl, val in rows if val]
        if lines:
            st.markdown("  \n".join(lines))
        c1, c2 = st.columns(2)
        if c1.button("✏️ " + t("tasks.edit"), key=f"edit_a_{aid}", width="stretch"):
            st.session_state["edit_action_id"] = aid
            st.rerun()
        if c2.button("🗑️ " + t("tasks.delete"), key=f"del_a_{aid}", width="stretch"):
            project["action_plan"] = [
                x for x in project.get("action_plan", []) if x.get("id") != aid]
            st.session_state.pop("edit_action_id", None)
            st.rerun()


def action_plan() -> None:
    project = get_project()
    st.header(t("action.title"))
    st.caption(t("action.help"))

    items = project.setdefault("action_plan", [])
    for it in items:
        if not it.get("id"):
            it["id"] = new_id()

    edit_id = st.session_state.get("edit_action_id")
    if not edit_id:
        _action_form(project, None)

    if items:
        st.markdown(f"**{t('action.list_title')}** ({len(items)})")
        for it in items:
            if edit_id == it["id"]:
                _action_form(project, it)
            else:
                _action_card(project, it)
    else:
        st.info(t("action.empty"))

    if items:
        st.markdown(f"**{t('action.preview')}**")
        prev = pd.DataFrame(
            [{t(f"action.{k}"): _s(it.get(k)) for k in _ACTION_FIELDS} for it in items]
        )
        st.dataframe(prev, hide_index=True, width="stretch")

    st.divider()
    st.download_button(
        t("action.export"),
        data=excel_action.build_bytes(project),
        file_name="SMED_plano_5W2H.xlsx",
        mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        width="stretch",
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
    if IS_BROWSER:
        if get_lang() == "en":
            st.markdown(
                """
This application runs **entirely in your browser** (via stlite / WebAssembly). There is
**no server**.

- **Local processing:** everything you type is processed **on your own device**. **No data is
  sent to any server** — there is no backend, database, or storage. Closing the tab discards it.
- **Your control:** you can export/download all your data at any time and clear it with
  *New / clear*.
- **No tracking:** the app does not create accounts or profiles of individuals.

For LGPD purposes, because no personal data leaves your device, the exposure is minimal. Even
so, the responsible organization should minimize personal data (names, IDs, e-mails) entered
into the 5W2H plan.
"""
            )
        else:
            st.markdown(
                """
Este aplicativo roda **inteiramente no seu navegador** (via stlite / WebAssembly). **Não há
servidor**.

- **Processamento local:** tudo o que você digita é processado **no seu próprio dispositivo**.
  **Nenhum dado é enviado a servidores** — não há backend, banco de dados ou armazenamento. Ao
  fechar a aba, tudo é descartado.
- **Seu controle:** você pode exportar/baixar todos os seus dados a qualquer momento e limpar
  em *Novo / limpar*.
- **Sem rastreamento:** o aplicativo não cria contas nem perfis de pessoas.

Para fins de LGPD, como nenhum dado pessoal sai do seu dispositivo, a exposição é mínima. Ainda
assim, a organização responsável deve minimizar dados pessoais (nomes, matrículas, e-mails)
inseridos no plano 5W2H.
"""
            )
        return
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
# About / branding (compact, rendered in the sidebar)
# --------------------------------------------------------------------------- #
def _img(path: str):
    return path if os.path.exists(path) else None


def about_sidebar() -> None:
    """Render developer/branding info compactly inside the sidebar."""
    with st.expander(t("about.title")):
        photo = _img(os.path.join(ASSETS, "leonardo.jpg"))
        if photo:
            st.image(photo, width=120)
        st.markdown(f"**{t('about.dev')}**")
        st.caption(t("about.role"))
        st.caption(t("about.context"))
        st.markdown(f"**{t('about.partners')}**")
        lp1, lp2 = st.columns(2)
        sodexo = _img(os.path.join(ASSETS, "logo sodexo.png"))
        vale = _img(os.path.join(ASSETS, "Logo vale.png"))
        if sodexo:
            lp1.image(sodexo, width=90)
        if vale:
            lp2.image(vale, width=90)
