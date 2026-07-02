"""SMED Up — Streamlit app entry point (deployable to streamlit.app)."""
from __future__ import annotations

import streamlit as st

from smed import project_io, views
from smed.i18n import get_lang, set_lang, t
from smed.state import ensure_project, get_project, reset_project

st.set_page_config(page_title="SMED Up", page_icon="⏱️", layout="wide")

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
        use_container_width=True,
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
    if st.button(t("side.new"), use_container_width=True):
        st.session_state["confirm_new"] = True
    if st.session_state.get("confirm_new"):
        if st.button(f"⚠️ {t('side.new_confirm')}", type="primary", use_container_width=True):
            reset_project()
            st.session_state["confirm_new"] = False
            st.rerun()

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
    st.Page(views.about, title=t("nav.about"), icon="👤", url_path="sobre"),
]
st.navigation(pages).run()

st.caption(f"{t('footer.made_by')} Leonardo Manzoli Stoco · SMED Up")
