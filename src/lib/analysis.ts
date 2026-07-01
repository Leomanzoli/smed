// SMED analysis computations. Durations are in whole minutes.
import type { Analysis, Project, SetupType, Task } from '../types';
import { durationMinutes } from './time';

export interface ComputedRow {
  diff: number; // Tempo (Fim - Início)
  tempoI: number; // original internal time (J in template)
  tempoE: number; // original external time (K in template)
  reanalise: SetupType; // effective re-analysis (defaults to original)
  finalI: number; // Final Tempo I
  finalE: number; // Final Tempo E
  ganho: number; // Ganho estimado (pre-filled, editable)
  tempoFinal: number; // finalI + finalE - ganho
}

export function taskDiff(task: Task): number {
  return durationMinutes(task.inicio, task.fim) ?? 0;
}

export function effectiveReanalise(task: Task, a: Analysis): SetupType {
  return a.reanaliseIE || task.analiseIE;
}

/** Suggested Ganho estimado before any manual edit. */
export function prefillGanho(task: Task, a: Analysis): number {
  const diff = taskDiff(task);
  const re = effectiveReanalise(task, a);
  const finalI = a.finalTempoI ?? (re === 'interna' ? diff : 0);
  const finalE = a.finalTempoE ?? (re === 'externa' ? diff : 0);
  return re === 'interna' ? finalI : finalE;
}

export function computeRow(task: Task, a: Analysis): ComputedRow {
  const diff = taskDiff(task);
  const tempoI = task.analiseIE === 'interna' ? diff : 0;
  const tempoE = task.analiseIE === 'externa' ? diff : 0;
  const reanalise = effectiveReanalise(task, a);
  const finalI = a.finalTempoI ?? (reanalise === 'interna' ? diff : 0);
  const finalE = a.finalTempoE ?? (reanalise === 'externa' ? diff : 0);
  const ganho = a.ganhoManual ? a.ganhoEstimado ?? 0 : reanalise === 'interna' ? finalI : finalE;
  const tempoFinal = finalI + finalE - ganho;
  return { diff, tempoI, tempoE, reanalise, finalI, finalE, ganho, tempoFinal };
}

export interface Totals {
  diff: number;
  tempoI: number;
  tempoE: number;
  ganho: number;
  tempoFinal: number;
  reductionPct: number; // 1 - tempoFinal/diff
}

export function computeTotals(project: Project): Totals {
  let diff = 0,
    tempoI = 0,
    tempoE = 0,
    ganho = 0,
    tempoFinal = 0;
  for (const task of project.tasks) {
    const a = project.analysis[task.id];
    const r = computeRow(task, a ?? emptyForTotals());
    diff += r.diff;
    tempoI += r.tempoI;
    tempoE += r.tempoE;
    ganho += r.ganho;
    tempoFinal += r.tempoFinal;
  }
  const reductionPct = diff > 0 ? 1 - tempoFinal / diff : 0;
  return { diff, tempoI, tempoE, ganho, tempoFinal, reductionPct };
}

function emptyForTotals(): Analysis {
  return {
    reanaliseIE: '',
    finalTempoI: null,
    finalTempoE: null,
    ecrs: '',
    ganhoEstimado: null,
    ganhoManual: false,
    kaizen: '',
    oQueE: '',
  };
}
