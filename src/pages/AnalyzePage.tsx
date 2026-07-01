import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProjectEditor } from '../hooks/useProjectEditor';
import { ProjectTabs } from '../components/ProjectTabs';
import { computeRow, computeTotals } from '../lib/analysis';
import { formatDuration, timeToMinutes } from '../lib/time';
import { emptyAnalysis, type Analysis, type ECRS, type SetupType } from '../types';

const toClock = (min: number) =>
  `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(Math.round(min) % 60).padStart(2, '0')}`;

const ECRS_VALUES: ECRS[] = ['eliminar', 'combinar', 'reduzir', 'simplificar'];

export function AnalyzePage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { project, loading, update } = useProjectEditor(id);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  if (loading) return <p className="text-slate-500">{t('common.loading')}</p>;
  if (!project) return <p className="text-slate-500">404</p>;

  const editAnalysis = (taskId: string, mutator: (a: Analysis) => void) =>
    update((d) => {
      const a = d.analysis[taskId] ?? emptyAnalysis();
      mutator(a);
      d.analysis[taskId] = a;
    });

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const { importFieldCollection } = await import('../lib/excel/fieldImport');
      const { basicInfo, tasks } = await importFieldCollection(file);
      update((d) => {
        (Object.keys(basicInfo) as (keyof typeof basicInfo)[]).forEach((k) => {
          const v = basicInfo[k];
          if (v) d.basicInfo[k] = v;
        });
        d.tasks = tasks;
        d.analysis = {};
        for (const task of tasks) d.analysis[task.id] = emptyAnalysis();
      });
      setMessage({ type: 'ok', text: t('analyze.importedField') });
    } catch {
      setMessage({ type: 'err', text: t('analyze.importFieldError') });
    }
  }

  const totals = computeTotals(project);
  const th = 'whitespace-nowrap px-2 py-2 text-left text-xs font-semibold';

  return (
    <div>
      <ProjectTabs id={project.id} />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">{t('analyze.title')}</h1>
        <div className="flex flex-wrap gap-2">
          <button className="btn-outline" onClick={() => fileRef.current?.click()}>
            ⬆ {t('analyze.importField')}
          </button>
          <input ref={fileRef} type="file" accept=".xlsx" className="hidden" onChange={handleImport} />
          <button className="btn-primary" onClick={async () => { const m = await import('../lib/excel/smedExport'); await m.exportSmedForm(project); }} disabled={project.tasks.length === 0}>
            ⬇ {t('analyze.exportSmed')}
          </button>
        </div>
      </div>

      {message && (
        <p className={`mb-3 text-sm ${message.type === 'ok' ? 'text-brand' : 'text-red-600'}`}>{message.text}</p>
      )}

      {project.tasks.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">{t('analyze.noTasks')}</div>
      ) : (
        <>
          <div className="mb-2 flex flex-wrap gap-3 text-xs text-slate-500">
            <span className="chip bg-slate-100 text-slate-600">{t('analyze.collected')}</span>
            <span className="chip bg-brand/10 text-brand">{t('analyze.computed')}</span>
            <span className="chip bg-amber-100 text-amber-700">{t('analyze.toFill')}</span>
          </div>

          <div className="card overflow-x-auto">
            <table className="min-w-[1400px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className={`${th} bg-slate-50`}>#</th>
                  <th className={`${th} bg-slate-50`}>{t('analyze.tarefa')}</th>
                  <th className={`${th} bg-slate-50`}>{t('analyze.task')}</th>
                  <th className={`${th} bg-slate-50`}>{t('analyze.descricao')}</th>
                  <th className={`${th} bg-slate-50`}>{t('analyze.inicio')}</th>
                  <th className={`${th} bg-slate-50`}>{t('analyze.fim')}</th>
                  <th className={`${th} bg-brand/5`}>{t('analyze.tempo')}</th>
                  <th className={`${th} bg-brand/5`}>{t('analyze.analiseIE')}</th>
                  <th className={`${th} bg-brand/5`}>{t('analyze.tempoI')}</th>
                  <th className={`${th} bg-brand/5`}>{t('analyze.tempoE')}</th>
                  <th className={`${th} bg-amber-50`}>{t('analyze.reanalise')}</th>
                  <th className={`${th} bg-amber-50`}>{t('analyze.finalI')}</th>
                  <th className={`${th} bg-amber-50`}>{t('analyze.finalE')}</th>
                  <th className={`${th} bg-amber-50`}>{t('analyze.ecrs')}</th>
                  <th className={`${th} bg-amber-50`}>{t('analyze.ganho')}</th>
                  <th className={`${th} bg-brand/5`}>{t('analyze.tempoFinal')}</th>
                  <th className={`${th} bg-amber-50`}>{t('analyze.kaizen')}</th>
                  <th className={`${th} bg-amber-50`}>{t('analyze.oQueE')}</th>
                </tr>
              </thead>
              <tbody>
                {project.tasks.map((task, i) => {
                  const a = project.analysis[task.id] ?? emptyAnalysis();
                  const c = computeRow(task, a);
                  return (
                    <tr key={task.id} className="border-b border-slate-100 align-top">
                      <td className="px-2 py-2 text-xs text-slate-400">{i + 1}</td>
                      <td className="px-2 py-2 font-medium">{task.tarefa}</td>
                      <td className="px-2 py-2 text-slate-500">{task.task}</td>
                      <td className="max-w-[220px] px-2 py-2 text-slate-600">{task.descricao}</td>
                      <td className="px-2 py-2 tabular-nums">{task.inicio}</td>
                      <td className="px-2 py-2 tabular-nums">{task.fim}</td>
                      <td className="px-2 py-2 tabular-nums">{formatDuration(c.diff)}</td>
                      <td className="px-2 py-2">
                        <span className={`chip ${task.analiseIE === 'interna' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'}`}>
                          {t(`common.${task.analiseIE}`)}
                        </span>
                      </td>
                      <td className="px-2 py-2 tabular-nums">{formatDuration(c.tempoI)}</td>
                      <td className="px-2 py-2 tabular-nums">{formatDuration(c.tempoE)}</td>
                      <td className="px-2 py-2">
                        <select
                          className="input px-2 py-1"
                          value={a.reanaliseIE || task.analiseIE}
                          onChange={(e) => editAnalysis(task.id, (x) => void (x.reanaliseIE = e.target.value as SetupType))}
                        >
                          <option value="interna">{t('common.interna')}</option>
                          <option value="externa">{t('common.externa')}</option>
                        </select>
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="time"
                          className="input w-24 px-2 py-1"
                          value={toClock(c.finalI)}
                          onChange={(e) => editAnalysis(task.id, (x) => void (x.finalTempoI = timeToMinutes(e.target.value)))}
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="time"
                          className="input w-24 px-2 py-1"
                          value={toClock(c.finalE)}
                          onChange={(e) => editAnalysis(task.id, (x) => void (x.finalTempoE = timeToMinutes(e.target.value)))}
                        />
                      </td>
                      <td className="px-2 py-2">
                        <select
                          className="input px-2 py-1"
                          value={a.ecrs}
                          onChange={(e) => editAnalysis(task.id, (x) => void (x.ecrs = e.target.value as ECRS))}
                        >
                          <option value="">—</option>
                          {ECRS_VALUES.map((v) => (
                            <option key={v} value={v}>
                              {t(`ecrs.${v}`)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex items-center gap-1">
                          <input
                            type="time"
                            className="input w-24 px-2 py-1"
                            value={toClock(c.ganho)}
                            onChange={(e) =>
                              editAnalysis(task.id, (x) => {
                                x.ganhoEstimado = timeToMinutes(e.target.value);
                                x.ganhoManual = true;
                              })
                            }
                          />
                          {a.ganhoManual && (
                            <button
                              className="btn-ghost px-1 py-1 text-xs"
                              title="Auto"
                              onClick={() =>
                                editAnalysis(task.id, (x) => {
                                  x.ganhoManual = false;
                                  x.ganhoEstimado = null;
                                })
                              }
                            >
                              ↺
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-2 py-2 font-semibold tabular-nums">{formatDuration(c.tempoFinal)}</td>
                      <td className="px-2 py-2">
                        <input
                          className="input w-40 px-2 py-1"
                          value={a.kaizen}
                          onChange={(e) => editAnalysis(task.id, (x) => void (x.kaizen = e.target.value))}
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          className="input w-48 px-2 py-1"
                          value={a.oQueE}
                          onChange={(e) => editAnalysis(task.id, (x) => void (x.oQueE = e.target.value))}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-300 bg-slate-50 font-semibold">
                  <td className="px-2 py-2" colSpan={6}>
                    {t('analyze.totals')}
                  </td>
                  <td className="px-2 py-2 tabular-nums">{formatDuration(totals.diff)}</td>
                  <td className="px-2 py-2" />
                  <td className="px-2 py-2 tabular-nums">{formatDuration(totals.tempoI)}</td>
                  <td className="px-2 py-2 tabular-nums">{formatDuration(totals.tempoE)}</td>
                  <td className="px-2 py-2" colSpan={4} />
                  <td className="px-2 py-2 tabular-nums">{formatDuration(totals.ganho)}</td>
                  <td className="px-2 py-2 tabular-nums">{formatDuration(totals.tempoFinal)}</td>
                  <td className="px-2 py-2" colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-end gap-3">
            <span className="text-sm text-slate-500">{t('analyze.reduction')}</span>
            <span className="rounded-lg bg-brand px-4 py-2 text-lg font-bold text-white tabular-nums">
              {(totals.reductionPct * 100).toFixed(0)}%
            </span>
          </div>
        </>
      )}
    </div>
  );
}
