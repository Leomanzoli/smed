"""SMED Up — Streamlit app entry point (deployable to streamlit.app)."""
from __future__ import annotations

import streamlit as st

from smed import project_io, views
from smed.i18n import get_lang, set_lang, t
from smed.state import ensure_project, get_project, reset_project

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
        imported, err = project_io.from_json_bytes(up.getvalue())
        if err:
            st.error(err)
        else:
            st.session_state["project"] = imported
            st.success(t("side.import_ok"))
            st.rerun()

    st.divider()
    if st.button(t("side.new"), width="stretch"):
        st.session_state["confirm_new"] = True
    if st.session_state.get("confirm_new"):
        if st.button(f"⚠️ {t('side.new_confirm')}", type="primary", width="stretch"):
            reset_project()
            st.session_state["confirm_new"] = False
            st.rerun()

    st.divider()
    views.about_sidebar()

# --------------------------------------------------------------------------- #
# Consent gate (LGPD)
# --------------------------------------------------------------------------- #
if not st.session_state.get("consent"):
    st.title("⏱️ " + t("app.title"))
    st.subheader(t("consent.title"))
    st.info(t("consent.body"))
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

st.caption(f"{t('footer.made_by')} Leonardo Manzoli Stoco · SMED Up · build 2026-07-01-c")
