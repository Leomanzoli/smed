import ExcelJS from 'exceljs';
import type { BasicInfo, Project } from '../../types';
import { downloadBlob, safeFileName } from '../download';

const BRAND = 'FF007E7A';
const FIELD_HEADERS = ['Tarefa', 'Task', 'Descrição da tarefa', 'Início', 'Fim', 'Análise I x E'];

const INFO_ROWS: [string, keyof BasicInfo][] = [
  ['Atividade em análise', 'atividade'],
  ['Nomes dos aplicadores', 'aplicadores'],
  ['Data da análise', 'dataAnalise'],
  ['Área de atuação', 'area'],
  ['Gerência', 'gerencia'],
  ['Supervisão/Coordenação', 'supervisao'],
  ['Revisão', 'revisao'],
  ['Data da revisão', 'dataRevisao'],
];

/** Build the field-collection workbook — the data source consumed by the analysis module. */
export async function buildFieldWorkbook(project: Project): Promise<ExcelJS.Workbook> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'SMED Up';
  wb.created = new Date();
  const ws = wb.addWorksheet('Coleta de Campo');
  ws.columns = [{ width: 28 }, { width: 34 }, { width: 42 }, { width: 12 }, { width: 12 }, { width: 16 }];

  ws.mergeCells('A1:F1');
  const title = ws.getCell('A1');
  title.value = 'SMED - Coleta de Campo';
  title.font = { name: 'HELVETICA', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
  title.alignment = { horizontal: 'center', vertical: 'middle' };
  title.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BRAND } };
  ws.getRow(1).height = 24;

  INFO_ROWS.forEach(([lbl, key], i) => {
    const r = i + 2;
    const l = ws.getCell(`A${r}`);
    l.value = lbl;
    l.font = { bold: true };
    ws.getCell(`B${r}`).value = project.basicInfo[key] || '';
  });

  const headerRow = INFO_ROWS.length + 3; // -> row 11
  FIELD_HEADERS.forEach((h, i) => {
    const cell = ws.getCell(headerRow, i + 1);
    cell.value = h;
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BRAND } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  });

  project.tasks.forEach((task, i) => {
    const r = headerRow + 1 + i;
    ws.getCell(r, 1).value = task.tarefa;
    ws.getCell(r, 2).value = task.task;
    ws.getCell(r, 3).value = task.descricao;
    ws.getCell(r, 4).value = task.inicio;
    ws.getCell(r, 5).value = task.fim;
    ws.getCell(r, 6).value = task.analiseIE === 'interna' ? 'Interna' : 'Externa';
    ws.getCell(r, 3).alignment = { wrapText: true };
  });

  ws.views = [{ state: 'frozen', ySplit: headerRow }];

  return wb;
}

/** Build and download the field-collection workbook. */
export async function exportFieldCollection(project: Project): Promise<void> {
  const wb = await buildFieldWorkbook(project);
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  downloadBlob(blob, `Coleta SMED - ${safeFileName(project.name)}.xlsx`);
}
