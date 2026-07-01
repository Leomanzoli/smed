import { useTranslation } from 'react-i18next';

const SECTIONS = {
  pt: [
    {
      h: 'Processamento 100% local',
      p: [
        'O SMED Up é um aplicativo de acesso livre que funciona inteiramente no seu dispositivo. Todos os dados inseridos são gravados apenas no armazenamento local do navegador (IndexedDB) e nunca são enviados para servidores.',
        'O desenvolvedor não coleta, não recebe, não acessa e não compartilha nenhuma informação inserida por você.',
      ],
    },
    {
      h: 'Dados tratados',
      p: [
        'O app pode conter dados pessoais informados por você: nomes dos aplicadores, matrícula e e-mail (no plano de ação 5W2H). Recomenda-se coletar apenas o estritamente necessário.',
      ],
    },
    {
      h: 'Finalidade e base legal',
      p: [
        'Os dados são utilizados exclusivamente para a aplicação da metodologia SMED na sua organização (análise de tempos, melhoria de processos e plano de ação). O tratamento deve observar uma base legal adequada da LGPD (Lei nº 13.709/2018), como o legítimo interesse do empregador ou o cumprimento de obrigações, definida pela sua organização.',
      ],
    },
    {
      h: 'Armazenamento e segurança',
      p: [
        'Os dados permanecem no dispositivo onde foram inseridos. Recomenda-se proteger o dispositivo com senha/biometria e manter o sistema atualizado. Arquivos exportados (Excel e .json) ficam sob sua responsabilidade — guarde-os em local seguro.',
      ],
    },
    {
      h: 'Compartilhamento',
      p: ['Não há compartilhamento automático com terceiros. Qualquer compartilhamento ocorre apenas quando você exporta e envia um arquivo manualmente.'],
    },
    {
      h: 'Direitos do titular',
      p: [
        'Você pode, a qualquer momento e dentro do próprio app: acessar e corrigir os dados (telas de coleta e análise), exportar os dados (portabilidade, via “Exportar tudo”) e excluí-los (por projeto ou “Excluir todos os dados”).',
      ],
    },
    {
      h: 'Retenção e exclusão',
      p: ['A retenção é controlada por você. Ao usar “Excluir dados”, as informações são removidas do dispositivo de forma definitiva.'],
    },
    {
      h: 'Cookies e rastreamento',
      p: ['O SMED Up não utiliza cookies de rastreamento nem ferramentas de analytics de terceiros. Um consentimento informado é exibido no primeiro uso.'],
    },
    {
      h: 'Responsabilidades',
      p: ['Como os dados ficam sob seu controle, a organização/usuário que os insere atua como controladora dos dados perante a LGPD. O desenvolvedor fornece a ferramenta sem tratar os dados.'],
    },
  ],
  en: [
    {
      h: '100% local processing',
      p: [
        'SMED Up is a free-access application that runs entirely on your device. All entered data is stored only in the browser’s local storage (IndexedDB) and is never sent to servers.',
        'The developer does not collect, receive, access or share any information you enter.',
      ],
    },
    {
      h: 'Data handled',
      p: ['The app may contain personal data you provide: analysts’ names, ID number and e-mail (in the 5W2H action plan). Collect only what is strictly necessary.'],
    },
    {
      h: 'Purpose and legal basis',
      p: [
        'Data is used exclusively to apply the SMED methodology in your organization (time analysis, process improvement and action plan). Processing must rely on an appropriate LGPD (Law 13.709/2018) legal basis, such as the employer’s legitimate interest or compliance with obligations, as defined by your organization.',
      ],
    },
    {
      h: 'Storage and security',
      p: [
        'Data remains on the device where it was entered. Protect the device with a password/biometrics and keep the system updated. Exported files (Excel and .json) are your responsibility — keep them in a safe place.',
      ],
    },
    {
      h: 'Sharing',
      p: ['There is no automatic sharing with third parties. Any sharing happens only when you manually export and send a file.'],
    },
    {
      h: 'Data subject rights',
      p: [
        'At any time, within the app, you can: access and rectify data (collection and analysis screens), export data (portability, via “Export all”) and delete it (per project or “Delete all data”).',
      ],
    },
    {
      h: 'Retention and deletion',
      p: ['Retention is controlled by you. Using “Delete data” permanently removes the information from the device.'],
    },
    {
      h: 'Cookies and tracking',
      p: ['SMED Up uses no tracking cookies and no third-party analytics. Informed consent is shown on first use.'],
    },
    {
      h: 'Responsibilities',
      p: ['Because data stays under your control, the organization/user entering it acts as the data controller under the LGPD. The developer provides the tool without processing the data.'],
    },
  ],
} as const;

export function PrivacyPage() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage ?? 'pt').startsWith('en') ? 'en' : 'pt';

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('privacy.title')}</h1>
        <span className="chip mt-2 bg-brand/10 text-brand">🔒 {t('privacy.updated')}</span>
      </div>
      {SECTIONS[lang].map((s, i) => (
        <section key={i} className="card p-5">
          <h2 className="font-semibold text-slate-900">{s.h}</h2>
          {s.p.map((para, j) => (
            <p key={j} className="mt-2 text-sm text-slate-600">
              {para}
            </p>
          ))}
        </section>
      ))}
    </div>
  );
}
