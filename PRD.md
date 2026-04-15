# [Project Name] [Required]
## Product Requirements Document

> **TRA460: Digital Health Implementation** | Chalmers University of Technology

> **v1.0 Section Guide:**
> - **[Required]** — Must be substantive for this submission to pass.
> - **[Recommended]** — Optional for v1.0, but strengthens your foundation.
> - **[Expand Later]** — Scaffolding for future iterations. Initial thoughts welcome.

---

### Project Details [Required]

| Field               | Value                                      |
|---------------------|--------------------------------------------|
| **Group**           | TRA460_Group_5                             |
| **Version**         | 1.0                                        |
| **Date**            | 2026-04-15                                |
| **Clinical Mentor** | [David Sundemo, MD PHD, Sahlgrenska]                 |
| **Group Members**   | [Johannes Lindqvist (MPCSC), Daniel Krämer (MPCAS), Abigail Kruegle (MPCAS), Yuxuan Zhong (MPCAS)]      |

---

## 1. Needs Statement [Required]

<!--
  REQUIRED FOR v1.0

  THE CORE OF YOUR PRD.
  Use the Stanford Biodesign format below. Be specific:
  - The verb should describe a function, not a technology.
  - The population should be narrow enough to be actionable.
  - The outcome should be measurable or clearly observable.

  Weak:  "A way to use AI for patients that improves healthcare."
  Strong: "A way to detect early signs of atrial fibrillation
           in post-stroke patients managed in primary care
           that reduces time-to-treatment for recurrent events."
-->

A way to increase the empathy of clinician responses to patient portal messages for adults in order to improve patient satisfaction.

<!--
Critique from Claude: 

Here's an honest critical review of where you stand.

  ---
  Strengths

  - Solution-free: "increase empathy" describes the change needed without naming any technology — that's disciplined and correct.
  - Logical flow: problem → population → outcome tells a coherent story. A reader can follow the reasoning without explanation.
  - Outcome is grounded in real decision-maker priorities: public health systems actively track patient satisfaction scores — this isn't a hypothetical metric.
  - Patient portal specificity: narrowing from "all written communication" to patient portal messages gives the problem a clear, bounded context.

  ---
  Weaknesses

  1. "Empathy" is abstract — it's not yet defined in a way that could be measured or operationalized. What does an empathetic message look like versus a cold one? Without that definition,
  it's hard to know if your tool is working.
  2. The outcome lacks a specific metric and threshold — "improve patient satisfaction scores" tells us the direction but not the magnitude. A study cannot be designed around this yet.
  This is your most important gap to close.
  3. The population may be too broad to show an effect — "adults using patient portals" is a heterogeneous group. A 28-year-old managing a minor infection and a 65-year-old with heart
  failure may respond very differently. A broader population requires a larger, more expensive study to detect a signal.
  4. The safety constraint isn't captured — you mentioned that clinical accuracy must be preserved. That's important context missing from the statement.

  ---
  Skipped-step risks

  - We didn't explore existing solutions — are there communication training programs, templating tools, or style guides already in use? If so, what's their limitation? Your need statement
  is stronger if you can articulate why current approaches fail.
  - We didn't explore the upstream angle — could the problem be prevented earlier, e.g., through clinician communication training or patient onboarding that sets expectations for written
  tone?

  ---
  Recommended next actions

  1. Interview 3–5 public health system administrators — ask what patient satisfaction metric they watch most closely, what a meaningful improvement looks like, and whether they're already
   trying to solve this.
  2. Interview 3–5 clinicians — ask what makes portal messaging hard, whether they've received complaints about tone, and what they've tried.
  3. Search for existing tools and studies — establish what's already been tried and why it's insufficient. This is the evidence base for your unmet need.

-->

---

### 1.1 Clinical Context & Background [Required]

<!--
  REQUIRED FOR v1.0

  Set the stage. What is the clinical problem space?
  - What condition, workflow, or care gap are you addressing?
  - How significant is this problem? (incidence, prevalence, burden)
  - Why does it matter — clinically, economically, or humanly?
-->

Since the development of secure healthcare portals, online messaging has become a primary channel for patients to communicate medical concerns, questions, or administrative requests. As the volume and pace of messages increase, clinicians have found a tension between clinical efficiency and compassionate communication. In order to address all of their messages, clinicians often default to brief, clinical language, which is technically accurate, but can leave patients feeling dismissed, misunderstood, or uncared for. For many patients, especially patients with chronic or multiple conditions who rely on frequent written communication, the tone of the messages directly shapes their perception of whether their clinician cares about them. Impersonal or abrupt responses are a driver of patient dissatisfaction, formal complaints, and voluntary disenrollment from care relationships. Clinically, it is important that a patient feels cared for by their clinician to maintain healthy trust and openness. On a human level, it is critical that patients feel cared for throughout their entire healthcare journey, during which they may feel medically or emotionally vulnerable. A tool to ensure that online clinician-written communication is caring and empathetic is a simple way optimize this portion of a patient's healthcare journey.

