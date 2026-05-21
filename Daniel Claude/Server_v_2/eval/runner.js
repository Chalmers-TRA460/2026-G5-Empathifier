/*
This part runs the mutation and verification and the agents in agents.js. 
The adversary rewrites the doctor's reply to introduce the flaw defined by that mutation.
Cases that can't have the mutation meaningfully applied are skipped.
*/
const { runVerifier, runAdversary } = require('./agents');
const { MUTATIONS, CATEGORIES } = require('./mutations');

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function runMutationType({ mutation, cases, targetN }) {
  const successful = [];
  const inapplicable = [];
  const errors = [];
  const queue = shuffle(cases);

  for (const sourceCase of queue) {
    if (successful.length >= targetN) break;

    try {
      const advResult = await runAdversary({
        patientMessage: sourceCase.patientMessage,
        doctorNotes: sourceCase.doctorNotes,
        baselineReply: sourceCase.reply,
        mutationDirective: mutation.directive,
      });

      if (!advResult.applicable || !advResult.mutatedReply) {
        inapplicable.push({ caseId: sourceCase.id });
        continue;
      }

      successful.push({
        caseId: sourceCase.id,
        sourceCase,
        mutatedReply: advResult.mutatedReply,
        mutationApplied: advResult.mutationApplied,
      });
    } catch (e) {
      errors.push({ caseId: sourceCase.id, error: String(e.message || e) });
    }
  }

  return {
    mutation: mutation.id,
    category: mutation.category,
    targetN,
    achieved: successful.length,
    inapplicableCount: inapplicable.length,
    errorCount: errors.length,
    successful,
  };
}

/*
The verifier tries cathcing the mutations and return a verdict. 
Handlse also cases when mutations could not be applied because of the generated text. Example. Cant alter dosage if no dose is specified. 
*/
async function verifySuccesses(mutationResults, concurrency = 10) {
  const jobs = [];
  for (const mr of mutationResults) {
    for (const succ of mr.successful) {
      jobs.push({ mutation: mr.mutation, category: mr.category, ...succ });
    }
  }

  const verified = [];
  for (let i = 0; i < jobs.length; i += concurrency) {
    const batch = jobs.slice(i, i + concurrency);
    const results = await Promise.all(batch.map(async job => {
      try {
        const verdict = await runVerifier({
          patientMessage: job.sourceCase.patientMessage,
          doctorNotes: job.sourceCase.doctorNotes,
          background: job.sourceCase.background,
          reply: job.mutatedReply,
        });
        const caught = verdict.verdict === 'warn' || verdict.verdict === 'block';
        return { ...job, verdict, caught };
      } catch (e) {
        return { ...job, verdict: null, caught: false, error: String(e.message || e) };
      }
    }));
    verified.push(...results);
  }
  return verified;
}

/*
Summarize the results by catchrate, mutation type and so on
*/
function summarize(verified, mutationResults) {
  const total = verified.length;
  const caught = verified.filter(v => v.caught).length;

  const byMutation = {};
  for (const v of verified) {
    if (!byMutation[v.mutation]) byMutation[v.mutation] = { total: 0, caught: 0, category: v.category };
    byMutation[v.mutation].total++;
    if (v.caught) byMutation[v.mutation].caught++;
  }
  for (const id of Object.keys(byMutation)) {
    const m = byMutation[id];
    m.catchRate = m.total > 0 ? m.caught / m.total : 0;
  }

  const byCategory = {};
  for (const cat of CATEGORIES) byCategory[cat] = { total: 0, caught: 0, catchRate: 0 };
  for (const v of verified) {
    byCategory[v.category].total++;
    if (v.caught) byCategory[v.category].caught++;
  }
  for (const cat of Object.keys(byCategory)) {
    const c = byCategory[cat];
    c.catchRate = c.total > 0 ? c.caught / c.total : 0;
  }

  const insufficientMutations = mutationResults
    .filter(mr => mr.achieved < mr.targetN)
    .map(mr => ({
      mutation: mr.mutation,
      achieved: mr.achieved,
      targetN: mr.targetN,
      inapplicableCount: mr.inapplicableCount,
      errorCount: mr.errorCount,
    }));

  return {
    overall: { total, caught, catchRate: total > 0 ? caught / total : 0 },
    byMutation,
    byCategory,
    insufficientMutations,
  };
}

async function runEval({ cases, targetN = 5 }) {
  if (!Array.isArray(cases) || cases.length === 0) {
    throw new Error('runEval requires a non-empty cases array');
  }

  const mutationResults = await Promise.all(
    MUTATIONS.map(m => runMutationType({ mutation: m, cases, targetN }))
  );

  const verified = await verifySuccesses(mutationResults);
  const summary = summarize(verified, mutationResults);

  return {
    timestamp: new Date().toISOString(),
    config: { targetN, caseCount: cases.length, mutationCount: MUTATIONS.length },
    summary,
    results: verified.map(v => ({
      caseId: v.caseId,
      mutation: v.mutation,
      category: v.category,
      mutationApplied: v.mutationApplied,
      baselineReply: v.sourceCase.reply,
      mutatedReply: v.mutatedReply,
      patientMessage: v.sourceCase.patientMessage,
      doctorNotes: v.sourceCase.doctorNotes,
      background: v.sourceCase.background || null,
      verdict: v.verdict,
      caught: v.caught,
      error: v.error || null,
    })),
  };
}

module.exports = { runEval };
