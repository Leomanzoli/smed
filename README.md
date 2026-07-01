# SMED Up

Aplicativo web (PWA) de **acesso livre** e **código fechado** para aplicar a metodologia **SMED** (Single Minute Exchange of Die): coleta de campo no celular e análise completa no desktop, gerando o formulário SMED em Excel idêntico ao modelo oficial e o plano de ação 5W2H.

- **100% local**: os dados ficam apenas no dispositivo (IndexedDB). Nenhum servidor, nenhum cadastro.
- **Offline**: instalável como PWA e utilizável sem internet após o primeiro acesso.
- **Bilíngue**: Português (Brasil) e Inglês.

## Stack

React + TypeScript + Vite · Tailwind CSS · React Router · Zustand · Dexie (IndexedDB) · react-i18next · ExcelJS (carregado sob demanda) · vite-plugin-pwa (Workbox).

## Requisitos

- Node.js 20+ (desenvolvido com Node 24) e npm.

## Instalação e execução

```bash
npm install        # instala dependências
npm run dev        # servidor de desenvolvimento (http://localhost:5173)
npm run build      # verificação de tipos + build de produção (dist/)
npm run preview    # serve o build de produção localmente
npm run verify     # gera planilhas de teste e valida a exportação/importação (Node)
```

## Estrutura

```
assets/                 imagens e o modelo oficial (Formulário de Aplicação do SMED.xlsx)
public/                 favicon, ícones do PWA, imagens de marca, _redirects (SPA)
scripts/verify-excel.ts teste em Node da geração/leitura de Excel
src/
  components/           layout, cabeçalho, rodapé (marca), modal, campos
  db/                   Dexie (armazenamento local)
  hooks/                carregamento e autosave de projeto
  i18n/                 traduções pt/en
  lib/                  tempo, cálculos SMED, download, IO de projeto (JSON)
  lib/excel/            geração do Formulário SMED, coleta e 5W2H; leitura da coleta
  pages/                Início, Projetos, Coleta, Análise, Plano de Ação, Ajuda, Privacidade, Sobre
```

## Fluxo de uso

1. **Projetos** → criar um projeto.
2. **Coleta de Campo** → Passo 1 (informações básicas) e Passo 2 (tarefas com “+”). Exportar o **Excel de coleta** (opcional).
3. **Análise** → importar o Excel de coleta (ou continuar com as tarefas do projeto), preencher Reanálise I×E, ECRS, Final Tempo I/E, Ganho estimado, Kaizen. Exportar o **Formulário SMED (.xlsx)** idêntico ao modelo.
4. **Plano de Ação (5W2H)** → cadastrar ações e exportar.
5. **Backup / outra máquina** → em Projetos, “Exportar tudo” (.json) e “Importar projeto”.

O passo a passo completo e a política de LGPD também estão dentro do app (menus **Como usar** e **Privacidade**).

## Exportações

- **Excel de coleta** — base de dados da coleta de campo (ponte para a análise).
- **Formulário SMED (.xlsx)** — reproduz o modelo oficial: títulos, cabeçalhos, fórmulas (`=F-E`, `=IF(H="X",G,0)`, `=G-P`, `SUBTOTAL`/`SUM`, `1-(Q/G)`), mesclagens, validações e formatação.
- **Plano de Ação 5W2H (.xlsx)**.
- **Backup (.json)** — projeto único ou todos os projetos, para continuar em outra máquina.

## Privacidade (LGPD)

Processamento 100% local; o desenvolvedor não coleta, acessa ou compartilha dados. O usuário/organização é o controlador dos dados. Direitos de acesso, correção, portabilidade (exportar) e exclusão são atendidos dentro do app. Sem cookies de rastreamento ou analytics de terceiros. Consentimento exibido no primeiro uso.

## Deploy

Build totalmente estático (`dist/`). Recomendado: **Cloudflare Pages**, **Netlify** ou **Vercel** (gratuitos, aceitam repositório privado e HTTPS).

- O arquivo `public/_redirects` já configura o fallback de SPA (`/* /index.html 200`) para Cloudflare Pages e Netlify.
- **Código fechado**: mantenha o repositório **privado**. Observação: por ser um app 100% no cliente, o JavaScript entregue ao navegador é sempre inspecionável — o sigilo se dá pelo repositório privado e pelo bundle minificado, não por ocultação do código no navegador.

## Desenvolvedor

**Leonardo Manzoli Stoco** — Especialista em Tecnologias para SSMA — Limpeza Industrial do Porto de Tubarão.
Empresas parceiras: **Sodexo** e **Vale**.
