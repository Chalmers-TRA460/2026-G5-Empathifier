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
| **Clinical Mentor** | David Sundemo, MD PHD, Sahlgrenska                 |
| **Group Members**   | Johannes Lindqvist (MPCSC), Daniel Krämer (MPCAS), Abigail Kruegle (MPCAS), Yuxuan Zhong (MPCAS)      |

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

A way to improve communication tone in online portal messaging in adult patients communicating with clinicians through government-operated health portals in Sweden in order to improve patient-reported measures of respect and trust in care.

---

### 1.1 Clinical Context & Background [Required]

<!--
  REQUIRED FOR v1.0

  Set the stage. What is the clinical problem space?
  - What condition, workflow, or care gap are you addressing?
  - How significant is this problem? (incidence, prevalence, burden)
  - Why does it matter — clinically, economically, or humanly?
-->

Since the development of secure healthcare portals, online messaging has become a primary channel for patients to communicate medical concerns, questions, or administrative requests. As the volume and pace of messages increase, clinicians have found a tension between clinical efficiency and compassionate communication. In order to address all of their messages, clinicians often default to brief, clinical language, which is technically accurate, but can leave patients feeling dismissed or misunderstood. For many patients, especially patients with chronic or multiple conditions who rely on frequent written communication, the tone of the messages directly shapes their perception of whether their clinician cares about them. Impersonal or abrupt responses are a driver of patient dissatisfaction, formal complaints, and voluntary unenrollment from care relationships. Clinically, it is important that a patient feels cared for by their clinician to maintain healthy trust and openness. On a human level, it is critical that patients feel cared for throughout their entire healthcare journey, during which they may feel medically or emotionally vulnerable. A tool to ensure that online clinician-written communication is caring and empathetic is a simple way optimize this portion of a patient's healthcare journey.

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

In a conversation with David Sundemo, a clinician who regularly responds to patient portal messages, he indicated that time constraints, workplace stress, and cognitive load can make it difficult for clinicians to craft the emotionally-attuned responses they know their patients need. When a doctor or nurse does invest the effort to write a thoughtful, intentional message, it can take significant time, cutting into either their clinical capacity or their personal life. This creates an ultimatum for the healthcare provider. They either spend too much time crafting a message, or they send a message that falls short. Notably, David observed that many physicians in Sweden are not currently using LLMs to bridge this gap, leaving the problem largely unaddressed in practice. He mentioned a survey where 8% of doctors use LLMs for administrative tasks. 

AI-driven tools could provide an opportunity to draft better messages in less time, with the risk that patients may perceive AI-generated messages as inauthentic. We believe there is an ethical obligation to be transparent with patients when AI has played a role in drafting a clinician's response. Accordingly, the tool should be designed to preserve clinician ownership of the message, minimizing the volume of AI-generated text while maximizing its impact on tone and clarity. There is also a longer-term risk to consider: if clinicians offload too much of the response-generation process to AI, they may need to spend more time in the future remembering a patient's case or connecting with them on a personal level.

A further clinical safety risk involves the potential for AI-generated content to distort or obscure the clinician's intended medical information. Large language models can hallucinate, and even when they do not, subtle rephrasing of clinical guidance can change its meaning in ways that are can impact patient safety. A message that inadvertently alters a medication instruction, softens a warning, or introduces ambiguity around a diagnosis could cause real harm. This risk must be mitigated by a core design principle to treat the clinician's medical input as authoritative and immutable, with AI influence scoped strictly to tone, clarity, and empathy, and never to clinical substance. Any version of the message presented to the clinician for review should make it easy to verify that the medical content remains exactly as intended.



### 1.3 Existing Solutions & Gaps [Required]

<!--
  REQUIRED FOR v1.0

  What solutions or tools exist today for this problem?
  - Clinical tools, apps, devices, workflows
  - Why are they insufficient, inaccessible, or underused?
  - What gap remains that your project could fill?

  Notes for this section:
  Here are good articles we should use in our report: 
  https://pmc.ncbi.nlm.nih.gov/articles/PMC12075825/ 
  https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2804309 
  https://arxiv.org/abs/2601.15558 
