import ExcelJS from 'exceljs';
import type { BasicInfo, SetupType, Task } from '../../types';
import { uid } from '../id';

function norm(s: unknown): string {
  return String(s ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function cellText(cell: ExcelJS.Cell): string {
  const v = cell.value as unknown;
  if (v === null || v === undefined) return '';
  if (v instanceof Date) {
    const hh = String(v.getHours()).padStart(2, '0');
    const mm = String(v.getMinutes()).padStart(2, '0');
    return v.getHours() || v.getMinutes() ? `${hh}:${mm}` : v.toISOString().slice(0, 10);
  }
  return (cell.text ?? String(v)).trim();
}

function normalizeTime(s: string): string {
  const m = s.trim().match(/^(\d{1,2}):(\d{2})/);
  return m ? `${m[1].padStart(2, '0')}:${m[2]}` : s.trim();
}

const INFO_MAP: Record<string, keyof BasicInfo> = {
  'atividade em analise': 'atividade',
  'nomes dos aplicadores': 'aplicadores',
  'data da analise': 'dataAnalise',
  'area de atuacao': 'area',
  gerencia: 'gerencia',
  'supervisao/coordenacao': 'supervisao',
  revisao: 'revisao',
  'data da revisao': 'dataRevisao',
};

export interface FieldImportResult {
  basicInfo: Partial<BasicInfo>;
  tasks: Task[];
}

/** Read a field-collection workbook (exported by this app) back into basic info + tasks. */
export async function parseFieldWorkbook(buffer: ArrayBuffer): Promise<FieldImportResult> {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buffer);
  const ws = wb.worksheets[0];
  if (!ws) throw new Error('empty');

  const basicInfo: Partial<BasicInfo> = {};
  let headerRow = -1;
  const colIndex: Record<string, number> = {};

  ws.eachRow((row, rowNumber) => {
    if (headerRow !== -1) return;
    const first = norm(cellText(row.getCell(1)));
    if (first === 'tarefa') {
      headerRow = rowNumber;
      row.eachCell((cell, col) => {
        colIndex[norm(cellText(cell))] = col;
      });
      return;
    }
    const key = INFO_MAP[first];
    if (key) basicInfo[key] = cellText(row.getCell(2));
  });

  const tasks: Task[] = [];
  if (headerRow !== -1) {
    const cTarefa = colIndex['tarefa'] ?? 1;
    const cTask = colIndex['task'] ?? 2;
    const cDesc = colIndex['descricao da tarefa'] ?? 3;
    const cIni = colIndex['inicio'] ?? 4;
    const cFim = colIndex['fim'] ?? 5;
    const cIE = colIndex['analise i x e'] ?? 6;

    for (let r = headerRow + 1; r <= ws.rowCount; r++) {
      const row = ws.getRow(r);
      const tarefa = cellText(row.getCell(cTarefa));
      const desc = cellText(row.getCell(cDesc));
      const ini = cellText(row.getCell(cIni));
      const fim = cellText(row.getCell(cFim));
      if (!tarefa && !desc && !ini && !fim) continue;
      const ie = norm(cellText(row.getCell(cIE)));
      const analiseIE: SetupType = ie.startsWith('int') ? 'interna' : 'externa';
      tasks.push({
        id: uid(),
        tarefa,
        task: cellText(row.getCell(cTask)),
        descricao: desc,
        inicio: normalizeTime(ini),
        fim: normalizeTime(fim),
        analiseIE,
      });
    }
  }

  return { basicInfo, tasks };
}

export async function importFieldCollection(file: File): Promise<FieldImportResult> {
  return parseFieldWorkbook(await file.arrayBuffer());
}
