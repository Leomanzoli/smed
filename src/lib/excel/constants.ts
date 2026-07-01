// Constants that mirror the official template: assets/Formulário de Aplicação do SMED.xlsx
// Column layout B..S, data starts at row 9, headers at rows 7-8, title at row 2.

export const BRAND_ARGB = 'FF007E7A'; // teal from the template title bar
export const HEADER_ARGB = 'FF007E7A';
export const SUBHEADER_ARGB = 'FFE6F2F1';
export const TOTAL_ARGB = 'FFF2F2F2';
export const FONT_NAME = 'HELVETICA';
export const FONT_SIZE = 10;

// Number formats
export const FMT_CLOCK = 'hh:mm';
export const FMT_DURATION = '[h]:mm:ss';
export const FMT_TOTAL = '[h]:mm:ss;@';
export const FMT_PERCENT = '0%';
export const FMT_DATE = 'dd/mm/yyyy';

// Rows
export const TITLE_ROW = 2;
export const INFO_LABEL_ROW = 4;
export const INFO_VALUE_ROW = 5;
export const HEADER_ROW_TOP = 7;
export const HEADER_ROW_SUB = 8;
export const DATA_START_ROW = 9;

// Column letters (1-based indices in comments)
export const COL = {
  tarefa: 'B', // 2
  task: 'C', // 3
  descricao: 'D', // 4
  inicio: 'E', // 5
  fim: 'F', // 6
  tempo: 'G', // 7
  interna: 'H', // 8
  externa: 'I', // 9
  tempoI: 'J', // 10
  tempoE: 'K', // 11
  ecrsE: 'L', // 12
  ecrsC: 'M', // 13
  ecrsR: 'N', // 14
  ecrsS: 'O', // 15
  ganho: 'P', // 16
  tempoFinal: 'Q', // 17
  kaizen: 'R', // 18
  oQueE: 'S', // 19
} as const;

// Static header labels (Portuguese, matching the template exactly)
export const LABELS = {
  title: 'SMED - Single Minute Exchange of Die',
  atividade: 'Atividade:',
  dataAnalise: 'Data análise:',
  elaborador: 'Elaborador:',
  revisao: 'Revisão:',
  dataRevisao: 'Data da revisão:',
  tarefa: 'Tarefa',
  task: 'Task',
  descricao: 'Descrição',
  inicio: 'Início',
  fim: 'Fim',
  tempo: 'Tempo',
  analiseIE: 'Análise I x E',
  interna: 'Interna',
  externa: 'Externa',
  tempoGroup: 'Tempo',
  interno: 'Interno',
  externo: 'Externo',
  ecrs: 'Análise ECRS',
  E: 'E',
  C: 'C',
  R: 'R',
  S: 'S',
  ganho: 'Ganho estimado',
  tempoFinalHeader: 'Tempo Final',
  kaizen: 'Melhoria - Kaizens necessários',
  qual: 'Qual?',
  oQueE: 'O que é?',
  total: 'TOTAL',
  reducao: 'Redução de tempo:',
} as const;

export const ECRS_COLUMN: Record<string, keyof typeof COL> = {
  eliminar: 'ecrsE',
  combinar: 'ecrsC',
  reduzir: 'ecrsR',
  simplificar: 'ecrsS',
};

// Column widths (approximation of the template)
export const COLUMN_WIDTHS: Record<string, number> = {
  A: 0.71,
  B: 31.71,
  C: 5.57,
  D: 31,
  E: 10.57,
  F: 10.57,
  G: 12.57,
  H: 10.29,
  I: 10.29,
  J: 13,
  K: 13.57,
  L: 6,
  M: 6,
  N: 6,
  O: 6,
  P: 19.57,
  Q: 12.43,
  R: 19.43,
  S: 52.57,
};
