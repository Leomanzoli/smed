import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';

export function useProjects() {
  return useLiveQuery(() => db.projects.orderBy('updatedAt').reverse().toArray(), []);
}

export function useProjectCount() {
  return useLiveQuery(() => db.projects.count(), []);
}
