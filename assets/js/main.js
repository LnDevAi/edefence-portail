
// ----- Helpers : chargement d'un include HTML-----
async function loadInclude(id, url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const html = await res.text();
    const container = document.getElementById(id);
    if (container) container.innerHTML = html;
  } catch (err) {
    console.warn('Échec include', url, err);
  }
}

// ----- Charger header et footer (à appeler au démarrage) -----
async function loadIncludes() {
  await Promise.all([
    loadInclude('include-header', 'includes/header.html'),
    loadInclude('include-footer', 'includes/footer.html')
  ]);

  // Appliquer les traductions après insertion du header
  if (typeof window.setLang === 'function') {
    const saved = (function() { try { return localStorage.getItem('edefence:lang') || 'fr'; } catch(e) { return 'fr'; } })();
    window.setLang(saved);
  }

  // Après insertion, attacher l'écouteur pour le bouton theme
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleLightMode);
}

// ----- Thème / couleur d'accent : bascule et mémorisation -----
// Toggle du mode clair (white theme) : applique la classe `light-mode` sur la balise <body>
function toggleLightMode() {
  const body = document.body;
  body.classList.toggle('light-mode');
  const isLight = body.classList.contains('light-mode');
  try { localStorage.setItem('edefence:lightMode', isLight ? '1' : '0'); } catch(e){}
}
// Restaurer le mode clair depuis le stockage local
function restoreLightModeFromStorage() {
  try {
    const v = localStorage.getItem('edefence:lightMode');
    if (v==='1') document.body.classList.add('light-mode');
  } catch(e){}
}

// ----- Fonctions utilitaires visibles globalement (utilisées par les onclick HTML) -----
window.switchPortalTab = function(id, el) {
  document.querySelectorAll('.portal-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.portal-nav-item').forEach(b => b.classList.remove('active'));
  const tab = document.getElementById('ptab-' + id);
  if (tab) tab.classList.add('active');
  if (el) el.classList.add('active');
};

window.unlockReport = function() {
  const org   = document.getElementById('f-org').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const size  = document.getElementById('f-size').value;
  if (!org || !email || !size) { showToast(t('toast.fill_fields')); return; }
  document.getElementById('secu-blurred').classList.add('revealed');
  document.getElementById('frustration-gate').classList.add('hidden');
  document.getElementById('frustration-success').classList.remove('hidden');
};

window.toggleMobileNav = function() {
  const el = document.getElementById('mobile-nav');
  if (el) el.classList.toggle('hidden');
};

// ----- Modal & forms -----
function buildForms() {
  return {
    login: `
      <h2 class="font-display text-2xl font-bold text-white mb-1">${t('modal.login.title')}</h2>
      <p class="text-ed-muted text-sm mb-6">${t('modal.login.subtitle')}</p>
      <form onsubmit="handleAuth(event,'login')">
        <div class="space-y-4">
          <div><label class="block text-xs text-ed-muted uppercase tracking-wide mb-1.5">${t('modal.login.email')}</label><input type="email" class="ed-input text-sm" placeholder="contact@entreprise.com" required/></div>
          <div><label class="block text-xs text-ed-muted uppercase tracking-wide mb-1.5">${t('modal.login.password')}</label><input type="password" class="ed-input text-sm" placeholder="••••••••" required/></div>
          <button type="submit" class="w-full py-3 rounded-xl text-sm font-semibold text-ed-bg btn-primary">${t('modal.login.submit')}</button>
        </div>
      </form>
      <p class="text-center text-xs text-ed-muted mt-4">${t('modal.login.no_account')} <button onclick="openModal('signup')" class="hover:underline" style="color:var(--accent1)">${t('modal.login.create')}</button></p>`,
    signup: `
      <h2 class="font-display text-2xl font-bold text-white mb-1">${t('modal.signup.title')}</h2>
      <p class="text-ed-muted text-sm mb-6">${t('modal.signup.subtitle')}</p>
      <form onsubmit="handleAuth(event,'signup')">
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div><label class="block text-xs text-ed-muted uppercase tracking-wide mb-1.5">${t('modal.signup.first_name')}</label><input type="text" class="ed-input text-sm" required/></div>
            <div><label class="block text-xs text-ed-muted uppercase tracking-wide mb-1.5">${t('modal.signup.last_name')}</label><input type="text" class="ed-input text-sm" required/></div>
          </div>
          <div><label class="block text-xs text-ed-muted uppercase tracking-wide mb-1.5">${t('modal.signup.email')}</label><input type="email" class="ed-input text-sm" placeholder="contact@entreprise.com" required/></div>
          <div><label class="block text-xs text-ed-muted uppercase tracking-wide mb-1.5">${t('modal.signup.org')}</label><input type="text" class="ed-input text-sm" placeholder="${t('modal.signup.org_placeholder')}" required/></div>
          <div><label class="block text-xs text-ed-muted uppercase tracking-wide mb-1.5">${t('modal.signup.password')}</label><input type="password" class="ed-input text-sm" placeholder="${t('modal.signup.password_hint')}" required minlength="8"/></div>
          <button type="submit" class="w-full py-3 rounded-xl text-sm font-semibold text-ed-bg btn-primary">${t('modal.signup.submit')}</button>
        </div>
      </form>
      <p class="text-center text-xs text-ed-muted mt-4">${t('modal.signup.have_account')} <button onclick="openModal('login')" class="hover:underline" style="color:var(--accent1)">${t('modal.signup.connect')}</button></p>`
  };
}

