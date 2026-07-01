import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProjects } from '../hooks/useProject';
import { createProject, deleteAllData, deleteProject, saveProject } from '../db/db';
import { uid } from '../lib/id';
import { exportAllJson, exportProjectJson, parseImport } from '../lib/projectIO';
import type { Project } from '../types';

export function ProjectsPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const projects = useProjects();
  const [name, setName] = useState('');
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString(i18n.language, { dateStyle: 'medium' });

  async function handleCreate() {
    const p = createProject(name);
    await saveProject(p);
    setName('');
    navigate(`/projeto/${p.id}/coleta`);
  }

  async function handleDuplicate(p: Project) {
    const copy: Project = {
      ...structuredClone(p),
      id: uid(),
      name: `${p.name} (cópia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveProject(copy);
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const imported = await parseImport(file);
      for (const p of imported) await saveProject(p);
      setMessage({ type: 'ok', text: t('projects.imported') });
    } catch {
      setMessage({ type: 'err', text: t('projects.importError') });
    }
  }

  async function handleDeleteAll() {
    if (!confirm(t('projects.deleteAllConfirm'))) return;
    await deleteAllData();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('projects.title')}</h1>
        <p className="text-sm text-slate-500">{t('projects.subtitle')}</p>
      </div>

      <div className="card p-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            className="input"
            placeholder={t('projects.namePlaceholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          <button className="btn-primary shrink-0" onClick={handleCreate}>
            + {t('projects.create')}
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="btn-outline" onClick={() => fileRef.current?.click()}>
            ⬆ {t('projects.importAll')}
          </button>
          <input ref={fileRef} type="file" accept=".json,application/json" className="hidden" onChange={handleImport} />
          {projects && projects.length > 0 && (
            <button className="btn-outline" onClick={() => exportAllJson(projects)}>
              ⬇ {t('projects.exportAll')}
            </button>
          )}
        </div>
        {message && (
          <p className={`mt-2 text-sm ${message.type === 'ok' ? 'text-brand' : 'text-red-600'}`}>{message.text}</p>
        )}
      </div>

      {!projects ? (
        <p className="text-sm text-slate-500">{t('common.loading')}</p>
      ) : projects.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">{t('projects.empty')}</div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {projects.map((p) => (
            <div key={p.id} className="card flex flex-col p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold text-slate-900">{p.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {t('projects.updated')}: {fmtDate(p.updatedAt)} · {p.tasks.length}{' '}
                    {p.tasks.length === 1 ? 'tarefa' : 'tarefas'} · {p.actionPlan.length} 5W2H
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link to={`/projeto/${p.id}/coleta`} className="btn-primary">
                  {t('projects.open')}
                </Link>
                <button className="btn-ghost" onClick={() => exportProjectJson(p)}>
                  ⬇ {t('common.export')}
                </button>
                <button className="btn-ghost" onClick={() => handleDuplicate(p)}>
                  ⧉ {t('projects.duplicate')}
                </button>
                <button
                  className="btn-ghost text-red-600 hover:bg-red-50"
                  onClick={() => confirm(t('projects.deleteConfirm')) && deleteProject(p.id)}
                >
                  🗑 {t('common.delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card border-red-200 p-4">
        <h2 className="text-sm font-semibold text-red-700">{t('projects.dangerZone')}</h2>
        <button className="btn-danger mt-2" onClick={handleDeleteAll}>
          {t('projects.deleteAll')}
        </button>
      </div>
    </div>
  );
}
