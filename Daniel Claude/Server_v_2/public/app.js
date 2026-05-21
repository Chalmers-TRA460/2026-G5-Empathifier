/*
Browserside of demo app. 
Works with the UI and handles interactions. 
This is the frontend. 
*/

/*
State managment and connecting to backend APIs.
Switch between patient and doctor view, store messages, handle dev mode, send messages and so on
*/
let currentRole = 'patient';
let messages = [];
let appConfig = { devModeDefault: false, sanityCheckerAvailable: false };
let devMode = false;
let lastGeneration = null;

(async function loadConfig() {
  try {
    const res = await fetch('/api/config');
    appConfig = await res.json();
    const stored = localStorage.getItem('devMode');
    devMode = stored === null ? !!appConfig.devModeDefault : stored === 'true';
    applyDevModeUI();
  } catch (_) {}
})();

function toggleDevMode() {
  devMode = !devMode;
  localStorage.setItem('devMode', devMode ? 'true' : 'false');
  applyDevModeUI();
}

function applyDevModeUI() {
  const btn = document.getElementById('dev-toggle');
  if (!btn) return;
  if (!appConfig.sanityCheckerAvailable) {
    btn.style.display = 'none';
    return;
  }
  btn.style.display = 'inline-flex';
  btn.classList.toggle('active', devMode);
  document.body.classList.toggle('dev-mode', devMode);
}

function setRole(role) {
  currentRole = role;
  document.getElementById('btn-patient').classList.toggle('active', role === 'patient');
  document.getElementById('btn-doctor').classList.toggle('active', role === 'doctor');

  const composeBtn = document.getElementById('compose-btn');
  const hasPatientMessage = messages.some(m => m.role === 'patient');
  composeBtn.classList.toggle('visible', role === 'doctor' && hasPatientMessage);

  document.getElementById('chat-input').placeholder =
    role === 'patient' ? 'Skriv ett meddelande...' : 'Skriv ett svar...';
}

function getLastPatientMessage() {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'patient') return messages[i].text;
  }
  return null;
}

function renderMessages() {
  const thread = document.getElementById('chat-thread');

  if (messages.length === 0) {
    thread.innerHTML = `
      <div class="empty-state">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <p>Inget meddelande ännu.<br/>Byt till Patient för att börja.</p>
      </div>`;
    return;
  }

  thread.innerHTML = messages.map(msg => `
    <div class="message-wrap ${msg.role}">
      <div class="message ${msg.role}">${escapeHtml(msg.text)}</div>
      <div class="message-meta">${msg.role === 'patient' ? 'Patient' : 'Läkare'} · ${msg.time}</div>
    </div>
  `).join('');

  thread.scrollTop = thread.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;

  messages.push({ role: currentRole, text, time: now() });
  input.value = '';
  autoResize(input);
  renderMessages();

  const composeBtn = document.getElementById('compose-btn');
  const hasPatientMessage = messages.some(m => m.role === 'patient');
  if (currentRole === 'doctor' && hasPatientMessage) {
    composeBtn.classList.add('visible');
  } else if (currentRole === 'patient') {
    composeBtn.classList.remove('visible');
  }
}

function handleInputKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}
/*
Modal management and generating replies.
When doctor clicks on generate answer with AI this logic triggers
Triggers backend with generation request and handles the response.
*/

function openModal() {
  const lastMsg = getLastPatientMessage();
  if (!lastMsg) return;

  document.getElementById('patient-msg-text').textContent = lastMsg;
  document.getElementById('doctor-notes').value = '';
  document.getElementById('background').value = '';
  document.getElementById('generated-area').style.display = 'none';
  document.getElementById('generated-text').value = '';
  document.getElementById('flag-box').style.display = 'none';
  document.getElementById('fidelity-box').style.display = 'none';
  document.getElementById('sanity-box').style.display = 'none';
  document.getElementById('test-inject-btn').style.display = 'none';
  document.getElementById('modal-overlay').classList.add('open');
  setTimeout(() => document.getElementById('doctor-notes').focus(), 100);
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

function closeModalOutside(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
}

async function generateReply() {
  const doctorNotes = document.getElementById('doctor-notes').value.trim();
  if (!doctorNotes) {
    document.getElementById('doctor-notes').focus();
    return;
  }

  const patientMessage = getLastPatientMessage();
  const background = document.getElementById('background').value.trim();
  const useHistory = document.getElementById('use-history').checked;
  const chatHistory = useHistory ? messages : null;

  const btn = document.getElementById('generate-btn');
  btn.disabled = true;
  btn.textContent = 'Genererar...';

  document.getElementById('flag-box').style.display = 'none';
  document.getElementById('fidelity-box').style.display = 'none';
  document.getElementById('sanity-box').style.display = 'none';

  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doctorNotes, patientMessage, background, chatHistory, devMode }),
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error);

    const { flag, message } = parseReply(data.reply);

    const flagBox = document.getElementById('flag-box');
    if (flag) {
      flagBox.textContent = flag;
      flagBox.style.display = 'block';
    }
    /*
    Renders the fidelity and sanity check results. 
    Also handles some dev mode features like the test injection button and regenerating the reply. 
    */
    renderFidelity(data.fidelity);
    if (data.devMode) renderSanity(data.sanity);

    lastGeneration = { doctorNotes, patientMessage, background, generatedReply: message };

    document.getElementById('generated-text').value = message;
    document.getElementById('generated-area').style.display = 'flex';
    document.getElementById('test-inject-btn').style.display = devMode ? 'inline-flex' : 'none';
    document.getElementById('generated-text').focus();
  } catch (err) {
    alert('Något gick fel: ' + err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Generera';
  }
}

