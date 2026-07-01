import ExcelJS from 'exceljs';
import type { ActionItem, Project } from '../../types';
import { downloadBlob, safeFileName } from '../download';

const BRAND = 'FF007E7A';
const HEADERS = ['O quê?', 'Por quê?', 'Onde?', 'Quando?', 'Quem?', 'Como?', 'Quanto?', 'Matrícula', 'E-mail'];
const KEYS: (keyof Omit<ActionItem, 'id'>)[] = [
  'oQue',
  'porQue',
  'onde',
  'quando',
  'quem',
  'como',
  'quanto',
  'matricula',
  'email',
];

/** Export the 5W2H action plan. */
export async function exportActionPlan(project: Project): Promise<void> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'SMED Up';
  wb.created = new Date();
  const ws = wb.addWorksheet('Plano de Ação 5W2H');
  ws.columns = HEADERS.map((_, i) => ({ width: i < 7 ? 24 : 18 }));

  ws.mergeCells(1, 1, 1, HEADERS.length);
  const title = ws.getCell(1, 1);
  title.value = `Plano de Ação (5W2H) — ${project.name}`;
  title.font = { name: 'HELVETICA', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
  title.alignment = { horizontal: 'center', vertical: 'middle' };
  title.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BRAND } };
  ws.getRow(1).height = 24;

  HEADERS.forEach((h, i) => {
    const c = ws.getCell(2, i + 1);
    c.value = h;
    c.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BRAND } };
    c.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  });

  project.actionPlan.forEach((item, i) => {
    const r = 3 + i;
    KEYS.forEach((k, ci) => {
      const c = ws.getCell(r, ci + 1);
      c.value = item[k] || '';
      c.alignment = { vertical: 'top', wrapText: true };
    });
  });

  ws.views = [{ state: 'frozen', ySplit: 2 }];

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  downloadBlob(blob, `Plano de Acao 5W2H - ${safeFileName(project.name)}.xlsx`);
}
