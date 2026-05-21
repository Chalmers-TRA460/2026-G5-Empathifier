require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const { runEval } = require('./runner');
const { MUTATIONS, CATEGORIES } = require('./mutations');

const app = express();
const PORT = process.env.EVAL_PORT || 3001;

app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/mutations', (_req, res) => {
  res.json({
    categories: CATEGORIES,
    mutations: MUTATIONS.map(m => ({ id: m.id, category: m.category, directive: m.directive })),
  });
});

app.get('/api/sample', (_req, res) => {
  try {
    const samplePath = path.join(__dirname, 'cases', 'sample.jsonl');
    if (!fs.existsSync(samplePath)) return res.json({ cases: [] });
    const text = fs.readFileSync(samplePath, 'utf8');
    const cases = text
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean)
      .map(l => JSON.parse(l));
    res.json({ cases });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
});

app.post('/api/run', async (req, res) => {
  const { cases, targetN } = req.body;
  if (!Array.isArray(cases) || cases.length === 0) {
    return res.status(400).json({ error: 'cases must be a non-empty array' });
  }
  const requiredKeys = ['id', 'patientMessage', 'doctorNotes', 'reply'];
  for (const c of cases) {
    for (const k of requiredKeys) {
      if (!c[k]) return res.status(400).json({ error: `case missing required key: ${k}` });
    }
  }
  const n = Number.isFinite(targetN) && targetN > 0 ? Math.floor(targetN) : 5;

  try {
    const result = await runEval({ cases, targetN: n });
    res.json(result);
  } catch (e) {
    console.error('eval run failed', e);
    res.status(500).json({ error: String(e.message || e) });
  }
});

app.listen(PORT, () => {
  console.log(`Eval harness listening on http://localhost:${PORT}`);
});