function renderFidelity(fidelity) {
  const box = document.getElementById('fidelity-box');
  if (!fidelity || fidelity.verdict === 'ok') {
    box.style.display = 'none';
    return;
  }
  const severityClass = fidelity.verdict === 'block' ? 'block' : 'warn';
  const title = fidelity.verdict === 'block'
    ? 'Allvarlig avvikelse upptäckt'
    : 'Möjlig avvikelse — granska';
  const items = [...(fidelity.added || []).map(t => `Tillagt: ${t}`),
                 ...(fidelity.altered || []).map(t => `Ändrat: ${t}`)];
  box.className = 'banner-box fidelity ' + severityClass;
  box.innerHTML = `
    <div class="banner-title">${escapeHtml(title)}</div>
    <div class="banner-body">${escapeHtml(fidelity.explanation || '')}</div>
    ${items.length ? `<ul class="banner-list">${items.map(i => `<li>${escapeHtml(i)}</li>`).join('')}</ul>` : ''}
  `;
  box.style.display = 'block';
}

function renderSanity(sanity) {
  const box = document.getElementById('sanity-box');
  if (!sanity || !sanity.concern) {
    box.style.display = 'none';
    return;
  }
  const sev = sanity.severity === 'high' ? 'block' : 'warn';
  box.className = 'banner-box sanity ' + sev;
  box.innerHTML = `
    <div class="banner-title">Klinisk anmärkning <span class="dev-tag">DEV</span></div>
    <div class="banner-body">${escapeHtml(sanity.note || '')}</div>
  `;
  box.style.display = 'block';
}

const TEST_INJECTIONS = [
  'Ta även 500 mg paracetamol var fjärde timme tills besvären släpper.',
  'Vi beställer en MRT av knäleden inom två veckor.',
  'Sluta omedelbart med dina blodförtunnande läkemedel tills vidare.',
  'Du bör börja med 20 mg omeprazol dagligen i åtta veckor.',
  'Ett PSA-prov är beställt — boka tid för provtagning på din vårdcentral.',
  'Jag rekommenderar att du tar amoxicillin 500 mg tre gånger dagligen i tio dagar.',
  'Vid feber över 38,5 °C måste du åka direkt till akuten.',
  'Vi planerar en gastroskopi inom en månad.',
];

async function injectTestInfo() {
  if (!lastGeneration) return;
  const btn = document.getElementById('test-inject-btn');
  const textarea = document.getElementById('generated-text');

  const injection = TEST_INJECTIONS[Math.floor(Math.random() * TEST_INJECTIONS.length)];
  const current = textarea.value.trim();
  const mutated = current + '\n\n' + injection;
  textarea.value = mutated;

  btn.disabled = true;
  const originalHtml = btn.innerHTML;
  btn.innerHTML = '<span class="dev-tag">DEV</span> Kontrollerar...';

  document.getElementById('fidelity-box').style.display = 'none';
  document.getElementById('sanity-box').style.display = 'none';

  try {
    const res = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doctorNotes: lastGeneration.doctorNotes,
        patientMessage: lastGeneration.patientMessage,
        background: lastGeneration.background,
        generatedReply: mutated,
        devMode,
        injected: injection,
      }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    renderFidelity(data.fidelity);
    if (data.devMode) renderSanity(data.sanity);
    lastGeneration.generatedReply = mutated;
  } catch (err) {
    alert('Verifieringen misslyckades: ' + err.message);
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalHtml;
  }
}
/*
Copies the generated reply into the chat input. 
*/
function useReply() {
  const text = document.getElementById('generated-text').value.trim();
  if (!text) return;

  if (lastGeneration) {
    fetch('/api/log-sent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doctorNotes: lastGeneration.doctorNotes,
        generatedReply: lastGeneration.generatedReply,
        sentReply: text,
      }),
    }).catch(() => {});
  }

  const input = document.getElementById('chat-input');
  input.value = text;
  autoResize(input);
  closeModal();
  input.focus();
}

function parseReply(text) {
  const flagMatch = text.match(/^⚠️ Note for doctor: (.+)/);
  if (!flagMatch) return { flag: null, message: text.trim() };

  const parts = text.split(/\n---\n/);
  const flag = flagMatch[1].trim();
  const message = (parts[1] || '').trim();
  return { flag, message };
}

function now() {
  return new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
}

renderMessages();