-->

  Clinicians currently have limited traditional options for improving the tone of portal messages in a timely manner. Tight schedules and heavy workloads often prevent doctors and nurses from taking the time to write a more emotionally-driven message, and this workload also makes it difficult to get a second opinion on a message from a colleague. These clinicians could turn to general-purpose LLMs to review and edit communications. While technically feasible, this approach adds a time burden to an already time-constrained workflow, and the use of online AI services raises concern for clinicians about patient privacy. 

  Since empathetic communication is a universal need across healthcare systems internationally, many existing solutions have been developed and integrated into healthcare infrastructure to meet this need. Some technologies existing technologies address the need at earlier stages in the patient journey, such as AI assistants to answer patient questions about their medical records, AI chatbots to answer non-emergency medical questions, and LLM-driven tools to speed up other routine tasks in healthcare providers' workflow, allowing them more time to respond to patient messages.
  
  The focus of this project, though, is a tool to specifically improve understanding and trust in patient portal messages. Dozens of companies and institutions have introduced tools specifically targeted in this area, such as Epic (Epic AI Text Assistant), Doctrin, and more custom-designed tools designed for specific healthcare systems such as Stanford University and the Mayo Clinic. These tools exist in various stages of clinical implementation. 

  While innovation in this space is accelerating, no simple, integrated solution exists within public healthcare portals in Sweden, namely 1177. This project aims to fill this gap by providing a lightweight tool that improves message tone with minimal clinician burden, preserves medical accuracy, and integrates directly into existing 1177 workflows.


### 1.4 Success Metrics [Recommended]

<!--
  RECOMMENDED FOR v1.0

  How will you know your solution actually addresses the need?
  Think about the "that..." clause in your Needs Statement —
  how would you measure or observe that outcome?
- [e.g., Time-to-intervention reduced by X%]
- [e.g., Nurse documentation burden reduced from Y to Z minutes/day]
- [e.g. Factual Accuracy Retention Rate: ≥X% fact consistency between rewritten and original messages.]
- [e.g. Reduction in Follow-up Queries：Whether the rate of follow-up questions within 48 hours of receiving a response has decreased by X%. (Clear and empathetic responses typically alleviate patient anxiety and thereby reduce follow-up inquiries.)]


Outcome: Improve patient-reported measures of respect and trust in care
- Tied to "Respect and treatment" category of Nationell patientenkät (NPE), a survey conducted every few years in Sweden
- Poor communication tone leads to provider-switching, second-opinion seeking, and relationship erosion. 
  - This could be quantified through analysis of provider-switching, the number of clinicians that a patient communicates with for any given medical issue, or the number of follow-up messages a patient sends on a given medical issue
- Factual Accuracy: LLM-generated messages must maintain consistency of medical information between rewritten and original messages
  - could be quantified through a Factual Accuracy Retention Rate: ≥X% fact consistency between rewritten and original messages.
- Also possible to conduct a survey on 1177 specifically for this tool to ask patients how they feel about the communication
- Also important to make sure this does not add time to the doctor's workflow
-->

Primary Metric: Patient-Reported Communication Quality

  The primary measure of success is patient satisfaction with portal message communication, captured through an in-portal survey deployed within 1177. Patients will rate their messaging experience on a 5-point scale across multiple dimensions, which are inspired by Sweden's Nationell Patientenkät (NPE) survey:

  - Respect & Care: did the message make you feel heard and cared for?
  - Information & Clarity: was the medical information clear and easy to understand?
  - Continuity & Coordination: do you feel well-informed and involved in the next steps?
  - Perceived Participation & Involvement: did the message make you feel like an active participant in your care?
  - Accessibility: was the message easy to access and understand?
  - Overall Experience: how would you rate your overall experience with this communication?

  Target: [to be defined after baseline measurement]

  Long-Term Metric: Nationell Patientenkät (NPE)

  Improvement in the "Respect and Treatment" category of the NPE will serve as the long-term population-level indicator of success, evaluated on the NPE's standard survey cycle.


  Safety Metric: Factual Accuracy Retention Rate

  LLM-rewritten messages must preserve the factual content of the original clinician message. This is ensured through maintaining a Human-in-the-Loop workflow, where the clinician maintains responsibility of final factual accuracy. Factual accuracy should be maintained such that the clinicians do not need to spend excessive time correcting mistakes from the tool (see time constraint below).

  Operational Constraint: Clinician Workflow Time

  The tool must not increase the time clinicians spend on portal messages. Baseline message response time will be established through a pre-launch clinician survey, assessing the time to draft messages with and without the tool. 

  Target: average response time within baseline range (threshold to be determined)

  Long-Term Behavioral Indicators

  The following will be tracked as lagging indicators of relationship quality over time:
  - Provider-switching rate among active 1177 portal users
  - Average number of clinicians contacted per medical issue
  - Volume of follow-up messages per medical issue per patient

---

## 2. Stakeholders & Users

