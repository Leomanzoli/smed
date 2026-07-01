import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/branding/leonardo.jpg"
              alt="Leonardo Manzoli Stoco"
              className="h-12 w-12 rounded-full object-cover ring-2 ring-brand/20"
            />
            <div className="text-sm">
              <p className="font-semibold text-slate-900">Leonardo Manzoli Stoco</p>
              <p className="text-slate-500">{t('about.role')}</p>
              <p className="text-slate-500">{t('about.company')}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <img src="/branding/logo-sodexo.png" alt="Sodexo" className="h-7 object-contain" />
            <img src="/branding/logo-vale.png" alt="Vale" className="h-8 object-contain" />
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-slate-400">
          {t('footer.rights')} ·{' '}
          <Link to="/privacidade" className="underline hover:text-brand">
            {t('nav.privacy')}
          </Link>
        </p>
      </div>
    </footer>
  );
}
