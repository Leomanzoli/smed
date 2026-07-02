"""Bilingual strings (PT/EN) for the SMED Streamlit app."""
from __future__ import annotations

import streamlit as st

LANG_KEY = "lang"
DEFAULT_LANG = "pt"

STRINGS: dict[str, dict[str, str]] = {
    # ---- generic / nav ----
    "app.title": {"pt": "SMED Up", "en": "SMED Up"},
    "app.subtitle": {
        "pt": "Single Minute Exchange of Die — aplicação da metodologia SMED",
        "en": "Single Minute Exchange of Die — SMED methodology",
    },
    "nav.home": {"pt": "Início", "en": "Home"},
    "nav.collect": {"pt": "Coleta (campo)", "en": "Collect (field)"},
    "nav.analyze": {"pt": "Análise", "en": "Analysis"},
    "nav.action": {"pt": "Plano 5W2H", "en": "5W2H Plan"},
    "nav.help": {"pt": "Como usar", "en": "How to use"},
    "nav.privacy": {"pt": "Privacidade / LGPD", "en": "Privacy / LGPD"},
    "nav.about": {"pt": "Sobre", "en": "About"},
    "common.language": {"pt": "Idioma", "en": "Language"},
    "common.download": {"pt": "Baixar", "en": "Download"},
    "common.add": {"pt": "Adicionar", "en": "Add"},
    "common.save": {"pt": "Salvar", "en": "Save"},
    "common.minutes": {"pt": "min", "en": "min"},
    "common.none": {"pt": "—", "en": "—"},

    # ---- sidebar project ----
    "side.project": {"pt": "Projeto", "en": "Project"},
    "side.project_name": {"pt": "Nome do projeto", "en": "Project name"},
    "side.backup": {"pt": "Backup completo (JSON)", "en": "Full backup (JSON)"},
    "side.export_json": {"pt": "Exportar dados (JSON)", "en": "Export data (JSON)"},
    "side.import_json": {"pt": "Importar dados (JSON)", "en": "Import data (JSON)"},
    "side.import_ok": {"pt": "Dados importados com sucesso.", "en": "Data imported."},
    "side.new": {"pt": "Novo / limpar", "en": "New / clear"},
    "side.new_confirm": {"pt": "Confirmar limpeza dos dados", "en": "Confirm clearing data"},

    # ---- consent ----
    "consent.title": {"pt": "Aviso de privacidade (LGPD)", "en": "Privacy notice (LGPD)"},
    "consent.body": {
        "pt": (
            "Este aplicativo roda em servidor (Streamlit Community Cloud). Os dados que você "
            "digita são processados temporariamente na sua sessão e **não são armazenados** "
            "pelo aplicativo — ao fechar a aba, são descartados. Evite inserir dados pessoais "
            "sensíveis. Baixe seus arquivos para guardar as informações."
        ),
        "en": (
            "This app runs on a server (Streamlit Community Cloud). The data you type is "
            "processed transiently in your session and is **not stored** by the app — it is "
            "discarded when you close the tab. Avoid sensitive personal data. Download your "
            "files to keep the information."
        ),
    },
    "consent.accept": {"pt": "Li e concordo", "en": "I have read and agree"},

    # ---- home ----
    "home.lead": {
        "pt": "Aplique o SMED em duas etapas: colete os dados no campo e faça a análise para gerar o formulário e o plano de ação.",
        "en": "Apply SMED in two steps: collect data in the field and analyze it to generate the form and the action plan.",
    },
    "home.step1": {"pt": "1. Coleta (campo)", "en": "1. Collect (field)"},
    "home.step1_desc": {
        "pt": "Informações básicas + tarefas repetíveis (início/fim). Exporte o Excel de campo.",
        "en": "Basic info + repeatable tasks (start/end). Export the field Excel.",
    },
    "home.step2": {"pt": "2. Análise", "en": "2. Analysis"},
    "home.step2_desc": {
        "pt": "Classifique Interna/Externa, aplique ECRS, estime ganhos e gere o formulário SMED.",
        "en": "Classify Internal/External, apply ECRS, estimate gains and generate the SMED form.",
    },
    "home.step3": {"pt": "3. Plano 5W2H", "en": "3. 5W2H Plan"},
    "home.step3_desc": {
        "pt": "Registre as ações de melhoria e exporte o plano.",
        "en": "Register improvement actions and export the plan.",
    },

    # ---- basic info ----
    "basic.title": {"pt": "Passo 1 — Informações básicas", "en": "Step 1 — Basic info"},
    "basic.atividade": {"pt": "Atividade em análise", "en": "Activity under analysis"},
    "basic.aplicadores": {"pt": "Aplicadores (elaborador)", "en": "Applicators (author)"},
    "basic.data_analise": {"pt": "Data da análise", "en": "Analysis date"},
    "basic.area": {"pt": "Área", "en": "Area"},
    "basic.gerencia": {"pt": "Gerência", "en": "Management"},
    "basic.supervisao": {"pt": "Supervisão", "en": "Supervision"},
    "basic.revisao": {"pt": "Revisão", "en": "Revision"},
    "basic.data_revisao": {"pt": "Data da revisão", "en": "Revision date"},
    "basic.section_label": {"pt": "Rótulo do grupo (cabeçalho)", "en": "Group label (header)"},
    "basic.section_help": {
        "pt": "Aparece no cabeçalho D7:G7 do formulário. Se vazio, usa a Atividade.",
        "en": "Shown in header D7:G7 of the form. If empty, uses the Activity.",
    },

    # ---- tasks / collect ----
    "tasks.title": {"pt": "Passo 2 — Tarefas repetíveis", "en": "Step 2 — Repeatable tasks"},
    "tasks.help": {
        "pt": "Adicione uma linha por tarefa. Início/Fim no formato HH:MM. O tempo é calculado automaticamente.",
        "en": "Add one row per task. Start/End in HH:MM format. Time is computed automatically.",
    },
    "tasks.tarefa": {"pt": "Tarefa", "en": "Task"},
    "tasks.task": {"pt": "Nº (Task)", "en": "No. (Task)"},
    "tasks.descricao": {"pt": "Descrição", "en": "Description"},
    "tasks.inicio": {"pt": "Início (HH:MM)", "en": "Start (HH:MM)"},
    "tasks.fim": {"pt": "Fim (HH:MM)", "en": "End (HH:MM)"},
    "tasks.tempo": {"pt": "Tempo", "en": "Time"},
    "tasks.empty": {"pt": "Nenhuma tarefa ainda. Adicione linhas na tabela acima.", "en": "No tasks yet. Add rows in the table above."},
    "tasks.export_field": {"pt": "Exportar Excel de campo", "en": "Export field Excel"},
    "tasks.import_field": {"pt": "Importar Excel de campo", "en": "Import field Excel"},
    "tasks.import_ok": {"pt": "Excel de campo importado.", "en": "Field Excel imported."},

    # ---- analyze ----
    "analyze.title": {"pt": "Análise SMED", "en": "SMED Analysis"},
    "analyze.help": {
        "pt": "Para cada tarefa: classifique Interna/Externa, marque ECRS, estime o ganho (min) e descreva o Kaizen.",
        "en": "For each task: classify Internal/External, mark ECRS, estimate the gain (min) and describe the Kaizen.",
    },
    "analyze.ie": {"pt": "I x E", "en": "I x E"},
    "analyze.interna": {"pt": "Interna", "en": "Internal"},
    "analyze.externa": {"pt": "Externa", "en": "External"},
    "analyze.ganho": {"pt": "Ganho estimado (min)", "en": "Estimated gain (min)"},
    "analyze.tempo_final": {"pt": "Tempo final", "en": "Final time"},
    "analyze.kaizen": {"pt": "Kaizen — Qual?", "en": "Kaizen — Which?"},
    "analyze.o_que_e": {"pt": "O que é?", "en": "What is it?"},
    "analyze.no_tasks": {"pt": "Cadastre tarefas na página de Coleta primeiro.", "en": "Register tasks on the Collect page first."},
    "analyze.totals": {"pt": "Totais", "en": "Totals"},
    "analyze.total_time": {"pt": "Tempo total", "en": "Total time"},
    "analyze.total_final": {"pt": "Tempo final total", "en": "Total final time"},
    "analyze.reduction": {"pt": "Redução", "en": "Reduction"},
    "analyze.export_smed": {"pt": "Exportar formulário SMED (Excel)", "en": "Export SMED form (Excel)"},
    "ecrs.e": {"pt": "Eliminar (E)", "en": "Eliminate (E)"},
    "ecrs.c": {"pt": "Combinar (C)", "en": "Combine (C)"},
    "ecrs.r": {"pt": "Reduzir (R)", "en": "Reduce (R)"},
    "ecrs.s": {"pt": "Simplificar (S)", "en": "Simplify (S)"},

    # ---- action plan ----
    "action.title": {"pt": "Plano de ação 5W2H", "en": "5W2H Action plan"},
    "action.help": {"pt": "Uma linha por ação. Exporte o plano em Excel.", "en": "One row per action. Export the plan to Excel."},
    "action.o_que": {"pt": "O quê?", "en": "What?"},
    "action.por_que": {"pt": "Por quê?", "en": "Why?"},
    "action.onde": {"pt": "Onde?", "en": "Where?"},
    "action.quando": {"pt": "Quando?", "en": "When?"},
    "action.quem": {"pt": "Quem?", "en": "Who?"},
    "action.como": {"pt": "Como?", "en": "How?"},
    "action.quanto": {"pt": "Quanto?", "en": "How much?"},
    "action.matricula": {"pt": "Matrícula", "en": "ID"},
    "action.email": {"pt": "E-mail", "en": "E-mail"},
    "action.export": {"pt": "Exportar plano 5W2H (Excel)", "en": "Export 5W2H plan (Excel)"},

    # ---- help ----
    "help.title": {"pt": "Como usar", "en": "How to use"},

    # ---- privacy ----
    "privacy.title": {"pt": "Privacidade e LGPD", "en": "Privacy and LGPD"},

    # ---- about ----
    "about.title": {"pt": "Sobre o desenvolvedor", "en": "About the developer"},
    "about.dev": {"pt": "Leonardo Manzoli Stoco", "en": "Leonardo Manzoli Stoco"},
    "about.role": {"pt": "Especialista em Tecnologias para SSMA", "en": "Specialist in HSE Technologies"},
    "about.context": {
        "pt": "Limpeza Industrial do Porto de Tubarão",
        "en": "Industrial Cleaning at the Port of Tubarão",
    },
    "about.partners": {"pt": "Parceiros", "en": "Partners"},

    # ---- footer ----
    "footer.made_by": {"pt": "Desenvolvido por", "en": "Developed by"},
}


def set_lang(lang: str) -> None:
    st.session_state[LANG_KEY] = lang if lang in ("pt", "en") else DEFAULT_LANG


def get_lang() -> str:
    return st.session_state.get(LANG_KEY, DEFAULT_LANG)


def t(key: str) -> str:
    entry = STRINGS.get(key)
    if not entry:
        return key
    return entry.get(get_lang(), entry.get(DEFAULT_LANG, key))
