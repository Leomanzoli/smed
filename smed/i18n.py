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
    "common.cancel": {"pt": "Cancelar", "en": "Cancel"},
    "common.minutes": {"pt": "min", "en": "min"},
    "common.none": {"pt": "—", "en": "—"},
    "common.initial": {"pt": "Inicial", "en": "Initial"},
    "common.final": {"pt": "Final", "en": "Final"},

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
    "consent.body_browser": {
        "pt": (
            "Este aplicativo roda **inteiramente no seu navegador** — não há servidor e "
            "**nenhum dado é enviado** para fora do seu dispositivo. Os dados existem apenas "
            "nesta aba e são descartados ao fechá-la. Baixe seus arquivos para guardar as "
            "informações."
        ),
        "en": (
            "This app runs **entirely in your browser** — there is no server and **no data is "
            "sent** off your device. Data exists only in this tab and is discarded when you "
            "close it. Download your files to keep the information."
        ),
    },

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
        "pt": "Preencha os campos e toque em Adicionar. Cada tarefa vira um cartão que você pode editar ou excluir. O tempo é calculado automaticamente.",
        "en": "Fill in the fields and tap Add. Each task becomes a card you can edit or delete. Time is computed automatically.",
    },
    "tasks.add_title": {"pt": "Adicionar tarefa", "en": "Add task"},
    "tasks.list_title": {"pt": "Tarefas cadastradas", "en": "Registered tasks"},
    "tasks.edit": {"pt": "Editar", "en": "Edit"},
    "tasks.delete": {"pt": "Excluir", "en": "Delete"},
    "tasks.no_name": {"pt": "(sem nome)", "en": "(no name)"},
    "tasks.need_name": {
        "pt": "Informe ao menos a Tarefa ou a Descrição.",
        "en": "Provide at least the Task or the Description.",
    },
    "tasks.tarefa": {"pt": "Tarefa", "en": "Task"},
    "tasks.ie": {"pt": "Análise inicial: Interna ou Externa?", "en": "Initial analysis: Internal or External?"},
    "tasks.ie_help": {
        "pt": "Classificação inicial da tarefa no campo. Serve de ponto de partida na Análise e pode ser alterada lá.",
        "en": "Initial classification in the field. It seeds the Analysis and can be changed there.",
    },
    "tasks.task": {"pt": "Nº (Task)", "en": "No. (Task)"},
    "tasks.descricao": {"pt": "Descrição", "en": "Description"},
    "tasks.inicio": {"pt": "Início", "en": "Start"},
    "tasks.fim": {"pt": "Fim", "en": "End"},
    "tasks.tempo": {"pt": "Tempo", "en": "Time"},
    "tasks.empty": {"pt": "Nenhuma tarefa ainda. Adicione acima.", "en": "No tasks yet. Add above."},
    "tasks.export_field": {"pt": "Exportar Excel de campo", "en": "Export field Excel"},
    "tasks.import_field": {"pt": "Importar Excel de campo", "en": "Import field Excel"},
    "tasks.import_ok": {"pt": "Excel de campo importado.", "en": "Field Excel imported."},

    # ---- analyze ----
    "analyze.title": {"pt": "Análise SMED", "en": "SMED Analysis"},
    "analyze.help": {
        "pt": "Para cada tarefa: classifique Interna/Externa, marque ECRS, estime o ganho (min) e descreva o Kaizen.",
        "en": "For each task: classify Internal/External, mark ECRS, estimate the gain (min) and describe the Kaizen.",
    },
    "analyze.ie": {"pt": "I x E (final)", "en": "I x E (final)"},
    "analyze.ie_inicial": {"pt": "I x E inicial", "en": "Initial I x E"},
    "analyze.interna": {"pt": "Interna", "en": "Internal"},
    "analyze.externa": {"pt": "Externa", "en": "External"},
    "analyze.ganho": {"pt": "Ganho estimado (min)", "en": "Estimated gain (min)"},
    "analyze.tempo_final": {"pt": "Tempo final", "en": "Final time"},
    "analyze.computed": {"pt": "Valores calculados", "en": "Computed values"},
    "analyze.kaizen": {"pt": "Kaizen — Qual?", "en": "Kaizen — Which?"},
    "analyze.o_que_e": {"pt": "O que é?", "en": "What is it?"},
    "analyze.no_tasks": {"pt": "Cadastre tarefas na página de Coleta primeiro.", "en": "Register tasks on the Collect page first."},
    "analyze.totals": {"pt": "Totais", "en": "Totals"},
    "analyze.total_time": {"pt": "Tempo total", "en": "Total time"},
    "analyze.total_final": {"pt": "Tempo final total", "en": "Total final time"},
    "analyze.reduction": {"pt": "Redução", "en": "Reduction"},
    "analyze.export_smed": {"pt": "Exportar formulário SMED (Excel)", "en": "Export SMED form (Excel)"},
    "analyze.ie_toggle": {"pt": "Externa? (desligado = Interna)", "en": "External? (off = Internal)"},
    "analyze.ecrs": {"pt": "ECRS (escolha uma)", "en": "ECRS (choose one)"},
    "analyze.total_gain": {"pt": "Ganho total", "en": "Total gain"},
    "analyze.ie_split": {"pt": "Interno × Externo (tempo)", "en": "Internal × External (time)"},
    "analyze.internal": {"pt": "Interno", "en": "Internal"},
    "analyze.external": {"pt": "Externo", "en": "External"},
    "analyze.tempo_i": {"pt": "Tempo interno", "en": "Internal time"},
    "analyze.tempo_e": {"pt": "Tempo externo", "en": "External time"},
    "analyze.converted": {"pt": "Convertido Interno→Externo", "en": "Converted Internal→External"},
    "analyze.converted_help": {
        "pt": "Percentual de tarefas internas iniciais que passaram a externas.",
        "en": "Share of initially internal tasks that became external.",
    },
    "analyze.converted_ei": {"pt": "Convertido Externo→Interno", "en": "Converted External→Internal"},
    "analyze.converted_ei_help": {
        "pt": "Percentual de tarefas externas iniciais que passaram a internas.",
        "en": "Share of initially external tasks that became internal.",
    },
    "analyze.changed": {"pt": "Tarefas alteradas", "en": "Changed tasks"},
    "analyze.preview": {"pt": "Prévia do formulário SMED", "en": "SMED form preview"},
    "analyze.preview_help": {
        "pt": "Visualização (somente leitura) dos dados que serão gerados no Excel.",
        "en": "Read-only preview of the data that will be generated in Excel.",
    },
    "ecrs.e": {"pt": "Eliminar (E)", "en": "Eliminate (E)"},
    "ecrs.c": {"pt": "Combinar (C)", "en": "Combine (C)"},
    "ecrs.r": {"pt": "Reduzir (R)", "en": "Reduce (R)"},
    "ecrs.s": {"pt": "Simplificar (S)", "en": "Simplify (S)"},
    "ecrs.none": {"pt": "Nenhum", "en": "None"},

    # ---- action plan ----
    "action.title": {"pt": "Plano de ação 5W2H", "en": "5W2H Action plan"},
    "action.help": {"pt": "Adicione uma ação por vez. Exporte o plano em Excel.", "en": "Add one action at a time. Export the plan to Excel."},
    "action.add_title": {"pt": "Adicionar ação", "en": "Add action"},
    "action.list_title": {"pt": "Ações", "en": "Actions"},
    "action.empty": {"pt": "Nenhuma ação ainda.", "en": "No actions yet."},
    "action.need": {"pt": "Preencha ao menos 'O quê?'.", "en": "Fill at least 'What?'."},
    "action.no_o_que": {"pt": "(sem descrição)", "en": "(no description)"},
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
    "action.preview": {"pt": "Prévia do plano (somente leitura)", "en": "Plan preview (read-only)"},

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
