import { useTranslation } from 'react-i18next';

const APP_VERSION = '1.0.0';

export function AboutPage() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">{t('about.title')}</h1>

      <section className="card overflow-hidden">
        <div className="bg-gradient-to-br from-brand to-brand-dark p-6 text-white">
          <div className="flex items-center gap-4">
            <img
              src="/branding/leonardo.jpg"
              alt="Leonardo Manzoli Stoco"
              className="h-20 w-20 rounded-full object-cover ring-4 ring-white/30"
            />
            <div>
              <p className="text-xs uppercase tracking-wide text-white/70">{t('about.developer')}</p>
              <h2 className="text-xl font-bold">Leonardo Manzoli Stoco</h2>
              <p className="text-sm text-white/90">{t('about.role')}</p>
              <p className="text-sm text-white/90">{t('about.company')}</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <p className="text-sm text-slate-600">{t('about.appDesc')}</p>
          <p className="mt-3 text-xs text-slate-400">
            {t('about.version')} {APP_VERSION}
          </p>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{t('about.partners')}</h2>
        <div className="mt-4 flex flex-wrap items-center gap-8">
          <img src="/branding/logo-sodexo.png" alt="Sodexo" className="h-10 object-contain" />
          <img src="/branding/logo-vale.png" alt="Vale" className="h-12 object-contain" />
        </div>
      </section>
    </div>
  );
}
