// Domain model for the SMED Up application.
// All data is stored locally on the device (see src/db/db.ts).

export type Language = 'pt' | 'en';

/** Internal (machine stopped) vs External (machine running) setup task. */
export type SetupType = 'interna' | 'externa';

/** ECRS action: Eliminate, Combine, Reduce, Simplify. */
export type ECRS = 'eliminar' | 'combinar' | 'reduzir' | 'simplificar';

/** Step 1 — basic information about the analysis (field collection). */
export interface BasicInfo {
  atividade: string; // Atividade em análise *
  aplicadores: string; // Nomes dos aplicadores *
  dataAnalise: string; // ISO yyyy-mm-dd *
  area: string; // Área de atuação *
  gerencia: string; // Gerência *
  supervisao: string; // Supervisão/Coordenação *
  revisao: string; // Revisão (optional)
  dataRevisao: string; // ISO yyyy-mm-dd (optional)
}

/** Step 2 — a single observed task (field collection). */
export interface Task {
  id: string;
  tarefa: string; // Tarefa *
  task: string; // Task (optional)
  descricao: string; // Descrição da tarefa *
  inicio: string; // HH:mm *
  fim: string; // HH:mm *
  analiseIE: SetupType; // Análise I x E *
}

/** Analysis fields filled on the desktop, linked to a task by id. */
export interface Analysis {
  reanaliseIE: SetupType | '';
  finalTempoI: number | null; // minutes
  finalTempoE: number | null; // minutes
  ecrs: ECRS | '';
  ganhoEstimado: number | null; // minutes (pre-filled, editable)
  ganhoManual: boolean; // true once the user edits ganhoEstimado manually
  kaizen: string; // Melhoria - Kaizens necessários (Qual?)
  oQueE: string; // O que é?
}

/** 5W2H action-plan item. */
export interface ActionItem {
  id: string;
  oQue: string; // O quê?
  porQue: string; // Por quê?
  onde: string; // Onde?
  quando: string; // Quando?
  quem: string; // Quem?
  como: string; // Como?
  quanto: string; // Quanto?
  matricula: string; // Matrícula
  email: string; // E-mail
}

export const SCHEMA_VERSION = 1;

/** A full project: everything needed to resume work on another machine. */
export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  schemaVersion: number;
  sectionLabel: string; // header over Descrição/Início/Fim/Tempo (D7:G7 in the Excel template)
  basicInfo: BasicInfo;
  tasks: Task[];
  analysis: Record<string, Analysis>; // taskId -> Analysis
  actionPlan: ActionItem[];
}

export function emptyBasicInfo(): BasicInfo {
  return {
    atividade: '',
    aplicadores: '',
    dataAnalise: '',
    area: '',
    gerencia: '',
    supervisao: '',
    revisao: '',
    dataRevisao: '',
  };
}

export function emptyAnalysis(): Analysis {
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
