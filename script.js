// ========== THEME TOGGLE ==========
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const iconSun = themeToggle.querySelector('.icon-sun');
const iconMoon = themeToggle.querySelector('.icon-moon');

// Load saved theme (oscuro por defecto)
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcons(savedTheme);
}

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  const next = current === 'light' ? 'dark' : 'light';
  if (next === 'dark') {
    html.removeAttribute('data-theme');
  } else {
    html.setAttribute('data-theme', 'light');
  }
  localStorage.setItem('theme', next);
  updateThemeIcons(next);
});

function updateThemeIcons(theme) {
  if (theme === 'light') {
    iconSun.style.display = 'none';
    iconMoon.style.display = 'block';
  } else {
    iconSun.style.display = 'block';
    iconMoon.style.display = 'none';
  }
}

// ========== MOBILE MENU ==========
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

function setMenu(open) {
  hamburger.classList.toggle('active', open);
  mobileMenu.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
}
hamburger.setAttribute('aria-expanded', 'false');
hamburger.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
mobileLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) setMenu(false);
});

// ========== NAVBAR SCROLL ==========
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ========== ACTIVE NAV LINK ==========
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveLink() {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}
window.addEventListener('scroll', updateActiveLink);

// ========== SCROLL REVEAL ==========
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ========== COUNTER ANIMATION ==========
const counters = document.querySelectorAll('[data-count]');
let counted = false;

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !counted) {
      counted = true;
      counters.forEach(counter => {
        const target = +counter.dataset.count;
        let current = 0;
        const increment = target / 40;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.textContent = target;
            clearInterval(timer);
          } else {
            counter.textContent = Math.floor(current);
          }
        }, 30);
      });
    }
  });
}, { threshold: 0.5 });

if (counters.length) counterObserver.observe(counters[0].closest('.stats'));

// ========== SKILL BARS ==========
const skillCards = document.querySelectorAll('.skill-card');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.3 });

skillCards.forEach(card => skillObserver.observe(card));

// ========== CONTACT FORM ==========
const form = document.getElementById('contactForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  const name = form.name;
  const email = form.email;
  const message = form.message;

  // Reset
  [name, email, message].forEach(field => {
    field.closest('.form-group').classList.remove('error');
  });

  if (!name.value.trim()) {
    name.closest('.form-group').classList.add('error');
    valid = false;
  }
  if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    email.closest('.form-group').classList.add('error');
    valid = false;
  }
  if (!message.value.trim()) {
    message.closest('.form-group').classList.add('error');
    valid = false;
  }

  if (valid) {
    // WhatsApp integration
    const text = encodeURIComponent(
      `Hola Juan Pablo, soy ${name.value}.\n\n${message.value}\n\nMi correo: ${email.value}`
    );
    window.open(`https://wa.me/50661943952?text=${text}`, '_blank');
    form.reset();
  }
});

// ========== PODCAST ==========
// Si existe assets/podcast_juanpablo.mp3 se reproduce ese archivo.
// Si no existe, la página narra el guion (podcast-voz.js) con la voz en español del dispositivo.
const audio = document.getElementById('podcastAudio');
const podcastCard = document.getElementById('podcastCard');
const playBtn = document.getElementById('playBtn');
const seek = document.getElementById('seek');
const curTime = document.getElementById('curTime');
const durTime = document.getElementById('durTime');
const eq = document.getElementById('eq');
const podcastNote = document.getElementById('podcastNote');

// Barras del ecualizador
for (let i = 0; i < 40; i++) {
  const bar = document.createElement('span');
  bar.style.animationDelay = (-Math.random() * 0.9).toFixed(2) + 's';
  bar.style.animationDuration = (0.55 + Math.random() * 0.6).toFixed(2) + 's';
  eq.appendChild(bar);
}

const fmtTime = (s) => {
  if (!isFinite(s)) return '--:--';
  return Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
};
function setProgress(pct) {
  seek.value = pct;
  seek.style.setProperty('--p', pct + '%');
}
function setPlayingUI(on) {
  podcastCard.classList.toggle('playing', on);
  playBtn.setAttribute('aria-label', on ? 'Pausar podcast' : 'Reproducir podcast');
}

