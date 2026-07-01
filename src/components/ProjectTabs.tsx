import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function ProjectTabs({ id }: { id: string }) {
  const { t } = useTranslation();
  const tabs = [
    { to: `/projeto/${id}/coleta`, key: 'nav.collect' },
    { to: `/projeto/${id}/analise`, key: 'nav.analyze' },
    { to: `/projeto/${id}/plano`, key: 'nav.actionPlan' },
  ];
  return (
    <div className="mb-4 flex gap-1 overflow-x-auto rounded-lg border border-slate-200 bg-white p-1">
      {tabs.map((tb) => (
        <NavLink
          key={tb.to}
          to={tb.to}
          className={({ isActive }) =>
            `whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ${
              isActive ? 'bg-brand text-white' : 'text-slate-600 hover:bg-slate-100'
            }`
          }
        >
          {t(tb.key)}
        </NavLink>
      ))}
    </div>
  );
}
