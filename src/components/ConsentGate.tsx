import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useSettings } from '../store/useSettings';

export function ConsentGate() {
  const { t } = useTranslation();
  const consent = useSettings((s) => s.consent);
  const accept = useSettings((s) => s.acceptConsent);
  if (consent) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 p-3 sm:p-4">
      <div className="card mx-auto max-w-3xl border-brand/30 p-4 shadow-lg">
        <h3 className="font-semibold text-slate-900">{t('consent.title')}</h3>
        <p className="mt-1 text-sm text-slate-600">{t('consent.body')}</p>
        <p className="mt-1 text-sm text-slate-600">{t('consent.personalData')}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button className="btn-primary" onClick={accept}>
            {t('consent.accept')}
          </button>
          <Link className="btn-ghost" to="/privacidade">
            {t('consent.readMore')}
          </Link>
        </div>
      </div>
    </div>
  );
}
