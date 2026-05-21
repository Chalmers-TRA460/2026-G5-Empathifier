/*
This file creates the frontend app for the mutation evaluation tool.
Similar to the product app. 
*/

const $ = (id) => document.getElementById(id);

const casesEl = $('cases');
const caseCountEl = $('caseCount');
const targetNEl = $('targetN');
const runBtn = $('runBtn');
const statusEl = $('status');
const resultsPanel = $('resultsPanel');
const overallEl = $('overall');
const categoryTable = $('categoryTable');
const mutationTable = $('mutationTable');
const insufficientPanel = $('insufficientPanel');
const resultsTable = $('resultsTable');
const loadSampleBtn = $('loadSample');
const exportCsvBtn = $('exportCsv');

let lastResult = null;

function parseCases(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const cases = [];
  for (let i = 0; i < lines.length; i++) {
    try {
      cases.push(JSON.parse(lines[i]));
    } catch (e) {
      throw new Error(`Line ${i + 1} is not valid JSON: ${e.message}`);
    }
  }
  return cases;
}

function updateCaseCount() {
  try {
    const cases = parseCases(casesEl.value);
    caseCountEl.textContent = `${cases.length} case${cases.length === 1 ? '' : 's'}`;
    caseCountEl.style.color = '';
  } catch (e) {
    caseCountEl.textContent = e.message;
    caseCountEl.style.color = '#c0392b';
  }
}

casesEl.addEventListener('input', updateCaseCount);

loadSampleBtn.addEventListener('click', async () => {
  try {
    const r = await fetch('/api/sample');
    const data = await r.json();
    if (!data.cases || data.cases.length === 0) {
      statusEl.textContent = 'No sample file found.';
      return;
    }
    casesEl.value = data.cases.map(c => JSON.stringify(c)).join('\n');
    updateCaseCount();
    statusEl.textContent = '';
  } catch (e) {
    statusEl.textContent = `Failed to load sample: ${e.message}`;
  }
});

runBtn.addEventListener('click', async () => {
  let cases;
  try {
    cases = parseCases(casesEl.value);
  } catch (e) {
    statusEl.textContent = e.message;
    statusEl.style.color = '#c0392b';
    return;
  }
  if (cases.length === 0) {
    statusEl.textContent = 'Provide at least one case.';
    statusEl.style.color = '#c0392b';
    return;
  }
  const targetN = parseInt(targetNEl.value, 10) || 5;

  runBtn.disabled = true;
  statusEl.style.color = '';
  statusEl.textContent = `Running ${cases.length} cases × 21 mutations × N=${targetN}... this can take 30–90 s.`;

  try {
    const r = await fetch('/api/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cases, targetN }),
    });
    const data = await r.json();
    if (!r.ok) {
      throw new Error(data.error || 'Run failed');
    }
    lastResult = data;
    renderResults(data);
    statusEl.textContent = `Done. ${data.summary.overall.total} tests, ${data.summary.overall.caught} caught.`;
  } catch (e) {
    statusEl.textContent = `Failed: ${e.message}`;
    statusEl.style.color = '#c0392b';
  } finally {
    runBtn.disabled = false;
  }
});

function rateClass(rate) {
  if (rate >= 0.8) return 'good';
  if (rate >= 0.5) return 'mid';
  return 'bad';
}

function pct(rate) {
  return `${Math.round(rate * 100)}%`;
}

