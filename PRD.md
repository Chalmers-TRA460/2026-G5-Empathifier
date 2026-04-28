# [G5-Empathifier] [Required]
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

<!--
Abby's notes, used as an input to Spezi to help write the actual section. Please add notes so we can re-prompt for different content, or edit/add/delete the current section!

  - met with a clinician who frequently needs to respond to patient messages, but he sees that time constraints, stress, and cognitive load often prevent him and his colleagues, physiscians and nurses, from responding with adequately emotionally-attuned messages
  - If he does decide to write a very intentional message, it can take up a lot of his time, which either eats away at his professional capacity or his personal time
  - Currently, most clinicians he knows do not use LLMs to help write their messages. He referenced a study that we can find later. Clinicians are either putting in lots of time, or writing messages that patients may find unsatisfactory
  - There is a risk that if AI is used to solve this problem, it may feel inauthentic to patients. We believe we have an obligation to share with patients is AI is used to craft the clinicians' responses. We want to give the clinician ownership over the message, and minimize the amount of LLM-generated text while maximizing the impact of the tool. 
  - It's also a long-term risk that if clinicians offload too much of the response-generation to AI, they will need to spend more time in the future remembering a case or connecting with a patient
  - Another risk is that medical information may become distorted or inaccurate after being processed by an LLM. There will be a clinician always having the final say of a message, but to minimize mistakes and burden on the clinician, medical information must be preserved completely.
-->

In a conversation with David Sundemo, a clinician who regularly responds to patient portal messages, he indicated that time constraints, workplace stress, and cognitive load can make it difficult for clinicians to craft the emotionally-attuned responses they know their patients need. When doctor or nurse does invest the effort to write a thoughtful, intentional message, it can take significant time, cutting into either their clinical capacity or their personal life. This creates an ultimatum for the healthcare provider: spend too much time, or send a message that falls short. Notably, David observed that many physicians in Sweden are not currently using LLMs to bridge this gap, leaving the problem largely unaddressed in practice. He mentioned a survey where 8% of doctors use LLMs for adm. tasks. 

AI-driven tools could provide an opportunity to draft better messages in less time, with the risk that patients may perceive AI-generated messages as inauthentic. We believe there is an ethical obligation to be transparent with patients when AI has played a role in drafting a clinician's response. Accordingly, the tool should be designed to preserve clinician ownership of the message — minimizing the volume of AI-generated text while maximizing its impact on tone and clarity. There is also a longer-term risk to consider: if clinicians offload too much of the response-generation process to AI, they may need to spend more time in the future remembering a patient's case or connecting with them on a personal level.

A further clinical safety risk involves the potential for AI-generated content to distort or obscure the clinician's intended medical information. Large language models can hallucinate, and even when they do not, subtle rephrasing of clinical guidance can change its meaning in ways that are can impact patient safety. A message that inadvertently alters a medication instruction, softens a warning, or introduces ambiguity around a diagnosis could cause real harm. This risk must be mitigated by a core design principle to treat the clinician's medical input as authoritative and immutable, with AI influence scoped strictly to tone, clarity, and empathy, and never to clinical substance. Any version of the message presented to the clinician for review should make it easy to verify that the medical content remains exactly as intended.



### 1.3 Existing Solutions & Gaps [Required]

<!--
  REQUIRED FOR v1.0

  What solutions or tools exist today for this problem?
  - Clinical tools, apps, devices, workflows
  - Why are they insufficient, inaccessible, or underused?
  - What gap remains that your project could fill?
-->

<!--
  Notes for this section:
  - Clinical tools: 
    - similar tools have been implemented at other healthcare facilities, in early stages. It's a moment where this problem is actively being recognized, but portals like 1177 do not have a tool available
    - clinicians could prompt secured LLMs on their own to help with drafting. This has a fairly high burden on the clinician to do this prompting,  chatting with an AI agent, and final review. The ideal solution would be simpler.
  - What gap remains that your project could fill?
    - more simple solution that minimized the amount of LLM-generated message while maximizing empathy. Easy to use, fast, and adjustable to different types of patients
  
-->
LLMs have advanced greatly in the last few years, with massive amounts of research and experiments related to it. In the medical setting, the research tends to focus on accuracy and reducing hallucinations rather than empathy, but reducing hallucinations is also crucial for our tool. Although much fewer, there are also examples of researchers fine-tuning LLMs to focus on empathy, but these don't necessarily consider accuracy as an equally important metric.

