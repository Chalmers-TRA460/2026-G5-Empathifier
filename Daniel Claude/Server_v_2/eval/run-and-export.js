// Runs the full eval against eval/cases/sample.jsonl, then writes an Excel
// workbook with one curated-example sheet, a summary sheet, and a full-results
// sheet. Saves the raw JSON alongside in case the workbook is ever re-built.

const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const { runEval } = require('./runner');
const { MUTATIONS } = require('./mutations');

const CAUGHT_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD5F5E3' } };
const MISSED_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFADBD8' } };
const HEADER_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E6EC' } };

function loadCases() {
  const casesPath = path.join(__dirname, 'cases/sample.jsonl');
  return fs.readFileSync(casesPath, 'utf8')
    .split('\n').map(l => l.trim()).filter(Boolean)
    .map(l => JSON.parse(l));
}

function formatFlagged(verdict) {
  if (!verdict) return '';
  const altered = (verdict.altered || []).map(a => `altered: ${a}`);
  const added = (verdict.added || []).map(a => `added: ${a}`);
  return [...altered, ...added].join('\n');
}

function formatPct(rate) {
  return `${Math.round(rate * 100)}%`;
}

function buildExampleRows(results) {
  const byMutation = {};
  for (const r of results) {
    if (!byMutation[r.mutation]) byMutation[r.mutation] = [];
    byMutation[r.mutation].push(r);
  }

  const rows = [];
  for (const mutation of MUTATIONS) {
    const entries = byMutation[mutation.id] || [];
    const caught = entries.filter(e => e.caught);
    const missed = entries.filter(e => !e.caught);

    if (entries.length === 0) {
      rows.push({
        mutation: mutation.id,
        category: mutation.category,
        caught: '(insufficient material)',
        caseId: '',
        patientMessage: '',
        doctorNotes: '',
        baselineReply: '',
        mutationApplied: '',
        mutatedReply: '',
        verdict: '',
        flagged: '',
        explanation: '',
      });
      continue;
    }

    if (caught.length > 0) {
      rows.push(toRow(caught[0]));
    }
    for (let i = 0; i < Math.min(3, missed.length); i++) {
      rows.push(toRow(missed[i]));
    }
  }
  return rows;
}

function toRow(r) {
  return {
    mutation: r.mutation,
    category: r.category,
    caught: r.caught ? 'yes' : 'no',
    caseId: r.caseId,
    patientMessage: r.patientMessage || '',
    doctorNotes: r.doctorNotes || '',
    baselineReply: r.baselineReply || '',
    mutationApplied: r.mutationApplied || '',
    mutatedReply: r.mutatedReply || '',
    verdict: r.verdict ? r.verdict.verdict : (r.error ? 'error' : ''),
    flagged: formatFlagged(r.verdict),
    explanation: r.verdict ? (r.verdict.explanation || '') : (r.error || ''),
  };
}

function colorCaughtColumn(ws, columnKey) {
  const col = ws.getColumn(columnKey);
  col.eachCell({ includeEmpty: false }, (cell, rowNum) => {
    if (rowNum === 1) return;
    if (cell.value === 'yes') cell.fill = CAUGHT_FILL;
    else if (cell.value === 'no') cell.fill = MISSED_FILL;
  });
}

function styleHeader(row) {
  row.font = { bold: true };
  row.fill = HEADER_FILL;
}

