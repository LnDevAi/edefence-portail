// Lightweight i18n for E-DEFENCE portail
const STORAGE_KEY = 'edefence:lang';

const translations = {
  fr: {
    nav: {
      portail: 'Portail',
      features: 'Fonctionnalités',
      parcours: 'Parcours',
      certifications: 'Certifications',
      plateformes: 'Plateformes',
      news: 'Actualités',
      contact: 'Contact',
    },
    auth: {
      login: 'Connexion',
      signup: 'Accès gratuit',
      register: "S'inscrire",
    },
    modal: {
      login: {
        title: 'Bon retour',
        subtitle: 'Connectez-vous à votre espace E DEFENCE',
        email: 'Email',
        password: 'Mot de passe',
        submit: 'Se connecter',
        no_account: 'Pas de compte ?',
        create: 'Créer un accès gratuit',
      },
      signup: {
        title: 'Accès gratuit',
        subtitle: 'Créez votre compte et démarrez votre audit',
        first_name: 'Prénom',
        last_name: 'Nom',
        email: 'Email professionnel',
        org: 'Organisation',
        org_placeholder: "Nom de votre entreprise",
        password: 'Mot de passe',
        password_hint: '8 caractères minimum',
        submit: 'Créer mon compte gratuit',
        have_account: 'Déjà un compte ?',
        connect: 'Se connecter',
      },
    },
    toast: {
      fill_fields: 'Veuillez remplir tous les champs.',
      login_success: 'Connexion réussie.',
      signup_success: 'Compte créé. Bienvenue sur E DEFENCE.',
    },
    lang_toggle: 'EN',
  },
  en: {
    nav: {
      portail: 'Portal',
      features: 'Features',
      parcours: 'Learning path',
      certifications: 'Certifications',
      plateformes: 'Platforms',
      news: 'News',
      contact: 'Contact',
    },
    auth: {
      login: 'Sign in',
      signup: 'Free access',
      register: 'Sign up',
    },
    modal: {
      login: {
        title: 'Welcome back',
        subtitle: 'Sign in to your E DEFENCE space',
        email: 'Email',
        password: 'Password',
        submit: 'Sign in',
        no_account: 'No account?',
        create: 'Create free access',
      },
      signup: {
        title: 'Free access',
        subtitle: 'Create your account and start your audit',
        first_name: 'First name',
        last_name: 'Last name',
        email: 'Professional email',
        org: 'Organization',
        org_placeholder: 'Your company name',
        password: 'Password',
        password_hint: 'Minimum 8 characters',
        submit: 'Create my free account',
        have_account: 'Already have an account?',
        connect: 'Sign in',
      },
    },
    toast: {
      fill_fields: 'Please fill in all fields.',
      login_success: 'Successfully signed in.',
      signup_success: 'Account created. Welcome to E DEFENCE.',
    },
    lang_toggle: 'FR',
  },
};

let _lang = 'fr';

function t(keyPath) {
  const keys = keyPath.split('.');
  let node = translations[_lang];
  for (const k of keys) {
    if (!node) return keyPath;
    node = node[k];
  }
  return node || keyPath;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  const toggleBtn = document.getElementById('lang-toggle');
  if (toggleBtn) toggleBtn.textContent = t('lang_toggle');
}

window.setLang = function(lang) {
  _lang = lang;
  try { localStorage.setItem(STORAGE_KEY, lang); } catch(e) {}
  document.documentElement.lang = lang;
  applyTranslations();
};

window.toggleLang = function() {
  window.setLang(_lang === 'fr' ? 'en' : 'fr');
};

window.t = t;

// Initialize from storage
(function init() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'fr') _lang = saved;
  } catch(e) {}
})();
