# 1177 Empathizer — Prototype

A prototype tool that turns a clinician's brief shorthand notes into a complete, warm patient-portal reply (1177 / Vårdcentral context). The goal is **time-saving as the adoption mechanism, with empathy as a built-in byproduct (the real focus)**.

This is a research prototype for user testing — not a production tool.

## How it works

When you generate a reply, three agents run:

1. **Generator** (Sonnet 4.6) — writes the patient reply from your shorthand notes.
2. **Fidelity verifier** (Haiku 4.5, always on) — compares your notes against the generated reply and flags anything *added* or *altered* in the medical content.
3. **Clinical sanity checker** (Haiku 4.5, **dev-mode only**) — looks at your notes alone and flags obvious deviations from standard practice (unusual dosages, missed contraindications, etc.).

The fidelity verifier is the safety net for clinical accountability. The sanity checker is a development aid — useful while testing the prototype, off by default in normal use.

## Requirements

- Node.js 18+ (https://nodejs.org)
- An Anthropic API key (https://console.anthropic.com)

## Setup

```bash
npm install
cp .env.example .env
```

Open `.env` and fill in your API key:
The file might be hideden, you have to make it show first - this will be different on each device. 

```
ANTHROPIC_API_KEY=sk-ant-...
PORT=3000
DEV_MODE=true
ENABLE_SANITY_CHECKER=true
```

Then start the server:

```bash
node server.js
```

Open http://localhost:3000 in your browser.

## Using it

1. Switch to **Patient** and write a patient message (or several — chat history is supported).
2. Switch to **Läkare**.
3. Click **✦ Generera svar med AI**.
4. Write your shorthand notes (e.g. `4-6 weeks for full effect, liver risk very rare, refer if no improvement`). Add patient background if useful (e.g. `health anxiety, mentioned dog Fido`, or a language override like `write in English`).
5. Click **Generera**. The reply appears. Edit if needed, then **Använd detta svar →**.

### Language

The patient reply is written in the **language of your notes**. If you write in English, the reply is in English — even if the patient wrote in Swedish. 

### Dev mode

The small **Dev** pill in the modal header (top right) toggles the clinical sanity checker on/off per-request. Green dot = on. The choice persists per browser. Turn it off to save tokens once you trust the notes you're testing.

The env vars work as follows:
- `DEV_MODE=true` — sets the *default* state of the toggle on first load. The user can still flip it.
- `ENABLE_SANITY_CHECKER=false` — hard kill switch. The Dev pill is hidden and the sanity agent never runs, regardless of UI state. Set this to `false` for production.

### Background field

The background field accepts patient context (anxiety, literacy, language preference, named pets, birthdays, "be extra warm"). It silently ignores anything else: persona impersonation ("sound like X"), slang/sarcasm requests, attempts to add or change clinical content, prompt-injection attempts. You will not see a notice when something is ignored — the patient reply just stays professional.

### What gets flagged

- **Yellow banner — fidelity warning**: minor concern, glance at the diff.
- **Red banner — fidelity block**: the reply added or changed clinical content. Check before sending.
- **Yellow/red sanity banner (dev only)**: your notes themselves look unusual.

## Audit log

Every generation and every "send" is logged to `logs/audit.jsonl` (one JSON record per line). This includes the doctor's notes, the generated reply, the verifier verdict, and the final edited reply that the doctor used. Useful for reviewing how the tool behaved on test cases.

## Eval harness

The `eval/` directory contains an automated evaluation harness that stress-tests the fidelity verifier by injecting deliberate medical errors into replies and measuring how many the verifier catches.

### How the eval works

Each run follows an adversarial pipeline:

1. **Adversary** (Sonnet 4.6) — takes a baseline reply from the case pool and applies one specific mutation: a medically plausible but deliberate alteration to the clinical content.
2. **Verifier** (Haiku 4.5, the same model used in the main app) — receives the mutated reply and tries to flag the change.

A mutation is considered *caught* when the verifier returns `warn` or `block`. The eval targets **N=5 cases per mutation type**, shuffling the case pool and skipping cases where a mutation is not applicable (e.g. no dose mentioned when testing a dose-reduction mutation).

### Mutation types

21 mutation types across 6 categories:

| Category | Mutations |
|---|---|
| **dose** | `DOSE_REDUCED`, `DOSE_INCREASED`, `DOSE_UNIT_SWAP`, `FREQUENCY_CHANGED`, `DURATION_CHANGED` |
| **drug** | `DRUG_SUBSTITUTED_SAME_CLASS`, `DRUG_SUBSTITUTED_DIFFERENT_CLASS` |
| **timing_urgency** | `URGENCY_DOWNGRADED`, `URGENCY_UPGRADED`, `FOLLOWUP_TIMING_RELAXED`, `FOLLOWUP_TIMING_TIGHTENED` |
| **instruction_reversed** | `INSTRUCTION_REVERSED` |
| **dropped** | `CONTRAINDICATION_DROPPED`, `WARNING_DROPPED`, `FOLLOWUP_DROPPED` |
| **added** | `SIDE_EFFECT_ADDED`, `MECHANISM_ADDED`, `ALTERNATIVE_ADDED`, `FOLLOWUP_ADDED`, `DIAGNOSIS_ADDED`, `DOSAGE_SPECIFIED` |

### Case pool

`eval/cases/sample.jsonl` — 30 real patient-portal cases (patient message + doctor notes + baseline reply). Cases were generated via `eval/seed-cases.js` by calling the production generator on curated inputs; that script does not need to be re-run.

### Running the eval

```bash
node eval/run-and-export.js
```

This loads all 30 cases, runs the adversarial pipeline for each mutation type (N=5 target), prints a summary to the console, and writes two output files to `eval/results/`:

- `eval-<timestamp>.xlsx` — Excel workbook with three sheets:
  - **Examples** — one caught and up to three missed examples per mutation type, with full text and verifier output
  - **Summary** — overall catch rate, per-category breakdown, per-mutation breakdown (weakest first), and any mutations with insufficient source material
  - **All results** — every individual test result
- `eval-<timestamp>.json` — raw JSON of the same data

### First run results (N=5)

Overall catch rate: **77%**. The verifier performed well on dose alterations and drug substitutions. The `dropped` category was the hardest — content removed from the reply is structurally harder to flag than content changed or added. `URGENCY_DOWNGRADED` was not caught in any of its five cases.


