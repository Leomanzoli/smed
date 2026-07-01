import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProjectEditor } from '../hooks/useProjectEditor';
import { ProjectTabs } from '../components/ProjectTabs';
import { Field } from '../components/Field';
import { Modal } from '../components/Modal';
import type { ActionItem } from '../types';
import { uid } from '../lib/id';

function emptyItem(): ActionItem {
  return { id: uid(), oQue: '', porQue: '', onde: '', quando: '', quem: '', como: '', quanto: '', matricula: '', email: '' };
}

export function ActionPlanPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { project, loading, update } = useProjectEditor(id);
  const [draft, setDraft] = useState<ActionItem | null>(null);

  if (loading) return <p className="text-slate-500">{t('common.loading')}</p>;
  if (!project) return <p className="text-slate-500">404</p>;

  const save = () => {
    if (!draft) return;
    update((d) => {
      const idx = d.actionPlan.findIndex((x) => x.id === draft.id);
      if (idx >= 0) d.actionPlan[idx] = draft;
      else d.actionPlan.push(draft);
    });
    setDraft(null);
  };

  const remove = (itemId: string) => update((d) => void (d.actionPlan = d.actionPlan.filter((x) => x.id !== itemId)));

  const fields: [keyof ActionItem, string][] = [
    ['oQue', t('action.oQue')],
    ['porQue', t('action.porQue')],
    ['onde', t('action.onde')],
    ['quando', t('action.quando')],
    ['quem', t('action.quem')],
    ['como', t('action.como')],
    ['quanto', t('action.quanto')],
    ['matricula', t('action.matricula')],
    ['email', t('action.email')],
  ];

  return (
    <div>
      <ProjectTabs id={project.id} />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">{t('action.title')}</h1>
        <div className="flex flex-wrap gap-2">
          <button className="btn-primary" onClick={() => setDraft(emptyItem())}>
            + {t('action.add')}
          </button>
          <button className="btn-outline" onClick={async () => { const m = await import('../lib/excel/actionPlanExport'); await m.exportActionPlan(project); }} disabled={project.actionPlan.length === 0}>
            ⬇ {t('action.export')}
          </button>
        </div>
      </div>

      {project.actionPlan.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">{t('action.empty')}</div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {project.actionPlan.map((item, i) => (
            <div key={item.id} className="card p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-slate-900">
                  {i + 1}. {item.oQue || '—'}
                </p>
                <div className="flex shrink-0 gap-1">
                  <button className="btn-outline px-2 py-1 text-xs" onClick={() => setDraft(structuredClone(item))}>
                    {t('common.edit')}
                  </button>
                  <button className="btn-ghost px-2 py-1 text-xs text-red-600 hover:bg-red-50" onClick={() => remove(item.id)}>
                    {t('common.remove')}
                  </button>
                </div>
              </div>
              <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-slate-600">
                {fields.slice(1).map(([key, label]) =>
                  item[key] ? (
                    <div key={key} className="truncate">
                      <dt className="inline font-medium text-slate-500">{label} </dt>
                      <dd className="inline">{item[key]}</dd>
                    </div>
                  ) : null,
                )}
              </dl>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!draft}
        onClose={() => setDraft(null)}
        title={draft && project.actionPlan.some((x) => x.id === draft.id) ? t('action.editTitle') : t('action.newTitle')}
        footer={
          <>
            <button className="btn-ghost" onClick={() => setDraft(null)}>
              {t('common.cancel')}
            </button>
            <button className="btn-primary" onClick={save}>
              {t('common.save')}
            </button>
          </>
        }
      >
        {draft && (
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map(([key, label]) => (
              <Field key={key} label={label} className={key === 'oQue' || key === 'porQue' ? 'sm:col-span-2' : ''}>
                {key === 'email' ? (
                  <input type="email" className="input" value={draft[key]} onChange={(e) => setDraft({ ...draft, [key]: e.target.value })} />
                ) : (
                  <input className="input" value={draft[key]} onChange={(e) => setDraft({ ...draft, [key]: e.target.value })} />
                )}
              </Field>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
