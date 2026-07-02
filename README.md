# SMED Up

Aplicativo online (Streamlit) para aplicação da metodologia **SMED — Single Minute Exchange of Die**.
Coleta dados em campo, faz a análise (Interna/Externa, ECRS, ganhos) e gera:

- **Formulário SMED** em Excel, no mesmo layout do modelo padrão;
- **Excel de coleta** de campo (exportar/importar);
- **Plano de ação 5W2H** em Excel;
- **Backup completo** em JSON para continuar em outra máquina.

Bilíngue (PT/EN). Interface responsiva para celular e desktop.

## Rodar localmente

```powershell
python -m pip install -r requirements.txt
streamlit run streamlit_app.py
```

Abra o endereço mostrado (ex.: http://localhost:8501).

## Publicar no streamlit.app (Streamlit Community Cloud)

1. Garanta que o repositório contém `streamlit_app.py` e `requirements.txt` na raiz.
2. Acesse https://share.streamlit.io e conecte sua conta do GitHub.
3. Clique em **New app** e selecione:
   - **Repository:** este repositório (pode ser **privado** — mantém o código fechado);
   - **Branch:** `main`;
   - **Main file path:** `streamlit_app.py`;
   - **Python version:** 3.12 (nas configurações avançadas).
4. Clique em **Deploy**. O app fica disponível em uma URL `*.streamlit.app`.

> O código Python roda no servidor da Streamlit e não é enviado ao navegador.

## Privacidade (LGPD)

O app roda em servidor. Os dados digitados ficam apenas na **sessão** (memória do servidor),
não são armazenados em banco de dados/disco e são descartados ao encerrar a sessão. Baixe os
arquivos (Excel/JSON) para guardar as informações. Evite inserir dados pessoais sensíveis.

## Estrutura

```
streamlit_app.py          # ponto de entrada + navegação + barra lateral
smed/
  compute.py              # cálculos de tempo e SMED
  state.py                # modelo do projeto em session_state
  i18n.py                 # textos PT/EN
  project_io.py           # backup JSON (exportar/importar)
  excel_smed.py           # formulário SMED (Excel)
  excel_field.py          # coleta de campo (Excel) + importação
  excel_action.py         # plano 5W2H (Excel)
  views.py                # páginas (Início, Coleta, Análise, 5W2H, Ajuda, Privacidade, Sobre)
.streamlit/config.toml    # tema
assets/                   # modelo de referência, foto e logos
```

## Desenvolvedor

**Leonardo Manzoli Stoco** — Especialista em Tecnologias para SSMA
Limpeza Industrial do Porto de Tubarão. Parceiros: Sodexo, Vale.