### 2.1 Primary User(s) [Required]

<!--
   REQUIRED FOR v1.0

  Who will directly use or interact with your solution day-to-day?
  Be specific: "Cardiac nurses in outpatient clinics" not just "nurses."
-->

Physicians, nurses, and other healthcare providers who communicate with patients about medical matters using an online patient portal.

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

Patients and their caregivers are affected by the resulting clinician responses, and the tool may change levels of trust that patients and caregivers put in their healthcare system.
Hospital administrators who handle documentation and appointments could experience improvements in patient communication when their patients are more satisfied with their care, as well as a reduced scheduling burden if patients are more satisfied with their original healthcare provider. Hospital administrators who have contact with patients could benefit from an expansion of this tool that could improve their communication streams with patients. 
Managers of hospitals and of Vårdcentraler are negatively impacted by dissatisfied patients who choose to continue their care elsewhere, as these institutions are paid per patient.
Regional healthcare management is motivated to invest money into a product that efficiently improves patient satisfaction, and the region is impacted by positive or negative changes in care.

### 2.3 User Journey — Current State [Recommended]

<!--
  RECOMMENDED FOR v1.0

  Describe the current care pathway or experience of your primary user.
  A simple narrative walkthrough is fine, e.g.:
  "The patient wakes up, measures their..., calls the clinic to..."

Currently: Patient texts doctor. Doctor takes time (or don't) and writes back. 
New: Patient texts doctor. Doctor writes a short version, sends it to out service. Our service helps to formulate it nicer for the patient. Doctor sends back.
-->

Currently, the patient experiences a non-emergency medical concern or has a question regarding their medical care. The patient or their caregiver logs into their online patient portal and finds the healthcare provider. The patient or caregiver drafts and sends a message containing their medical question or concern. The patient or caregiver waits for the healthcare provider to respond, and reads the response. If necessary, the patient or caregiver responds to the clinician's and/or follows the follow-up instructions from the healthcare provider. 

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
We envision a communication assistant integrated directly into the 1177.se messaging interface, designed to help healthcare providers craft warmer, more empathetic responses without adding time to their workflow. When activated, the tool presents a structured input interface where the clinician enters relevant medical information and any additional context. Using the patient's original message, the clinician's input, and a series of carefully designed prompts, the tool uses an LLM to generate a draft response that is respectful, professional, and warm in tone. The clinician then reviews, edits, and sends, maintaining full ownership of the final message.

To preserve medical accuracy, the tool employs a multi-layer LLM architecture in which each layer reviews the output of the previous one, minimizing hallucinations and ensuring factual consistency with the clinician's original input. All processing runs on a securely controlled server, designed to comply at minimum with GDPR, the Swedish Patient Data Act (Patientdatalagen, PDL), and the NIS2 Directive.

---

## 4. Requirements

### 4.0 Scope of MVP vs. Full Vision
 The Solution Vision in §3 describes the full product as we ultimately envision it: a tone-rewriting assistant embedded directly in the 1177.se messaging interface, with all LLM processing running on infrastructure that meets Swedish healthcare data-handling requirements. Both 1177 integration and locally-controlled hosting are central to the gap identified in §1.3, and both remain non-negotiable for any real-world deployment.
 
 For this course, the MVP is scoped as a **standalone proof-of-concept of the tone-rewriting capability itself**. It demonstrates that a clinician's medical input can be reliably transformed into a warmer, more empathetic patient-facing draft while preserving medical fidelity (see §1.4 and §4.1 Must-Haves). It does not yet run inside 1177, and it does not yet run on healthcare-grade infrastructure. These are instead captured as "Could Have" in §4.1 and will be deferred to future iterations. The MVP is intended to validate the core capability so that integration and hosting work, both of which are substantial engineering and policy efforts, can be justified and developed with confidence.


### 4.1 Functional Requirements (MoSCoW) [Recommended]

<!--
  RECOMMENDED FOR v1.0

  Categorize what your MVP needs to DO.
  Each requirement should be a clear, testable capability.
  A few items per category is enough for v1.0 — this section
  will grow significantly in later iterations.
-->

<!--
  PENDING REVIEW:

  Testability plan for all requirements
  What happens if the user inputs not enough or irrelevant or incomprehensible input?
-->


**Must Have** — *Non-negotiable for a functioning MVP*
- The user can write a response manually or choose to activate the tool.
- The tool allows the user to input medical information as well as non-medical background information.
- The tool's output contains only the response to the patient. It does not include: meta-commentary, preambles or sign-offs from the tool itself, headers or section labels, explanations
  ▎ of what the tool changed, alternative phrasings, or notes to the user.
- The tool generates a response in the same language that the medical information was provided in.
- The tool does not engage with the user (for example, to ask clarifying questions or discuss the input information) prior to generating a response.
- The tool presents its output as an editable draft. The user reviews and may freely edit the draft before any sending action; the tool itself does not send messages on the user's behalf (see Won't-Have)
- Content requirements:
  - The tool edits the user's provided information to form a response to the patient in complete sentences.
  - The response has a greater level of empathy than the user's provided information alone, as judged by human raters against a rubric (rubric to be defined; see §1.4).
  - The tool preserves the user's medical content with full fidelity. Specifically, the tool does not:
    - **Add** medical advice, claims, or information not present in the user's input.
    - **Remove or obfuscate** any of the user's medical advice or information.
    - **Alter the substance** of the user's medical advice, even if it appears incorrect or irrelevant.
    - **Alter the clinical meaning, urgency, or instructions** conveyed by the user's input.
  - The tool writes in first-person, as the user.
  - The tool uses accessible language in any wording it adds: short sentences and common words. The tool does not introduce medical jargon, but it preserves the user's medical content (including any terms or explanations the user wrote) verbatim — it does not add, simplify, or expand on the user's medical wording.
  - The drafted message does not indicate that AI was used. Disclosure of AI involvement is a separate feature, to be designed and placed appropriately within the tool once integrated with 1177, to meet 1177's desired disclosure policies.
  - The tool ignores everything in the user's input non-medical information except patient personal context, personal references, and moderate tone calibration (i.e., the tool may slightly soften or warm tone based on patient context, but never change content).
  - The tool's tone is warm and empathetic while remaining professional. It is respectful, free of slang or casual familiarity, and appropriate for clinical correspondence. Empathy is expressed through acknowledgment and care, not informality.

