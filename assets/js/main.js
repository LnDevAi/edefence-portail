
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
  if (!org || !email || !size) { showToast('Veuillez remplir tous les champs.'); return; }
  document.getElementById('secu-blurred').classList.add('revealed');
  document.getElementById('frustration-gate').classList.add('hidden');
  document.getElementById('frustration-success').classList.remove('hidden');
};

window.toggleMobileNav = function() {
  const el = document.getElementById('mobile-nav');
  if (el) el.classList.toggle('hidden');
};

// ----- Modal & forms -----
const FORMS = {
  login: `
    <h2 class="font-display text-2xl font-bold text-white mb-1">Bon retour</h2>
    <p class="text-ed-muted text-sm mb-6">Connectez-vous à votre espace E DEFENCE</p>
    <form onsubmit="handleAuth(event,'login')">
      <div class="space-y-4">
        <div><label class="block text-xs text-ed-muted uppercase tracking-wide mb-1.5">Email</label><input type="email" class="ed-input text-sm" placeholder="contact@entreprise.com" required/></div>
        <div><label class="block text-xs text-ed-muted uppercase tracking-wide mb-1.5">Mot de passe</label><input type="password" class="ed-input text-sm" placeholder="••••••••" required/></div>
        <button type="submit" class="w-full py-3 rounded-xl text-sm font-semibold text-ed-bg btn-primary">Se connecter</button>
      </div>
    </form>
    <p class="text-center text-xs text-ed-muted mt-4">Pas de compte ? <button onclick="openModal('signup')" class="hover:underline" style="color:var(--accent1)">Créer un accès gratuit</button></p>`,
  signup: `
    <h2 class="font-display text-2xl font-bold text-white mb-1">Accès gratuit</h2>
    <p class="text-ed-muted text-sm mb-6">Créez votre compte et démarrez votre audit</p>
    <form onsubmit="handleAuth(event,'signup')">
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div><label class="block text-xs text-ed-muted uppercase tracking-wide mb-1.5">Prénom</label><input type="text" class="ed-input text-sm" required/></div>
          <div><label class="block text-xs text-ed-muted uppercase tracking-wide mb-1.5">Nom</label><input type="text" class="ed-input text-sm" required/></div>
        </div>
        <div><label class="block text-xs text-ed-muted uppercase tracking-wide mb-1.5">Email professionnel</label><input type="email" class="ed-input text-sm" placeholder="contact@entreprise.com" required/></div>
        <div><label class="block text-xs text-ed-muted uppercase tracking-wide mb-1.5">Organisation</label><input type="text" class="ed-input text-sm" placeholder="Nom de votre entreprise" required/></div>
        <div><label class="block text-xs text-ed-muted uppercase tracking-wide mb-1.5">Mot de passe</label><input type="password" class="ed-input text-sm" placeholder="8 caractères minimum" required minlength="8"/></div>
        <button type="submit" class="w-full py-3 rounded-xl text-sm font-semibold text-ed-bg btn-primary">Créer mon compte gratuit</button>
      </div>
    </form>
    <p class="text-center text-xs text-ed-muted mt-4">Déjà un compte ? <button onclick="openModal('login')" class="hover:underline" style="color:var(--accent1)">Se connecter</button></p>`
};

window.openModal = function(type) {
  const content = FORMS[type] || '';
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
  showToast(type==='login' ? 'Connexion réussie.' : 'Compte créé. Bienvenue sur E DEFENCE.');
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

// ----- Initialisation au chargement -----
window.addEventListener('DOMContentLoaded', function(){
  restoreLightModeFromStorage();
  loadIncludes();
});
