"""SMED Up — Streamlit app entry point (deployable to streamlit.app)."""
from __future__ import annotations

import hashlib
import os
import sys

import streamlit as st

from smed import project_io, views
from smed.i18n import get_lang, set_lang, t
from smed.state import ensure_project, get_project, reset_project

# True when running client-side in the browser (stlite / Pyodide / WebAssembly).
IS_BROWSER = sys.platform == "emscripten"

st.set_page_config(page_title="SMED Up", page_icon="⏱️", layout="wide")

# --------------------------------------------------------------------------- #
# Responsive polish (professional mobile + desktop)
# --------------------------------------------------------------------------- #
st.markdown(
    """
    <style>
      /* Center content with a comfortable, adaptive width (grows with the screen,
         capped on very large monitors, full width on phones) */
      .block-container {
        max-width: min(1200px, 92vw);
        padding-top: 2.2rem;
        padding-bottom: 4rem;
      }
      /* Card look for bordered containers (task/analysis/action cards, add forms) */
      div[data-testid="stVerticalBlockBorderWrapper"] {
        border-radius: 12px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
      }
      /* Touch-friendly, consistent buttons */
      .stButton > button,
      .stDownloadButton > button,
      .stFormSubmitButton > button {
        min-height: 2.7rem;
        border-radius: 8px;
        font-weight: 600;
      }
      /* On phones: full width + let column rows wrap so nothing gets cramped */
      @media (max-width: 640px) {
        .block-container { max-width: 100%; padding: 1.4rem 1rem 3rem; }
        div[data-testid="stHorizontalBlock"] { flex-wrap: wrap; gap: 0.5rem; }
        div[data-testid="stHorizontalBlock"] > div[data-testid="stColumn"] {
          flex: 1 1 100% !important;
          min-width: 100% !important;
        }
      }
      /* SSMA-style date/time inputs */
      [data-testid="stDateInput"] label p,
      [data-testid="stTimeInput"] label p {
        font-weight: 600 !important;
        color: #374151 !important;
      }
      [data-testid="stDateInput"] input,
      [data-testid="stTimeInput"] input {
        border-radius: 8px !important;
        border: 1px solid #d1d5db !important;
        min-height: 2.6rem !important;
        font-variant-numeric: tabular-nums !important;
      }
      [data-testid="stDateInput"] input:focus,
      [data-testid="stTimeInput"] input:focus {
        border-color: #374151 !important;
        box-shadow: 0 0 0 2px rgba(55, 65, 81, 0.15) !important;
      }
      [data-testid="stDateInput"] [data-testid="stIconMaterial"] svg,
      [data-testid="stTimeInput"] [data-testid="stIconMaterial"] svg {
        color: #374151 !important;
      }
      /* Centered logo on consent screen */
      .smed-logo-center { display: flex; justify-content: center; margin-bottom: 1rem; }
      .smed-logo-center img { max-width: 200px; width: 100%; height: auto; }
      /* Sidebar logo */
      .smed-sidebar-logo { margin-bottom: 0.6rem; max-width: 200px; }
      .smed-sidebar-logo img { width: 100%; height: auto; }
    </style>
    """,
    unsafe_allow_html=True,
)

# Session bootstrap
if "lang" not in st.session_state:
    set_lang("pt")
ensure_project()

# --------------------------------------------------------------------------- #
# Sidebar: language, project, backup
# --------------------------------------------------------------------------- #
with st.sidebar:
    logo_path = os.path.join("assets", "Logo SMED.png")
    if os.path.exists(logo_path):
        import base64
        logo_b64 = base64.b64encode(open(logo_path, "rb").read()).decode()
        st.markdown(
            f'<div class="smed-sidebar-logo"><img src="data:image/png;base64,{logo_b64}" '
            f'alt="Fábrica de SMED" /></div>',
            unsafe_allow_html=True,
        )
    st.markdown("### ⏱️ SMED Up")
    lang = st.radio(
        t("common.language"),
        options=["pt", "en"],
        index=0 if get_lang() == "pt" else 1,
        format_func=lambda x: "Português" if x == "pt" else "English",
        horizontal=True,
    )
    set_lang(lang)

    st.divider()
    project = get_project()
    project["name"] = st.text_input(t("side.project_name"), value=project.get("name", ""))

    st.markdown(f"**{t('side.backup')}**")
    st.download_button(
        t("side.export_json"),
        data=project_io.to_json_bytes(project),
        file_name="SMED_backup.json",
        mime="application/json",
        width="stretch",
    )
    up = st.file_uploader(t("side.import_json"), type=["json"], key="json_up")
    if up is not None:
        data = up.getvalue()
        sig = hashlib.md5(data).hexdigest()
        if st.session_state.get("json_up_sig") != sig:
            imported, err = project_io.from_json_bytes(data)
            if err:
                st.error(err)
            else:
                st.session_state["project"] = imported
                st.session_state["json_up_sig"] = sig
                st.success(t("side.import_ok"))
                st.rerun()

    st.divider()
    if st.button(t("side.new"), width="stretch"):
        st.session_state["confirm_new"] = True
    if st.session_state.get("confirm_new"):
        if st.button(f"⚠️ {t('side.new_confirm')}", type="primary", width="stretch"):
            reset_project()
            for _k in ("confirm_new", "field_up_sig", "json_up_sig", "edit_task_id", "edit_action_id"):
                st.session_state.pop(_k, None)
            st.rerun()

    st.divider()
    views.about_sidebar()

# --------------------------------------------------------------------------- #
# Consent gate (LGPD)
# --------------------------------------------------------------------------- #
if not st.session_state.get("consent"):
    logo_path = os.path.join("assets", "Logo SMED.png")
    if os.path.exists(logo_path):
        import base64
        logo_b64 = base64.b64encode(open(logo_path, "rb").read()).decode()
        st.markdown(
            f'<div class="smed-logo-center"><img src="data:image/png;base64,{logo_b64}" '
            f'alt="Fábrica de SMED" /></div>',
            unsafe_allow_html=True,
        )
    st.title("⏱️ " + t("app.title"))
    st.subheader(t("consent.title"))
    st.info(t("consent.body_browser") if IS_BROWSER else t("consent.body"))
    if st.button(t("consent.accept"), type="primary"):
        st.session_state["consent"] = True
        st.rerun()
    st.stop()

# --------------------------------------------------------------------------- #
# Navigation
# --------------------------------------------------------------------------- #
pages = [
    st.Page(views.home, title=t("nav.home"), icon="🏠", default=True, url_path="inicio"),
    st.Page(views.collect, title=t("nav.collect"), icon="📝", url_path="coleta"),
    st.Page(views.analyze, title=t("nav.analyze"), icon="📊", url_path="analise"),
    st.Page(views.action_plan, title=t("nav.action"), icon="✅", url_path="plano"),
    st.Page(views.help_page, title=t("nav.help"), icon="❓", url_path="ajuda"),
    st.Page(views.privacy, title=t("nav.privacy"), icon="🔒", url_path="privacidade"),
]
st.navigation(pages).run()

st.caption(f"{t('footer.made_by')} Leonardo Manzoli Stoco · SMED Up · build 2026-07-01-e")
