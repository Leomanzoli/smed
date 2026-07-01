import { useTranslation } from 'react-i18next';

const CONTENT = {
  pt: {
    steps: [
      'Abra o SMED Up no navegador. Opcionalmente, instale na tela inicial (menu do navegador → “Instalar app”) para usar offline no campo.',
      'Escolha o idioma (PT/EN) no topo da tela.',
      'Em “Projetos”, crie um novo projeto e dê um nome (ex.: “Troca de ferramenta — Linha 3”).',
      'Coleta de Campo — Passo 1: preencha as Informações básicas. Campos com “*” são obrigatórios (Atividade, Aplicadores, Data, Área, Gerência, Supervisão).',
      'Coleta de Campo — Passo 2: toque em “+ Nova tarefa” e registre Tarefa, Descrição, Início, Fim e Análise I×E (Interna ou Externa). Toque em “+” novamente para a próxima tarefa, até concluir.',
      'Exporte o “Excel de coleta” para levar os dados a outro dispositivo — ou continue no mesmo aparelho, indo direto para a Análise.',
      'Análise: se os dados vieram de outro dispositivo, use “Importar Excel de coleta”. Revise as colunas calculadas (Tempo, Tempo I, Tempo E).',
      'Preencha as colunas de análise: Reanálise I×E, Final Tempo I e E, ECRS (Eliminar/Combinar/Reduzir/Simplificar), Ganho estimado (já vem sugerido e é editável), além de Kaizen e “O que é?”. O Tempo final e a % de redução são calculados automaticamente.',
      'Exporte o “Formulário SMED (.xlsx)” — gerado exatamente no modelo oficial, com fórmulas, cabeçalhos e totais.',
      'Plano de Ação (5W2H): cadastre as ações (O quê, Por quê, Onde, Quando, Quem, Como, Quanto, Matrícula, E-mail) e exporte para Excel.',
      'Backup / outra máquina: em “Projetos”, use “Exportar tudo” para gerar um arquivo .json. Em outro computador, use “Importar projeto” para continuar de onde parou.',
      'Para apagar dados: exclua um projeto individual ou use “Excluir todos os dados” na Zona de risco.',
    ],
    lgpd: [
      'Processamento 100% local: seus dados ficam apenas neste dispositivo (armazenamento IndexedDB do navegador). Nada é enviado a servidores.',
      'O desenvolvedor não coleta, não acessa e não compartilha seus dados.',
      'Dados pessoais tratados: nomes de aplicadores, matrícula e e-mail (no plano de ação). Colete apenas o necessário e com finalidade legítima.',
      'Seus direitos (LGPD): acessar, corrigir, exportar (portabilidade) e excluir os dados a qualquer momento, dentro do próprio app.',
      'Retenção controlada por você: use “Excluir dados” para apagar tudo do dispositivo.',
      'Sem cookies de rastreamento e sem analytics de terceiros. Consentimento informado exibido no primeiro uso.',
    ],
  },
  en: {
    steps: [
      'Open SMED Up in your browser. Optionally install it to the home screen (browser menu → “Install app”) to use it offline in the field.',
      'Pick the language (PT/EN) at the top of the screen.',
      'In “Projects”, create a new project and give it a name (e.g. “Tool change — Line 3”).',
      'Field Collection — Step 1: fill in the Basic information. Fields marked “*” are required (Activity, Analysts, Date, Area, Management, Supervision).',
      'Field Collection — Step 2: tap “+ New task” and record Task name, Description, Start, End and I×E analysis (Internal or External). Tap “+” again for the next task, until done.',
      'Export the “Collection Excel” to move the data to another device — or keep going on the same device, straight to Analysis.',
      'Analysis: if the data came from another device, use “Import collection Excel”. Review the computed columns (Time, Time I, Time E).',
      'Fill in the analysis columns: Re-analysis I×E, Final Time I and E, ECRS (Eliminate/Combine/Reduce/Simplify), Estimated gain (pre-filled and editable), plus Kaizen and “What is it?”. Final time and reduction % are computed automatically.',
      'Export the “SMED form (.xlsx)” — generated exactly like the official template, with formulas, headers and totals.',
      'Action Plan (5W2H): add the actions (What, Why, Where, When, Who, How, How much, ID number, E-mail) and export to Excel.',
      'Backup / another machine: in “Projects”, use “Export all” to generate a .json file. On another computer, use “Import project” to resume where you left off.',
      'To erase data: delete an individual project or use “Delete all data” in the Danger zone.',
    ],
    lgpd: [
      '100% local processing: your data stays only on this device (browser IndexedDB storage). Nothing is sent to servers.',
      'The developer does not collect, access or share your data.',
      'Personal data handled: analysts’ names, ID number and e-mail (in the action plan). Collect only what is necessary and for a legitimate purpose.',
      'Your rights (LGPD): access, rectify, export (portability) and delete data at any time, within the app itself.',
      'Retention controlled by you: use “Delete data” to wipe everything from the device.',
      'No tracking cookies and no third-party analytics. Informed consent shown on first use.',
    ],
  },
} as const;

export function HelpPage() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage ?? 'pt').startsWith('en') ? 'en' : 'pt';
  const c = CONTENT[lang];

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">{t('help.title')}</h1>
        <p className="mt-1 text-slate-600">{t('help.intro')}</p>
      </div>

      <ol className="space-y-3">
        {c.steps.map((step, i) => (
          <li key={i} className="card flex gap-3 p-4">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand text-sm font-bold text-white">
              {i + 1}
            </span>
            <p className="text-sm text-slate-700">{step}</p>
          </li>
        ))}
      </ol>

      <section className="card border-brand/30 p-5">
        <h2 className="text-lg font-semibold text-brand">{t('help.lgpdTitle')}</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
          {c.lgpd.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