Recently, a [tool][https://arxiv.org/abs/2601.15558] similar to our idea was developed at the Mayo Clinic. The group assessed the potential for using LLMs to edit messages to be more empathic, while conserving the factual correctness. This existing tool was created as part of a research experiment at the company, and is not widely deployed. Although it isn't deployed, the results are promising and indicate that our tool could have the intended effect.

Additionally, the lack of simple integrations with systems like 1177 likely reduce the adoption by physicians, which our tool would aim to fix. 


### 1.4 Success Metrics [Recommended]

<!--
  RECOMMENDED FOR v1.0

  How will you know your solution actually addresses the need?
  Think about the "that..." clause in your Needs Statement —
  how would you measure or observe that outcome?
-->

- [e.g., Time-to-intervention reduced by X%]
- [e.g., Nurse documentation burden reduced from Y to Z minutes/day]
- Factual Accuracy Retention Rate: ≥X% fact consistency between rewritten and original messages.
- Reduction in Follow-up Queries：Whether the rate of follow-up questions within 48 hours of receiving a response has decreased by X%. (Clear and empathetic responses typically alleviate patient anxiety and thereby reduce follow-up inquiries.)


Measuring patient satisfaction is difficult because there is no clear, standardized metric for it. Currently, doctors receive feedback through reports on 1177, or patients request a different doctor due to how the doctor responds. If enough doctors use this service, it would be possible to compare the average number of reports—or the average number of patients switching doctors—between those who use the service and those who do not.
A side effect of this service could be time savings for doctors, which can be measured in minutes saved per day.
A more direct approach would be to survey patients with different types of messages and ask them how they feel about the communication.

---

## 2. Stakeholders & Users

### 2.1 Primary User(s) [Required]

<!--
   REQUIRED FOR v1.0

  Who will directly use or interact with your solution day-to-day?
  Be specific: "Cardiac nurses in outpatient clinics" not just "nurses."
-->

Physicians and nurses who communicate with patients about medical matters using an online patient portal.

### 2.2 Other Stakeholders [Required]

<!--
  REQUIRED FOR v1.0

  Who else is affected by or has influence over this solution?
  Consider: patients, caregivers, administrators, IT departments,
  payers/insurers, regulators, clinical champions, etc.



  Notes: 
  managers of vårdcentralen, who get money per patient
  tool could be expanded to administrators
-->

Patients and their caregivers are affected by the resulting clinician responses. 
Hospital administrators are affected by changes in patient satisfaction as a result of the tool.

### 2.3 User Journey — Current State [Recommended]

<!--
  RECOMMENDED FOR v1.0

  Describe the current care pathway or experience of your primary user.
  A simple narrative walkthrough is fine, e.g.:
  "The patient wakes up, measures their..., calls the clinic to..."
-->
Currently: Patient texts doctor. Doctor takes time (or don't) and writes back. 
New: Patient texts doctor. Doctor writes a short version, sends it to out service. Our service helps to formulate it nicer for the patient. Doctor sends back.

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
Our vision is to build an communication assistant.It not only cuts down the time doctors spend on routine patient message responses and makes their replies more empathetic and humanized, but also crucially ensures the complete retention of all critical medical information. For patients, this means access to accurate medical information alongside a genuine sense of being understood and respected, which in turn reduces unnecessary anxiety and repetitive follow-up inquiries. The end result is a more efficient and harmonious doctor-patient communication dynamic.
The service should act as an assistant that supports doctors in formulating their own responses, rather than functioning as a chatbot that answers all patient questions automatically. It should be designed and used in a morally responsible way.

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

- We are still unsure how to design it in a way that doesn't feel like lying to the patient. Do we want to use an LLM or more like a tree like sturctue with LLM support. Should it be fully text generation or multiple suggestions? How to do it so that we would be fine with the service being used when doctors write with us. Resolve it hopefully by next week. 
- Can we run this LLM locally on out devices? Do we have enough RAM etc. so that it works well enough. Look into it and solve by next week. 
- If we do profiles for patients that need extra long texts or need extra nice texts etc. How do we define them? How do we let the doctor choose in what way to rewrite it? 
- Even doing it locally, we should restrict the LLM (if we use one) to not being able to safe data. It should restart each time and not safe any information. It shouldn't be possible to construct a profile of the patient by letting the LLM link together old conversations. Will be resolved when coding start further. 

---

## Changelog [Required]

| Version | Date       | Summary of Changes                                  |
|---------|------------|-----------------------------------------------------|
| 1.0     | 2026-04-17 | Initial draft after first clinical mentor meeting   |
|         |            |                                                     |
