import os from 'node:os';
import path from 'node:path';
import { buildSmedWorkbook } from '../src/lib/excel/smedExport';
import { buildFieldWorkbook } from '../src/lib/excel/fieldExport';
import { parseFieldWorkbook } from '../src/lib/excel/fieldImport';
import { emptyAnalysis, type Project } from '../src/types';

function makeProject(): Project {
  const now = new Date().toISOString();
  const tasks: Project['tasks'] = [
    { id: 't1', tarefa: 'Mobilização', task: '1', descricao: 'Chegada da equipe', inicio: '07:00', fim: '07:22', analiseIE: 'externa' },
    { id: 't2', tarefa: 'Preparação', task: '2', descricao: 'Preparação das caminhonetes', inicio: '07:22', fim: '08:17', analiseIE: 'interna' },
    { id: 't3', tarefa: 'Ajuste', task: '3', descricao: 'Ajuste final', inicio: '08:17', fim: '08:30', analiseIE: 'interna' },
  ];
  const analysis: Project['analysis'] = {
    t1: emptyAnalysis(),
    t2: { ...emptyAnalysis(), reanaliseIE: 'externa', ecrs: 'reduzir', ganhoEstimado: 10, ganhoManual: true, kaizen: 'Kit pré-montado', oQueE: 'Preparar kits na véspera' },
    t3: emptyAnalysis(),
  };
  return {
    id: 'p1',
    name: 'Teste SMED',
    createdAt: now,
    updatedAt: now,
    schemaVersion: 1,
    sectionLabel: 'Roço na ERM',
    basicInfo: {
      atividade: 'Roço na ERM',
      aplicadores: 'Leonardo Manzoli Stoco',
      dataAnalise: '2025-10-23',
      area: 'Manutenção viária',
      gerencia: 'Gerência X',
      supervisao: 'Coordenação Y',
      revisao: '01',
      dataRevisao: '2026-10-26',
    },
    tasks,
    analysis,
    actionPlan: [],
  };
}

async function main() {
  const project = makeProject();
  const smedPath = path.join(os.tmpdir(), 'smed-verify.xlsx');
  const fieldPath = path.join(os.tmpdir(), 'field-verify.xlsx');

  const smedWb = await buildSmedWorkbook(project);
  await smedWb.xlsx.writeFile(smedPath);

  const fieldWb = await buildFieldWorkbook(project);
  await fieldWb.xlsx.writeFile(fieldPath);

  const buf = await fieldWb.xlsx.writeBuffer();
  const parsed = await parseFieldWorkbook(buf as unknown as ArrayBuffer);

  const checks: [string, boolean][] = [
    ['field tasks count = 3', parsed.tasks.length === 3],
    ['field task1 tarefa', parsed.tasks[0]?.tarefa === 'Mobilização'],
    ['field task1 inicio 07:00', parsed.tasks[0]?.inicio === '07:00'],
    ['field task1 fim 07:22', parsed.tasks[0]?.fim === '07:22'],
    ['field task1 externa', parsed.tasks[0]?.analiseIE === 'externa'],
    ['field task2 interna', parsed.tasks[1]?.analiseIE === 'interna'],
    ['field basicInfo atividade', parsed.basicInfo.atividade === 'Roço na ERM'],
    ['field basicInfo dataAnalise', parsed.basicInfo.dataAnalise === '2025-10-23'],
  ];

  let ok = true;
  for (const [name, pass] of checks) {
    console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}`);
    if (!pass) ok = false;
  }
  console.log('SMED_FILE=' + smedPath);
  console.log('FIELD_FILE=' + fieldPath);
  console.log(ok ? 'ALL_FIELD_CHECKS_PASS' : 'SOME_FIELD_CHECKS_FAIL');
  if (!ok) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
