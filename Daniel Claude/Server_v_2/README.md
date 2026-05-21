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

The patient reply is written in the **language of your notes**. If you write in English, the reply is in English — even if the patient wrote in Swedish. To override, write a language instruction in the background field (`write in Swedish`, `på svenska`, `in English`).

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

## Feedback

Anything that surprises you — refusals, mistranslations, the verifier flagging things it shouldn't, the verifier missing things it should catch — please note down with the doctor's notes that produced it. The audit log captures this automatically.
