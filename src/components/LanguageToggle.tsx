import { useTranslation } from 'react-i18next';

const LANGS = ['pt', 'en'] as const;

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage ?? 'pt').slice(0, 2);
  return (
    <div className="inline-flex overflow-hidden rounded-lg border border-white/30 text-xs">
      {LANGS.map((l) => (
        <button
          key={l}
          onClick={() => void i18n.changeLanguage(l)}
          className={`px-2 py-1 font-semibold ${lang === l ? 'bg-white text-brand' : 'text-white/90 hover:bg-white/10'}`}
          aria-pressed={lang === l}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