**Should Have** — *High value, but the MVP could technically function without these*
-  If either input field contains content in a language other than Swedish or English, the tool blocks generation and notifies the user that the input must be in Swedish or English. The tool does not generate a draft until the user revises the input.

**Could Have** — *Nice-to-have if time and resources allow*
- The integrated LLM runs locally (or in an environment that meets Swedish healthcare data-handling requirements) to protect patient data.
- The tool meets the technical and policy requirements for integration with 1177 (Sweden's national patient portal).

**Won't Have** — *Explicitly out of scope for this project*
- Sending messages on the user's behalf. The tool produces a draft; the user is always the one who sends.
- Multi-turn conversation. The tool does not chat with the user, ask follow-up questions, or maintain a dialogue. It generates one draft per activation

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

Data Privacy & Security
  - TBD: All patient data and clinician input must be processed in an environment that complies with GDPR, the Swedish Patient Data Act (Patientdatalagen, PDL), and the NIS2 Directive.
  - The tool must not store, log, or carry over patient information between activations. Inputs are discarded once the draft is returned to the clinician.
  - For real-world deployment (post-MVP), the LLM must run locally or in an environment that meets Swedish healthcare data-handling requirements. 
  - The tool must not be able to construct or retain a profile of any patient across sessions.

  Regulatory
  - The tool is a communication aid, not a clinical decision-support system. It must not influence clinical substance (see §4.1 Must-Haves). This is intended to keep the tool outside the scope of MDR as a medical device. This classification should be confirmed with a regulatory advisor before deployment.

  Interoperability
  - The tool must integrate with the 1177.se messaging interface and meet Inera's technical and policy requirements for tools operating within 1177.

  Accessibility & Localization
  - The tool must support Swedish and English input and output.
  - Any UI surfaces presented to the clinician should target WCAG 2.1 AA compliance.

  Performance
  - The tool must not increase the clinician's average response time per message (see §1.4 Operational Constraint). Draft generation latency should be low enough that it is faster to activate the tool than to write a comparably empathetic message manually.

  Reliability
  - If the LLM is unavailable or fails, the clinician must still be able to send a manually-written response through the normal portal flow. The tool must never block the existing workflow.

---

## 5. Technical Direction [Expand Later]

<!--
  EXPAND IN LATER ITERATIONS

  Initial thoughts only. No commitments required yet.
  This section helps your future self (and your AI agent, if using
  Claude Code) understand the technical landscape you are considering.
-->

- **Platform:** [iOS / Android / Web / Cross-platform / TBD]
- **Key Integrations:** APIs of LLMs for message generations and multi-layer LLM checks
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