window.openModal = function(type) {
  const content = buildForms()[type] || '';
  const target = document.getElementById('modal-content');
  if (target) target.innerHTML = content;
  const bd = document.getElementById('modal-bd');
  if (bd) { bd.classList.remove('hidden'); bd.classList.add('flex'); }
};
window.closeModal = function() {
  const bd = document.getElementById('modal-bd');
  if (bd) { bd.classList.add('hidden'); bd.classList.remove('flex'); }
};

// Click outside modal to close
document.addEventListener('click', function(e){
  const bd = document.getElementById('modal-bd');
  if (bd && e.target === bd) closeModal();
});

window.handleAuth = function(e, type) {
  e.preventDefault();
  closeModal();
  showToast(type === 'login' ? t('toast.login_success') : t('toast.signup_success'));
};

window.handleContact = function(e) {
  e.preventDefault();
  e.target.reset();
  const ok = document.getElementById('contact-ok');
  if (ok) { ok.classList.remove('hidden'); setTimeout(() => ok.classList.add('hidden'), 5000); }
};

// ----- Toast -----
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), 3500);
}
window.showToast = showToast;

// ----- Smooth scroll: fermer le mobile nav après clic sur ancre -----
document.addEventListener('click', function(e){
  const a = e.target.closest && e.target.closest('a[href^="#"]');
  if (a) {
    const mobile = document.getElementById('mobile-nav');
    if (mobile) mobile.classList.add('hidden');
  }
});

// ----- Actualités cybersécurité -----
window.loadActualites = async function() {
  const container = document.getElementById('actualites-grid');
  if (!container) return;

  const fallback = [
    {
      title: "Vague de ransomwares cible les PME en Afrique de l'Ouest",
      summary: "Une nouvelle campagne de ransomware exploite des vulnérabilités RDP non corrigées pour cibler les petites et moyennes entreprises burkinabè et sénégalaises.",
      category: "alerte",
      published_at: new Date().toISOString(),
      is_ai_generated: false
    },
    {
      title: "Zero Trust : adoption croissante dans les entreprises UEMOA",
      summary: "Le modèle Zero Trust gagne du terrain dans les DSI de la zone UEMOA, porté par les exigences de conformité BCEAO et les incidents récents.",
      category: "actualite",
      published_at: new Date().toISOString(),
      is_ai_generated: true
    },
    {
      title: "RGPD au Burkina Faso : ce que change la nouvelle directive CIL",
      summary: "La Commission de l'Informatique et des Libertés (CIL) du Burkina Faso renforce ses exigences — voici les points d'attention pour votre entreprise.",
      category: "article_maison",
      published_at: new Date().toISOString(),
      is_ai_generated: false
    }
  ];

  try {
    const res = await fetch('/api/v1/articles?published=true&limit=6');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    const articles = Array.isArray(data) ? data : (data.items || []);
    renderActualites(container, articles.length ? articles : fallback);
  } catch {
    renderActualites(container, fallback);
  }
};

function renderActualites(container, articles) {
  const catColors  = { actualite: '#00d4ff', alerte: '#ff3b5c', tutorial: '#00c896', article_maison: '#ffa500' };
  const catLabels  = { actualite: 'Actualité', alerte: 'Alerte', tutorial: 'Tutoriel', article_maison: 'Article' };

  container.innerHTML = articles.map(function(a) {
    const color = catColors[a.category] || '#00d4ff';
    const label = catLabels[a.category] || 'Article';
    const rgb   = hexToRgb(color);
    const date  = new Date(a.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    const aiTag = a.is_ai_generated
      ? '<span class="badge badge-info" style="font-size:9px">IA</span>'
      : '';
    return '<div class="card-border rounded-2xl p-5" style="background:rgba(255,255,255,.02)">'
      + '<div class="flex items-center gap-2 mb-3">'
      +   '<span class="badge" style="background:rgba(' + rgb + ',.12);border:1px solid rgba(' + rgb + ',.3);color:' + color + '">' + label + '</span>'
      +   aiTag
      + '</div>'
      + '<h3 class="font-semibold text-white text-sm mb-2 leading-snug">' + escapeHtml(a.title) + '</h3>'
      + '<p class="text-xs text-ed-muted leading-relaxed mb-3">' + escapeHtml(a.summary || '') + '</p>'
      + '<div class="text-xs text-ed-muted">' + date + '</div>'
      + '</div>';
  }).join('');
}

function hexToRgb(hex) {
  var r = parseInt(hex.slice(1, 3), 16);
  var g = parseInt(hex.slice(3, 5), 16);
  var b = parseInt(hex.slice(5, 7), 16);
  return r + ',' + g + ',' + b;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ----- Initialisation au chargement -----
window.addEventListener('DOMContentLoaded', function(){
  restoreLightModeFromStorage();
  loadIncludes();
  loadActualites();
});