### 1.2 Key Clinical Insights [Required]

<!--
  REQUIRED FOR v1.0

  THIS IS THE MOST IMPORTANT SECTION FOR v1.0.
  Synthesize what you learned from your clinical mentor meeting(s).
  - What did you observe or hear?
  - What is the current workflow / status quo?
  - Where are the friction points, inefficiencies, or risks?
  - What surprised you?

  Ground this in specifics. Quotes, scenarios, and concrete
  examples are more valuable than generalizations.
-->

### 1.3 Existing Solutions & Gaps [Required]

<!--
  REQUIRED FOR v1.0

  What solutions or tools exist today for this problem?
  - Clinical tools, apps, devices, workflows
  - Why are they insufficient, inaccessible, or underused?
  - What gap remains that your project could fill?
-->

### 1.4 Success Metrics [Recommended]

<!--
  RECOMMENDED FOR v1.0

  How will you know your solution actually addresses the need?
  Think about the "that..." clause in your Needs Statement —
  how would you measure or observe that outcome?
-->

- [e.g., Time-to-intervention reduced by X%]
- [e.g., Nurse documentation burden reduced from Y to Z minutes/day]
-

---

## 2. Stakeholders & Users

### 2.1 Primary User(s) [Required]

<!--
   REQUIRED FOR v1.0

  Who will directly use or interact with your solution day-to-day?
  Be specific: "Cardiac nurses in outpatient clinics" not just "nurses."
-->

### 2.2 Other Stakeholders [Required]

<!--
  REQUIRED FOR v1.0

  Who else is affected by or has influence over this solution?
  Consider: patients, caregivers, administrators, IT departments,
  payers/insurers, regulators, clinical champions, etc.
-->

### 2.3 User Journey — Current State [Recommended]

<!--
  RECOMMENDED FOR v1.0

  Describe the current care pathway or experience of your primary user.
  A simple narrative walkthrough is fine, e.g.:
  "The patient wakes up, measures their..., calls the clinic to..."
-->

---

## 3. Solution Vision [Required]

<!--
  REQUIRED FOR v1.0

  1-2 paragraphs maximum. This is your "north star," not a feature list.
  - What is the high-level concept?
  - How does it directly address the Needs Statement?
  - What does success look like from the user's perspective?

  Keep it directional. You will refine this throughout the course.
-->

---

## 4. Requirements

### 4.1 Functional Requirements (MoSCoW) [Recommended]

<!--
  RECOMMENDED FOR v1.0

  Categorize what your MVP needs to DO.
  Each requirement should be a clear, testable capability.
  A few items per category is enough for v1.0 — this section
  will grow significantly in later iterations.
-->

**Must Have** — *Non-negotiable for a functioning MVP*
- [e.g., Patient can log daily symptom entries via a mobile interface]
-

**Should Have** — *High value, but the MVP could technically function without these*
- [e.g., Clinician receives a weekly summary report of patient-logged data]
-

**Could Have** — *Nice-to-have if time and resources allow*
- [e.g., Push notification reminders for symptom logging]
-

**Won't Have** — *Explicitly out of scope for this project*
- [e.g., Integration with national EHR systems]
-

### 4.2 Non-Functional Requirements & Constraints [Recommended]

<!--
  RECOMMENDED FOR v1.0

  Consider the "invisible" requirements:
  - Data privacy & security (GDPR, patient data handling)
  - Regulatory considerations (MDR, wellness vs. medical device)
  - Accessibility (WCAG, language/localization)
  - Interoperability standards (FHIR, HL7, openEHR)
  - Performance, offline capability
-->

---

## 5. Technical Direction [Expand Later]

<!--
  EXPAND IN LATER ITERATIONS

  Initial thoughts only. No commitments required yet.
  This section helps your future self (and your AI agent, if using
  Claude Code) understand the technical landscape you are considering.
-->

- **Platform:** [iOS / Android / Web / Cross-platform / TBD]
- **Key Integrations:** [EHR systems, wearables, sensors, APIs, etc.]
- **Candidate Tech Stack:** [SpeziVibe, Swift/Kotlin, React, etc. / TBD]
- **Infrastructure:** [Cloud provider, on-premise, hybrid / TBD]

---

## 6. Open Questions & Risks [Required]

<!--
  REQUIRED FOR v1.0

  Be honest about what you don't know yet. This is a sign of
  rigorous thinking, not weakness.
  - What assumptions are you making that haven't been validated?
  - What could block or derail this project?
  - What do you need to ask your clinical mentor next?
-->

- **[Question/Risk]:** [Your plan to resolve it, and by when]
- **[Question/Risk]:** [Your plan to resolve it, and by when]
-

---

## Changelog [Required]

| Version | Date       | Summary of Changes                                  |
|---------|------------|-----------------------------------------------------|
| 1.0     | YYYY-MM-DD | Initial draft after first clinical mentor meeting   |
|         |            |                                                     |
