import { useCallback, useEffect, useRef, useState } from 'react';
import type { Project } from '../types';
import { db, saveProject } from '../db/db';

/**
 * Load a project into local state and autosave (debounced) any mutations back to IndexedDB.
 * `update` receives a mutable draft.
 */
export function useProjectEditor(id?: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const latest = useRef<Project | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    if (!id) {
      setProject(null);
      setLoading(false);
      return;
    }
    void db.projects.get(id).then((p) => {
      if (!active) return;
      latest.current = p ?? null;
      setProject(p ?? null);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [id]);

  const scheduleSave = useCallback((p: Project) => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      void saveProject({ ...p });
    }, 400);
  }, []);

  const update = useCallback(
    (mutator: (draft: Project) => void) => {
      setProject((prev) => {
        if (!prev) return prev;
        const next = structuredClone(prev) as Project;
        mutator(next);
        latest.current = next;
        scheduleSave(next);
        return next;
      });
    },
    [scheduleSave],
  );

  // Flush the latest state on unmount.
  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
      if (latest.current) void saveProject(latest.current);
    },
    [],
  );

  return { project, loading, update };
}
