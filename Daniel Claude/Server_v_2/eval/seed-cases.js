// One-shot script: takes hardcoded (patient, doctor-notes, background) triples,
// calls the running main server at :3000 to generate the reply via the production
// generator, and appends the cases to eval/cases/sample.jsonl.
// Was used to create a newer version of our dataset. Do not need to run that again.
// Could deal with cases when the generated answer had the problems like already being flagged. But that didn't happen.

const fs = require('fs');
const path = require('path');

const CASES = [
  {
    id: 'case-004-sciatica-neuropathy-en',
    patientMessage: `I have sciatica pain from a hip reconstruction I had in 2002. Now I'm experiencing weakness when lifting my arms. Facial numbness, mostly on the left side but feel a little on right. Legs are almost numb from knee down, it does travel up my left leg. Feet numb and tingling too. My head is almost kinda numb and I can't think straight. Dizzy on and off. I feel sick to my stomach. Please help. Thank you, X`,
    doctorNotes: `medical history is suggestive of Peripheral Neuropathy.
Referral to a Neurologist for a Clinical Examination of Reflexes and Sensory System Nerve Conduction Studies.`,
    background: '',
  },
  {
    id: 'case-005-phentermine-postop-en',
    patientMessage: `I had my gallbladder removed about 2 weeks ago, and have found that my appetite has increased and I am eating constantly. I have already gained about 5 pounds. I have a prescription for phentermine, and I'm wondering if it is safe to start taking it again.`,
    doctorNotes: `Successful surgery, safe to resume all of your home medications
undesired weight gain, best to evaluate eating habits and adjust diet.
Safe to take phentermine, but I don't recommend for weight loss, compared to lifestyle and eating habits which have longer term positive effects.
Recommend at least 30 minutes of exercise each day as opposed to taking phentermine.`,
    background: '',
  },
  {
    id: 'case-006-eyebrow-hematoma-en',
    patientMessage: `About 5 weeks ago I walked into a large plate glass door and hit my brow bone. Came out immediately into a large lump and had a black eye for over a week. Although swelling has gone down, there is still a lump on the eyebrow bone which feels like solid bone.`,
    doctorNotes: `Hematoma formation due to trauma. Black eye common after injury to scalp region.
Lump will gradually reduce in size, can take analgesic and anti-inflammatory.`,
    background: '',
  },
  {
    id: 'case-007-seborrhea-face-en',
    patientMessage: `Hi, I suffer from a red patch over my nose on the left side and right, worse more so on the left. I have been told by my previous doctor that it is eczema and have tried non-prescribed and prescribed creams and nothing seems to clear it up. I have also tried to change eating and drinking habits but no change. It also flares up more so every now and again with no reason as to why. Is there anything I can do? please help`,
    doctorNotes: `keep a possibility of seborrhea dermatitis, can present as red scaly patches on sebaceous gland rich areas like scalp, face, chest etc.
Use a moderately potent topical steroid cream like fluticasone propionate cream twice daily for the initial 2 weeks.
Seborrhea dermatitis often recurs and not advisable to use topical steroids on face for long - therefore after 2 weeks steroids should be replaced with a topical immunomodulator e.g. either pimecrolimus or tacrolimus`,
    background: 'Anxious patient, be extra nice',
  },
  {
    id: 'case-008-allergic-rhinitis-en',
    patientMessage: `Hi, I am Kiran. For the last 3-4 years, I have had a sneezing problem. Once I start sneezing the whole day it goes on some times. Morning sneezes are frequent. Otherwise normally I am perfectly alright, no running nose. I am 25 years old. Weight 60kgs; Height 165 cms. I have consulted a previous doctor once, but he said it might be an allergy problem, so no cure. I just wanted to know what is the cause of this problem and how it can be cured`,
    doctorNotes: `Allergic rhinitis, usually seasonal due to pollen grains, grass, dander or plain dust.
Early morning rhinitis usually due to congestion of the nasal mucosa.
Identify the allergen and try to avoid exposure.
Allopathic treatment consists of decongestants as tablets or as nasal spray`,
    background: '',
  },
  {
    id: 'case-009-shoulder-strain-park-en',
    patientMessage: `Hi, this is X. I had a ride in an amusement park where we were taken up in a row of seats attached to a 30-40 ft iron tower. Then abruptly the seats will drop as a free fall, coming to a sudden halt. It has been 2 days since the ride and I have pain when I move my arms over my head or keep them in a specific angle. Is that because of the free fall?`,
    doctorNotes: `Potential strain on tendon - depends a lot on the position of the arm and shoulder.
Could be pain at the attachment of the arm to the shoulder from rotator cuff strain or pain shooting from neck down the arm from neck strain.
Likely not due to permanent injury but recommend examination.`,
    background: 'English not native language, write more simply',
  },
  {
    id: 'case-010-snowmobile-cough-blood-en',
    patientMessage: `I had a snowmobile accident 8 days ago. I think I bruised some ribs and I heard there is not much that can be done to help that, except time to heal. However, today I coughed up a tiny bit of blood. Is that something to be extremely worried about or is that normal a week after a hard impact to the chest?`,
    doctorNotes: `small amounts of black /cola colored blood likely the altered blood from small tears in oral tract from the injury. If so, it will heal by itself.
Depends also on helmet usage - should rule out fractures of skull and face.
will send a referral for CT scan of head. If normal then nothing to worry about.`,
    background: '',
  },
  {
    id: 'case-011-urticaria-child-en',
    patientMessage: `Hello doctor, My 4 year old son has some kind of rashes from last week. We visited a clinic who suggested a dermatologist consultation. I have attached images of the rashes and the prescription. We noticed that it increases in the evenings. Every morning he wakes up with clear skin and during evenings it worsens. He had a fever for two days around the same time it started. He keeps scratching himself. The severity has reduced, but it is not completely gone.`,
    doctorNotes: `minor case of urticaria, a non-specific rash. could be due to food, dust, insect bite or a viral fever. Can persist 15-45 days and disappear completely afterward. This should last a few days, no cause for alarm.
Continue with Zempred (Methylprednisolone) and Levocet (Levocetirizine).`,
    background: '',
  },
  {
    id: 'case-012-mifepristone-bleeding-en',
    patientMessage: `Hello doctor, My friend underwent a USG and she was detected with 6-week pregnancy and then she took Mifepristone and then next day four Misoprostol (mouth dissolving). Now it has been more than 24 hours. She is bleeding continuously with clots and having severe pain. Kindly suggest what to do now for pain and bleeding?`,
    doctorNotes: `Bleeding with clots can be due to retained products of conception or implantation site infection or both.
Either require an ultrasound and potentially D&C, will schedule`,
    background: '',
  },
  {
    id: 'case-013-retinal-detachment-en',
    patientMessage: `Hello doctor, My vision was crystal clear this morning. I just woke up from a nap, and the vision in my left eye is blurry. It has not cleared up in the past half an hour. Twice over the years, this has happened, and it normalized over a few hours, but I am in a jungle now. So, I would like to err on the side of caution. I have had previous retinal detachments.`,
    doctorNotes: `Referral to ophthalmologist for exam
Could be retinal detachment or bleeding. History of prior retinal detachment suggeests problem with retina, requires prompt treatment. Treatment would be via laser surgery or a vitrectomy if needed (surgical removal of the vitreous gel).`,
    background: '',
  },
  {
    id: 'case-014-bike-shoulder-en',
    patientMessage: `Hello doctor, Last night, I fell from my bike on my right side as it got slipped while driving. My right hand and right shoulder directly hit the road and cause severe pain on the right side of the abdomen. The emergency room prescribed some medicine and I got relieved from my side pain. I went for an x-ray of the right chest, it was normal. But after 36 hours I am having pain in the right shoulder (scapula) and while sitting, or arising out of bed, or moving hand on the upper side the pain increases a lot. Is it normal or need better medical assistance?`,
    doctorNotes: `Normal symptoms after trauma.
Pain in neck and shoulder can be due to ligament sprain of the cervical spine.
Make an appointment for further evaluation.
For now, take analgesic like ibuprofen for pain relief.`,
    background: '',
  },
  {
    id: 'case-015-root-canal-en',
    patientMessage: `Hello doctor, I have been going to a dentist about a tooth that is sore. They started a root canal but then did not finish. I have gone back several times and every time they open up the tooth and insert medicine. My tooth is in agony right now. I am just wondering if this is a standard procedure during a root canal? Should not the dentist remove the nerves so I am not in so much pain? Or is it the standard procedure to fight the infection first and then remove the nerves?`,
    doctorNotes: `The treatment of choice for an infected tooth is a root canal therapy.
Dentist can determine whether nerve is viable or not. If necrosis, they will remove dead tissue. If viable, they will clean out the canals and fill them with a sealer. Then the tooth should be restored with a crown
Should be no further discomfort after procedure`,
    background: '',
  },
  {
    id: 'case-016-mouthwash-smoker-en',
    patientMessage: `Hello doctor, Is there a difference in alcoholic and non-alcoholic mouthwash. Which is better at combating bad breath due to smoking than alcoholic? I am in a hygiene school and want to know whether or not to recommend non-alcohol mouthwash for the complaints of bad breath from smoking. I have recommended tongue scraping, alcoholic mouthwash. Anyways, they are not going to stop smoking or drinking. I was looking at a way to have them not dry out the tissues, but stopping the obvious factors do not seem to be an option.`,
    doctorNotes: `Mouthwash w chlorhexidine (0.12%) very effective in controlling halitosis, it is antibacterial to control bad breath.
Also keeps gums healthy and prevents plaque formation.
Alcohol free mouthwashes can cause irritation to the mucosa lining the mouth and may worsen bad breath.
Advise chlorhexidine mouthwash if you smoke. May need to use for ~3 months to see visible results`,
    background: '',
  },
  {
    id: 'case-017-palpitations-stress-en',
    patientMessage: `I am a 30 yr old female that has been experiencing an irregular heart beat brought on by possible stress of starting a new position at work. Ever since I atarted it my heart has had random episodes of quick beats to where it feels like two at a time. Its noticeable and I'm wondering what's wrong. No change if anything other than my job.`,
    doctorNotes: `Two beats which you feel in succession may be because of extra beats.
The change in job and early anxiety about fitting into a new place may increase the stress hormones like cortisol.
Both situations are completely benign and just some relaxation techniques would help.
If it's too troublesome, a 24-hour Holter monitor would be the best test to evaluate the same, or an EKG during the episode.
For your age, rule out thyroid as the cause if associated symptoms are present.
will set up a time to discuss these options`,
    background: '',
  },
  {
    id: 'case-018-toothache-smoker-en',
    patientMessage: `I am a smoker and i have an tooth ache really bad i think infection is involved. i used pain meds and hydrogen peroxide to help with pain will see my dentist asap. i am a smoker it does not seem to bother me just trying to make sure i am not harming the infected area by smoking?`,
    doctorNotes: `smoking is not good for oral tissue.
If you are having tooth pain only while eating food and a cavity (hole) is there, then it needs to be filled up with dental material.
If your pain is continuous and the cavity is too deep, then you have to undergo RCT (root canal treatment).
For pain relief, start antibiotics and painkillers, along with Metrogyl-DG gel massage over the gum area where the tooth pain is.
And use Hexidine mouthwash after food twice a day`,
    background: '',
  },
  {
    id: 'case-019-post-viral-cough-en',
    patientMessage: `I had a virus or cold in mid January. Symptoms were nasal and chest congestion with a cough. 6 weeks later the cough persists and is worse in the evening or at night with headaches. I've been told it could be walking pneumonia. Should I see my physician?`,
    doctorNotes: `Will set up appointments to get
1. Clinical examination of the respiratory system
2. Chest x-ray to rule out lung infection
3. Pulmonary Function Test (PFT) to rule out bronchitis
Lung infection and bronchitis are both common after viral upper respiratory tract infection (URI).
Both can cause similar symptoms.
You should first get diagnosed and then start appropriate treatment.`,
    background: '',
  },
  {
    id: 'case-020-mosquito-cellulitis-en',
    patientMessage: `I have a mosquito bite which I got yesterday but it swelled up when I got up. It's big and on my wrist, there's also a red streak from my wrist up to the crease of my arm. It's itchy and tingling and hot. Doctor prescribed antibiotics but I don't know if I should take it. I took Claritin but no help and put on tricalm but it has become worse. Cortisone and steroid creams make my bites worse as well. Please help I am so miserable right now.`,
    doctorNotes: `Your symptoms are caused by infection, irritation and allergic reactions from mosquito bites' sting and saliva.
Take antibiotics and an anti-allergic like fexofenadine 120 mg OD.
Take Tab CPM at night, and apply anti-allergic mixed with antibiotic cream locally 3 times a day.
It will take at least 3 weeks to return to normal.`,
    background: '',
  },
  {
    id: 'case-021-child-stomachache-en',
    patientMessage: `my daughter is 9 and a half, she is 26.48 kg, height 132cm. she is suffering from stomachache since a very long time. she used to vomit very frequently since she was born. but now not so much but her stomache continues. she pulls the elastic of her skirt or removes the button of her pant to get some relief. her stomacheaches even sometimes in the morning when she wakes up without even eating anything. and she even feel like vomitting sometimes when she brushes her teeth. i have consulted many doctors and got many tests done but yet cant find out the reason. pls help me`,
    doctorNotes: `Excessive vomiting may cause temporary stomach pain from muscle stretching at the time, but it would not continue for such a long time.
recommended that avoid all fried, oily and outside fast food, as many of their constituents cause intestinal inflammation and chronic abdominal pain.
One such example is unsuspecting celiac disease.
You can consult a local dietician to modify her diet and see if symptoms improve.
call if symptoms do not improve and we would advise a routine stool test for ova and cyst, and an abdominal ultrasound to rule out any intra-abdominal pathology.
Will set up an appointment to discuss symptoms and this treatment plan`,
    background: '',
  },
  {
    id: 'case-022-ureteric-stone-en',
    patientMessage: `I had a fever last night which has calmed down now. Now I have this throbbing pain in my lower left abdomen which gets worse when I cough or sneeze. It feels like something has burst in my tummy when I cough and the pain is unbearable when that happens.`,
    doctorNotes: `Your symptoms may be caused by a left ureteric stone with urinary tract infection.
Will make appointment to get an abdominal ultrasound and a routine urine examination.
If it is a UTI with a stone, can refer you to a urologist for further management based on the stone's size and location, and take antibiotics to control the infection.`,
    background: '',
  },
  {
    id: 'case-023-head-injury-bruise-en',
    patientMessage: `Hi I fell over a week ago tomorrow backwards and hit the back of my head on concrete. I have a cut minor that's scabbing up stopped bleeding that night and a big bump and feels really bruised all around the back of my head. My head keeps making a crunch like noise and I have to take painkillers as its so sore as healing. I notice tonight under my eyes look black (I don't normally get bags). Do you think it's just the healing process?`,
    doctorNotes: `The injury mechanism suggests you had internal bleeding in the head, which caused the black area around your eye.
The brain heals on its own, and you may feel some headaches and pain due to the physiological protective process.
If these symptoms worsen, please call and we will set up an appointment with a neurologist and get an MRI.
In most clinical cases, this is just a healing process and subsides in 7-10 days.`,
    background: '',
  },
  {
    id: 'case-024-androgenic-alopecia-en',
    patientMessage: `Hi doctor, I'm having frequent hair loss and my hair has lost its color and started thinning since 2 years, moreover I'm having diabetes and I masturbate daily. Do the above mentioned problem persists because of diabetes or masturbation. Can it be cured. Will my hair regain its natural health and strength?`,
    doctorNotes: `You seem to have androgenetic alopecia, also called male pattern baldness.
Diabetes does not influence hair loss, but keep it controlled.
Masturbation does not affect hair, but it should be done in moderation.
Consult a dermatologist for a firm diagnosis.
Management suggestions: Continue finasteride 1 mg daily in the morning as you are taking, take biotin 10 mg daily at night and vitamin E 400 mg capsule, apply minoxidil 10% solution twice a day, and cleanse the scalp with ketoconazole shampoo.
Continue treatment for a few months to a few years.`,
    background: '',
  },
  {
    id: 'case-025-kidney-infection-en',
    patientMessage: `Hi Doctor I have a kidney infection last month. I went to emergency for it and I get clipro antibiotic. but now I feel the same system as I had last month. Please let me know if my kidney got infection again and can I get heal forever? Thank you so much.`,
    doctorNotes: `Not specified the type of kidney infection (urethritis/cystitis/pyelonephritis/prostatitis).
If you have the same problem again, get urinalysis, urine culture and sensitivity, and abdominal ultrasound done.
If tests confirm urinary tract infection, you can be started on a sensitive antibiotic based on the urine culture and sensitivity report.
Will make an appointment to perform those tests, then can refer to a nephrologist/urologist as needed.`,
    background: '',
  },
  {
    id: 'case-026-asthma-allergy-en',
    patientMessage: `I am suffering from asthma and allergy. I am using a inhaler which is a composition of (budesonide and formeterol). And i am having a tablet montair(MONTELUCAST+LEVOCETRIZINE). My problem is that I am suffering from sneezing and mucosal fluid. When I am having montelucast I am okay but when I stop that i am suffering. My question is that for how many days i should have montelucast and if not then is there any alternative like nasal spray.`,
    doctorNotes: `Sneezing and nasal discharge are normally related to allergies, and treatment involves avoiding known allergens and using medication.
Montelukast is effective for allergies and also used in asthma.
Topical nasal sprays also help reduce symptoms, examples include Allegra, Nasacort, Flonase, Avamys.
We will set up an appointment to discuss further and make the appropriate prescription.`,
    background: '',
  },
  {
    id: 'case-027-panic-disorder-en',
    patientMessage: `Ocassionally after a long walk or high stress i will get visual disturbences and a disimbodied expericence which leads to panic which causes this felling to become stronger, it is almost as if i am passing out but for very breifly and once i sit down or take ideporofen it eventually goes away. I first had this feeling when i started smoking majauna but i have stopped ever since.`,
    doctorNotes: `You may have adjustment disorder or panic disorder.
Avoid using other substances such as alcohol.
can give a referral to psychiatrist.
Practice relaxation techniques, time management, and build problem-solving skills for better physical and mental health.`,
    background: '',
  },
  {
    id: 'case-028-flu-shot-low-bp-en',
    patientMessage: `I received a flu shot this morning and i have low blood pressure, 83/63. Could this flu shot account for the low blood pressue. I have a heart problem, also, and i generally have high blood pressure, never do i get low blood pressue, should i come in to the clinic?`,
    doctorNotes: `Symptoms may be related to heart failure or an allergic reaction from the flu shot.
Watch for additional symptoms such as tachycardia, itching and shortness of breath.
It is recommended to visit the ER for a physical examination and tests including resting ECG, cardiac ultrasound, complete blood count and blood electrolyte tests.
Urgent treatment may be required if the symptoms are caused by an allergic reaction.`,
    background: '',
  },
  {
    id: 'case-029-back-pain-wife-en',
    patientMessage: `Sir, my wife 48 years old she was felt from a dinning sofa moving to end to allow another at that time she had experienced some pain at at bottom and no any problem or pain since one year she is used to take active part on bed with out inconvenence. from one month she is beeng suffering with some pain after half an hour standing or sitting at the end of spine above ash. we visited doctor on getting ex-ray the doctor have advised to take bed rest for 6 weeks onle no medicins sujested and said no problem, pain may relief after rest. the sujested rest is over still she was suffering with same pain. Kindly sujest at the earlest. Thanking you Doctor.`,
    doctorNotes: `Get an X-ray of the hip joint and pelvic bone to check for degenerative changes.
Undergo short wave diathermy and physiotherapy after getting the report.
Practice back extension and pelvic floor exercises regularly.
Sleep on a hard bed.
Take calcium, vitamin A and vitamin D supplements.`,
    background: 'Use simple English',
  },
  {
    id: 'case-030-asthmatic-bronchitis-en',
    patientMessage: `Hi, I have been diagnosed with asthmatic bronchitis, never have had asthma, dont smoke, still having asthma attacks after having bronchitis for a week. Have been having back pains on the right side, below my shoulder blade, had xrays but it seemed normal. I still get those pains when I grasp for air. What is causing the pain.`,
    doctorNotes: `Bronchitis is allergy-related and may develop into asthma over time.
Excessive breathing difficulties tense the respiratory muscles and then cause pain.
Use anti-allergic tablets, bronchodilator spray, analgesics as needed, local painkiller gel, and antacids.
Will refer to an allergy specialist for tests, who may prescribe complete treatment with sublingual immunotherapy for the identified allergens.`,
    background: '',
  },
];

