// ── Client Portal ─────────────────────────────────────────────────────────────

(function () {
  var _token = null;
  var _client = null;

  function getToken() {
    try { return localStorage.getItem('edefence:clientToken'); } catch (e) { return null; }
  }
  function saveToken(t) {
    try { localStorage.setItem('edefence:clientToken', t); } catch (e) {}
  }
  function clearToken() {
    try { localStorage.removeItem('edefence:clientToken'); localStorage.removeItem('edefence:clientData'); } catch (e) {}
  }
  function saveClientData(d) {
    try { localStorage.setItem('edefence:clientData', JSON.stringify(d)); } catch (e) {}
  }
  function getClientData() {
    try { return JSON.parse(localStorage.getItem('edefence:clientData') || 'null'); } catch (e) { return null; }
  }

  // ── Modal helpers ───────────────────────────────────────────────────────────

  function showClientModal(html) {
    var bd = document.getElementById('client-modal-bd');
    if (!bd) {
      bd = document.createElement('div');
      bd.id = 'client-modal-bd';
      bd.className = 'fixed inset-0 z-[200] flex items-center justify-center';
      bd.style.cssText = 'background:rgba(0,0,0,.7);backdrop-filter:blur(4px)';
      bd.addEventListener('click', function (e) { if (e.target === bd) closeClientModal(); });
      document.body.appendChild(bd);
    }
    bd.innerHTML = '<div class="card-border rounded-2xl p-7 w-full max-w-lg mx-4 relative" style="background:#071525;max-height:90vh;overflow-y:auto">'
      + '<button onclick="closeClientModal()" class="absolute top-4 right-4 text-ed-muted hover:text-white text-xl leading-none">&times;</button>'
      + html + '</div>';
    bd.style.display = 'flex';
  }

  window.closeClientModal = function () {
    var bd = document.getElementById('client-modal-bd');
    if (bd) bd.style.display = 'none';
  };

  // ── Entry point ─────────────────────────────────────────────────────────────

  window.openClientSpace = function () {
    var tok = getToken();
    if (tok) {
      // verify token still valid
      fetch('/api/v1/client/me', { headers: { Authorization: 'Bearer ' + tok } })
        .then(function (r) {
          if (r.ok) return r.json();
          clearToken();
          showClientLoginForm();
        })
        .then(function (data) {
          if (data) {
            _token = tok;
            _client = data;
            saveClientData(data);
            showClientDashboard();
          }
        })
        .catch(function () { clearToken(); showClientLoginForm(); });
    } else {
      showClientLoginForm();
    }
  };

  // ── Login form ──────────────────────────────────────────────────────────────

  function showClientLoginForm(errorMsg) {
    var err = errorMsg ? '<p class="text-red-400 text-xs mb-3">' + errorMsg + '</p>' : '';
    showClientModal(
      '<h2 class="font-display text-xl font-bold text-white mb-1">Espace Client</h2>'
      + '<p class="text-ed-muted text-sm mb-5">Connectez-vous pour accéder à vos services E-DEFENCE</p>'
      + err
      + '<form id="client-login-form" onsubmit="submitClientLogin(event)">'
      + '<div class="space-y-4">'
      + '<div><label class="block text-xs text-ed-muted uppercase tracking-wide mb-1.5">Email</label>'
      + '<input id="cl-email" type="email" class="ed-input text-sm" placeholder="contact@votre-entreprise.com" required/></div>'
      + '<div><label class="block text-xs text-ed-muted uppercase tracking-wide mb-1.5">Mot de passe</label>'
      + '<input id="cl-password" type="password" class="ed-input text-sm" placeholder="••••••••" required/></div>'
      + '<button type="submit" class="w-full py-3 rounded-xl text-sm font-semibold text-ed-bg btn-primary">Se connecter</button>'
      + '</div></form>'
    );
  }

  window.submitClientLogin = function (e) {
    e.preventDefault();
    var email = document.getElementById('cl-email').value.trim();
    var password = document.getElementById('cl-password').value;
    var btn = e.target.querySelector('button[type=submit]');
    btn.textContent = '…';
    btn.disabled = true;

    fetch('/api/v1/client/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password })
    })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
      .then(function (res) {
        if (!res.ok) {
          showClientLoginForm(res.data.detail || 'Identifiants invalides');
          return;
        }
        _token = res.data.access_token;
        saveToken(_token);
        _client = { company_name: res.data.company_name, id: res.data.client_id };
        saveClientData(_client);
        updateHeaderBtn();
        loadAndShowDashboard();
      })
      .catch(function () { showClientLoginForm('Erreur réseau, réessayez.'); });
  };

  // ── Dashboard ───────────────────────────────────────────────────────────────

  function loadAndShowDashboard() {
    fetch('/api/v1/client/dashboard', { headers: { Authorization: 'Bearer ' + _token } })
      .then(function (r) { return r.json(); })
      .then(function (data) { showClientDashboard(data); })
      .catch(function () { showClientDashboard(null); });
  }

  function showClientDashboard(data) {
    if (!data) data = { contracts: [], invoices: [], service_requests: [], stats: { active_contracts: 0, pending_invoices: 0, total_due_fcfa: 0, pending_requests: 0 } };
    var cd = _client || getClientData() || {};

    var html = '<h2 class="font-display text-xl font-bold text-white mb-1">Bienvenue, <span class="g-text">' + escHtml(cd.company_name || '') + '</span></h2>'
      + '<p class="text-ed-muted text-xs mb-5">Tableau de bord de vos services E-DEFENCE</p>'

      // Stats row
      + '<div class="grid grid-cols-2 gap-3 mb-5">'
      + kpiCard('Contrats actifs', data.stats.active_contracts, '#00d4ff')
      + kpiCard('Factures en attente', data.stats.pending_invoices, '#ff3b5c')
      + kpiCard('Montant dû', fmtFcfa(data.stats.total_due_fcfa), '#ffa500')
      + kpiCard('Demandes en cours', data.stats.pending_requests, '#00c896')
      + '</div>'

      // Tabs
      + '<div class="flex gap-2 mb-4 border-b border-white/10 pb-2">'
      + tabBtn('cp-tab-services', 'Mes services', 'cp-tab')
      + tabBtn('cp-tab-factures', 'Factures', 'cp-tab')
      + tabBtn('cp-tab-demander', 'Demander', 'cp-tab')
      + tabBtn('cp-tab-audit', 'Audit rapide', 'cp-tab')
      + '</div>'

      // Tab: services
      + '<div id="cp-tab-services" class="cp-tab-content">'
      + renderContracts(data.contracts)
      + '</div>'

      // Tab: factures
      + '<div id="cp-tab-factures" class="cp-tab-content hidden">'
      + renderInvoices(data.invoices)
      + '</div>'

      // Tab: demander service
      + '<div id="cp-tab-demander" class="cp-tab-content hidden">'
      + renderServiceRequest()
      + '</div>'

      // Tab: audit
      + '<div id="cp-tab-audit" class="cp-tab-content hidden">'
      + renderAuditForm()
      + '</div>'

      + '<div class="mt-5 pt-4 border-t border-white/10 flex justify-between items-center">'
      + '<span class="text-xs text-ed-muted">Connecté : ' + escHtml(cd.company_name || '') + '</span>'
      + '<button onclick="clientLogout()" class="text-xs text-red-400 hover:text-red-300 transition-colors">Se déconnecter</button>'
      + '</div>';

    showClientModal(html);

    // activate first tab
    document.querySelectorAll('.cp-tab-btn').forEach(function (b, i) {
      b.addEventListener('click', function () { switchCpTab(b.dataset.target); });
      if (i === 0) b.classList.add('active-cp-tab');
    });
  }

  function kpiCard(label, val, color) {
    return '<div class="rounded-xl p-3 text-center" style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06)">'
      + '<div class="text-xl font-bold" style="color:' + color + '">' + val + '</div>'
      + '<div class="text-xs text-ed-muted mt-0.5">' + label + '</div></div>';
  }

  function tabBtn(target, label) {
    return '<button class="cp-tab-btn text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors text-ed-muted hover:text-white" data-target="' + target + '">' + label + '</button>';
  }

  function switchCpTab(id) {
    document.querySelectorAll('.cp-tab-content').forEach(function (el) { el.classList.add('hidden'); });
    document.querySelectorAll('.cp-tab-btn').forEach(function (b) {
      b.classList.remove('active-cp-tab');
      b.style.background = '';
      b.style.color = '';
    });
    var tab = document.getElementById(id);
    if (tab) tab.classList.remove('hidden');
    var btn = document.querySelector('[data-target="' + id + '"]');
    if (btn) { btn.style.background = 'rgba(0,212,255,.12)'; btn.style.color = '#00d4ff'; }
  }

  var SERVICE_LABELS = { boitier: 'Boîtier EDR', soc: 'SOC managé', sauvegarde: 'Sauvegarde cloud', audit360: 'Audit 360°', cyberacademy: 'Cyber Academy' };
  var STATUS_LABELS  = { actif: 'Actif', expire: 'Expiré', suspendu: 'Suspendu', resilie: 'Résilié' };
  var INV_STATUS     = { en_attente: { label: 'En attente', color: '#ffa500' }, paye: { label: 'Payée', color: '#00c896' }, en_retard: { label: 'En retard', color: '#ff3b5c' }, annule: { label: 'Annulée', color: '#4a6b8a' } };
  var REQ_STATUS     = { en_attente: { label: 'En attente', color: '#ffa500' }, en_cours: { label: 'En cours', color: '#00d4ff' }, accepte: { label: 'Accepté', color: '#00c896' }, refuse: { label: 'Refusé', color: '#ff3b5c' } };

  function renderContracts(contracts) {
    if (!contracts || !contracts.length) return '<p class="text-ed-muted text-sm text-center py-6">Aucun contrat actif pour le moment.<br><span class="text-xs">Utilisez l\'onglet "Demander" pour souscrire à un service.</span></p>';
    return '<div class="space-y-3">' + contracts.map(function (c) {
      var color = c.status === 'actif' ? '#00c896' : '#4a6b8a';
      return '<div class="rounded-xl p-4" style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06)">'
        + '<div class="flex items-center justify-between mb-2">'
        + '<span class="font-semibold text-sm text-white">' + (SERVICE_LABELS[c.service_type] || c.service_type) + '</span>'
        + '<span class="badge" style="background:rgba(0,200,150,.12);border:1px solid rgba(0,200,150,.3);color:' + color + '">' + (STATUS_LABELS[c.status] || c.status) + '</span>'
        + '</div>'
        + '<div class="text-xs text-ed-muted">Montant : <span class="text-white">' + fmtFcfa(c.amount_fcfa) + ' / ' + c.billing_period + '</span></div>'
        + '<div class="text-xs text-ed-muted mt-1">Depuis le ' + fmtDate(c.start_date) + (c.end_date ? ' · Jusqu\'au ' + fmtDate(c.end_date) : '') + '</div>'
        + '</div>';
    }).join('') + '</div>';
  }

  function renderInvoices(invoices) {
    if (!invoices || !invoices.length) return '<p class="text-ed-muted text-sm text-center py-6">Aucune facture disponible.</p>';
    return '<div class="space-y-2">' + invoices.map(function (inv) {
      var s = INV_STATUS[inv.status] || { label: inv.status, color: '#4a6b8a' };
      return '<div class="flex items-center justify-between rounded-xl p-3" style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06)">'
        + '<div>'
        + '<div class="text-sm font-semibold text-white">' + escHtml(inv.invoice_number) + '</div>'
        + '<div class="text-xs text-ed-muted">' + fmtDate(inv.due_date) + '</div>'
        + '</div>'
        + '<div class="text-right">'
        + '<div class="text-sm font-bold text-white">' + fmtFcfa(inv.amount_fcfa) + '</div>'
        + '<span class="badge" style="background:rgba(255,255,255,.05);color:' + s.color + '">' + s.label + '</span>'
        + '</div></div>';
    }).join('') + '</div>';
  }

  function renderServiceRequest() {
    return '<p class="text-ed-muted text-sm mb-4">Sélectionnez un service et envoyez votre demande. Notre équipe vous contactera sous 24h.</p>'
      + '<form id="cp-svc-form" onsubmit="submitServiceRequest(event)" class="space-y-4">'
      + '<div><label class="block text-xs text-ed-muted uppercase tracking-wide mb-1.5">Service souhaité</label>'
      + '<select id="cp-svc-type" class="ed-input text-sm" required>'
      + '<option value="">-- Choisir --</option>'
      + '<option value="boitier">Boîtier EDR — Protection endpoint</option>'
      + '<option value="soc">SOC managé — Surveillance 24/7</option>'
      + '<option value="sauvegarde">Sauvegarde cloud — Continuité métier</option>'
      + '<option value="audit360">Audit 360° — Diagnostic complet</option>'
      + '<option value="cyberacademy">Cyber Academy — Formation équipe</option>'
      + '</select></div>'
      + '<div><label class="block text-xs text-ed-muted uppercase tracking-wide mb-1.5">Message (optionnel)</label>'
      + '<textarea id="cp-svc-msg" class="ed-input text-sm" rows="3" placeholder="Décrivez votre besoin, le nombre de postes, vos contraintes…"></textarea></div>'
      + '<button type="submit" class="w-full py-3 rounded-xl text-sm font-semibold text-ed-bg btn-primary">Envoyer la demande</button>'
      + '</form>'
      + '<div id="cp-svc-ok" class="hidden mt-4 p-3 rounded-xl text-sm text-center" style="background:rgba(0,200,150,.12);border:1px solid rgba(0,200,150,.3);color:#00c896">Demande envoyée ! Notre équipe vous contactera sous 24h.</div>';
  }

  function renderAuditForm() {
    return '<p class="text-ed-muted text-sm mb-4">Entrez l\'URL ou le domaine de votre site pour un audit de sécurité rapide.</p>'
      + '<form id="cp-audit-form" onsubmit="submitAudit(event)" class="space-y-4">'
      + '<div><label class="block text-xs text-ed-muted uppercase tracking-wide mb-1.5">Domaine / URL cible</label>'
      + '<input id="cp-audit-target" type="text" class="ed-input text-sm" placeholder="exemple.com ou https://exemple.com" required/></div>'
      + '<button type="submit" class="w-full py-3 rounded-xl text-sm font-semibold text-ed-bg btn-primary">Lancer l\'audit</button>'
      + '</form>'
      + '<div id="cp-audit-results" class="hidden mt-4"></div>';
  }

  // ── Service request submit ──────────────────────────────────────────────────

  window.submitServiceRequest = function (e) {
    e.preventDefault();
    var svcType = document.getElementById('cp-svc-type').value;
    var msg = document.getElementById('cp-svc-msg').value.trim();
    var btn = e.target.querySelector('button[type=submit]');
    btn.textContent = '…'; btn.disabled = true;

    fetch('/api/v1/client/service-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + _token },
      body: JSON.stringify({ service_type: svcType, message: msg || null })
    })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
      .then(function (res) {
        btn.textContent = 'Envoyer la demande'; btn.disabled = false;
        if (res.ok) {
          document.getElementById('cp-svc-form').reset();
          var ok = document.getElementById('cp-svc-ok');
          if (ok) { ok.classList.remove('hidden'); setTimeout(function () { ok.classList.add('hidden'); }, 5000); }
        } else {
          if (window.showToast) showToast('Erreur lors de l\'envoi');
        }
      })
      .catch(function () { btn.textContent = 'Envoyer la demande'; btn.disabled = false; });
  };

  // ── Audit submit ────────────────────────────────────────────────────────────

  window.submitAudit = function (e) {
    e.preventDefault();
    var target = document.getElementById('cp-audit-target').value.trim();
    var btn = e.target.querySelector('button[type=submit]');
    var results = document.getElementById('cp-audit-results');
    btn.textContent = 'Analyse en cours…'; btn.disabled = true;
    results.classList.add('hidden');

    fetch('/api/v1/client/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + _token },
      body: JSON.stringify({ target: target })
    })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
      .then(function (res) {
        btn.textContent = 'Lancer l\'audit'; btn.disabled = false;
        if (!res.ok) { results.classList.remove('hidden'); results.innerHTML = '<p class="text-red-400 text-sm">' + (res.data.detail || 'Erreur audit') + '</p>'; return; }
        renderAuditResults(res.data, results);
      })
      .catch(function () { btn.textContent = 'Lancer l\'audit'; btn.disabled = false; });
  };

  function renderAuditResults(data, container) {
    var gradeColor = { A: '#00c896', B: '#00d4ff', C: '#ffa500', D: '#ff8c00', F: '#ff3b5c' };
    var color = gradeColor[data.grade] || '#4a6b8a';

    var html = '<div class="flex items-center gap-4 mb-4 p-4 rounded-xl" style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08)">'
      + '<div class="text-center"><div class="text-4xl font-bold" style="color:' + color + '">' + data.grade + '</div><div class="text-xs text-ed-muted mt-1">Grade</div></div>'
      + '<div class="flex-1">'
      + '<div class="flex items-center gap-2 mb-1"><span class="text-white font-semibold text-sm">' + escHtml(data.target) + '</span></div>'
      + '<div class="flex items-center gap-2">'
      + '<div class="flex-1 rounded-full h-2" style="background:rgba(255,255,255,.1)"><div class="rounded-full h-2 transition-all" style="width:' + data.score + '%;background:' + color + '"></div></div>'
      + '<span class="text-sm font-bold" style="color:' + color + '">' + data.score + '/100</span>'
      + '</div></div></div>'
      + '<div class="space-y-2">' + data.checks.map(function (c) {
        var cs = { ok: { icon: '✓', color: '#00c896' }, warn: { icon: '⚠', color: '#ffa500' }, fail: { icon: '✗', color: '#ff3b5c' } };
        var s = cs[c.status] || cs.warn;
        return '<div class="flex items-start gap-3 p-3 rounded-lg" style="background:rgba(255,255,255,.02)">'
          + '<span class="text-sm font-bold mt-0.5" style="color:' + s.color + '">' + s.icon + '</span>'
          + '<div><div class="text-xs font-semibold text-white">' + escHtml(c.name) + ' <span class="font-normal text-ed-muted">+' + c.score + ' pts</span></div>'
          + '<div class="text-xs text-ed-muted mt-0.5">' + escHtml(c.detail) + '</div></div></div>';
      }).join('') + '</div>';

    container.innerHTML = html;
    container.classList.remove('hidden');
  }

  // ── Logout ──────────────────────────────────────────────────────────────────

  window.clientLogout = function () {
    clearToken();
    _token = null;
    _client = null;
    closeClientModal();
    updateHeaderBtn();
    if (window.showToast) showToast('Déconnecté de l\'espace client');
  };

  // ── Header button state ─────────────────────────────────────────────────────

  function updateHeaderBtn() {
    var btn = document.getElementById('client-space-btn');
    if (!btn) return;
    var cd = getClientData();
    if (cd && getToken()) {
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
        + '<span>' + escHtml(cd.company_name || 'Mon espace') + '</span>';
      btn.style.background = 'rgba(0,212,255,.1)';
    } else {
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
        + '<span>Espace Client</span>';
      btn.style.background = '';
    }
  }

  // ── Init ────────────────────────────────────────────────────────────────────

  function escHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function fmtFcfa(n) {
    return Number(n).toLocaleString('fr-FR') + ' F';
  }
  function fmtDate(d) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  window.addEventListener('DOMContentLoaded', function () {
    // restore header button state after header is loaded
    setTimeout(updateHeaderBtn, 300);
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
