import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProjectEditor } from '../hooks/useProjectEditor';
import { ProjectTabs } from '../components/ProjectTabs';
import { Field } from '../components/Field';
import { Modal } from '../components/Modal';
import { IEToggle } from '../components/IEToggle';
import { emptyAnalysis, type BasicInfo, type SetupType, type Task } from '../types';
import { uid } from '../lib/id';
import { durationMinutes, formatDuration, isValidTime } from '../lib/time';

function emptyTask(): Task {
  return { id: uid(), tarefa: '', task: '', descricao: '', inicio: '', fim: '', analiseIE: 'interna' };
}

export function CollectPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { project, loading, update } = useProjectEditor(id);
  const [draft, setDraft] = useState<Task | null>(null);
  const [showErrors, setShowErrors] = useState(false);

  if (loading) return <p className="text-slate-500">{t('common.loading')}</p>;
  if (!project) return <p className="text-slate-500">404</p>;

  const info = project.basicInfo;
  const setInfo = (key: keyof BasicInfo, value: string) => update((d) => void (d.basicInfo[key] = value));

  const startNew = () => {
    setShowErrors(false);
    setDraft(emptyTask());
  };
  const startEdit = (task: Task) => {
    setShowErrors(false);
    setDraft(structuredClone(task));
  };

  const draftValid = (task: Task) =>
    task.tarefa.trim() && task.descricao.trim() && isValidTime(task.inicio) && isValidTime(task.fim);

  const saveDraft = () => {
    if (!draft) return;
    if (!draftValid(draft)) {
      setShowErrors(true);
      return;
    }
    update((d) => {
      const idx = d.tasks.findIndex((x) => x.id === draft.id);
      if (idx >= 0) d.tasks[idx] = draft;
      else {
        d.tasks.push(draft);
        d.analysis[draft.id] = emptyAnalysis();
      }
    });
    setDraft(null);
  };

  const removeTask = (taskId: string) =>
    update((d) => {
      d.tasks = d.tasks.filter((x) => x.id !== taskId);
      delete d.analysis[taskId];
    });

  const move = (taskId: string, dir: -1 | 1) =>
    update((d) => {
      const i = d.tasks.findIndex((x) => x.id === taskId);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= d.tasks.length) return;
      [d.tasks[i], d.tasks[j]] = [d.tasks[j], d.tasks[i]];
    });

  return (
    <div>
      <ProjectTabs id={project.id} />

      <input
        className="mb-4 w-full rounded-lg border border-transparent bg-transparent px-1 text-xl font-bold text-slate-900 hover:border-slate-200 focus:border-brand focus:bg-white focus:outline-none"
        value={project.name}
        onChange={(e) => update((d) => void (d.name = e.target.value))}
      />

      {/* Step 1 — basic info */}
      <section className="card p-4 sm:p-6">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">{t('basic.step')}</p>
          <h2 className="text-lg font-semibold">{t('basic.title')}</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t('basic.atividade')} required className="sm:col-span-2">
            <input className="input" value={info.atividade} onChange={(e) => setInfo('atividade', e.target.value)} />
          </Field>
          <Field label={t('basic.aplicadores')} required>
            <input className="input" value={info.aplicadores} onChange={(e) => setInfo('aplicadores', e.target.value)} />
          </Field>
          <Field label={t('basic.dataAnalise')} required>
            <input type="date" className="input" value={info.dataAnalise} onChange={(e) => setInfo('dataAnalise', e.target.value)} />
          </Field>
          <Field label={t('basic.area')} required>
            <input className="input" value={info.area} onChange={(e) => setInfo('area', e.target.value)} />
          </Field>
          <Field label={t('basic.gerencia')} required>
            <input className="input" value={info.gerencia} onChange={(e) => setInfo('gerencia', e.target.value)} />
          </Field>
          <Field label={t('basic.supervisao')} required>
            <input className="input" value={info.supervisao} onChange={(e) => setInfo('supervisao', e.target.value)} />
          </Field>
          <Field label={t('basic.revisao')}>
            <input className="input" value={info.revisao} onChange={(e) => setInfo('revisao', e.target.value)} />
          </Field>
          <Field label={t('basic.dataRevisao')}>
            <input type="date" className="input" value={info.dataRevisao} onChange={(e) => setInfo('dataRevisao', e.target.value)} />
          </Field>
        </div>
      </section>

      {/* Step 2 — tasks */}
      <section className="card mt-6 p-4 sm:p-6">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">{t('tasks.step')}</p>
            <h2 className="text-lg font-semibold">{t('tasks.title')}</h2>
            <p className="mt-1 text-xs text-slate-500">{t('tasks.addHint')}</p>
          </div>
          <button className="btn-primary shrink-0" onClick={startNew} aria-label={t('tasks.add')}>
            + {t('tasks.add')}
          </button>
        </div>

        {project.tasks.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
            {t('tasks.empty')}
          </p>
        ) : (
          <ul className="space-y-2">
            {project.tasks.map((task, i) => {
              const dur = durationMinutes(task.inicio, task.fim);
              return (
                <li key={task.id} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand/10 text-xs font-bold text-brand">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-slate-900">
                      {task.tarefa}
                      {task.task ? <span className="ml-2 text-xs text-slate-400">#{task.task}</span> : null}
                    </p>
                    <p className="truncate text-xs text-slate-500">{task.descricao}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span>
                        {task.inicio || '--:--'} → {task.fim || '--:--'}
                      </span>
                      <span className="chip bg-slate-100 text-slate-600">{formatDuration(dur)}</span>
                      <span className={`chip ${task.analiseIE === 'interna' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'}`}>
                        {t(`common.${task.analiseIE}`)}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-1">
                    <button className="btn-ghost px-2 py-0.5 text-xs" onClick={() => move(task.id, -1)} disabled={i === 0} aria-label={t('tasks.moveUp')}>
                      ▲
                    </button>
                    <button className="btn-ghost px-2 py-0.5 text-xs" onClick={() => move(task.id, 1)} disabled={i === project.tasks.length - 1} aria-label={t('tasks.moveDown')}>
                      ▼
                    </button>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button className="btn-outline px-2 py-1 text-xs" onClick={() => startEdit(task)}>
                      {t('common.edit')}
                    </button>
                    <button className="btn-ghost px-2 py-1 text-xs text-red-600 hover:bg-red-50" onClick={() => removeTask(task.id)}>
                      {t('common.remove')}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          <button className="btn-outline" onClick={async () => { const m = await import('../lib/excel/fieldExport'); await m.exportFieldCollection(project); }} disabled={project.tasks.length === 0}>
            ⬇ {t('tasks.exportField')}
          </button>
          <button className="btn-primary" onClick={() => navigate(`/projeto/${project.id}/analise`)} disabled={project.tasks.length === 0}>
            {t('tasks.goAnalyze')} →
          </button>
        </div>
      </section>

      <Modal
        open={!!draft}
        onClose={() => setDraft(null)}
        title={draft && project.tasks.some((x) => x.id === draft.id) ? t('tasks.editTitle') : t('tasks.newTitle')}
        footer={
          <>
            <button className="btn-ghost" onClick={() => setDraft(null)}>
              {t('common.cancel')}
            </button>
            <button className="btn-primary" onClick={saveDraft}>
              {t('common.save')}
            </button>
          </>
        }
      >
        {draft && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t('tasks.tarefa')} required error={showErrors && !draft.tarefa.trim() ? t('common.required') : undefined} className="sm:col-span-2">
              <input className="input" value={draft.tarefa} onChange={(e) => setDraft({ ...draft, tarefa: e.target.value })} autoFocus />
            </Field>
            <Field label={t('tasks.task')} className="sm:col-span-2">
              <input className="input" value={draft.task} onChange={(e) => setDraft({ ...draft, task: e.target.value })} />
            </Field>
            <Field label={t('tasks.descricao')} required error={showErrors && !draft.descricao.trim() ? t('common.required') : undefined} className="sm:col-span-2">
              <textarea className="input min-h-[80px]" value={draft.descricao} onChange={(e) => setDraft({ ...draft, descricao: e.target.value })} />
            </Field>
            <Field label={t('tasks.inicio')} required error={showErrors && !isValidTime(draft.inicio) ? t('tasks.invalidTime') : undefined}>
              <input type="time" className="input" value={draft.inicio} onChange={(e) => setDraft({ ...draft, inicio: e.target.value })} />
            </Field>
            <Field label={t('tasks.fim')} required error={showErrors && !isValidTime(draft.fim) ? t('tasks.invalidTime') : undefined}>
              <input type="time" className="input" value={draft.fim} onChange={(e) => setDraft({ ...draft, fim: e.target.value })} />
            </Field>
            <Field label={t('tasks.analiseIE')} required className="sm:col-span-2">
              <div>
                <IEToggle value={draft.analiseIE} onChange={(v: SetupType) => setDraft({ ...draft, analiseIE: v })} />
              </div>
            </Field>
          </div>
        )}
      </Modal>
    </div>
  );
}
