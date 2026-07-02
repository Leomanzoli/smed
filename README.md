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

## Publicar no GitHub Pages (100% no navegador, via stlite)

Esta opção roda o app **inteiramente no navegador** do usuário (WebAssembly/[stlite](https://github.com/whitphx/stlite)),
sem servidor — **nenhum dado sai do dispositivo**. Ideal para LGPD e para hospedar no seu
próprio domínio `*.github.io`.

1. Os arquivos `index.html` e `.nojekyll` já estão na raiz do repositório.
2. No GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
3. Selecione **Branch: `main`** e **Folder: `/ (root)`**, e salve.
4. Aguarde o build; o app fica em `https://<usuário>.github.io/<repositório>/`
   (ex.: `https://leomanzoli.github.io/smed/`).

> A primeira carga baixa o runtime Python (uma vez, fica em cache). Depois roda offline no
> navegador. O mesmo código Python serve tanto ao Streamlit Cloud quanto ao stlite — o texto
> de privacidade se adapta automaticamente ao ambiente (`sys.platform == "emscripten"`).

## Privacidade (LGPD)

- **No GitHub Pages (stlite):** o app roda **inteiramente no seu navegador**. Não há servidor,
  backend ou banco de dados, e **nenhum dado é enviado** para fora do dispositivo. Ao fechar a
  aba, tudo é descartado. Baixe os arquivos (Excel/JSON) para guardar as informações.
- **No Streamlit Community Cloud:** o app roda em servidor; os dados ficam apenas na **sessão**
  (memória do servidor), não são armazenados e são descartados ao encerrar. Evite dados
  pessoais sensíveis.

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
  views.py                # páginas (Início, Coleta, Análise, 5W2H, Ajuda, Privacidade)
.streamlit/config.toml    # tema (Streamlit Cloud / local)
index.html                # entrada do stlite (GitHub Pages, roda no navegador)
.nojekyll                 # serve todos os arquivos no GitHub Pages (inclui .streamlit/ e smed/)
assets/                   # modelo de referência, foto e logos
```

## Desenvolvedor

**Leonardo Manzoli Stoco** — Especialista em Tecnologias para SSMA
Limpeza Industrial do Porto de Tubarão. Parceiros: Sodexo, Vale.
