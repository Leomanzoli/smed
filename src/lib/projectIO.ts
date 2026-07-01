import type { Project } from '../types';
import { SCHEMA_VERSION, emptyBasicInfo } from '../types';
import { downloadBlob, safeFileName } from './download';
import { uid } from './id';

const APP_TAG = 'smed-up';

/** Export a single project as a portable .json backup (to resume on another machine). */
export function exportProjectJson(project: Project): void {
  const payload = {
    app: APP_TAG,
    kind: 'project',
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    project,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  downloadBlob(blob, `SMED ${safeFileName(project.name)}.smed.json`);
}

/** Export every project (full local backup). */
export function exportAllJson(projects: Project[]): void {
  const payload = {
    app: APP_TAG,
    kind: 'backup',
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    projects,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  downloadBlob(blob, `SMED backup ${new Date().toISOString().slice(0, 10)}.smed.json`);
}

function coerceProject(p: Record<string, unknown>): Project {
  const now = new Date().toISOString();
  return {
    id: typeof p.id === 'string' ? p.id : uid(),
    name: String(p.name ?? 'Projeto SMED'),
    createdAt: typeof p.createdAt === 'string' ? p.createdAt : now,
    updatedAt: typeof p.updatedAt === 'string' ? p.updatedAt : now,
    schemaVersion: SCHEMA_VERSION,
    sectionLabel: String(p.sectionLabel ?? ''),
    basicInfo: { ...emptyBasicInfo(), ...((p.basicInfo as object) ?? {}) },
    tasks: Array.isArray(p.tasks) ? (p.tasks as Project['tasks']) : [],
    analysis: p.analysis && typeof p.analysis === 'object' ? (p.analysis as Project['analysis']) : {},
    actionPlan: Array.isArray(p.actionPlan) ? (p.actionPlan as Project['actionPlan']) : [],
  };
}

/** Parse a .json backup (single project or full backup) into a list of projects. */
export async function parseImport(file: File): Promise<Project[]> {
  const text = await file.text();
  const data = JSON.parse(text);
  if (!data || data.app !== APP_TAG) throw new Error('invalid');
  if (data.kind === 'backup' && Array.isArray(data.projects)) return data.projects.map(coerceProject);
  if (data.project) return [coerceProject(data.project)];
  throw new Error('invalid');
}
