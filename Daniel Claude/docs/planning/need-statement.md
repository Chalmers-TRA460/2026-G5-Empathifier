# Need Statement

## Final Need Statement

> **"A way to help clinicians deliver the quality of communication that high-need patients require — in adults with chronic conditions or mental health concerns — when time and cognitive load make this difficult, in order to reduce unnecessary doctor transfer requests driven by poor communication."**

---

## Components

| Component | Definition |
|-----------|------------|
| **Problem** | Clinicians lack a scalable way to deliver the quality of communication they know certain high-need patients require. They are aware of which patients need extra care but time pressure and cognitive load prevent them from always providing it. Responses end up informationally correct but emotionally insufficient — missing acknowledgment, explanation of *why*, and warmth. |
| **Population** | Adults with chronic conditions or mental health concerns who communicate regularly with their care team. These patients are most harmed by terse responses. The solution may extend to other patient groups but this is the primary focus. |
| **Outcome** | Reduction in unnecessary doctor transfer requests driven by poor communication. Transfer requests are already tracked administratively by Swedish regional healthcare systems and are directly costly (onboarding time, continuity of care disruption). |

---

## Context

- **Decision-maker / Payer:** Swedish regional government, which funds and operates the patient portal chat service
- **Service users:** Doctors and nurses with patient contact through text (doctor-triggered use, selective — not for all patients)
- **Key insight:** Clinicians know which patients need extra care but the system doesn't always allow them to give it. They are not indifferent — they are capacity-constrained. The solution extends the capacity of already-caring clinicians rather than correcting bad behavior. When high-need patients feel unheard, they request doctor transfers — a measurable, costly downstream event.
- **Doctor validation:** Interviewed doctors recognize the problem and confirmed they would use a selective tool for patients they know need extra care.

---

## Original Need Statement (for reference)

> "A way to increase the empathy of clinician responses to patient portal messages for adults in order to improve patient satisfaction."

---

## Critical Review

### Strengths
- Problem is precise and solution-free
- Outcome is measurable and already tracked by the Swedish healthcare system
- Causal chain is defensible: poor portal communication → patients feel unheard → doctor transfer requests
- Population is specific enough to study but large enough to matter

### Open Risks
1. **"Adequately acknowledge" needs definition** — Who judges adequacy? This will matter when measuring whether the intervention worked.
2. **Causal link needs validation** — Do patients cite communication quality as the primary reason for transfer requests? Other factors (geography, wait times) may dominate.
3. **Outcome isolation** — Study design needs to isolate transfer requests caused by poor portal communication vs. other reasons.
4. **"Unnecessary" is doing work** — Not all communication-driven transfer requests are avoidable; be precise about what the intervention can change.

### Recommended Next Steps
1. ~~Interview 2-3 Swedish primary care doctors~~ — **Done.** Doctors recognize the problem and confirmed they would use a selective tool for patients they know need extra care.
2. **[Open question — confirm with doctor contact]** Transfer requests are tracked at Vårdcentral level, driven by per-patient funding. Hypothesis: the more financially concrete outcome metric may be **patient deregistration from Vårdcentral** rather than individual doctor transfer requests. Confirm: (a) whether Vårdcentral tracks deregistrations and reasons, (b) whether communication quality is a recognized driver of patient churn, and (c) whether internal doctor switches vs. full Vårdcentral switches have different funding implications.
3. Talk to a patient with a chronic condition who has switched doctors — ask what drove it

---

## Solution Direction

### Concept
A **structured response builder** combined with AI language generation. The doctor flags a high-need patient, fills in structured sections (acknowledge, validate, explain, contextualize, next steps, invite) with clinical facts in their own words, and an AI uses templates to generate a full, empathetic response. The doctor reviews and sends.

The structure is informed by established communication frameworks doctors already know — particularly **NURSE** (Name, Understand, Respect, Support, Explore) and **ICE** (Ideas, Concerns, Expectations) from Pendleton's model, both taught in Swedish medical education.

### Design decision: AI access to patient text

**Option B — Doctor structures, AI writes (current direction)**
The doctor reads the patient message themselves, identifies concerns, and fills in the structured sections. The AI only processes what the doctor writes — patient text never touches the AI.
- Regulatory risk: Low — patient data stays within the care team
- Tradeoff: Slightly more work for the doctor

**Option A — AI structures, doctor fills in (revisit if regulations allow)**
The AI reads the patient message, identifies concerns, and pre-populates section headers. The doctor fills in the facts.
- Regulatory risk: High under current Swedish healthcare data rules (GDPR, Patientdatalagen, regional IT governance)
- Would require AI to run within Swedish national infrastructure (e.g. Inera) — not external APIs
- Worth revisiting if data processing agreements can be established

**Current direction: Option B.** Option A remains the preferred design if regulatory and infrastructure constraints can be resolved.

### Input framework

The doctor fills in the following sections. Sections left blank or marked FALSE are skipped by the AI and excluded from the generated response.

| Section | Purpose | Required? |
|---------|---------|-----------|
| **Acknowledge** | What did the patient say that needs to be recognized emotionally? | Yes |
| **Validate** | Why is their concern understandable? | Optional |
| **Concerns** | One block per concern — expandable. Each block contains: Topic, Explain, What it means for this patient | Yes — min. 1 |
| **Next steps** | What should the patient do? What will the doctor do? | Yes |
| **Invite** | Leave the door open — pre-filled default, doctor can override | Yes |

### Example

**Patient message:**
> "I've been taking the new medication for two weeks but I'm still in pain. I also read online that it can cause liver damage and now I'm really scared. Can I also get a referral to a specialist?"

**Doctor fills in:**
- Acknowledge: She has been in pain for two weeks and is scared about the medication
- Validate: Worrying about side effects when in pain is completely natural
- Concern 1 — Medication not working: Takes 4–6 weeks for full effect; she should continue and not stop early
- Concern 2 — Fear of liver damage: Very rare, only at high doses over long periods; her dose is safe
- Concern 3 — Referral: Appropriate after 6 weeks if no improvement; I will initiate now
- Next steps: Continue medication. Referral being prepared.
- Invite: (default pre-fill accepted)

**AI generates:**
> Hi Anna,
>
> Thank you for your message — I understand it is frustrating to still be in pain, and it is completely natural to worry when you read about possible side effects.
>
> What you read about liver damage is true, but it is important to know that it is very rare and only occurs at high doses over a long period of time. Your current dose is safe and you have nothing to worry about.
>
> Regarding the pain, I want to explain that this medication often takes 4–6 weeks to reach its full effect. It is therefore important that you continue taking it as planned and do not stop the treatment early.
>
> As for your referral — I agree that it is the right way forward if the pain persists. I will initiate the referral now so that it is ready after six weeks if you do not notice any improvement before then.
>
> Please do not hesitate to get in touch if anything changes or if you have any more questions.
>
> Kind regards,
> Dr. [Name]

### Open questions for the team
- Is the time saved on language generation (Option B) enough to offset manual structuring by the doctor?
- How much freedom should the AI have to alter templates — consistency vs. naturalness?
- Who owns and maintains the templates — the region, the Vårdcentral, or individual clinicians?
- How does the system handle patients who write in languages other than Swedish?

---

## Quality Checklist

- [x] Solution-free — no technology, product, or approach mentioned
- [x] One sentence — clear and concise
- [x] Logical flow — problem → population → outcome tells a coherent story
- [x] Measurable outcome — transfer requests are tracked administratively
- [x] Decision-maker would pay — transfers are a direct cost to Swedish regional healthcare
