// ── E-DEFENCE Client Portal ────────────────────────────────────────────────
// All critical functions attached to window for onclick= compatibility.
// Modal uses inline style z-index (no arbitrary Tailwind classes).

(function () {
  'use strict';

  var _token = null;
  var _client = null;
  var _pendingService = null;   // service chosen in catalog, waiting checkout
  var _pendingInvoice = null;   // invoice after subscribe, waiting payment

  // ── LocalStorage helpers ──────────────────────────────────────────────────

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

  // ── Modal shell ───────────────────────────────────────────────────────────

  function getOrCreateModalBd() {
    var bd = document.getElementById('client-modal-bd');
    if (!bd) {
      bd = document.createElement('div');
      bd.id = 'client-modal-bd';
      bd.setAttribute('role', 'dialog');
      bd.setAttribute('aria-modal', 'true');
      bd.style.cssText = [
        'position:fixed',
        'top:0',
        'left:0',
        'width:100%',
        'height:100%',
        'z-index:9999',
        'background:rgba(0,0,0,0.75)',
        'display:none',
        'align-items:center',
        'justify-content:center',
        'backdrop-filter:blur(4px)',
        '-webkit-backdrop-filter:blur(4px)',
      ].join(';');
      bd.addEventListener('click', function (e) {
        if (e.target === bd) window.closeClientModal();
      });
      document.body.appendChild(bd);
    }
    return bd;
  }

  function showView(viewName, viewData) {
    var bd = getOrCreateModalBd();
    bd.style.display = 'flex';

    var content = '';
    if (viewName === 'login') content = buildLoginView(viewData);
    else if (viewName === 'register') content = buildRegisterView(viewData);
    else if (viewName === 'catalog') content = buildCatalogView(viewData);
    else if (viewName === 'checkout') content = buildCheckoutView(viewData);
    else if (viewName === 'payment') content = buildPaymentView(viewData);
    else if (viewName === 'dashboard') content = buildDashboardView(viewData);

    bd.innerHTML = '<div id="cp-modal-box" style="'
      + 'background:#071525;'
      + 'border:1px solid rgba(0,212,255,.2);'
      + 'border-radius:16px;'
      + 'padding:28px;'
      + 'width:100%;'
      + 'max-width:560px;'
      + 'margin:16px;'
      + 'max-height:90vh;'
      + 'overflow-y:auto;'
      + 'position:relative;'
      + '">'
      + '<button onclick="closeClientModal()" style="'
      + 'position:absolute;top:16px;right:16px;'
      + 'background:none;border:none;cursor:pointer;'
      + 'color:#4a6b8a;font-size:22px;line-height:1;'
      + 'padding:4px 8px;'
      + '" aria-label="Fermer">&times;</button>'
      + content
      + '</div>';

    // Attach tab switcher after render
    setTimeout(function () {
      var tabBtns = bd.querySelectorAll('[data-cp-tab]');
      tabBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          cpSwitchTab(btn.dataset.cpTab);
        });
      });
    }, 0);
  }

  window.closeClientModal = function () {
    var bd = document.getElementById('client-modal-bd');
    if (bd) bd.style.display = 'none';
  };

  // ── Escape HTML ───────────────────────────────────────────────────────────

  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function fmtFcfa(n) {
    return Number(n).toLocaleString('fr-FR') + ' F CFA';
  }
  function fmtDate(d) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  // ── Inline styles ─────────────────────────────────────────────────────────

  var S = {
    label:   'display:block;font-size:11px;color:#4a6b8a;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;font-weight:600',
    input:   'width:100%;box-sizing:border-box;background:#0d1e33;border:1px solid #1e3a5f;border-radius:8px;padding:10px 12px;color:#e8f4ff;font-size:13px;outline:none',
    btnPrim: 'width:100%;padding:12px;border-radius:10px;font-size:13px;font-weight:700;border:none;cursor:pointer;background:linear-gradient(135deg,#00d4ff,#00c896);color:#07111f',
    btnGhost:'background:none;border:1px solid rgba(255,255,255,.15);border-radius:8px;padding:8px 14px;color:#e8f4ff;font-size:12px;cursor:pointer',
    link:    'color:#00d4ff;background:none;border:none;cursor:pointer;font-size:12px;text-decoration:underline',
    card:    'background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:14px;margin-bottom:10px',
    errBox:  'background:rgba(255,59,92,.08);border:1px solid rgba(255,59,92,.25);border-radius:8px;padding:10px 12px;color:#ff3b5c;font-size:12px;margin-bottom:14px',
    okBox:   'background:rgba(0,200,150,.08);border:1px solid rgba(0,200,150,.25);border-radius:8px;padding:10px 12px;color:#00c896;font-size:12px;margin-bottom:14px',
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
      + '<form onsubmit="submitClientLogin(event)">'
      + '<div style="margin-bottom:14px"><label style="' + S.label + '">Email</label>'
      + '<input id="cp-email" type="email" required style="' + S.input + '" placeholder="contact@entreprise.com"/></div>'
      + '<div style="margin-bottom:18px"><label style="' + S.label + '">Mot de passe</label>'
      + '<input id="cp-password" type="password" required style="' + S.input + '" placeholder="••••••••"/></div>'
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
      + sectors.map(function (s) { return '<option value="' + esc(s) + '">' + esc(s) + '</option>'; }).join('');

    return '<h2 style="' + S.h2 + '">Créer votre compte</h2>'
      + '<p style="' + S.sub + '">Rejoignez E-DEFENCE — accès au portail immédiat</p>'
      + err
      + '<form onsubmit="submitClientRegister(event)">'
      + '<div style="' + S.row + '">'
      + '<div style="' + S.col + '"><label style="' + S.label + '">Nom de l\'entreprise *</label>'
      + '<input id="cp-r-company" type="text" required style="' + S.input + '" placeholder="SONATEL SA"/></div>'
      + '<div style="' + S.col + '"><label style="' + S.label + '">Nom du contact *</label>'
      + '<input id="cp-r-contact" type="text" required style="' + S.input + '" placeholder="Moussa Kaboré"/></div>'
      + '</div>'
      + '<div style="margin-bottom:14px"><label style="' + S.label + '">Email *</label>'
      + '<input id="cp-r-email" type="email" required style="' + S.input + '" placeholder="contact@entreprise.com"/></div>'
      + '<div style="margin-bottom:14px"><label style="' + S.label + '">Mot de passe *</label>'
      + '<input id="cp-r-password" type="password" required minlength="8" style="' + S.input + '" placeholder="Minimum 8 caractères"/></div>'
      + '<div style="' + S.row + '">'
      + '<div style="' + S.col + '"><label style="' + S.label + '">Téléphone</label>'
      + '<input id="cp-r-phone" type="tel" style="' + S.input + '" placeholder="+226 70 00 00 00"/></div>'
      + '<div style="' + S.col + '"><label style="' + S.label + '">Secteur</label>'
      + '<select id="cp-r-sector" style="' + S.input + '">' + sectorOpts + '</select></div>'
      + '</div>'
      + '<div style="margin-bottom:18px"><label style="' + S.label + '">Ville</label>'
      + '<input id="cp-r-city" type="text" style="' + S.input + '" placeholder="Ouagadougou"/></div>'
      + '<button type="submit" id="cp-reg-btn" style="' + S.btnPrim + '">Créer mon compte</button>'
      + '</form>'
      + '<p style="text-align:center;margin-top:14px;font-size:12px;color:#4a6b8a">'
      + 'Déjà client ? '
      + '<button onclick="showView(\'login\')" style="' + S.link + '">Se connecter</button>'
      + '</p>';
  }

  // ── VIEW: CATALOG ─────────────────────────────────────────────────────────

  var CATALOG_ICONS = {
    shield: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    eye:    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
    database:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4.03 3-9 3S3 13.66 3 12"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/></svg>',
    search: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    book:   '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  };

  function buildCatalogView(catalogData) {
    var items = (catalogData && catalogData.length) ? catalogData : [];
    var cards = items.map(function (svc) {
      var icon = CATALOG_ICONS[svc.icon] || CATALOG_ICONS.shield;
      var billingLabel = svc.billing === 'unique' ? 'Paiement unique' : '/mois';
      return '<div style="' + S.card + '">'
        + '<div style="display:flex;align-items:flex-start;gap:12px">'
        + '<div style="color:#00d4ff;flex-shrink:0;margin-top:2px">' + icon + '</div>'
        + '<div style="flex:1;min-width:0">'
        + '<div style="font-weight:700;color:#e8f4ff;font-size:14px;margin-bottom:4px">' + esc(svc.name) + '</div>'
        + '<div style="color:#4a6b8a;font-size:12px;line-height:1.5;margin-bottom:10px">' + esc(svc.description) + '</div>'
        + '<div style="display:flex;align-items:center;justify-content:space-between">'
        + '<div style="color:#00c896;font-weight:700;font-size:15px">' + fmtFcfa(svc.price_fcfa) + ' <span style="color:#4a6b8a;font-size:11px;font-weight:400">' + esc(billingLabel) + '</span></div>'
        + '<button onclick="selectService(' + JSON.stringify(svc).replace(/"/g, '&quot;') + ')" style="'
        + 'background:linear-gradient(135deg,#00d4ff,#00c896);color:#07111f;border:none;border-radius:8px;'
        + 'padding:7px 14px;font-size:12px;font-weight:700;cursor:pointer'
        + '">S\'abonner</button>'
        + '</div>'
        + '</div></div></div>';
    }).join('');

    var noItems = items.length === 0
      ? '<p style="color:#4a6b8a;text-align:center;padding:20px">Chargement du catalogue…</p>'
      : '';

    return '<div style="display:flex;align-items:center;gap:10px;margin-bottom:4px">'
      + '<h2 style="' + S.h2 + ';margin:0">Nos services</h2>'
      + '</div>'
      + '<p style="' + S.sub + '">Choisissez un service et souscrivez immédiatement</p>'
      + (noItems || cards)
      + '<div style="text-align:center;margin-top:8px">'
      + (_token ? '<button onclick="loadAndShowDashboard()" style="' + S.link + '">← Retour au tableau de bord</button>' : '')
      + '</div>';
  }

  // ── VIEW: CHECKOUT ────────────────────────────────────────────────────────

  function buildCheckoutView(svc) {
    if (!svc) return '<p style="color:#ff3b5c">Erreur : service non trouvé.</p>';
    var billingLabel = svc.billing === 'unique' ? 'paiement unique' : 'par mois';
    return '<h2 style="' + S.h2 + '">Confirmer l\'abonnement</h2>'
      + '<p style="' + S.sub + '">Vérifiez les détails avant de confirmer</p>'
      + '<div style="' + S.card + 'background:rgba(0,212,255,.04);border-color:rgba(0,212,255,.2)">'
      + '<div style="font-weight:700;color:#e8f4ff;font-size:15px;margin-bottom:6px">' + esc(svc.name) + '</div>'
      + '<div style="color:#4a6b8a;font-size:12px;margin-bottom:12px">' + esc(svc.description) + '</div>'
      + '<div style="font-size:22px;font-weight:700;color:#00c896">' + fmtFcfa(svc.price_fcfa) + '</div>'
      + '<div style="color:#4a6b8a;font-size:12px;margin-top:2px">' + esc(billingLabel) + '</div>'
      + '</div>'
      + '<p style="color:#4a6b8a;font-size:12px;margin-bottom:18px">'
      + 'En confirmant, un contrat sera créé et une facture générée. Vous pourrez payer immédiatement.'
      + '</p>'
      + '<button id="cp-checkout-btn" onclick="confirmSubscribe()" style="' + S.btnPrim + '">Confirmer l\'abonnement</button>'
      + '<button onclick="showView(\'catalog\', window._cpCatalogCache)" style="'
      + 'width:100%;margin-top:10px;padding:10px;background:none;border:1px solid rgba(255,255,255,.15);'
      + 'border-radius:10px;color:#4a6b8a;font-size:13px;cursor:pointer'
      + '">← Retour au catalogue</button>';
  }

  // ── VIEW: PAYMENT ─────────────────────────────────────────────────────────

  function buildPaymentView(opts) {
    opts = opts || {};
    var err = opts.error ? '<div style="' + S.errBox + '">' + esc(opts.error) + '</div>' : '';
    var methods = [
      { value: 'orange_money', label: 'Orange Money', placeholder: 'Numéro de téléphone (ex: +226 70 00 00 00)', icon: '🟠' },
      { value: 'moov_money',   label: 'Moov Money',   placeholder: 'Numéro de téléphone (ex: +226 65 00 00 00)', icon: '🔵' },
      { value: 'coris_money',  label: 'Coris Money',  placeholder: 'Numéro de compte Coris',                    icon: '🟡' },
      { value: 'carte_bancaire', label: 'Carte bancaire', placeholder: '4 derniers chiffres de la carte',        icon: '💳' },
    ];

    var radios = methods.map(function (m, i) {
      return '<label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:10px 12px;'
        + 'border-radius:8px;border:1px solid #1e3a5f;margin-bottom:8px;transition:border .15s" '
        + 'id="cp-pay-label-' + i + '">'
        + '<input type="radio" name="cp-pay-method" value="' + esc(m.value) + '" '
        + (i === 0 ? 'checked ' : '')
        + 'onchange="cpPayMethodChanged(' + i + ', \'' + esc(m.placeholder) + '\')" '
        + 'style="accent-color:#00d4ff"/>'
        + '<span style="font-size:18px">' + m.icon + '</span>'
        + '<span style="font-size:13px;color:#e8f4ff;font-weight:600">' + esc(m.label) + '</span>'
        + '</label>';
    }).join('');

    return '<h2 style="' + S.h2 + '">Paiement</h2>'
      + '<p style="' + S.sub + '">' + (opts.service_name ? 'Service : <strong style="color:#e8f4ff">' + esc(opts.service_name) + '</strong> — ' : '') + fmtFcfa(opts.amount_fcfa || 0) + '</p>'
      + err
      + '<form onsubmit="submitPayment(event)">'
      + '<div style="margin-bottom:14px"><label style="' + S.label + '">Mode de paiement</label>'
      + radios + '</div>'
      + '<div style="margin-bottom:18px"><label style="' + S.label + '" id="cp-pay-ref-label">Numéro de téléphone</label>'
      + '<input id="cp-pay-ref" type="text" style="' + S.input + '" placeholder="Numéro de téléphone (ex: +226 70 00 00 00)"/></div>'
      + '<button type="submit" id="cp-pay-btn" style="' + S.btnPrim + '">Payer ' + fmtFcfa(opts.amount_fcfa || 0) + '</button>'
      + '</form>';
  }

  // ── VIEW: DASHBOARD ───────────────────────────────────────────────────────

  var SVCL = { boitier:'Boîtier EDR', soc:'SOC Managé', sauvegarde:'Sauvegarde Cloud', audit360:'Audit 360°', cyberacademy:'Cyber Academy' };
  var STCL  = { actif:'Actif', expire:'Expiré', suspendu:'Suspendu', resilie:'Résilié' };
  var INVST = { en_attente:{ label:'En attente', color:'#ffa500' }, paye:{ label:'Payée', color:'#00c896' }, en_retard:{ label:'En retard', color:'#ff3b5c' }, annule:{ label:'Annulée', color:'#4a6b8a' } };

  function buildDashboardView(data) {
    if (!data) data = { contracts:[], invoices:[], service_requests:[], stats:{ active_contracts:0, pending_invoices:0, total_due_fcfa:0, pending_requests:0 } };
    var cd = _client || getClientData() || {};
    var s = data.stats;

    function kpi(label, val, color) {
      return '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:10px;padding:12px;text-align:center">'
        + '<div style="font-size:20px;font-weight:700;color:' + color + '">' + val + '</div>'
        + '<div style="font-size:11px;color:#4a6b8a;margin-top:2px">' + label + '</div>'
        + '</div>';
    }

    function tabBtn(id, label, active) {
      return '<button data-cp-tab="' + id + '" style="'
        + 'padding:6px 12px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;border:none;transition:all .15s;'
        + (active ? 'background:rgba(0,212,255,.12);color:#00d4ff' : 'background:none;color:#4a6b8a')
        + '">' + label + '</button>';
    }

    // Contracts tab
    var contractsHtml = '';
    if (!data.contracts || !data.contracts.length) {
      contractsHtml = '<p style="color:#4a6b8a;text-align:center;padding:20px 0">Aucun service actif. '
        + '<button onclick="loadCatalogAndShow()" style="' + S.link + '">Découvrir le catalogue →</button></p>';
    } else {
      contractsHtml = data.contracts.map(function (c) {
        var sc = c.status === 'actif' ? '#00c896' : '#4a6b8a';
        return '<div style="' + S.card + '">'
          + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">'
          + '<span style="font-weight:600;color:#e8f4ff;font-size:13px">' + esc(SVCL[c.service_type] || c.service_type) + '</span>'
          + '<span style="font-size:11px;font-weight:600;padding:3px 8px;border-radius:4px;background:rgba(0,200,150,.1);border:1px solid rgba(0,200,150,.25);color:' + sc + '">' + esc(STCL[c.status] || c.status) + '</span>'
          + '</div>'
          + '<div style="font-size:12px;color:#4a6b8a">Montant : <span style="color:#e8f4ff">' + fmtFcfa(c.amount_fcfa) + ' / ' + esc(c.billing_period) + '</span></div>'
          + '<div style="font-size:12px;color:#4a6b8a;margin-top:2px">Depuis le ' + fmtDate(c.start_date) + (c.end_date ? ' · Jusqu\'au ' + fmtDate(c.end_date) : '') + '</div>'
          + '</div>';
      }).join('');
    }

    // Invoices tab
    var invoicesHtml = '';
    if (!data.invoices || !data.invoices.length) {
      invoicesHtml = '<p style="color:#4a6b8a;text-align:center;padding:20px 0">Aucune facture disponible.</p>';
    } else {
      invoicesHtml = data.invoices.map(function (inv) {
        var ist = INVST[inv.status] || { label: inv.status, color: '#4a6b8a' };
        var payBtn = inv.status === 'en_attente'
          ? '<button onclick="startPayment(\'' + esc(inv.id) + '\',' + inv.amount_fcfa + ',\'\')" style="'
            + 'background:linear-gradient(135deg,#00d4ff,#00c896);color:#07111f;border:none;border-radius:7px;'
            + 'padding:5px 12px;font-size:11px;font-weight:700;cursor:pointer;margin-top:6px'
            + '">Payer</button>'
          : '';
        return '<div style="' + S.card + 'display:flex;flex-direction:column">'
          + '<div style="display:flex;justify-content:space-between;align-items:flex-start">'
          + '<div>'
          + '<div style="font-weight:600;color:#e8f4ff;font-size:13px">' + esc(inv.invoice_number) + '</div>'
          + '<div style="font-size:11px;color:#4a6b8a;margin-top:2px">Échéance : ' + fmtDate(inv.due_date) + '</div>'
          + '</div>'
          + '<div style="text-align:right">'
          + '<div style="font-weight:700;color:#e8f4ff;font-size:14px">' + fmtFcfa(inv.amount_fcfa) + '</div>'
          + '<div style="font-size:11px;color:' + ist.color + ';font-weight:600;margin-top:2px">' + esc(ist.label) + '</div>'
          + '</div>'
          + '</div>'
          + payBtn
          + '</div>';
      }).join('');
    }

    // Audit tab
    var auditHtml = '<p style="color:#4a6b8a;font-size:13px;margin-bottom:14px">Diagnostiquez votre site en quelques secondes — score A→F.</p>'
      + '<form onsubmit="submitAudit(event)">'
      + '<div style="margin-bottom:14px"><label style="' + S.label + '">Domaine / URL cible</label>'
      + '<input id="cp-audit-target" type="text" required style="' + S.input + '" placeholder="exemple.com ou https://exemple.com"/></div>'
      + '<button type="submit" id="cp-audit-btn" style="' + S.btnPrim + '">Lancer l\'audit</button>'
      + '</form>'
      + '<div id="cp-audit-results" style="display:none;margin-top:16px"></div>';

    return '<h2 style="' + S.h2 + '">Bienvenue, <span style="background:linear-gradient(135deg,#00d4ff,#00c896);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">' + esc(cd.company_name || 'Mon espace') + '</span></h2>'
      + '<p style="' + S.sub + '">Tableau de bord de vos services E-DEFENCE</p>'
      + '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:18px">'
      + kpi('Contrats actifs', s.active_contracts, '#00d4ff')
      + kpi('Factures en attente', s.pending_invoices, '#ff3b5c')
      + kpi('Montant dû', fmtFcfa(s.total_due_fcfa), '#ffa500')
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
      + '<p style="color:#4a6b8a;font-size:13px;margin-bottom:12px">Découvrez nos services et souscrivez directement.</p>'
      + '<button onclick="loadCatalogAndShow()" style="' + S.btnPrim + '">Voir le catalogue</button>'
      + '</div>'
      + '<div id="cp-dash-audit" class="cp-dash-tab" style="display:none">' + auditHtml + '</div>'
      + '<div style="margin-top:18px;padding-top:14px;border-top:1px solid rgba(255,255,255,.07);display:flex;justify-content:space-between;align-items:center">'
      + '<span style="font-size:11px;color:#4a6b8a">Connecté : ' + esc(cd.company_name || '') + '</span>'
      + '<button onclick="clientLogout()" style="background:none;border:none;cursor:pointer;color:#ff3b5c;font-size:12px">Se déconnecter</button>'
      + '</div>';
  }

  // ── Tab switcher (dashboard) ──────────────────────────────────────────────

  function cpSwitchTab(targetId) {
    var tabs = document.querySelectorAll('.cp-dash-tab');
    tabs.forEach(function (t) { t.style.display = 'none'; });
    var target = document.getElementById(targetId);
    if (target) target.style.display = 'block';

    // update button styles
    var bd = document.getElementById('client-modal-bd');
    if (!bd) return;
    bd.querySelectorAll('[data-cp-tab]').forEach(function (btn) {
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

  // ── Login submit ──────────────────────────────────────────────────────────

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
        if (!res.ok) {
          showView('login', { error: res.data.detail || 'Identifiants invalides' });
          return;
        }
        _token = res.data.access_token;
        _client = { company_name: res.data.company_name, id: res.data.client_id };
        saveToken(_token);
        saveClientData(_client);
        updateHeaderBtn();
        loadAndShowDashboard();
      })
      .catch(function () {
        showView('login', { error: 'Erreur réseau, réessayez.' });
      });
  };

  // ── Register submit ───────────────────────────────────────────────────────

  window.submitClientRegister = function (e) {
    e.preventDefault();
    var btn = document.getElementById('cp-reg-btn');
    if (btn) { btn.textContent = '…'; btn.disabled = true; }

    var payload = {
      company_name: (document.getElementById('cp-r-company') || {}).value || '',
      contact_name: (document.getElementById('cp-r-contact') || {}).value || '',
      email: (document.getElementById('cp-r-email') || {}).value || '',
      password: (document.getElementById('cp-r-password') || {}).value || '',
      phone: (document.getElementById('cp-r-phone') || {}).value || null,
      sector: (document.getElementById('cp-r-sector') || {}).value || null,
      city: (document.getElementById('cp-r-city') || {}).value || null,
      country: 'Burkina Faso',
    };

    fetch('/api/v1/client/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
      .then(function (res) {
        if (!res.ok) {
          showView('register', { error: res.data.detail || 'Erreur lors de l\'inscription' });
          return;
        }
        _token = res.data.access_token;
        _client = { company_name: res.data.company_name, id: res.data.client_id };
        saveToken(_token);
        saveClientData(_client);
        updateHeaderBtn();
        // New user — show catalog directly
        loadCatalogAndShow();
      })
      .catch(function () {
        showView('register', { error: 'Erreur réseau, réessayez.' });
      });
  };

  // ── Dashboard loader ──────────────────────────────────────────────────────

  window.loadAndShowDashboard = function () {
    fetch('/api/v1/client/dashboard', { headers: { Authorization: 'Bearer ' + _token } })
      .then(function (r) { return r.json(); })
      .then(function (data) { showView('dashboard', data); })
      .catch(function () { showView('dashboard', null); });
  };

  // ── Catalog loader ────────────────────────────────────────────────────────

  window.loadCatalogAndShow = function () {
    fetch('/api/v1/catalog')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        window._cpCatalogCache = data;
        showView('catalog', data);
      })
      .catch(function () {
        window._cpCatalogCache = [];
        showView('catalog', []);
      });
  };

  // ── Service selection → Checkout ──────────────────────────────────────────

  window.selectService = function (svc) {
    if (!_token) {
      showView('login');
      return;
    }
    _pendingService = svc;
    showView('checkout', svc);
  };

  // ── Confirm subscribe ─────────────────────────────────────────────────────

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
        if (!res.ok) {
          // Show error in checkout view
          var bd = document.getElementById('client-modal-bd');
          var box = bd ? bd.querySelector('#cp-modal-box') : null;
          if (box) {
            var errDiv = document.createElement('div');
            errDiv.style.cssText = S.errBox;
            errDiv.textContent = res.data.detail || 'Erreur lors de la souscription';
            box.insertBefore(errDiv, box.querySelector('form') || box.children[2]);
          }
          if (btn) { btn.textContent = 'Confirmer l\'abonnement'; btn.disabled = false; }
          return;
        }
        _pendingInvoice = {
          invoice_id: res.data.invoice_id,
          amount_fcfa: res.data.amount_fcfa,
          service_name: res.data.service_name,
        };
        showView('payment', _pendingInvoice);
      })
      .catch(function () {
        if (btn) { btn.textContent = 'Confirmer l\'abonnement'; btn.disabled = false; }
        showView('checkout', _pendingService);
      });
  };

  // ── Payment method change ─────────────────────────────────────────────────

  window.cpPayMethodChanged = function (idx, placeholder) {
    var inp = document.getElementById('cp-pay-ref');
    if (inp) inp.placeholder = placeholder;
    var labels = ['Numéro de téléphone', 'Numéro de téléphone', 'Numéro de compte', 'Numéro de carte (4 derniers chiffres)'];
    var lbl = document.getElementById('cp-pay-ref-label');
    if (lbl) lbl.textContent = labels[idx] || 'Référence';
  };

  // ── Start payment (from invoice list) ────────────────────────────────────

  window.startPayment = function (invoiceId, amount, serviceName) {
    _pendingInvoice = { invoice_id: invoiceId, amount_fcfa: amount, service_name: serviceName };
    showView('payment', _pendingInvoice);
  };

  // ── Payment submit ────────────────────────────────────────────────────────

  window.submitPayment = function (e) {
    e.preventDefault();
    if (!_pendingInvoice) return;

    var methodEl = document.querySelector('input[name="cp-pay-method"]:checked');
    var method = methodEl ? methodEl.value : '';
    var ref = (document.getElementById('cp-pay-ref') || {}).value || '';
    var btn = document.getElementById('cp-pay-btn');
    if (btn) { btn.textContent = 'Traitement…'; btn.disabled = true; }

    fetch('/api/v1/client/invoices/' + _pendingInvoice.invoice_id + '/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + _token },
      body: JSON.stringify({ payment_method: method, payment_ref: ref || null }),
    })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
      .then(function (res) {
        if (!res.ok) {
          showView('payment', Object.assign({}, _pendingInvoice, { error: res.data.detail || 'Erreur paiement' }));
          return;
        }
        _pendingInvoice = null;
        _pendingService = null;
        // Show success then reload dashboard
        var bd = getOrCreateModalBd();
        bd.querySelector('#cp-modal-box').innerHTML = '<div style="text-align:center;padding:30px 10px">'
          + '<div style="font-size:48px;margin-bottom:14px">✅</div>'
          + '<h2 style="' + S.h2 + ';margin-bottom:8px">Paiement confirmé !</h2>'
          + '<p style="color:#4a6b8a;font-size:13px;margin-bottom:6px">Référence : <strong style="color:#00c896">' + esc(res.data.payment_ref) + '</strong></p>'
          + '<p style="color:#4a6b8a;font-size:13px;margin-bottom:18px">Montant : <strong style="color:#e8f4ff">' + fmtFcfa(res.data.amount_fcfa) + '</strong></p>'
          + '<button onclick="loadAndShowDashboard()" style="' + S.btnPrim + '">Voir mon tableau de bord</button>'
          + '</div>';
      })
      .catch(function () {
        showView('payment', Object.assign({}, _pendingInvoice, { error: 'Erreur réseau, réessayez.' }));
      });
  };

  // ── Audit submit ──────────────────────────────────────────────────────────

  window.submitAudit = function (e) {
    e.preventDefault();
    var target = (document.getElementById('cp-audit-target') || {}).value || '';
    var btn = document.getElementById('cp-audit-btn');
    var results = document.getElementById('cp-audit-results');
    if (btn) { btn.textContent = 'Analyse en cours…'; btn.disabled = true; }
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
      .catch(function () {
        if (btn) { btn.textContent = 'Lancer l\'audit'; btn.disabled = false; }
      });
  };

  function renderAuditResults(data, container) {
    var gc = { A:'#00c896', B:'#00d4ff', C:'#ffa500', D:'#ff8c00', F:'#ff3b5c' };
    var color = gc[data.grade] || '#4a6b8a';
    var html = '<div style="display:flex;align-items:center;gap:16px;padding:14px;border-radius:10px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);margin-bottom:12px">'
      + '<div style="text-align:center;min-width:48px"><div style="font-size:36px;font-weight:700;color:' + color + '">' + data.grade + '</div><div style="font-size:10px;color:#4a6b8a">Grade</div></div>'
      + '<div style="flex:1">'
      + '<div style="font-weight:600;color:#e8f4ff;font-size:13px;margin-bottom:6px">' + esc(data.target) + '</div>'
      + '<div style="display:flex;align-items:center;gap:8px">'
      + '<div style="flex:1;height:6px;border-radius:3px;background:rgba(255,255,255,.1)">'
      + '<div style="height:6px;border-radius:3px;width:' + data.score + '%;background:' + color + '"></div></div>'
      + '<span style="font-size:12px;font-weight:700;color:' + color + '">' + data.score + '/100</span>'
      + '</div></div></div>'
      + data.checks.map(function (c) {
        var cs = { ok:{ icon:'✓', color:'#00c896' }, warn:{ icon:'⚠', color:'#ffa500' }, fail:{ icon:'✗', color:'#ff3b5c' } };
        var s = cs[c.status] || cs.warn;
        return '<div style="display:flex;gap:10px;padding:10px;border-radius:8px;background:rgba(255,255,255,.02);margin-bottom:6px">'
          + '<span style="font-weight:700;color:' + s.color + ';flex-shrink:0">' + s.icon + '</span>'
          + '<div><div style="font-size:12px;font-weight:600;color:#e8f4ff">' + esc(c.name) + ' <span style="font-weight:400;color:#4a6b8a">+' + c.score + ' pts</span></div>'
          + '<div style="font-size:11px;color:#4a6b8a;margin-top:2px">' + esc(c.detail) + '</div></div></div>';
      }).join('');
    if (container) { container.innerHTML = html; container.style.display = 'block'; }
  }

  // ── Logout ────────────────────────────────────────────────────────────────

  window.clientLogout = function () {
    clearToken();
    _token = null;
    _client = null;
    _pendingService = null;
    _pendingInvoice = null;
    window.closeClientModal();
    updateHeaderBtn();
    if (window.showToast) window.showToast('Déconnecté de l\'espace client');
  };

  // ── Header button ─────────────────────────────────────────────────────────

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

  // ── Expose showView globally ──────────────────────────────────────────────

  window.showView = showView;
  window.cpSwitchTab = cpSwitchTab;

  // ── Init ──────────────────────────────────────────────────────────────────

  window.addEventListener('DOMContentLoaded', function () {
    setTimeout(updateHeaderBtn, 400);
  });

  // Also run after loadIncludes (header injected async)
  var _origLoad = window.loadIncludes;
  if (typeof _origLoad === 'function') {
    window.loadIncludes = async function () {
      await _origLoad();
      updateHeaderBtn();
    };
  }

})();