let podcastMode = 'audio'; // 'audio' (archivo mp3) | 'voice' (narración) | 'none'

// ---- Modo archivo (mp3) ----
const showDuration = () => { if (podcastMode === 'audio') durTime.textContent = fmtTime(audio.duration); };
['loadedmetadata', 'durationchange', 'canplay'].forEach(ev => audio.addEventListener(ev, showDuration));
if (audio.readyState >= 1) showDuration();
audio.addEventListener('timeupdate', () => {
  if (podcastMode !== 'audio') return;
  curTime.textContent = fmtTime(audio.currentTime);
  if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
});
audio.addEventListener('play', () => { if (podcastMode === 'audio') setPlayingUI(true); });
['pause', 'ended'].forEach(ev => audio.addEventListener(ev, () => {
  if (podcastMode === 'audio') setPlayingUI(false);
}));

// ---- Modo voz (narración con la voz del dispositivo) ----
const segs = window.PODCAST_SEGMENTS || [];
const canSpeak = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window && segs.length > 0;
const WORDS_PER_SEC = 2.75; // ≈ 165 palabras por minuto
const segDur = segs.map(sg => sg.t.split(/\s+/).length / WORDS_PER_SEC + sg.g / 1000);
const segStart = [];
let totalDur = 0;
segDur.forEach(d => { segStart.push(totalDur); totalDur += d; });
let vIndex = 0, vPlaying = false, vToken = 0, vTimer = null, vSegT0 = 0, vVoice = null;

function pickVoice() {
  const list = (speechSynthesis.getVoices() || []).filter(v => /^es([-_]|$)/i.test(v.lang));
  if (!list.length) return null;
  const order = ['es-cr', 'es-mx', 'es-419', 'es-us', 'es-co', 'es-ar', 'es-es'];
  const rank = v => {
    const i = order.indexOf(v.lang.replace('_', '-').toLowerCase());
    return (/natural|online|neural/i.test(v.name) ? -100 : 0) + (i === -1 ? 20 : i);
  };
  return list.slice().sort((x, y) => rank(x) - rank(y))[0];
}
function vUpdate() {
  const el = vPlaying ? Math.min(segDur[vIndex], (performance.now() - vSegT0) / 1000) : 0;
  const t = Math.min(totalDur, (segStart[vIndex] || 0) + el);
  curTime.textContent = fmtTime(t);
  setProgress((t / totalDur) * 100);
}
function vPause() {
  vToken++;
  speechSynthesis.cancel();
  clearInterval(vTimer);
  vPlaying = false;
  setPlayingUI(false);
  vUpdate();
}
function vFinish() {
  clearInterval(vTimer);
  vPlaying = false;
  vIndex = 0;
  setPlayingUI(false);
  vUpdate();
}
function vSpeak(from) {
  const token = ++vToken;
  speechSynthesis.cancel();
  vVoice = pickVoice() || vVoice;
  vPlaying = true;
  setPlayingUI(true);
  clearInterval(vTimer);
  vTimer = setInterval(vUpdate, 250);
  const step = (k) => {
    if (token !== vToken) return;
    if (k >= segs.length) { vFinish(); return; }
    vIndex = k;
    vSegT0 = performance.now();
    vUpdate();
    const u = new SpeechSynthesisUtterance(segs[k].t);
    u.lang = vVoice ? vVoice.lang : 'es-MX';
    if (vVoice) u.voice = vVoice;
    u.rate = 1;
    u.pitch = 1;
    let done = false;
    const next = () => {
      if (done || token !== vToken) return;
      done = true;
      setTimeout(() => step(k + 1), segs[k].g);
    };
    u.onend = next;
    u.onerror = (e) => { if (e.error === 'canceled' || e.error === 'interrupted') return; next(); };
    speechSynthesis.speak(u);
  };
  setTimeout(() => step(from), 80);
}
function enableVoiceMode() {
  if (podcastMode !== 'audio') return;
  if (!canSpeak) {
    podcastMode = 'none';
    playBtn.disabled = true;
    podcastNote.hidden = false;
    podcastNote.textContent = 'Tu navegador no puede leer el podcast en voz alta. Prueba con Chrome, Edge o Safari.';
    return;
  }
  podcastMode = 'voice';
  vVoice = pickVoice();
  durTime.textContent = '~' + fmtTime(totalDur);
  curTime.textContent = '0:00';
  podcastNote.hidden = false;
  podcastNote.textContent = 'Narración con la voz en español de tu dispositivo.';
}
// Si el mp3 no existe, pasa a narración
audio.addEventListener('error', enableVoiceMode);
if (audio.error || audio.networkState === 3) enableVoiceMode();
window.addEventListener('pagehide', () => { if (canSpeak) speechSynthesis.cancel(); });

