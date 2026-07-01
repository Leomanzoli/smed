import ExcelJS from 'exceljs';
import type { Project } from '../../types';
import { emptyAnalysis } from '../../types';
import { computeRow } from '../analysis';
import { minutesToExcelSerial, timeToMinutes } from '../time';
import { downloadBlob, safeFileName } from '../download';
import * as C from './constants';

const WHITE = 'FFFFFFFF';
const THIN = { style: 'thin' as const, color: { argb: 'FFBFBFBF' } };
const BORDER = { top: THIN, left: THIN, bottom: THIN, right: THIN };

function sheetName(name: string): string {
  const clean = (name || 'SMED').replace(/[\\/*?:[\]]/g, ' ').trim();
  return clean.slice(0, 31) || 'SMED';
}

function isoToDate(iso: string): Date | null {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(Date.UTC(y, m - 1, d));
}

/** Build the filled SMED workbook (matching the official template). Pure — no DOM. */
export async function buildSmedWorkbook(project: Project): Promise<ExcelJS.Workbook> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'SMED Up';
  wb.created = new Date();

  const ws = wb.addWorksheet(sheetName(project.name), {
    views: [{ state: 'frozen', ySplit: C.HEADER_ROW_SUB }],
    pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
  });

  for (const [col, w] of Object.entries(C.COLUMN_WIDTHS)) ws.getColumn(col).width = w;

  const baseFont = { name: C.FONT_NAME, size: C.FONT_SIZE };
  const solid = (argb: string) => ({ type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb } });

  // ---- Title (B2:S2) ----
  ws.mergeCells(`B${C.TITLE_ROW}:S${C.TITLE_ROW}`);
  const title = ws.getCell(`B${C.TITLE_ROW}`);
  title.value = C.LABELS.title;
  title.font = { ...baseFont, bold: true, color: { argb: WHITE } };
  title.alignment = { horizontal: 'center', vertical: 'middle' };
  title.fill = solid(C.BRAND_ARGB);
  ws.getRow(C.TITLE_ROW).height = 27.75;

  // ---- Basic info (rows 4-5) ----
  const info = project.basicInfo;
  const label = (range: string, text: string) => {
    const [start] = range.split(':');
    ws.mergeCells(range);
    const cell = ws.getCell(start);
    cell.value = text;
    cell.font = { ...baseFont, bold: true };
    cell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
    cell.fill = solid(C.SUBHEADER_ARGB);
    cell.border = BORDER;
    return cell;
  };
  const value = (range: string, val: ExcelJS.CellValue, numFmt?: string, align: 'left' | 'center' = 'left') => {
    const [start] = range.split(':');
    ws.mergeCells(range);
    const cell = ws.getCell(start);
    cell.value = val;
    cell.font = baseFont;
    cell.alignment = { horizontal: align, vertical: 'middle', wrapText: true };
    cell.border = BORDER;
    if (numFmt) cell.numFmt = numFmt;
    return cell;
  };

  label('B4:G4', `${C.LABELS.atividade} ${info.atividade}`.trim());
  ws.mergeCells('B5:G5');
  ws.getCell('B5').fill = solid(C.SUBHEADER_ARGB);
  ws.getCell('B5').border = BORDER;

  label('H4:I4', C.LABELS.dataAnalise);
  value('H5:I5', isoToDate(info.dataAnalise), C.FMT_DATE, 'center');
  label('J4:P4', C.LABELS.elaborador);
  value('J5:P5', info.aplicadores, undefined, 'left');
  label('Q4:R4', C.LABELS.revisao);
  value('Q5:R5', info.revisao, undefined, 'center');
  label('S4:S4', C.LABELS.dataRevisao);
  value('S5:S5', isoToDate(info.dataRevisao), C.FMT_DATE, 'center');

  // ---- Column headers (rows 7-8) ----
  const headerCell = (addr: string, text: string) => {
    const cell = ws.getCell(addr);
    cell.value = text;
    cell.font = { ...baseFont, bold: true, color: { argb: WHITE } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.fill = solid(C.HEADER_ARGB);
    cell.border = BORDER;
  };
  const headerMerges: [string, string][] = [
    ['B7:B8', C.LABELS.tarefa],
    ['C7:C8', C.LABELS.task],
    ['D7:G7', project.sectionLabel || info.atividade || ''],
    ['H7:I7', C.LABELS.analiseIE],
    ['J7:K7', C.LABELS.tempoGroup],
    ['L7:O7', C.LABELS.ecrs],
    ['P7:P8', C.LABELS.ganho],
    ['Q7:Q8', C.LABELS.tempoFinalHeader],
    ['R7:S7', C.LABELS.kaizen],
  ];
  for (const [range, text] of headerMerges) {
    ws.mergeCells(range);
    headerCell(range.split(':')[0], text);
    // ensure the merged partner cells also carry fill/border
    ws.getCell(range.split(':')[1]).fill = solid(C.HEADER_ARGB);
    ws.getCell(range.split(':')[1]).border = BORDER;
  }
  const subHeaders: [string, string][] = [
    ['D8', C.LABELS.descricao],
    ['E8', C.LABELS.inicio],
    ['F8', C.LABELS.fim],
    ['G8', C.LABELS.tempo],
    ['H8', C.LABELS.interna],
    ['I8', C.LABELS.externa],
    ['J8', C.LABELS.interno],
    ['K8', C.LABELS.externo],
    ['L8', C.LABELS.E],
    ['M8', C.LABELS.C],
    ['N8', C.LABELS.R],
    ['O8', C.LABELS.S],
    ['R8', C.LABELS.qual],
    ['S8', C.LABELS.oQueE],
  ];
  for (const [addr, text] of subHeaders) headerCell(addr, text);
  ws.getRow(C.HEADER_ROW_TOP).height = 16.5;
  ws.getRow(C.HEADER_ROW_SUB).height = 16.5;

  // ---- Data rows ----
  const start = C.DATA_START_ROW;
  const dataCell = (
    addr: string,
    val: ExcelJS.CellValue,
    opts: { numFmt?: string; align?: 'left' | 'center' | 'right'; wrap?: boolean; bold?: boolean } = {},
  ) => {
    const cell = ws.getCell(addr);
    cell.value = val;
    cell.font = { ...baseFont, bold: !!opts.bold };
    cell.alignment = { horizontal: opts.align ?? 'center', vertical: 'middle', wrapText: !!opts.wrap };
    cell.border = BORDER;
    if (opts.numFmt) cell.numFmt = opts.numFmt;
    return cell;
  };
  const listValidation = (addr: string) => {
    ws.getCell(addr).dataValidation = { type: 'list', allowBlank: true, formulae: ['"X,x"'] };
  };

  project.tasks.forEach((task, i) => {
    const r = start + i;
    const comp = computeRow(task, project.analysis[task.id] ?? emptyAnalysis());
    const iniMin = timeToMinutes(task.inicio);
    const fimMin = timeToMinutes(task.fim);

    dataCell(`B${r}`, task.tarefa, { align: 'center', wrap: true });
    const taskNum = Number(task.task);
    dataCell(`C${r}`, task.task && !Number.isNaN(taskNum) ? taskNum : task.task || null);
    dataCell(`D${r}`, task.descricao, { align: 'left', wrap: true });
    dataCell(`E${r}`, iniMin === null ? null : minutesToExcelSerial(iniMin), { numFmt: C.FMT_CLOCK });
    dataCell(`F${r}`, fimMin === null ? null : minutesToExcelSerial(fimMin), { numFmt: C.FMT_CLOCK });
    dataCell(`G${r}`, { formula: `F${r}-E${r}` }, { numFmt: C.FMT_DURATION });
    dataCell(`H${r}`, task.analiseIE === 'interna' ? 'X' : null);
    dataCell(`I${r}`, task.analiseIE === 'externa' ? 'X' : null);
    dataCell(`J${r}`, { formula: `IF(H${r}="X",G${r},0)` }, { numFmt: C.FMT_DURATION });
    dataCell(`K${r}`, { formula: `IF(I${r}="X",G${r},0)` }, { numFmt: C.FMT_DURATION });

    const a = project.analysis[task.id] ?? emptyAnalysis();
    for (const c of ['L', 'M', 'N', 'O']) dataCell(`${c}${r}`, null);
    if (a.ecrs) {
      const key = C.ECRS_COLUMN[a.ecrs];
      dataCell(`${C.COL[key]}${r}`, 'X');
    }
    dataCell(`P${r}`, comp.ganho > 0 ? minutesToExcelSerial(comp.ganho) : null, { numFmt: C.FMT_DURATION });
    dataCell(`Q${r}`, { formula: `G${r}-P${r}` }, { numFmt: C.FMT_DURATION, bold: true });
    dataCell(`R${r}`, a.kaizen, { align: 'center', wrap: true });
    dataCell(`S${r}`, a.oQueE, { align: 'left', wrap: true });

    for (const c of ['H', 'I', 'L', 'M', 'N', 'O']) listValidation(`${c}${r}`);
    ws.getRow(r).height = 24;
  });

  const n = project.tasks.length;
  if (n > 0) {
    const last = start + n - 1;
    const t = start + n;
    dataCell(`D${t}`, C.LABELS.total, { align: 'right', bold: true });
    dataCell(`G${t}`, { formula: `SUBTOTAL(9,G${start}:G${last})` }, { numFmt: C.FMT_TOTAL, bold: true });
    dataCell(`J${t}`, { formula: `SUBTOTAL(9,J${start}:J${last})` }, { numFmt: C.FMT_TOTAL, bold: true });
    dataCell(`K${t}`, { formula: `SUBTOTAL(9,K${start}:K${last})` }, { numFmt: C.FMT_TOTAL, bold: true });
    dataCell(`P${t}`, { formula: `SUM(P${start}:P${last})` }, { numFmt: C.FMT_TOTAL, bold: true });
    dataCell(`Q${t}`, { formula: `SUM(Q${start}:Q${last})` }, { numFmt: C.FMT_TOTAL, bold: true });
    for (const c of ['B', 'C', 'E', 'F', 'H', 'I', 'L', 'M', 'N', 'O', 'R', 'S'])
      ws.getCell(`${c}${t}`).fill = solid(C.TOTAL_ARGB);
    for (const c of ['D', 'G', 'J', 'K', 'P', 'Q']) ws.getCell(`${c}${t}`).fill = solid(C.TOTAL_ARGB);

    const rr = t + 1;
    dataCell(`P${rr}`, C.LABELS.reducao, { align: 'right', bold: true });
    dataCell(`Q${rr}`, { formula: `IF(G${t}=0,0,1-(Q${t}/G${t}))` }, { numFmt: C.FMT_PERCENT, bold: true });
  }

  return wb;
}

/** Build and download the filled SMED form. */
export async function exportSmedForm(project: Project): Promise<void> {
  const wb = await buildSmedWorkbook(project);
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  downloadBlob(blob, `Formulario SMED - ${safeFileName(project.name)}.xlsx`);
}