function renderResults(data) {
  resultsPanel.classList.remove('hidden');

  const { overall, byCategory, byMutation, insufficientMutations } = data.summary;
  overallEl.innerHTML = `Overall catch rate: <strong>${pct(overall.catchRate)}</strong> &nbsp; (${overall.caught} / ${overall.total})`;

  categoryTable.innerHTML = `
    <thead><tr><th>Category</th><th>Caught</th><th>Total</th><th>Catch rate</th></tr></thead>
    <tbody>
      ${Object.entries(byCategory).map(([cat, m]) => `
        <tr>
          <td>${cat}</td>
          <td>${m.caught}</td>
          <td>${m.total}</td>
          <td class="rate ${rateClass(m.catchRate)}">${pct(m.catchRate)}</td>
        </tr>
      `).join('')}
    </tbody>
  `;

  const mutEntries = Object.entries(byMutation).sort((a, b) => a[1].catchRate - b[1].catchRate);
  mutationTable.innerHTML = `
    <thead><tr><th>Mutation</th><th>Category</th><th>Caught</th><th>Total</th><th>Catch rate</th></tr></thead>
    <tbody>
      ${mutEntries.map(([id, m]) => `
        <tr>
          <td>${id}</td>
          <td>${m.category}</td>
          <td>${m.caught}</td>
          <td>${m.total}</td>
          <td class="rate ${rateClass(m.catchRate)}">${pct(m.catchRate)}</td>
        </tr>
      `).join('')}
    </tbody>
  `;

  if (insufficientMutations.length > 0) {
    insufficientPanel.classList.remove('hidden');
    insufficientPanel.innerHTML = `<strong>Insufficient source material</strong> for these mutations (achieved &lt; target N): ` +
      insufficientMutations.map(m => `<code>${m.mutation}</code> (${m.achieved}/${m.targetN})`).join(', ');
  } else {
    insufficientPanel.classList.add('hidden');
    insufficientPanel.innerHTML = '';
  }

  resultsTable.innerHTML = `
    <thead>
      <tr>
        <th>Case</th>
        <th>Mutation</th>
        <th>Verdict</th>
        <th>Caught?</th>
        <th>What verifier flagged</th>
      </tr>
    </thead>
    <tbody>
      ${data.results.map((r, i) => renderRow(r, i)).join('')}
    </tbody>
  `;

  // Attach expand-on-click
  resultsTable.querySelectorAll('tr.expandable').forEach(row => {
    row.addEventListener('click', () => {
      const idx = row.dataset.idx;
      const detail = resultsTable.querySelector(`tr.detail-row[data-idx="${idx}"]`);
      detail.classList.toggle('hidden');
    });
  });
}

function renderRow(r, idx) {
  const verdict = r.verdict ? r.verdict.verdict : 'error';
  const flagged = r.verdict ? [
    ...(r.verdict.altered || []).map(a => `altered: ${a}`),
    ...(r.verdict.added || []).map(a => `added: ${a}`),
  ].join('; ') : (r.error || '');
  const caughtClass = r.caught ? 'caught-yes' : 'caught-no';
  const caughtLabel = r.caught ? 'YES' : 'no';
  return `
    <tr class="expandable" data-idx="${idx}">
      <td>${escapeHtml(r.caseId)}</td>
      <td>${r.mutation}</td>
      <td>${verdict}</td>
      <td class="${caughtClass}">${caughtLabel}</td>
      <td>${escapeHtml(flagged || '(nothing flagged)')}</td>
    </tr>
    <tr class="detail-row hidden" data-idx="${idx}">
      <td colspan="5">
        <span class="label">Mutation applied:</span>${escapeHtml(r.mutationApplied || '')}
        <span class="label">Patient message:</span>${escapeHtml(r.patientMessage)}
        <span class="label">Doctor's notes:</span>${escapeHtml(r.doctorNotes)}
        <span class="label">Baseline reply:</span>${escapeHtml(r.baselineReply)}
        <span class="label">Mutated reply:</span>${escapeHtml(r.mutatedReply)}
        <span class="label">Verifier explanation:</span>${escapeHtml(r.verdict ? r.verdict.explanation : (r.error || ''))}
      </td>
    </tr>
  `;
}

function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

exportCsvBtn.addEventListener('click', () => {
  if (!lastResult) return;
  const cols = ['caseId', 'mutation', 'category', 'caught', 'verdict', 'altered', 'added', 'mutationApplied', 'mutatedReply'];
  const rows = lastResult.results.map(r => ({
    caseId: r.caseId,
    mutation: r.mutation,
    category: r.category,
    caught: r.caught,
    verdict: r.verdict ? r.verdict.verdict : 'error',
    altered: r.verdict ? (r.verdict.altered || []).join(' | ') : '',
    added: r.verdict ? (r.verdict.added || []).join(' | ') : '',
    mutationApplied: r.mutationApplied || '',
    mutatedReply: r.mutatedReply || '',
  }));
  const csv = [
    cols.join(','),
    ...rows.map(row => cols.map(c => csvEscape(row[c])).join(',')),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `eval-results-${new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
});

function csvEscape(v) {
  const s = String(v ?? '');
  if (/[,"\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}
