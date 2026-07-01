import Dexie, { type Table } from 'dexie';
import { type Project, SCHEMA_VERSION, emptyBasicInfo } from '../types';
import { uid } from '../lib/id';

// Local-first storage. Nothing leaves the device: no server, no accounts.
export class SmedDatabase extends Dexie {
  projects!: Table<Project, string>;

  constructor() {
    super('smed-up');
    this.version(1).stores({
      projects: 'id, name, updatedAt',
    });
  }
}

export const db = new SmedDatabase();

export function createProject(name: string): Project {
  const now = new Date().toISOString();
  return {
    id: uid(),
    name: name.trim() || 'Projeto SMED',
    createdAt: now,
    updatedAt: now,
    schemaVersion: SCHEMA_VERSION,
    sectionLabel: '',
    basicInfo: emptyBasicInfo(),
    tasks: [],
    analysis: {},
    actionPlan: [],
  };
}

export async function saveProject(project: Project): Promise<void> {
  project.updatedAt = new Date().toISOString();
  await db.projects.put(project);
}

export async function getProject(id: string): Promise<Project | undefined> {
  return db.projects.get(id);
}

export async function listProjects(): Promise<Project[]> {
  return db.projects.orderBy('updatedAt').reverse().toArray();
}

export async function deleteProject(id: string): Promise<void> {
  await db.projects.delete(id);
}

export async function deleteAllData(): Promise<void> {
  await db.projects.clear();
}