async function buildWorkbook(result) {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Empathetic Portal Eval Harness';
  wb.created = new Date();

  // === Sheet: Examples ===
  const ws1 = wb.addWorksheet('Examples');
  ws1.columns = [
    { header: 'Mutation', key: 'mutation', width: 32 },
    { header: 'Category', key: 'category', width: 18 },
    { header: 'Caught?', key: 'caught', width: 10 },
    { header: 'Case ID', key: 'caseId', width: 30 },
    { header: 'Patient message', key: 'patientMessage', width: 55 },
    { header: "Doctor's notes", key: 'doctorNotes', width: 50 },
    { header: 'Original (baseline) reply', key: 'baselineReply', width: 60 },
    { header: 'Mutation applied', key: 'mutationApplied', width: 45 },
    { header: 'Mutated reply', key: 'mutatedReply', width: 60 },
    { header: 'Verifier verdict', key: 'verdict', width: 12 },
    { header: 'Verifier flagged (altered / added)', key: 'flagged', width: 55 },
    { header: 'Verifier explanation', key: 'explanation', width: 55 },
  ];
  styleHeader(ws1.getRow(1));
  for (const row of buildExampleRows(result.results)) ws1.addRow(row);
  ws1.eachRow({ includeEmpty: false }, row => {
    row.alignment = { vertical: 'top', wrapText: true };
  });
  colorCaughtColumn(ws1, 'caught');
  ws1.views = [{ state: 'frozen', xSplit: 3, ySplit: 1 }];

  // === Sheet: Summary ===
  const ws2 = wb.addWorksheet('Summary');
  ws2.getColumn(1).width = 32;
  ws2.getColumn(2).width = 18;
  ws2.getColumn(3).width = 12;
  ws2.getColumn(4).width = 12;
  ws2.getColumn(5).width = 14;

  let row = ws2.addRow(['Overall']);
  row.font = { bold: true, size: 14 };
  ws2.addRow(['Run timestamp', result.timestamp]);
  ws2.addRow(['Cases in pool', result.config.caseCount]);
  ws2.addRow(['Target N per mutation', result.config.targetN]);
  ws2.addRow(['Mutation types', result.config.mutationCount]);
  ws2.addRow(['Total tests run', result.summary.overall.total]);
  ws2.addRow(['Caught', result.summary.overall.caught]);
  const overallRow = ws2.addRow(['Overall catch rate', formatPct(result.summary.overall.catchRate)]);
  overallRow.font = { bold: true };
  ws2.addRow([]);

  row = ws2.addRow(['Per category']);
  row.font = { bold: true, size: 14 };
  const catHeader = ws2.addRow(['Category', 'Total', 'Caught', 'Catch rate']);
  styleHeader(catHeader);
  for (const [cat, m] of Object.entries(result.summary.byCategory)) {
    ws2.addRow([cat, m.total, m.caught, formatPct(m.catchRate)]);
  }
  ws2.addRow([]);

  row = ws2.addRow(['Per mutation (sorted by catch rate, weakest first)']);
  row.font = { bold: true, size: 14 };
  const mutHeader = ws2.addRow(['Mutation', 'Category', 'Total', 'Caught', 'Catch rate']);
  styleHeader(mutHeader);
  const sorted = Object.entries(result.summary.byMutation).sort((a, b) => a[1].catchRate - b[1].catchRate);
  for (const [id, m] of sorted) {
    ws2.addRow([id, m.category, m.total, m.caught, formatPct(m.catchRate)]);
  }

  if (result.summary.insufficientMutations.length > 0) {
    ws2.addRow([]);
    row = ws2.addRow(['Insufficient source material (achieved < target N)']);
    row.font = { bold: true, size: 14 };
    const insHeader = ws2.addRow(['Mutation', 'Achieved', 'Target N', 'Inapplicable', 'Errors']);
    styleHeader(insHeader);
    for (const im of result.summary.insufficientMutations) {
      ws2.addRow([im.mutation, im.achieved, im.targetN, im.inapplicableCount, im.errorCount]);
    }
  }

  // === Sheet: All results ===
  const ws3 = wb.addWorksheet('All results');
  ws3.columns = [
    { header: 'Case', key: 'caseId', width: 30 },
    { header: 'Mutation', key: 'mutation', width: 32 },
    { header: 'Category', key: 'category', width: 18 },
    { header: 'Caught?', key: 'caught', width: 10 },
    { header: 'Verifier verdict', key: 'verdict', width: 12 },
    { header: 'Mutation applied', key: 'mutationApplied', width: 45 },
    { header: 'Mutated reply', key: 'mutatedReply', width: 60 },
    { header: 'Verifier flagged', key: 'flagged', width: 55 },
  ];
  styleHeader(ws3.getRow(1));
  for (const r of result.results) {
    ws3.addRow({
      caseId: r.caseId,
      mutation: r.mutation,
      category: r.category,
      caught: r.caught ? 'yes' : 'no',
      verdict: r.verdict ? r.verdict.verdict : (r.error ? 'error' : ''),
      mutationApplied: r.mutationApplied || '',
      mutatedReply: r.mutatedReply || '',
      flagged: formatFlagged(r.verdict),
    });
  }
  ws3.eachRow({ includeEmpty: false }, row => {
    row.alignment = { vertical: 'top', wrapText: true };
  });
  colorCaughtColumn(ws3, 'caught');
  ws3.views = [{ state: 'frozen', xSplit: 1, ySplit: 1 }];

  return wb;
}

async function main() {
  const cases = loadCases();
  console.log(`Loaded ${cases.length} cases. Running eval with N=5 per mutation type…`);
  const start = Date.now();

  const result = await runEval({ cases, targetN: 5 });

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`Eval finished in ${elapsed}s.`);
  console.log(`Overall: ${result.summary.overall.caught} / ${result.summary.overall.total} caught (${formatPct(result.summary.overall.catchRate)})`);

  const resultsDir = path.join(__dirname, 'results');
  fs.mkdirSync(resultsDir, { recursive: true });
  const stamp = result.timestamp.replace(/[:.]/g, '-');
  const xlsxPath = path.join(resultsDir, `eval-${stamp}.xlsx`);
  const jsonPath = path.join(resultsDir, `eval-${stamp}.json`);

  const wb = await buildWorkbook(result);
  await wb.xlsx.writeFile(xlsxPath);
  fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2));

  console.log(`\nWrote ${xlsxPath}`);
  console.log(`Wrote ${jsonPath}`);

  if (result.summary.insufficientMutations.length > 0) {
    console.log(`\nInsufficient source material (achieved < target N):`);
    for (const im of result.summary.insufficientMutations) {
      console.log(`  ${im.mutation}: ${im.achieved}/${im.targetN}`);
    }
  }
}

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
