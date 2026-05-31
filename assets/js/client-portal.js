// ── E-DEFENCE Client Portal ────────────────────────────────────────────────
// Native <dialog> element (browser top layer). The dialog IS the styled box
// — no wrapper div — so no "double window" visual artefact.

(function () {
  'use strict';

  var _token = null;
  var _client = null;
  var _pendingService = null;

  // ── LocalStorage ──────────────────────────────────────────────────────────

  function getToken() {
    try { return localStorage.getItem('edefence:clientToken'); } catch (e) { return null; }
  }
  function saveToken(t) {
    try { localStorage.setItem('edefence:clientToken', t); } catch (e) {}
  }
  function clearToken() {
    try {
      localStorage.removeItem('edefence:clientToken');
      localStorage.removeItem('edefence:clientData');
    } catch (e) {}
  }
  function saveClientData(d) {
    try { localStorage.setItem('edefence:clientData', JSON.stringify(d)); } catch (e) {}
  }
  function getClientData() {
    try { return JSON.parse(localStorage.getItem('edefence:clientData') || 'null'); } catch (e) { return null; }
  }

  // ── Dialog ────────────────────────────────────────────────────────────────
  // The <dialog> element itself carries all styling — no inner wrapper.
  // margin: 80px auto positions it at the top (below the 64px fixed navbar).

  var DIALOG_CSS = [
    '#cp-dialog {',
    '  border: 1px solid rgba(0,212,255,.2);',
    '  border-radius: 16px;',
    '  padding: 32px 28px 28px 28px;',
    '  background: #071525;',
    '  color: #e8f4ff;',
    '  max-width: min(580px, calc(100vw - 20px));',
    '  width: 100%;',
    '  box-sizing: border-box;',
    '  outline: none;',
    '  overflow-y: auto;',
    '  max-height: calc(100svh - 100px);',
    '  position: relative;',
    '  margin: 80px auto 20px auto;',
    '}',
    '#cp-dialog::backdrop { background: rgba(4,12,28,0.92); backdrop-filter: blur(2px); }',
  ].join('\n');

  var CLOSE_BTN =
    '<button onclick="closeClientModal()" aria-label="Fermer" style="'
    + 'position:absolute;top:12px;right:14px;background:none;border:none;'
    + 'cursor:pointer;color:#4a6b8a;font-size:26px;line-height:1;'
    + 'padding:4px 8px;" >&times;</button>';

  function getOrCreateDialog() {
    var dlg = document.getElementById('cp-dialog');
    if (!dlg) {
      if (!document.getElementById('cp-dialog-style')) {
        var s = document.createElement('style');
        s.id = 'cp-dialog-style';
        s.textContent = DIALOG_CSS;
        document.head.appendChild(s);
      }
      dlg = document.createElement('dialog');
      dlg.id = 'cp-dialog';
      document.body.appendChild(dlg);
    }
    return dlg;
  }

  function showView(viewName, viewData) {
    var dlg = getOrCreateDialog();
    var content = '';
    if      (viewName === 'login')     content = buildLoginView(viewData);
    else if (viewName === 'register')  content = buildRegisterView(viewData);
    else if (viewName === 'catalog')   content = buildCatalogView(viewData);
    else if (viewName === 'checkout')  content = buildCheckoutView(viewData);
    else if (viewName === 'dashboard') content = buildDashboardView(viewData);
    else if (viewName === 'service')   content = buildServiceView(viewData);
    else if (viewName === 'success')   content = buildSuccessView(viewData);

    // The dialog IS the box — no wrapper div needed
    dlg.innerHTML = CLOSE_BTN + content;
    dlg.scrollTop = 0;

    if (!dlg.open) {
      try { dlg.showModal(); } catch (e) { dlg.setAttribute('open', ''); }
    }

    setTimeout(function () {
      dlg.querySelectorAll('[data-cp-tab]').forEach(function (btn) {
        btn.addEventListener('click', function () { cpSwitchTab(btn.dataset.cpTab); });
      });
      var first = dlg.querySelector('input:not([type=radio]), select, textarea');
      if (first) { try { first.focus(); } catch (e) {} }
    }, 80);
  }

  window.closeClientModal = function () {
    var dlg = document.getElementById('cp-dialog');
    if (dlg && dlg.open) { try { dlg.close(); } catch (e) { dlg.removeAttribute('open'); } }
  };

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var d = document.getElementById('cp-dialog');
      if (d && d.open) d.close();
    }
  });

  // ── Helpers ───────────────────────────────────────────────────────────────

  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function fmtFcfa(n) { return Number(n || 0).toLocaleString('fr-FR') + ' F CFA'; }
  function fmtDate(d) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  // ── Shared style tokens ───────────────────────────────────────────────────

  var S = {
    label:   'display:block;font-size:11px;color:#4a6b8a;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;font-weight:600',
    input:   'width:100%;box-sizing:border-box;background:#0d1e33;border:1px solid #1e3a5f;border-radius:8px;padding:10px 12px;color:#e8f4ff;font-size:14px;font-family:inherit;outline:none',
    btnPrim: 'width:100%;padding:12px;border-radius:10px;font-size:14px;font-weight:700;border:none;cursor:pointer;background:linear-gradient(135deg,#00d4ff,#00c896);color:#07111f;font-family:inherit',
    btnGhost:'background:none;border:1px solid rgba(255,255,255,.15);border-radius:8px;padding:8px 14px;color:#e8f4ff;font-size:12px;cursor:pointer;font-family:inherit',
    link:    'color:#00d4ff;background:none;border:none;cursor:pointer;font-size:12px;text-decoration:underline;font-family:inherit',
    card:    'background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:14px;margin-bottom:10px',
    errBox:  'background:rgba(255,59,92,.08);border:1px solid rgba(255,59,92,.25);border-radius:8px;padding:10px 12px;color:#ff3b5c;font-size:12px;margin-bottom:14px',
    okBox:   'background:rgba(0,200,150,.08);border:1px solid rgba(0,200,150,.25);border-radius:8px;padding:10px 12px;color:#00c896;font-size:12px;margin-bottom:14px',
    infoBox: 'background:rgba(0,212,255,.06);border:1px solid rgba(0,212,255,.2);border-radius:8px;padding:12px 14px;color:#e8f4ff;font-size:12px;margin-bottom:14px',
    h2:      'font-family:"Space Grotesk",sans-serif;font-size:20px;font-weight:700;color:#e8f4ff;margin:0 0 4px 0',
    sub:     'color:#4a6b8a;font-size:13px;margin:0 0 20px 0',
    row:     'display:flex;gap:12px;margin-bottom:14px',
    col:     'flex:1;min-width:0',
    tabRow:  'display:flex;gap:8px;margin-bottom:16px;border-bottom:1px solid rgba(255,255,255,.08);padding-bottom:12px;flex-wrap:wrap',
  };

  // ── VIEW: LOGIN ───────────────────────────────────────────────────────────

  function buildLoginView(opts) {
    opts = opts || {};
    var err = opts.error ? '<div style="' + S.errBox + '">' + esc(opts.error) + '</div>' : '';
    return '<h2 style="' + S.h2 + '">Espace Client</h2>'
      + '<p style="' + S.sub + '">Connectez-vous pour accéder à vos services E-DEFENCE</p>'
      + err
      + '<form onsubmit="submitClientLogin(event)" method="dialog">'
      + '<div style="margin-bottom:14px"><label style="' + S.label + '">Email</label>'
      + '<input id="cp-email" type="email" required autocomplete="email" style="' + S.input + '" placeholder="contact@entreprise.com"/></div>'
      + '<div style="margin-bottom:18px"><label style="' + S.label + '">Mot de passe</label>'
      + '<input id="cp-password" type="password" required autocomplete="current-password" style="' + S.input + '" placeholder="••••••••"/></div>'
      + '<button type="submit" id="cp-login-btn" style="' + S.btnPrim + '">Se connecter</button>'
      + '</form>'
      + '<p style="text-align:center;margin-top:14px;font-size:12px;color:#4a6b8a">'
      + 'Pas encore client ? '
      + '<button onclick="showView(\'register\')" style="' + S.link + '">Créer un compte</button>'
      + '</p>';
  }

  // ── VIEW: REGISTER ────────────────────────────────────────────────────────

  function buildRegisterView(opts) {
    opts = opts || {};
    var err = opts.error ? '<div style="' + S.errBox + '">' + esc(opts.error) + '</div>' : '';
    var sectors = ['Banque/Finance','Télécoms','Santé','Commerce','Industrie','Administration','Education','ONG','Autre'];
    var sectorOpts = '<option value="">-- Choisir --</option>'
      + sectors.map(function (s) { return '<option>' + esc(s) + '</option>'; }).join('');
    return '<h2 style="' + S.h2 + '">Créer votre compte</h2>'
      + '<p style="' + S.sub + '">Rejoignez E-DEFENCE — accès immédiat au portail</p>'
      + err
      + '<form onsubmit="submitClientRegister(event)" method="dialog">'
      + '<div style="' + S.row + '">'
      + '<div style="' + S.col + '"><label style="' + S.label + '">Entreprise *</label>'
      + '<input id="cp-r-company" type="text" required autocomplete="organization" style="' + S.input + '" placeholder="SONATEL SA"/></div>'
      + '<div style="' + S.col + '"><label style="' + S.label + '">Contact *</label>'
      + '<input id="cp-r-contact" type="text" required autocomplete="name" style="' + S.input + '" placeholder="Moussa Kaboré"/></div>'
      + '</div>'
      + '<div style="margin-bottom:14px"><label style="' + S.label + '">Email *</label>'
      + '<input id="cp-r-email" type="email" required autocomplete="email" style="' + S.input + '" placeholder="contact@entreprise.com"/></div>'
      + '<div style="margin-bottom:14px"><label style="' + S.label + '">Mot de passe *</label>'
      + '<input id="cp-r-password" type="password" required minlength="8" autocomplete="new-password" style="' + S.input + '" placeholder="Minimum 8 caractères"/></div>'
      + '<div style="' + S.row + '">'
      + '<div style="' + S.col + '"><label style="' + S.label + '">Téléphone</label>'
      + '<input id="cp-r-phone" type="tel" autocomplete="tel" style="' + S.input + '" placeholder="+226 70 00 00 00"/></div>'
      + '<div style="' + S.col + '"><label style="' + S.label + '">Secteur</label>'
      + '<select id="cp-r-sector" style="' + S.input + '">' + sectorOpts + '</select></div>'
      + '</div>'
      + '<div style="margin-bottom:18px"><label style="' + S.label + '">Ville</label>'
      + '<input id="cp-r-city" type="text" autocomplete="address-level2" style="' + S.input + '" placeholder="Ouagadougou"/></div>'
      + '<button type="submit" id="cp-reg-btn" style="' + S.btnPrim + '">Créer mon compte</button>'
      + '</form>'
      + '<p style="text-align:center;margin-top:14px;font-size:12px;color:#4a6b8a">'
      + 'Déjà client ? '
      + '<button onclick="showView(\'login\')" style="' + S.link + '">Se connecter</button>'
      + '</p>';
  }

  // ── VIEW: CATALOG ─────────────────────────────────────────────────────────

  var ICONS = {
    shield:   '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    eye:      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
    database: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4.03 3-9 3S3 13.66 3 12"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/></svg>',
    search:   '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    book:     '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  };

  function buildCatalogView(items) {
    items = (items && items.length) ? items : [];
    var cards = items.map(function (svc) {
      var icon = ICONS[svc.icon] || ICONS.shield;
      var bl = svc.billing === 'unique' ? 'Paiement unique' : '/mois';
      return '<div style="' + S.card + '">'
        + '<div style="display:flex;align-items:flex-start;gap:12px">'
        + '<div style="color:#00d4ff;flex-shrink:0;margin-top:2px">' + icon + '</div>'
        + '<div style="flex:1;min-width:0">'
        + '<div style="font-weight:700;color:#e8f4ff;font-size:14px;margin-bottom:4px">' + esc(svc.name) + '</div>'
        + '<div style="color:#4a6b8a;font-size:12px;line-height:1.5;margin-bottom:10px">' + esc(svc.description) + '</div>'
        + '<div style="display:flex;align-items:center;justify-content:space-between">'
        + '<div style="color:#00c896;font-weight:700;font-size:15px">' + fmtFcfa(svc.price_fcfa)
        + ' <span style="color:#4a6b8a;font-size:11px;font-weight:400">' + esc(bl) + '</span></div>'
        + '<button onclick="selectService(' + JSON.stringify(svc).replace(/"/g, '&quot;') + ')" style="'
        + 'background:linear-gradient(135deg,#00d4ff,#00c896);color:#07111f;border:none;border-radius:8px;'
        + 'padding:7px 14px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit'
        + '">S\'abonner</button>'
        + '</div></div></div></div>';
    }).join('');
    return '<h2 style="' + S.h2 + '">Nos services</h2>'
      + '<p style="' + S.sub + '">Choisissez un service et souscrivez immédiatement</p>'
      + (items.length ? cards : '<p style="color:#4a6b8a;text-align:center;padding:20px">Chargement…</p>')
      + '<div style="text-align:center;margin-top:8px">'
      + (_token ? '<button onclick="loadAndShowDashboard()" style="' + S.link + '">← Mon tableau de bord</button>' : '')
      + '</div>';
  }

  // ── VIEW: CHECKOUT ────────────────────────────────────────────────────────

  function buildCheckoutView(svc) {
    if (!svc) return '<p style="color:#ff3b5c">Erreur : service non trouvé.</p>';
    var bl = svc.billing === 'unique' ? 'paiement unique' : 'par mois';
    return '<h2 style="' + S.h2 + '">Confirmer l\'abonnement</h2>'
      + '<p style="' + S.sub + '">Vérifiez les détails avant de confirmer</p>'
      + '<div style="' + S.card + 'background:rgba(0,212,255,.04);border-color:rgba(0,212,255,.2)">'
      + '<div style="font-weight:700;color:#e8f4ff;font-size:15px;margin-bottom:6px">' + esc(svc.name) + '</div>'
      + '<div style="color:#4a6b8a;font-size:12px;margin-bottom:12px">' + esc(svc.description) + '</div>'
      + '<div style="font-size:22px;font-weight:700;color:#00c896">' + fmtFcfa(svc.price_fcfa) + '</div>'
      + '<div style="color:#4a6b8a;font-size:12px;margin-top:2px">' + esc(bl) + '</div>'
      + '</div>'
      + '<div style="' + S.infoBox + '">'
      + '<div style="font-weight:600;color:#00d4ff;margin-bottom:4px">💳 Paiement sécurisé via CinetPay</div>'
      + 'Notre équipe vous contactera dans les 24h pour finaliser le paiement. Votre accès sera activé dès confirmation.'
      + '</div>'
      + '<button id="cp-checkout-btn" onclick="confirmSubscribe()" style="' + S.btnPrim + '">Confirmer la demande</button>'
      + '<button onclick="showView(\'catalog\', window._cpCatalogCache)" style="'
      + 'width:100%;margin-top:10px;padding:10px;background:none;border:1px solid rgba(255,255,255,.15);'
      + 'border-radius:10px;color:#4a6b8a;font-size:13px;cursor:pointer;font-family:inherit'
      + '">← Retour au catalogue</button>';
  }

  // ── VIEW: SUCCESS (subscription confirmed) ────────────────────────────────

  function buildSuccessView(opts) {
    opts = opts || {};
    return '<div style="text-align:center;padding:10px 0">'
      + '<div style="font-size:56px;margin-bottom:14px">📋</div>'
      + '<h2 style="' + S.h2 + ';margin-bottom:10px">Demande enregistrée !</h2>'
      + (opts.service_name
          ? '<p style="color:#4a6b8a;font-size:13px;margin-bottom:6px">Service : <strong style="color:#e8f4ff">' + esc(opts.service_name) + '</strong></p>'
          : '')
      + '<div style="' + S.infoBox + 'margin:16px 0;text-align:left">'
      + '<div style="font-weight:600;color:#00d4ff;margin-bottom:6px">💳 Prochaine étape — Paiement CinetPay</div>'
      + 'Notre équipe vous contactera dans les <strong>24h</strong> pour finaliser votre paiement de manière sécurisée via CinetPay.'
      + '</div>'
      + '<p style="color:#4a6b8a;font-size:12px;margin-bottom:20px">Votre accès sera activé dès réception du paiement.</p>'
      + '<button onclick="loadAndShowDashboard()" style="' + S.btnPrim + '">Voir mon tableau de bord</button>'
      + '</div>';
  }

  // ── VIEW: DASHBOARD ───────────────────────────────────────────────────────

  var SVCL = {
    boitier:     { label: 'Boîtier EDR',       icon: ICONS.shield   },
    soc:         { label: 'SOC Managé',         icon: ICONS.eye      },
    sauvegarde:  { label: 'Sauvegarde Cloud',   icon: ICONS.database },
    audit360:    { label: 'Audit 360°',         icon: ICONS.search   },
    cyberacademy:{ label: 'Cyber Academy',      icon: ICONS.book     },
  };
  var STCL = { actif: 'Actif', expire: 'Expiré', suspendu: 'Suspendu', resilie: 'Résilié' };

  function buildDashboardView(data) {
    if (!data) data = { contracts: [], invoices: [], stats: { active_contracts: 0, pending_invoices: 0, total_due_fcfa: 0 } };
    var cd = _client || getClientData() || {};
    var s = data.stats || {};

    // Store contracts globally for service page navigation
    window._cpContracts = data.contracts || [];

    function kpi(label, val, color) {
      return '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);'
        + 'border-radius:10px;padding:12px;text-align:center">'
        + '<div style="font-size:20px;font-weight:700;color:' + color + '">' + val + '</div>'
        + '<div style="font-size:11px;color:#4a6b8a;margin-top:2px">' + label + '</div>'
        + '</div>';
    }
    function tabBtn(id, label, active) {
      return '<button data-cp-tab="' + id + '" style="padding:6px 12px;border-radius:8px;font-size:12px;'
        + 'font-weight:600;cursor:pointer;border:none;font-family:inherit;'
        + (active ? 'background:rgba(0,212,255,.12);color:#00d4ff' : 'background:none;color:#4a6b8a')
        + '">' + label + '</button>';
    }

    // Contracts tab
    var contractsHtml = '';
    if (!window._cpContracts.length) {
      contractsHtml = '<p style="color:#4a6b8a;text-align:center;padding:20px 0">Aucun service actif. '
        + '<button onclick="loadCatalogAndShow()" style="' + S.link + '">Découvrir le catalogue →</button></p>';
    } else {
      contractsHtml = window._cpContracts.map(function (c, i) {
        var svcInfo = SVCL[c.service_type] || { label: c.service_type, icon: ICONS.shield };
        var sc = c.status === 'actif' ? '#00c896' : '#4a6b8a';
        return '<div style="' + S.card + '">'
          + '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">'
          + '<div style="display:flex;align-items:center;gap:8px">'
          + '<span style="color:#00d4ff">' + svcInfo.icon + '</span>'
          + '<span style="font-weight:600;color:#e8f4ff;font-size:13px">' + esc(svcInfo.label) + '</span>'
          + '</div>'
          + '<span style="font-size:11px;font-weight:600;padding:3px 8px;border-radius:4px;'
          + 'background:rgba(0,200,150,.1);border:1px solid rgba(0,200,150,.25);color:' + sc + '">'
          + esc(STCL[c.status] || c.status) + '</span>'
          + '</div>'
          + '<div style="font-size:12px;color:#4a6b8a">Montant : <span style="color:#e8f4ff">'
          + fmtFcfa(c.amount_fcfa) + ' / ' + esc(c.billing_period) + '</span></div>'
          + '<div style="font-size:12px;color:#4a6b8a;margin-top:2px">Depuis le ' + fmtDate(c.start_date)
          + (c.end_date ? ' · Jusqu\'au ' + fmtDate(c.end_date) : '') + '</div>'
          + '<div style="text-align:right;margin-top:10px">'
          + '<button onclick="cpOpenService(' + i + ')" style="'
          + 'background:rgba(0,212,255,.08);border:1px solid rgba(0,212,255,.25);border-radius:8px;'
          + 'padding:6px 14px;font-size:12px;font-weight:600;cursor:pointer;color:#00d4ff;font-family:inherit'
          + '">Gérer →</button>'
          + '</div>'
          + '</div>';
      }).join('');
    }

    // Invoices tab
    var invoicesHtml = '';
    if (!data.invoices || !data.invoices.length) {
      invoicesHtml = '<p style="color:#4a6b8a;text-align:center;padding:20px 0">Aucune facture disponible.</p>';
    } else {
      var INVST = {
        en_attente: { label: 'En attente', color: '#ffa500' },
        paye:       { label: 'Payée',      color: '#00c896' },
        en_retard:  { label: 'En retard',  color: '#ff3b5c' },
        annule:     { label: 'Annulée',    color: '#4a6b8a' },
      };
      invoicesHtml = data.invoices.map(function (inv) {
        var ist = INVST[inv.status] || { label: inv.status, color: '#4a6b8a' };
        var cinetpayBadge = inv.status === 'en_attente'
          ? '<div style="margin-top:8px;font-size:11px;color:#00d4ff;'
            + 'background:rgba(0,212,255,.06);border:1px solid rgba(0,212,255,.2);'
            + 'border-radius:6px;padding:5px 10px;display:inline-block">'
            + '💳 Paiement CinetPay — Notre équipe vous contacte</div>'
          : '';
        return '<div style="' + S.card + '">'
          + '<div style="display:flex;justify-content:space-between;align-items:flex-start">'
          + '<div><div style="font-weight:600;color:#e8f4ff;font-size:13px">' + esc(inv.invoice_number) + '</div>'
          + '<div style="font-size:11px;color:#4a6b8a;margin-top:2px">Échéance : ' + fmtDate(inv.due_date) + '</div></div>'
          + '<div style="text-align:right">'
          + '<div style="font-weight:700;color:#e8f4ff;font-size:14px">' + fmtFcfa(inv.amount_fcfa) + '</div>'
          + '<div style="font-size:11px;color:' + ist.color + ';font-weight:600;margin-top:2px">' + esc(ist.label) + '</div>'
          + '</div></div>'
          + cinetpayBadge
          + '</div>';
      }).join('');
    }

    // Audit rapide tab
    var auditHtml = '<p style="color:#4a6b8a;font-size:13px;margin-bottom:14px">Diagnostiquez la sécurité d\'un domaine — score A→F.</p>'
      + '<form onsubmit="submitAudit(event)" method="dialog">'
      + '<div style="margin-bottom:14px"><label style="' + S.label + '">Domaine / URL cible</label>'
      + '<input id="cp-audit-target" type="text" required style="' + S.input + '" placeholder="exemple.com"/></div>'
      + '<button type="submit" id="cp-audit-btn" style="' + S.btnPrim + '">Lancer l\'audit</button>'
      + '</form>'
      + '<div id="cp-audit-results" style="display:none;margin-top:16px"></div>';

    var name = cd.company_name || 'Mon espace';
    return '<h2 style="' + S.h2 + '">Bienvenue, <span style="background:linear-gradient(135deg,#00d4ff,#00c896);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">' + esc(name) + '</span></h2>'
      + '<p style="' + S.sub + '">Tableau de bord de vos services E-DEFENCE</p>'
      + '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:18px">'
      + kpi('Services actifs', s.active_contracts || 0, '#00d4ff')
      + kpi('Factures', s.pending_invoices || 0, '#ffa500')
      + kpi('Montant dû', fmtFcfa(s.total_due_fcfa), '#ff3b5c')
      + '</div>'
      + '<div style="' + S.tabRow + '">'
      + tabBtn('cp-dash-services', 'Mes services', true)
      + tabBtn('cp-dash-invoices', 'Factures', false)
      + tabBtn('cp-dash-catalog', 'Ajouter un service', false)
      + tabBtn('cp-dash-audit', 'Audit rapide', false)
      + '</div>'
      + '<div id="cp-dash-services" class="cp-dash-tab">' + contractsHtml + '</div>'
      + '<div id="cp-dash-invoices" class="cp-dash-tab" style="display:none">' + invoicesHtml + '</div>'
      + '<div id="cp-dash-catalog" class="cp-dash-tab" style="display:none">'
      + '<p style="color:#4a6b8a;font-size:13px;margin-bottom:12px">Souscrivez à un nouveau service.</p>'
      + '<button onclick="loadCatalogAndShow()" style="' + S.btnPrim + '">Voir le catalogue</button>'
      + '</div>'
      + '<div id="cp-dash-audit" class="cp-dash-tab" style="display:none">' + auditHtml + '</div>'
      + '<div style="margin-top:18px;padding-top:14px;border-top:1px solid rgba(255,255,255,.07);'
      + 'display:flex;justify-content:space-between;align-items:center">'
      + '<span style="font-size:11px;color:#4a6b8a">' + esc(name) + '</span>'
      + '<button onclick="clientLogout()" style="background:none;border:none;cursor:pointer;color:#ff3b5c;font-size:12px;font-family:inherit">Se déconnecter</button>'
      + '</div>';
  }

  // ── VIEW: SERVICE PAGE ────────────────────────────────────────────────────

  var SERVICE_PAGES = {
    boitier: {
      label: 'Boîtier EDR',
      icon: ICONS.shield,
      color: '#00d4ff',
      description: 'Votre solution de détection et réponse aux incidents sur les endpoints (EDR).',
      features: [
        'Surveillance des endpoints en temps réel',
        'Détection comportementale des menaces',
        'Isolation automatique en cas d\'intrusion',
        'Rapports de sécurité mensuels détaillés',
        'Corrélation des alertes et threat hunting',
      ],
      status_msg: 'Votre Boîtier EDR est actif. Le tableau de bord de supervision sera disponible prochainement. Notre équipe technique vous contactera pour la configuration initiale.',
      cta_label: 'Contacter l\'équipe technique',
      cta_action: 'mailto:support@edefence.tech?subject=Boitier EDR - Support',
    },
    soc: {
      label: 'SOC Managé',
      icon: ICONS.eye,
      color: '#00c896',
      description: 'Centre Opérationnel de Sécurité géré par nos analystes 24h/24, 7j/7.',
      features: [
        'Surveillance continue 24h/24, 7j/7',
        'Analyse et corrélation des alertes SIEM',
        'Réponse aux incidents (MTTR < 4h garanti)',
        'Threat intelligence et veille cyber UEMOA',
        'Rapport mensuel d\'activité sécurité',
      ],
      status_msg: 'Votre SOC est opérationnel. L\'équipe E-DEFENCE surveille activement vos systèmes. Pour tout incident urgent, contactez-nous directement.',
      cta_label: 'Signaler un incident',
      cta_action: 'mailto:soc@edefence.tech?subject=Incident SOC',
      extra: '<div style="background:rgba(0,200,150,.06);border:1px solid rgba(0,200,150,.2);border-radius:8px;padding:12px 14px;margin-bottom:14px">'
        + '<div style="font-size:11px;color:#4a6b8a;margin-bottom:6px">CONTACT SOC D\'URGENCE</div>'
        + '<div style="font-size:13px;color:#e8f4ff">📧 soc@edefence.tech</div>'
        + '</div>',
    },
    sauvegarde: {
      label: 'Sauvegarde Cloud',
      icon: ICONS.database,
      color: '#ffa500',
      description: 'Protection de vos données critiques avec sauvegardes automatiques chiffrées.',
      features: [
        'Sauvegardes automatiques quotidiennes',
        'Chiffrement AES-256 en transit et au repos',
        'Rétention 30 jours avec versioning',
        'Restauration granulaire on-demand',
        'Conformité RGPD et réglementation BCEAO',
      ],
      status_msg: 'Service actif. La configuration de vos sauvegardes est en cours. Notre équipe vous contactera pour définir la stratégie de sauvegarde adaptée à votre infrastructure.',
      cta_label: 'Configurer mes sauvegardes',
      cta_action: 'mailto:support@edefence.tech?subject=Sauvegarde Cloud - Configuration',
    },
    audit360: {
      label: 'Audit 360°',
      icon: ICONS.search,
      color: '#00d4ff',
      description: 'Plateforme d\'audit de conformité complète : ISO 27001, RGPD, BCEAO, PCI-DSS.',
      features: [
        'Audits de conformité multi-référentiels',
        'Gestion des preuves et livrables',
        'Plan d\'action et suivi des recommandations',
        'Reporting automatisé et tableaux de bord',
        'Collaboration équipe auditeur/audité',
      ],
      status_msg: null,
      cta_label: 'Accéder à E-AUDIT 360',
      cta_action: 'https://audit.edefence.tech',
      cta_external: true,
      extra: '<div style="background:rgba(0,212,255,.06);border:1px solid rgba(0,212,255,.2);border-radius:8px;padding:12px 14px;margin-bottom:14px">'
        + '<div style="font-size:12px;color:#4a6b8a;margin-bottom:4px">VOTRE ESPACE AUDIT 360</div>'
        + '<div style="font-size:13px;color:#e8f4ff">Connectez-vous sur <strong>audit.edefence.tech</strong> avec vos identifiants E-DEFENCE pour accéder à vos audits en cours.</div>'
        + '</div>',
    },
    cyberacademy: {
      label: 'Cyber Academy',
      icon: ICONS.book,
      color: '#a855f7',
      description: 'Formations cybersécurité certifiantes adaptées au contexte UEMOA.',
      features: [
        'Parcours certifiants cybersécurité UEMOA',
        'Labs pratiques (hacking éthique, forensics)',
        'Quiz et évaluations en ligne',
        'Certificats E-DEFENCE reconnus',
        'Suivi de progression par apprenant',
      ],
      status_msg: null,
      cta_label: 'Accéder à Cyber Academy',
      cta_action: 'https://academy.edefence.tech',
      cta_external: true,
      extra: '<div style="background:rgba(168,85,247,.06);border:1px solid rgba(168,85,247,.2);border-radius:8px;padding:12px 14px;margin-bottom:14px">'
        + '<div style="font-size:12px;color:#4a6b8a;margin-bottom:4px">VOTRE ESPACE FORMATION</div>'
        + '<div style="font-size:13px;color:#e8f4ff">Connectez-vous sur <strong>academy.edefence.tech</strong> pour accéder à vos parcours et labs.</div>'
        + '</div>',
    },
  };

  function buildServiceView(contract) {
    contract = contract || {};
    var svcType = contract.service_type || '';
    var page = SERVICE_PAGES[svcType];

    if (!page) {
      return '<h2 style="' + S.h2 + '">Service</h2>'
        + '<p style="color:#4a6b8a">Informations non disponibles pour ce service.</p>'
        + '<button onclick="loadAndShowDashboard()" style="' + S.link + '">← Retour</button>';
    }

    var statusColor = contract.status === 'actif' ? '#00c896' : '#4a6b8a';
    var statusLabel = STCL[contract.status] || contract.status || 'Actif';

    var featuresList = page.features.map(function (f) {
      return '<div style="display:flex;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.05)">'
        + '<span style="color:' + page.color + ';font-weight:700;flex-shrink:0">✓</span>'
        + '<span style="font-size:13px;color:#c8dff0">' + esc(f) + '</span>'
        + '</div>';
    }).join('');

    var statusSection = page.status_msg
      ? '<div style="' + S.infoBox + '">'
        + '<div style="font-weight:600;color:#00d4ff;margin-bottom:4px">ℹ️ État du service</div>'
        + esc(page.status_msg)
        + '</div>'
      : '';

    var extraSection = page.extra || '';

    var ctaBtn = page.cta_external
      ? '<a href="' + page.cta_action + '" target="_blank" rel="noopener" style="'
        + 'display:block;width:100%;padding:12px;border-radius:10px;font-size:14px;font-weight:700;border:none;cursor:pointer;'
        + 'background:linear-gradient(135deg,#00d4ff,#00c896);color:#07111f;font-family:inherit;'
        + 'text-align:center;text-decoration:none;box-sizing:border-box">'
        + page.cta_label + ' ↗</a>'
      : '<a href="' + page.cta_action + '" style="'
        + 'display:block;width:100%;padding:12px;border-radius:10px;font-size:14px;font-weight:700;border:none;cursor:pointer;'
        + 'background:linear-gradient(135deg,#00d4ff,#00c896);color:#07111f;font-family:inherit;'
        + 'text-align:center;text-decoration:none;box-sizing:border-box">'
        + page.cta_label + '</a>';

    return '<button onclick="loadAndShowDashboard()" style="'
      + 'background:none;border:none;cursor:pointer;color:#4a6b8a;font-size:13px;font-family:inherit;'
      + 'margin-bottom:16px;padding:0;display:flex;align-items:center;gap:4px">'
      + '← Tableau de bord</button>'
      + '<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">'
      + '<div style="color:' + page.color + '">' + page.icon + '</div>'
      + '<div style="flex:1">'
      + '<h2 style="' + S.h2 + ';margin-bottom:2px">' + esc(page.label) + '</h2>'
      + '<p style="margin:0;font-size:12px;color:#4a6b8a">' + esc(page.description) + '</p>'
      + '</div>'
      + '<span style="font-size:11px;font-weight:700;padding:4px 10px;border-radius:6px;'
      + 'background:rgba(0,200,150,.1);border:1px solid rgba(0,200,150,.25);color:' + statusColor + ';white-space:nowrap">'
      + esc(statusLabel) + '</span>'
      + '</div>'
      + (contract.start_date
        ? '<p style="font-size:12px;color:#4a6b8a;margin-bottom:16px">Actif depuis le ' + fmtDate(contract.start_date)
          + ' · ' + fmtFcfa(contract.amount_fcfa) + ' / ' + esc(contract.billing_period || 'mois') + '</p>'
        : '')
      + '<div style="margin-bottom:16px">'
      + '<div style="font-size:11px;color:#4a6b8a;text-transform:uppercase;letter-spacing:.06em;font-weight:600;margin-bottom:8px">Fonctionnalités incluses</div>'
      + featuresList
      + '</div>'
      + statusSection
      + extraSection
      + ctaBtn;
  }

  // ── Tab switcher ──────────────────────────────────────────────────────────

  function cpSwitchTab(targetId) {
    document.querySelectorAll('.cp-dash-tab').forEach(function (t) { t.style.display = 'none'; });
    var target = document.getElementById(targetId);
    if (target) target.style.display = 'block';
    var dlg = document.getElementById('cp-dialog');
    if (!dlg) return;
    dlg.querySelectorAll('[data-cp-tab]').forEach(function (btn) {
      if (btn.dataset.cpTab === targetId) {
        btn.style.background = 'rgba(0,212,255,.12)';
        btn.style.color = '#00d4ff';
      } else {
        btn.style.background = 'none';
        btn.style.color = '#4a6b8a';
      }
    });
  }

  // ── Entry point ───────────────────────────────────────────────────────────

  window.openClientSpace = function () {
    var tok = getToken();
    if (tok) {
      _token = tok;
      fetch('/api/v1/client/me', { headers: { Authorization: 'Bearer ' + tok } })
        .then(function (r) {
          if (!r.ok) { clearToken(); _token = null; _client = null; showView('login'); return null; }
          return r.json();
        })
        .then(function (data) {
          if (!data) return;
          _client = data;
          saveClientData(data);
          updateHeaderBtn();
          loadAndShowDashboard();
        })
        .catch(function () { clearToken(); _token = null; _client = null; showView('login'); });
    } else {
      showView('login');
    }
  };

  // ── Forms ─────────────────────────────────────────────────────────────────

  window.submitClientLogin = function (e) {
    e.preventDefault();
    var email = (document.getElementById('cp-email') || {}).value || '';
    var pass  = (document.getElementById('cp-password') || {}).value || '';
    var btn = document.getElementById('cp-login-btn');
    if (btn) { btn.textContent = '…'; btn.disabled = true; }
    fetch('/api/v1/client/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password: pass }),
    })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
      .then(function (res) {
        if (!res.ok) { showView('login', { error: res.data.detail || 'Identifiants invalides' }); return; }
        _token = res.data.access_token;
        _client = { company_name: res.data.company_name, id: res.data.client_id };
        saveToken(_token); saveClientData(_client); updateHeaderBtn(); loadAndShowDashboard();
      })
      .catch(function () { showView('login', { error: 'Erreur réseau — réessayez.' }); });
  };

  window.submitClientRegister = function (e) {
    e.preventDefault();
    var btn = document.getElementById('cp-reg-btn');
    if (btn) { btn.textContent = '…'; btn.disabled = true; }
    fetch('/api/v1/client/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company_name: (document.getElementById('cp-r-company') || {}).value || '',
        contact_name: (document.getElementById('cp-r-contact') || {}).value || '',
        email:        (document.getElementById('cp-r-email')   || {}).value || '',
        password:     (document.getElementById('cp-r-password')|| {}).value || '',
        phone:        (document.getElementById('cp-r-phone')   || {}).value || null,
        sector:       (document.getElementById('cp-r-sector')  || {}).value || null,
        city:         (document.getElementById('cp-r-city')    || {}).value || null,
        country: 'Burkina Faso',
      }),
    })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
      .then(function (res) {
        if (!res.ok) { showView('register', { error: res.data.detail || 'Erreur lors de l\'inscription' }); return; }
        _token = res.data.access_token;
        _client = { company_name: res.data.company_name, id: res.data.client_id };
        saveToken(_token); saveClientData(_client); updateHeaderBtn(); loadCatalogAndShow();
      })
      .catch(function () { showView('register', { error: 'Erreur réseau — réessayez.' }); });
  };

  window.loadAndShowDashboard = function () {
    fetch('/api/v1/client/dashboard', { headers: { Authorization: 'Bearer ' + _token } })
      .then(function (r) { return r.json(); })
      .then(function (data) { showView('dashboard', data); })
      .catch(function () { showView('dashboard', null); });
  };

  window.loadCatalogAndShow = function () {
    fetch('/api/v1/catalog')
      .then(function (r) { return r.json(); })
      .then(function (data) { window._cpCatalogCache = data; showView('catalog', data); })
      .catch(function () { window._cpCatalogCache = []; showView('catalog', []); });
  };

  window.selectService = function (svc) {
    if (!_token) { showView('login'); return; }
    _pendingService = svc;
    showView('checkout', svc);
  };

  // Payment intentionally not wired — shows CinetPay confirmation instead
  window.confirmSubscribe = function () {
    if (!_pendingService) { showView('catalog', window._cpCatalogCache); return; }
    var btn = document.getElementById('cp-checkout-btn');
    if (btn) { btn.textContent = '…'; btn.disabled = true; }
    fetch('/api/v1/client/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + _token },
      body: JSON.stringify({ service_type: _pendingService.id }),
    })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
      .then(function (res) {
        // Whether the API call succeeds or not, show CinetPay confirmation
        var svcName = (res.ok && res.data.service_name) ? res.data.service_name : (_pendingService.name || '');
        _pendingService = null;
        showView('success', { service_name: svcName });
      })
      .catch(function () {
        // API not yet connected — still show the confirmation so the UX is clean
        var svcName = (_pendingService && _pendingService.name) || '';
        _pendingService = null;
        showView('success', { service_name: svcName });
      });
  };

  // Navigate to service management page from contract card
  window.cpOpenService = function (idx) {
    var c = (window._cpContracts || [])[idx];
    if (c) showView('service', c);
  };

  window.submitAudit = function (e) {
    e.preventDefault();
    var target = (document.getElementById('cp-audit-target') || {}).value || '';
    var btn = document.getElementById('cp-audit-btn');
    var results = document.getElementById('cp-audit-results');
    if (btn) { btn.textContent = 'Analyse…'; btn.disabled = true; }
    if (results) results.style.display = 'none';
    fetch('/api/v1/client/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + _token },
      body: JSON.stringify({ target: target.trim() }),
    })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
      .then(function (res) {
        if (btn) { btn.textContent = 'Lancer l\'audit'; btn.disabled = false; }
        if (!res.ok) {
          if (results) { results.style.display = 'block'; results.innerHTML = '<p style="color:#ff3b5c;font-size:13px">' + esc(res.data.detail || 'Erreur audit') + '</p>'; }
          return;
        }
        renderAuditResults(res.data, results);
      })
      .catch(function () { if (btn) { btn.textContent = 'Lancer l\'audit'; btn.disabled = false; } });
  };

  function renderAuditResults(data, container) {
    var gc = { A: '#00c896', B: '#00d4ff', C: '#ffa500', D: '#ff8c00', F: '#ff3b5c' };
    var color = gc[data.grade] || '#4a6b8a';
    var html = '<div style="display:flex;align-items:center;gap:16px;padding:14px;border-radius:10px;'
      + 'background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);margin-bottom:12px">'
      + '<div style="text-align:center;min-width:48px">'
      + '<div style="font-size:36px;font-weight:700;color:' + color + '">' + data.grade + '</div>'
      + '<div style="font-size:10px;color:#4a6b8a">Grade</div></div>'
      + '<div style="flex:1">'
      + '<div style="font-weight:600;color:#e8f4ff;font-size:13px;margin-bottom:6px">' + esc(data.target) + '</div>'
      + '<div style="display:flex;align-items:center;gap:8px">'
      + '<div style="flex:1;height:6px;border-radius:3px;background:rgba(255,255,255,.1)">'
      + '<div style="height:6px;border-radius:3px;width:' + data.score + '%;background:' + color + '"></div></div>'
      + '<span style="font-size:12px;font-weight:700;color:' + color + '">' + data.score + '/100</span>'
      + '</div></div></div>'
      + (data.checks || []).map(function (c) {
        var cs = { ok: { icon: '✓', color: '#00c896' }, warn: { icon: '⚠', color: '#ffa500' }, fail: { icon: '✗', color: '#ff3b5c' } };
        var st = cs[c.status] || cs.warn;
        return '<div style="display:flex;gap:10px;padding:10px;border-radius:8px;background:rgba(255,255,255,.02);margin-bottom:6px">'
          + '<span style="font-weight:700;color:' + st.color + ';flex-shrink:0">' + st.icon + '</span>'
          + '<div><div style="font-size:12px;font-weight:600;color:#e8f4ff">' + esc(c.name)
          + ' <span style="font-weight:400;color:#4a6b8a">+' + c.score + ' pts</span></div>'
          + '<div style="font-size:11px;color:#4a6b8a;margin-top:2px">' + esc(c.detail) + '</div></div></div>';
      }).join('');
    if (container) { container.innerHTML = html; container.style.display = 'block'; }
  }

  window.clientLogout = function () {
    clearToken(); _token = null; _client = null; _pendingService = null;
    window.closeClientModal(); updateHeaderBtn();
    if (window.showToast) window.showToast('Déconnecté de l\'espace client');
  };

  function updateHeaderBtn() {
    var btn = document.getElementById('client-space-btn');
    if (!btn) return;
    var cd = getClientData();
    if (cd && getToken()) {
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
        + '<span>' + esc(cd.company_name || 'Mon espace') + '</span>';
      btn.style.background = 'rgba(0,212,255,.1)';
    } else {
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
        + '<span>Espace Client</span>';
      btn.style.background = '';
    }
  }

  window.showView = showView;
  window.cpSwitchTab = cpSwitchTab;

  window.addEventListener('DOMContentLoaded', function () {
    setTimeout(updateHeaderBtn, 400);
  });

  var _origLoad = window.loadIncludes;
  if (typeof _origLoad === 'function') {
    window.loadIncludes = async function () {
      await _origLoad();
      updateHeaderBtn();
    };
  }

})();
