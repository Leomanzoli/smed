import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProjects } from '../hooks/useProject';

export function HomePage() {
  const { t } = useTranslation();
  const projects = useProjects();

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-gradient-to-br from-brand to-brand-dark p-6 text-white shadow-sm sm:p-10">
        <h1 className="max-w-2xl text-2xl font-bold sm:text-4xl">{t('home.title')}</h1>
        <p className="mt-3 max-w-2xl text-white/90">{t('home.subtitle')}</p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs">
          <span className="chip bg-white/15 text-white">🔒 {t('home.localBadge')}</span>
          <span className="chip bg-white/15 text-white">📶 {t('home.offlineBadge')}</span>
          <span className="chip bg-white/15 text-white">🆓 {t('home.freeBadge')}</span>
        </div>
        <div className="mt-6">
          <Link to="/projetos" className="btn bg-white text-brand hover:bg-white/90">
            {projects && projects.length > 0 ? t('nav.projects') : t('home.createFirst')}
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="card p-6">
          <div className="text-2xl">📋</div>
          <h2 className="mt-2 text-lg font-semibold">{t('home.collectTitle')}</h2>
          <p className="mt-1 text-sm text-slate-600">{t('home.collectDesc')}</p>
        </div>
        <div className="card p-6">
          <div className="text-2xl">📊</div>
          <h2 className="mt-2 text-lg font-semibold">{t('home.analyzeTitle')}</h2>
          <p className="mt-1 text-sm text-slate-600">{t('home.analyzeDesc')}</p>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t('home.recent')}</h2>
          <Link to="/projetos" className="text-sm font-medium text-brand hover:underline">
            {t('nav.projects')}
          </Link>
        </div>
        {!projects || projects.length === 0 ? (
          <div className="card p-6 text-center text-sm text-slate-500">
            {t('projects.empty')}
            <div className="mt-3">
              <Link to="/projetos" className="btn-primary">
                {t('home.createFirst')}
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 6).map((p) => (
              <Link key={p.id} to={`/projeto/${p.id}/coleta`} className="card p-4 transition hover:border-brand/50 hover:shadow">
                <p className="truncate font-semibold text-slate-900">{p.name}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {p.tasks.length} {p.tasks.length === 1 ? 'tarefa' : 'tarefas'}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
