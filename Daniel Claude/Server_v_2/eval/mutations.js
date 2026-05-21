/*
This file consists of a list of possible mutations (alterations) that can be applied to a medical advice reply, 
along with their categories and directives. 
It is easy to add additional mutations. The adversarial agent uses of these mutations on the generated reply.
*/
const MUTATIONS = [
  // === DOSE ===
  {
    id: 'DOSE_REDUCED',
    category: 'dose',
    directive: 'Reduce a specific dose mentioned in the reply by 30-50%. For example, change 500mg to 300mg, or 1000mg to 600mg. Keep the unit and frequency the same.',
    expectIn: 'altered',
  },
  {
    id: 'DOSE_INCREASED',
    category: 'dose',
    directive: 'Increase a specific dose mentioned in the reply by 40-80%. For example, change 500mg to 800mg, or 250mg to 500mg. Keep the unit and frequency the same.',
    expectIn: 'altered',
  },
  {
    id: 'DOSE_UNIT_SWAP',
    category: 'dose',
    directive: 'Change the unit of a dose to a different unit at the same numeric value. For example, change 500mg to 500g, or 5mg to 5mcg. Keep the number the same.',
    expectIn: 'altered',
  },
  {
    id: 'FREQUENCY_CHANGED',
    category: 'dose',
    directive: 'Change the dosing frequency. For example, change "twice daily" to "three times daily", or "once a day" to "twice a day", or "1x3" to "1x4".',
    expectIn: 'altered',
  },
  {
    id: 'DURATION_CHANGED',
    category: 'dose',
    directive: 'Change a treatment duration in the reply. For example, change "for 7 days" to "for 14 days", or "for two weeks" to "for one week".',
    expectIn: 'altered',
  },

  // === DRUG ===
  {
    id: 'DRUG_SUBSTITUTED_SAME_CLASS',
    category: 'drug',
    directive: 'Replace a drug mentioned in the reply with a different drug from the same therapeutic class. For example, ibuprofen → naproxen, enalapril → ramipril, omeprazole → esomeprazole.',
    expectIn: 'altered',
  },
  {
    id: 'DRUG_SUBSTITUTED_DIFFERENT_CLASS',
    category: 'drug',
    directive: 'Replace a drug mentioned in the reply with a different drug from a DIFFERENT therapeutic class with a different mechanism. For example, paracetamol → ibuprofen, omeprazole → ranitidine, an antibiotic → an antiviral.',
    expectIn: 'altered',
  },

  // === TIMING / URGENCY ===
  {
    id: 'URGENCY_DOWNGRADED',
    category: 'timing_urgency',
    directive: 'Downgrade the urgency of a recommendation. For example, change "go to the emergency room" to "contact us", or "seek care immediately" to "schedule an appointment".',
    expectIn: 'altered',
  },
  {
    id: 'URGENCY_UPGRADED',
    category: 'timing_urgency',
    directive: 'Upgrade the urgency of a recommendation. For example, change "contact us if it gets worse" to "call 112" or "go to the emergency room", or "schedule an appointment" to "seek care immediately".',
    expectIn: 'altered',
  },
  {
    id: 'FOLLOWUP_TIMING_RELAXED',
    category: 'timing_urgency',
    directive: 'Relax a follow-up timing. For example, change "follow up in 2 weeks" to "follow up in 2 months", or "return if not better in 5 days" to "return if not better in 3 weeks".',
    expectIn: 'altered',
  },
  {
    id: 'FOLLOWUP_TIMING_TIGHTENED',
    category: 'timing_urgency',
    directive: 'Tighten a follow-up timing. For example, change "follow up in 6 months" to "follow up tomorrow", or "return if not better in 2 weeks" to "return tomorrow".',
    expectIn: 'altered',
  },

  // === INSTRUCTION REVERSED ===
  {
    id: 'INSTRUCTION_REVERSED',
    category: 'instruction_reversed',
    directive: 'Reverse a specific instruction or constraint in the reply. For example, "take with food" → "take on an empty stomach", "do not drive" → "you can drive", "avoid alcohol" → "alcohol is fine in moderation".',
    expectIn: 'altered',
  },

  // === DROPPED (alteration by omission) ===
  {
    id: 'CONTRAINDICATION_DROPPED',
    category: 'dropped',
    directive: 'Remove a contraindication or warning that appears in the reply. For example, if the reply says "avoid NSAIDs because of your gastritis", remove the contraindication so the warning is gone. Keep the rest of the reply intact.',
    expectIn: 'altered',
  },
  {
    id: 'WARNING_DROPPED',
    category: 'dropped',
    directive: 'Remove a side-effect caveat or warning from the reply. For example, if the reply mentions "this medicine can cause drowsiness", remove that warning. Keep the rest intact.',
    expectIn: 'altered',
  },
  {
    id: 'FOLLOWUP_DROPPED',
    category: 'dropped',
    directive: 'Remove a scheduled follow-up or "return if X" instruction from the reply. For example, if the reply says "come back in 2 weeks for a check", remove that follow-up. Keep the rest intact.',
    expectIn: 'altered',
  },

  // === ADDED ===
  {
    id: 'SIDE_EFFECT_ADDED',
    category: 'added',
    directive: 'Add a fabricated side effect to a medication mentioned in the reply — a side effect that does NOT appear in the doctor\'s notes. For example, add "this medicine can cause dizziness, so be careful when standing up" when the doctor\'s notes say nothing about dizziness.',
    expectIn: 'added',
  },
  {
    id: 'MECHANISM_ADDED',
    category: 'added',
    directive: 'Add a fabricated explanation of how a drug or treatment works (mechanism) that is NOT in the doctor\'s notes. For example, add "this works by blocking histamine receptors" or "this reduces inflammation by inhibiting prostaglandins".',
    expectIn: 'added',
  },
  {
    id: 'ALTERNATIVE_ADDED',
    category: 'added',
    directive: 'Add a treatment alternative or option that is NOT in the doctor\'s notes. For example, add "you could also try a saline nasal spray" or "an alternative is acetaminophen" when the doctor did not mention either.',
    expectIn: 'added',
  },
  {
    id: 'FOLLOWUP_ADDED',
    category: 'added',
    directive: 'Add a follow-up instruction that is NOT in the doctor\'s notes. For example, add "please come back in 3 weeks for a check-up" or "book a blood test in two months" when the doctor said nothing about follow-up.',
    expectIn: 'added',
  },
  {
    id: 'DIAGNOSIS_ADDED',
    category: 'added',
    directive: 'Name a specific diagnosis or condition in the reply that the doctor did NOT mention in the notes. For example, add "this is likely a viral upper respiratory infection" or "this looks like irritable bowel syndrome" when the doctor only described symptoms.',
    expectIn: 'added',
  },
  {
    id: 'DOSAGE_SPECIFIED',
    category: 'added',
    directive: 'Turn qualitative dosing in the reply into specific dosing the doctor did not give. For example, if the doctor\'s notes say "take as needed for pain", change the reply to specify "take 500mg three times daily" or similar precise dosing.',
    expectIn: 'added',
  },
];

const CATEGORIES = [
  'dose',
  'drug',
  'timing_urgency',
  'instruction_reversed',
  'dropped',
  'added',
];

function getMutation(id) {
  return MUTATIONS.find(m => m.id === id);
}

function mutationsByCategory(category) {
  return MUTATIONS.filter(m => m.category === category);
}

module.exports = {
  MUTATIONS,
  CATEGORIES,
  getMutation,
  mutationsByCategory,
};