async function generateOne(c) {
  const r = await fetch('http://localhost:3000/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      patientMessage: c.patientMessage,
      doctorNotes: c.doctorNotes,
      background: c.background || '',
    }),
  });
  if (!r.ok) {
    const err = await r.text();
    throw new Error(`HTTP ${r.status}: ${err}`);
  }
  return r.json();
}

async function main() {
  const outPath = path.join(__dirname, 'cases/sample.jsonl');
  const concurrency = 5;
  const results = [];

  for (let i = 0; i < CASES.length; i += concurrency) {
    const batch = CASES.slice(i, i + concurrency);
    process.stdout.write(`[${i + 1}-${Math.min(i + concurrency, CASES.length)}/${CASES.length}] `);
    const batchResults = await Promise.all(batch.map(async (c) => {
      try {
        const resp = await generateOne(c);
        return { case: c, ok: true, reply: resp.reply, fidelity: resp.fidelity };
      } catch (e) {
        return { case: c, ok: false, error: String(e.message || e) };
      }
    }));
    results.push(...batchResults);
    console.log('done');
  }

  const flagged = [];
  const failed = [];
  const lines = [];
  for (const r of results) {
    if (!r.ok) {
      failed.push({ id: r.case.id, error: r.error });
      continue;
    }
    if (r.fidelity && r.fidelity.verdict !== 'ok') {
      flagged.push({ id: r.case.id, verdict: r.fidelity.verdict, explanation: r.fidelity.explanation });
    }
    const rec = {
      id: r.case.id,
      patientMessage: r.case.patientMessage,
      doctorNotes: r.case.doctorNotes,
      reply: r.reply,
    };
    if (r.case.background) rec.background = r.case.background;
    lines.push(JSON.stringify(rec));
  }

  if (lines.length > 0) {
    fs.appendFileSync(outPath, lines.join('\n') + '\n');
  }

  console.log('\n--- RESULTS ---');
  console.log(`Appended: ${lines.length} cases to ${outPath}`);
  if (flagged.length > 0) {
    console.log(`\nVerifier flagged ${flagged.length} baseline replies (may not be ideal seeds for the eval):`);
    flagged.forEach(f => console.log(` - ${f.id}: ${f.verdict} — ${f.explanation}`));
  }
  if (failed.length > 0) {
    console.log(`\nFailed to generate ${failed.length}:`);
    failed.forEach(f => console.log(` - ${f.id}: ${f.error}`));
  }
}

main().catch(e => { console.error('Fatal error:', e); process.exit(1); });