// ---- Controles (sirven para los dos modos) ----
playBtn.addEventListener('click', () => {
  if (podcastMode === 'voice') {
    if (vPlaying) vPause(); else vSpeak(vIndex);
    return;
  }
  if (podcastMode !== 'audio') return;
  if (audio.paused) {
    audio.play().catch(() => {
      if (audio.error || audio.networkState === 3) {
        enableVoiceMode();
        if (podcastMode === 'voice') vSpeak(vIndex);
      }
    });
  } else {
    audio.pause();
  }
});
seek.addEventListener('input', () => {
  if (podcastMode === 'voice') {
    curTime.textContent = fmtTime((seek.value / 100) * totalDur);
    seek.style.setProperty('--p', seek.value + '%');
    return;
  }
  if (audio.duration) audio.currentTime = (seek.value / 100) * audio.duration;
  seek.style.setProperty('--p', seek.value + '%');
});
seek.addEventListener('change', () => {
  if (podcastMode !== 'voice') return;
  const target = (seek.value / 100) * totalDur;
  let k = 0;
  segStart.forEach((st, i) => { if (st <= target) k = i; });
  vIndex = k;
  if (vPlaying) vSpeak(k); else vUpdate();
});

// ========== VISOR DE CURRÍCULUM ==========
const cvModal = document.getElementById('cvModal');
const cvFrame = document.getElementById('cvFrame');
const cvClose = document.getElementById('cvClose');
let lastFocus = null;

function openCv() {
  lastFocus = document.activeElement;
  if (!cvFrame.getAttribute('src')) cvFrame.setAttribute('src', cvFrame.dataset.src);
  cvModal.classList.add('open');
  cvModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  cvClose.focus();
}
function closeCv() {
  cvModal.classList.remove('open');
  cvModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocus) lastFocus.focus();
}
document.querySelectorAll('[data-open-cv]').forEach(el => el.addEventListener('click', openCv));
cvClose.addEventListener('click', closeCv);
cvModal.addEventListener('click', (e) => { if (e.target === cvModal) closeCv(); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && cvModal.classList.contains('open')) closeCv();
});

// ========== VISTA PREVIA EN VIVO DE PROYECTOS ==========
document.querySelectorAll('.browser').forEach(browser => {
  const view = browser.querySelector('.browser-view');
  const btn = browser.querySelector('.live-btn');
  const fit = (frame) => { frame.style.transform = `scale(${view.clientWidth / 1280})`; };
  btn.addEventListener('click', () => {
    const frame = document.createElement('iframe');
    frame.src = browser.dataset.url;
    frame.title = 'Vista previa de ' + browser.dataset.url;
    frame.loading = 'lazy';
    frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms');
    fit(frame);
    view.appendChild(frame);
    view.querySelector('.browser-cover').style.display = 'none';
    new ResizeObserver(() => fit(frame)).observe(view);
  });
});

// ========== FORMULARIO DE COTIZACIÓN (WhatsApp) ==========
const WA_NUMBER = '50661943952';
const quoteForm = document.getElementById('quoteForm');
const quoteNote = document.getElementById('quoteNote');

quoteForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const f = id => document.getElementById(id);
  const fields = {
    name: f('q-name'), email: f('q-email'), service: f('q-service'),
    budget: f('q-budget'), deadline: f('q-deadline'), message: f('q-message')
  };
  Object.values(fields).forEach(el => el.closest('.form-group').classList.remove('error'));

  let valid = true;
  const fail = el => { el.closest('.form-group').classList.add('error'); valid = false; };
  if (!fields.name.value.trim()) fail(fields.name);
  if (fields.email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value)) fail(fields.email);
  if (!fields.service.value) fail(fields.service);
  if (!fields.budget.value) fail(fields.budget);
  if (!fields.message.value.trim()) fail(fields.message);
  if (!valid) {
    quoteNote.className = 'form-note';
    quoteNote.textContent = 'Revisa los campos marcados en rojo.';
    return;
  }

  const lines = [
    `Hola Juan Pablo, soy ${fields.name.value.trim()}. Quiero cotizar un proyecto.`,
    '',
    `*Servicio:* ${fields.service.value}`,
    `*Presupuesto:* ${fields.budget.value}`,
    `*Plazo:* ${fields.deadline.value || 'Sin fecha definida'}`,
    `*Idea:* ${fields.message.value.trim()}`
  ];
  if (fields.email.value.trim()) lines.push(`*Correo:* ${fields.email.value.trim()}`);
  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;

  const win = window.open(url, '_blank', 'noopener');
  quoteNote.className = 'form-note ok';
  quoteNote.innerHTML = win
    ? 'Se abrió WhatsApp con tu mensaje. Envíalo para que me llegue.'
    : `Tu navegador bloqueó la ventana. <a href="${url}" target="_blank" rel="noopener">Toca aquí para abrir WhatsApp</a>.`;
  quoteForm.reset();
});


// ========== TRANSICIÓN AL HACER CLIC EN ENLACES ==========
const curtain = document.getElementById('pageCurtain');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const CURTAIN_IN = 240;   // ms que tarda en cubrir la pantalla
const CURTAIN_OUT = 360;  // ms que tarda en descubrirla
let curtainBusy = false;

function runCurtain(midAction, keepClosed) {
  if (reduceMotion || curtainBusy) { if (midAction) midAction(); return; }
  curtainBusy = true;
  curtain.className = 'page-curtain in';
  setTimeout(() => {
    if (midAction) midAction();
    if (keepClosed) return; // se está yendo a otra página: la cortina queda cerrada
    curtain.className = 'page-curtain out';
    setTimeout(() => { curtain.className = 'page-curtain'; curtainBusy = false; }, CURTAIN_OUT);
  }, CURTAIN_IN);
}

// Al terminar la apertura inicial, la cortina se esconde del todo
curtain.addEventListener('animationend', (e) => {
  if (e.animationName === 'curtain-open') curtain.className = 'page-curtain';
});

// Enlaces internos (#sección): la cortina cubre, salta a la sección y descubre
document.querySelectorAll('a[href^="#"]').forEach(a => {
  const id = a.getAttribute('href').slice(1);
  if (!id) return;
  a.addEventListener('click', (e) => {
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    runCurtain(() => {
      html.style.scrollBehavior = 'auto';
      target.scrollIntoView();
      html.style.scrollBehavior = '';
      history.replaceState(null, '', '#' + id);
      updateActiveLink();
    });
  });
});

// Enlaces a otras páginas (proyectos): la cortina cubre y luego entra al enlace
document.querySelectorAll('a[data-transition]').forEach(a => {
  a.addEventListener('click', (e) => {
    if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return; // clic con modificador: comportamiento normal
    e.preventDefault();
    const url = a.href;
    runCurtain(() => { window.location.href = url; }, true);
  });
});

// Al volver con el botón "atrás" la página puede quedar con la cortina cerrada: se reinicia
window.addEventListener('pageshow', (e) => {
  if (e.persisted) { curtain.className = 'page-curtain'; curtainBusy = false; }
});
