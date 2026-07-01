import { useTranslation } from 'react-i18next';
import type { SetupType } from '../types';

export function IEToggle({
  value,
  onChange,
  size = 'md',
}: {
  value: SetupType;
  onChange: (v: SetupType) => void;
  size?: 'sm' | 'md';
}) {
  const { t } = useTranslation();
  const pad = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm';
  return (
    <div className="inline-flex overflow-hidden rounded-lg border border-slate-300">
      {(['interna', 'externa'] as const).map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`${pad} font-medium ${
            value === v ? 'bg-brand text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          {t(`common.${v}`)}
        </button>
      ))}
    </div>
  );
}
