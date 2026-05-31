// Lightweight i18n for E-DEFENCE portail
const STORAGE_KEY = 'edefence:lang';

const translations = {
  fr: {
    nav: {
      portail: 'Portail', features: 'Fonctionnalités', parcours: 'Parcours',
      certifications: 'Certifications', plateformes: 'Plateformes', news: 'Actualités', contact: 'Contact',
    },
    auth: { login: 'Connexion', signup: 'Accès gratuit', register: "S'inscrire" },
    modal: {
      login: {
        title: 'Bon retour', subtitle: 'Connectez-vous à votre espace E DEFENCE',
        email: 'Email', password: 'Mot de passe', submit: 'Se connecter',
        no_account: 'Pas de compte ?', create: 'Créer un accès gratuit',
      },
      signup: {
        title: 'Accès gratuit', subtitle: 'Créez votre compte et démarrez votre audit',
        first_name: 'Prénom', last_name: 'Nom', email: 'Email professionnel',
        org: 'Organisation', org_placeholder: 'Nom de votre entreprise',
        password: 'Mot de passe', password_hint: '8 caractères minimum',
        submit: 'Créer mon compte gratuit', have_account: 'Déjà un compte ?', connect: 'Se connecter',
      },
    },
    toast: {
      fill_fields: 'Veuillez remplir tous les champs.',
      login_success: 'Connexion réussie.',
      signup_success: 'Compte créé. Bienvenue sur E DEFENCE.',
      request_sent: 'Demande envoyée. Notre équipe vous contactera sous 24h.',
      firmware_scheduled: 'Mise à jour firmware planifiée.',
      backup_retry: 'Sauvegarde relancée avec succès.',
      restore_scheduled: 'Restauration planifiée. Notre équipe vous contactera.',
      report_generating: 'Rapport en cours de génération…',
    },
    lang_toggle: 'EN',

    // ── Hero ──
    hero: {
      badge: 'Protection active — Portail de cybersécurité d\'entreprise',
      h1_1: 'Sécurisez votre',
      h1_2: 'organisation avec',
      desc: 'Portail unifié d\'audit, d\'inventaire et de formation en cybersécurité. Diagnostiquez vos vulnérabilités, corrigez-les, formez vos équipes.',
      cta_portal: 'Accéder au portail',
      cta_audit: 'Obtenir mon audit gratuit',
      kpi_companies: 'Entreprises protégées',
      kpi_modules: 'Modules de sécurité',
      kpi_iso: 'Référentiel couvert',
      kpi_nis: 'Conformité vérifiée',
    },

    // ── Portal shell ──
    portal: {
      badge: 'PORTAIL UNIFIÉ',
      title: 'Tableau de bord E-DEFENCE',
      subtitle: 'Centralisez votre posture de sécurité en un seul espace. Huit modules, une vision complète.',
      console: 'Console E-DEFENCE — Portail sécurisé',
      active: 'Protection active',
      tabs: {
        decouverte: 'Découverte', inventaire: 'Inventaire', performance: 'Performance',
        securite: 'Sécurité', wifi: 'Audit WiFi', antivirus: 'Antivirus',
        boitier: 'Boîtier', soc: 'SOC', sauvegarde: 'Sauvegarde',
        conformite: 'Hub Conformité', academy: 'Cyber-Academy',
      },
    },

    // ── Boîtier tab ──
    boitier: {
      kpi_deployed: 'Boîtiers déployés', kpi_threats: 'Menaces bloquées / mois',
      kpi_uptime: 'Disponibilité', kpi_clients: 'Clients actifs',
      kpi_firewall: 'Filtrage pare-feu', kpi_sla: 'SLA garanti',
      tab_status: 'Statuts', tab_alerts: 'Alertes bloquées', tab_firmware: 'Firmware',
      status_label: 'Statuts boîtiers clients', alerts_label: 'Alertes bloquées récentes',
      firmware_label: 'Gestion des firmwares',
      col_company: 'Entreprise', col_box: 'Boîtier', col_firmware: 'Firmware',
      col_status: 'Statut', col_sync: 'Dernière synchro', col_threat: 'Menace',
      col_type: 'Type', col_src: 'IP source', col_date: 'Date',
      col_version: 'Version', col_action: 'Action',
      update_btn: 'Mettre à jour', up_to_date: 'À jour',
      request_btn: 'Demander un boîtier', request_title: 'Demande de déploiement boîtier',
      request_org: 'Organisation', request_contact: 'Nom du contact',
      request_email: 'Email professionnel', request_phone: 'Téléphone',
      request_zone: 'Zone de déploiement', request_submit: 'Envoyer la demande',
      request_cancel: 'Annuler',
    },

    // ── SOC tab ──
    soc: {
      kpi_alerts: 'Alertes aujourd\'hui', kpi_critical: 'Critiques',
      kpi_agents: 'Agents connectés', kpi_mttr: 'MTTR moyen',
      kpi_realtime: 'Analysées en temps réel', kpi_action: 'Action immédiate requise',
      kpi_wazuh: 'Wazuh SIEM', kpi_response: 'Temps de réponse moyen',
      filter_all: 'Tous', filter_critical: 'Critique', filter_high: 'Élevé', filter_medium: 'Moyen',
      alerts_label: 'Dernières alertes SOC',
      col_time: 'Heure', col_agent: 'Agent', col_rule: 'Règle déclenchée',
      col_severity: 'Sévérité', col_status: 'Statut', col_action: 'Action',
      active: 'Surveillance active 24/7', active_sub: '— Centre SOC E-DEFENCE opérationnel',
      report_btn: 'Télécharger rapport mensuel', btn_respond: 'Répondre', btn_close: 'Clore',
    },

    // ── Sauvegarde tab ──
    sauvegarde: {
      kpi_protected: 'Données protégées', kpi_last: 'Dernière sauvegarde',
      kpi_rate: 'Taux de succès', kpi_rto: 'RTO garanti', kpi_rpo: 'RPO',
      kpi_support: 'Cloud + NAS local', kpi_auto: 'Automatique nocturne',
      kpi_period: '30 derniers jours', kpi_rto_val: '4 heures max', kpi_rpo_val: '24 heures',
      storage_label: 'Répartition du stockage', schedule_label: 'Planification',
      backups_label: 'Sauvegardes récentes', restore_label: 'Points de restauration',
      col_company: 'Entreprise', col_type: 'Type', col_size: 'Taille',
      col_duration: 'Durée', col_status: 'Statut', col_action: 'Action',
      retry_btn: 'Relancer', restore_prefix: 'Restaurer', retention: 'jours de rétention',
    },

    // ── Features section ──
    features: {
      badge: 'FONCTIONNALITÉS',
      title: 'Tout ce dont vous avez besoin',
      subtitle: 'Une plateforme conçue pour les équipes IT et les dirigeants qui veulent maîtriser leur sécurité sans complexité.',
      audit_title: 'Audit automatisé',
      audit_desc: 'Analyse complète de votre parc informatique, de votre réseau et de vos configurations en quelques minutes.',
      score_title: 'Score de sécurité',
      score_desc: 'Un score global clair avec des axes d\'amélioration priorisés pour guider vos actions correctrices.',
      alerts_title: 'Alertes en temps réel',
      alerts_desc: 'Détection et notification immédiate de toute activité suspecte sur votre infrastructure.',
      compliance_title: 'Rapports de conformité',
      compliance_desc: 'Vérification automatique de votre conformité RGPD, ISO 27001 et NIS2 avec recommandations détaillées.',
      training_title: 'Formation des équipes',
      training_desc: 'Modules de sensibilisation intégrés pour former l\'ensemble de votre organisation aux bonnes pratiques.',
      incidents_title: 'Gestion des incidents',
      incidents_desc: 'Procédures de réponse guidées pour contenir et résoudre les incidents de sécurité efficacement.',
    },

    // ── Services section ──
    services: {
      badge: 'NOS SERVICES',
      title_1: 'Protection',
      title_2: 'matérielle & opérationnelle',
      subtitle: 'Boîtier durci, surveillance 24/7 et sauvegarde sécurisée — trois piliers pour une protection complète de votre infrastructure.',
      from: 'À partir de',
      quote_btn: 'Demander un devis',
      popular: 'Le plus demandé',
      boitier_badge: 'Boîtier E-DEFENCE',
      boitier_title: 'Boîtier de Sécurité E-DEFENCE',
      boitier_tags: 'Ménages',
      boitier_tags2: 'PME',
      boitier_desc: 'Boîtier durci pré-configuré pour votre domicile ou votre entreprise — protégez votre réseau, votre WiFi et tous vos équipements connectés dès le premier jour.',
      boitier_f1: 'Firewall OPNsense nouvelle génération',
      boitier_f2: 'Protection WiFi — détection Evil Twin & intrus',
      boitier_f3: 'IDS/IPS Suricata — blocage des menaces en temps réel',
      boitier_f4: 'Filtrage DNS anti-phishing & contrôle parental',
      boitier_f5: 'Suivi de votre protection via la plateforme & l\'application',
      boitier_f6: 'Installation & configuration sur site incluses',
      soc_badge: 'SOC E-DEFENCE',
      soc_title: 'SOC E-DEFENCE — Surveillance 24/7',
      soc_desc: 'Centre des Opérations de Sécurité opéré par nos experts — détection, analyse et réponse aux incidents en temps réel avec Wazuh SIEM.',
      soc_f1: 'Surveillance active 24h/24, 7j/7',
      soc_f2: 'SIEM Wazuh avec agents déployés',
      soc_f3: 'Détection comportementale (EDR)',
      soc_f4: 'Rapport mensuel d\'incidents',
      soc_f5: 'Réponse aux incidents incluse',
      soc_f6: 'Tableau de bord client dédié',
      sav_badge: 'Sauvegarde Cloud',
      sav_title: 'Sauvegarde & Continuité',
      sav_desc: 'Protection de vos données critiques — sauvegarde automatisée cloud et NAS local, chiffrement AES-256, restauration garantie sous 4h.',
      sav_f1: 'Sauvegarde automatique quotidienne',
      sav_f2: 'Chiffrement AES-256 at-rest',
      sav_f3: 'Rétention 90 jours',
      sav_f4: 'Restauration testée mensuellement',
      sav_f5: 'Conformité CIL Burkina Faso',
      sav_f6: 'Dashboard de monitoring inclus',
    },

    // ── Parcours section ──
    parcours: {
      badge: 'PARCOURS GUIDÉS',
      title: 'De la découverte à l\'expertise',
      subtitle: 'Trois niveaux d\'accompagnement pour sécuriser votre organisation progressivement.',
      p1_level: 'Découverte', p1_title: 'Audit initial',
      p1_desc: 'Cartographiez votre parc, obtenez votre score et identifiez vos vulnérabilités prioritaires.',
      p1_f1: 'Inventaire automatique', p1_f2: 'Score de sécurité initial', p1_f3: 'Rapport de vulnérabilités',
      p2_badge: 'Le plus choisi', p2_level: 'Protection', p2_title: 'Sécurisation active',
      p2_desc: 'Corrigez vos failles, formez vos équipes et atteignez la conformité réglementaire.',
      p2_f1: 'Plan de remédiation guidé', p2_f2: 'Formations sensibilisation', p2_f3: 'Suivi RGPD / NIS2 / ISO 27001',
      p3_level: 'Maîtrise', p3_title: 'Cyber-résilience',
      p3_desc: 'Anticipez les menaces, répondez aux incidents et maintenez un niveau d\'excellence durable.',
      p3_f1: 'Simulation d\'attaques', p3_f2: 'Red team & pentest guidé', p3_f3: 'Certification E DEFENCE',
    },

    // ── Certifications section ──
    certif: {
      badge: 'CERTIFICATIONS',
      title_1: 'Des accréditations reconnues',
      title_2: 'à l\'international',
      desc: 'Obtenez des certifications E DEFENCE et des badges numériques validés, partageables sur LinkedIn et vérifiables par vos recruteurs.',
      f1: 'Badges numériques vérifiables',
      f2: 'Partageables LinkedIn, CV, e-mail',
      f3: 'Préparation CCST, CyberOps Cisco',
      f4: 'Reconnus dans 190 pays',
      cta: 'Obtenir ma certification',
      c1_title: 'Introduction Cybersécurité', c1_sub: 'Badge E DEFENCE officiel',
      c2_title: 'Conformité RGPD', c2_sub: 'Accréditation entreprise',
      c3_title: 'Audit Réseau', c3_sub: 'Certification technique',
      c4_title: 'Ethical Hacker', c4_sub: 'Niveau avancé',
    },

    // ── Plateformes section ──
    plateformes: {
      badge: 'NOS PLATEFORMES',
      title_1: 'L\'écosystème',
      subtitle: 'Deux plateformes complémentaires pour auditer votre sécurité et certifier vos équipes.',
      audit_type: 'Plateforme SaaS', audit_title: 'E-AUDIT 360',
      audit_desc: 'Plateforme unifiée d\'Audit & Conformité 360° UEMOA — Audit IT 10 modules, Audit Web, Hub Conformité 12 référentiels, 14 services additionnels. Générez des rapports PDF professionnels en quelques minutes.',
      audit_modules: 'Modules IT', audit_refs: 'Référentiels', audit_web: 'Audits Web', audit_ai: 'Rapports Claude',
      audit_cta: 'Accéder à E-AUDIT 360', audit_demo: 'Démo',
      academy_type: 'Plateforme Certifiante', academy_title: 'Cyber Academy',
      academy_desc: 'Plateforme phygitale d\'immersion pratique en cybersécurité UEMOA — 10 certifications, Cyber Range k3s, IA TARGUI, badges blockchain Polygon. Mobile Money CinetPay accepté.',
      academy_certif: 'Certifications', academy_labs: 'Labs Cyber Range',
      academy_ai: 'Tuteur TARGUI', academy_nft: 'Badges Blockchain',
      academy_cta: 'Rejoindre l\'Academy', academy_catalogue: 'Catalogue',
    },

    // ── Actualités section ──
    news: {
      badge: 'ACTUALITÉS',
      title_1: 'Cyber-veille',
      title_2: 'IA',
      subtitle: 'Informations fraîches filtrées et synthétisées par IA — restez informé des menaces et tendances en cybersécurité.',
      view_all: 'Voir toutes les actualités',
    },

    // ── Contact section ──
    contact: {
      badge: 'CONTACT',
      title: 'Parlons de votre sécurité',
      subtitle: 'Notre équipe d\'experts vous répond sous 24 heures ouvrées.',
      first_name: 'Prénom', last_name: 'Nom',
      email: 'Email professionnel', org: 'Organisation', message: 'Message',
      submit: 'Envoyer le message',
      success: 'Message envoyé. Nous vous répondrons sous 24 heures.',
      fp: 'Votre prénom', lp: 'Votre nom',
      ep: 'contact@entreprise.com', op: 'Nom de votre entreprise',
      mp: 'Décrivez votre besoin...',
    },
  },

  // ════════════════════════════════════════════════════
  en: {
    nav: {
      portail: 'Portal', features: 'Features', parcours: 'Learning path',
      certifications: 'Certifications', plateformes: 'Platforms', news: 'News', contact: 'Contact',
    },
    auth: { login: 'Sign in', signup: 'Free access', register: 'Sign up' },
    modal: {
      login: {
        title: 'Welcome back', subtitle: 'Sign in to your E DEFENCE space',
        email: 'Email', password: 'Password', submit: 'Sign in',
        no_account: 'No account?', create: 'Create free access',
      },
      signup: {
        title: 'Free access', subtitle: 'Create your account and start your audit',
        first_name: 'First name', last_name: 'Last name', email: 'Professional email',
        org: 'Organization', org_placeholder: 'Your company name',
        password: 'Password', password_hint: 'Minimum 8 characters',
        submit: 'Create my free account', have_account: 'Already have an account?', connect: 'Sign in',
      },
    },
    toast: {
      fill_fields: 'Please fill in all fields.',
      login_success: 'Successfully signed in.',
      signup_success: 'Account created. Welcome to E DEFENCE.',
      request_sent: 'Request sent. Our team will contact you within 24h.',
      firmware_scheduled: 'Firmware update scheduled.',
      backup_retry: 'Backup retried successfully.',
      restore_scheduled: 'Restore scheduled. Our team will contact you.',
      report_generating: 'Report generation in progress…',
    },
    lang_toggle: 'FR',

    // ── Hero ──
    hero: {
      badge: 'Active protection — Enterprise cybersecurity portal',
      h1_1: 'Secure your',
      h1_2: 'organization with',
      desc: 'Unified portal for audit, inventory and cybersecurity training. Diagnose your vulnerabilities, fix them, train your teams.',
      cta_portal: 'Access portal',
      cta_audit: 'Get my free audit',
      kpi_companies: 'Protected companies',
      kpi_modules: 'Security modules',
      kpi_iso: 'Framework covered',
      kpi_nis: 'Verified compliance',
    },

    // ── Portal shell ──
    portal: {
      badge: 'UNIFIED PORTAL',
      title: 'E-DEFENCE Dashboard',
      subtitle: 'Centralize your security posture in one place. Eight modules, one complete view.',
      console: 'E-DEFENCE Console — Secure portal',
      active: 'Active protection',
      tabs: {
        decouverte: 'Discovery', inventaire: 'Inventory', performance: 'Performance',
        securite: 'Security', wifi: 'WiFi Audit', antivirus: 'Antivirus',
        boitier: 'Gateway', soc: 'SOC', sauvegarde: 'Backup',
        conformite: 'Compliance Hub', academy: 'Cyber-Academy',
      },
    },

    // ── Boîtier tab ──
    boitier: {
      kpi_deployed: 'Deployed gateways', kpi_threats: 'Threats blocked / month',
      kpi_uptime: 'Uptime', kpi_clients: 'Active clients',
      kpi_firewall: 'Firewall filtering', kpi_sla: 'Guaranteed SLA',
      tab_status: 'Status', tab_alerts: 'Blocked threats', tab_firmware: 'Firmware',
      status_label: 'Client gateway status', alerts_label: 'Recent blocked threats',
      firmware_label: 'Firmware management',
      col_company: 'Company', col_box: 'Gateway', col_firmware: 'Firmware',
      col_status: 'Status', col_sync: 'Last sync', col_threat: 'Threat',
      col_type: 'Type', col_src: 'Source IP', col_date: 'Date',
      col_version: 'Version', col_action: 'Action',
      update_btn: 'Update', up_to_date: 'Up to date',
      request_btn: 'Request a gateway', request_title: 'Gateway deployment request',
      request_org: 'Organization', request_contact: 'Contact name',
      request_email: 'Professional email', request_phone: 'Phone',
      request_zone: 'Deployment zone', request_submit: 'Send request',
      request_cancel: 'Cancel',
    },

    // ── SOC tab ──
    soc: {
      kpi_alerts: 'Alerts today', kpi_critical: 'Critical',
      kpi_agents: 'Connected agents', kpi_mttr: 'Avg MTTR',
      kpi_realtime: 'Analyzed in real time', kpi_action: 'Immediate action required',
      kpi_wazuh: 'Wazuh SIEM', kpi_response: 'Average response time',
      filter_all: 'All', filter_critical: 'Critical', filter_high: 'High', filter_medium: 'Medium',
      alerts_label: 'Latest SOC alerts',
      col_time: 'Time', col_agent: 'Agent', col_rule: 'Rule triggered',
      col_severity: 'Severity', col_status: 'Status', col_action: 'Action',
      active: 'Active monitoring 24/7', active_sub: '— E-DEFENCE SOC Center operational',
      report_btn: 'Download monthly report', btn_respond: 'Respond', btn_close: 'Close',
    },

    // ── Sauvegarde tab ──
    sauvegarde: {
      kpi_protected: 'Protected data', kpi_last: 'Last backup',
      kpi_rate: 'Success rate', kpi_rto: 'Guaranteed RTO', kpi_rpo: 'RPO',
      kpi_support: 'Cloud + local NAS', kpi_auto: 'Automated nightly',
      kpi_period: 'Last 30 days', kpi_rto_val: '4 hours max', kpi_rpo_val: '24 hours',
      storage_label: 'Storage breakdown', schedule_label: 'Schedule',
      backups_label: 'Recent backups', restore_label: 'Restore points',
      col_company: 'Company', col_type: 'Type', col_size: 'Size',
      col_duration: 'Duration', col_status: 'Status', col_action: 'Action',
      retry_btn: 'Retry', restore_prefix: 'Restore', retention: 'day retention',
    },

    // ── Features section ──
    features: {
      badge: 'FEATURES',
      title: 'Everything you need',
      subtitle: 'A platform designed for IT teams and leaders who want to master their security without complexity.',
      audit_title: 'Automated audit',
      audit_desc: 'Complete analysis of your IT assets, network and configurations in minutes.',
      score_title: 'Security score',
      score_desc: 'A clear global score with prioritized improvement areas to guide your corrective actions.',
      alerts_title: 'Real-time alerts',
      alerts_desc: 'Immediate detection and notification of any suspicious activity on your infrastructure.',
      compliance_title: 'Compliance reports',
      compliance_desc: 'Automatic verification of your GDPR, ISO 27001 and NIS2 compliance with detailed recommendations.',
      training_title: 'Team training',
      training_desc: 'Built-in awareness modules to train your entire organization on best practices.',
      incidents_title: 'Incident management',
      incidents_desc: 'Guided response procedures to contain and resolve security incidents effectively.',
    },

    // ── Services section ──
    services: {
      badge: 'OUR SERVICES',
      title_1: 'Hardware &',
      title_2: 'operational protection',
      subtitle: 'Hardened gateway, 24/7 monitoring and secure backup — three pillars for complete infrastructure protection.',
      from: 'From',
      quote_btn: 'Request a quote',
      popular: 'Most requested',
      boitier_badge: 'E-DEFENCE Gateway',
      boitier_title: 'E-DEFENCE Security Gateway',
      boitier_tags: 'Households',
      boitier_tags2: 'SMB',
      boitier_desc: 'Pre-configured hardened gateway for your home or business — protect your network, WiFi and all connected devices from day one.',
      boitier_f1: 'Next-generation OPNsense firewall',
      boitier_f2: 'WiFi protection — Evil Twin & intruder detection',
      boitier_f3: 'Suricata IDS/IPS — real-time threat blocking',
      boitier_f4: 'DNS filtering for anti-phishing & parental control',
      boitier_f5: 'Monitor your protection via the platform & app',
      boitier_f6: 'On-site installation & configuration included',
      soc_badge: 'E-DEFENCE SOC',
      soc_title: 'E-DEFENCE SOC — 24/7 Monitoring',
      soc_desc: 'Security Operations Center operated by our experts — detection, analysis and incident response in real time with Wazuh SIEM.',
      soc_f1: 'Active monitoring 24h/24, 7d/7',
      soc_f2: 'Wazuh SIEM with deployed agents',
      soc_f3: 'Behavioral detection (EDR)',
      soc_f4: 'Monthly incident report',
      soc_f5: 'Incident response included',
      soc_f6: 'Dedicated client dashboard',
      sav_badge: 'Cloud Backup',
      sav_title: 'Backup & Business Continuity',
      sav_desc: 'Critical data protection — automated cloud and local NAS backup, AES-256 encryption, restore guaranteed within 4h.',
      sav_f1: 'Automated daily backup',
      sav_f2: 'AES-256 at-rest encryption',
      sav_f3: '90-day retention',
      sav_f4: 'Monthly restore testing',
      sav_f5: 'CIL Burkina Faso compliance',
      sav_f6: 'Monitoring dashboard included',
    },

    // ── Parcours section ──
    parcours: {
      badge: 'GUIDED PATHS',
      title: 'From discovery to expertise',
      subtitle: 'Three levels of support to progressively secure your organization.',
      p1_level: 'Discovery', p1_title: 'Initial audit',
      p1_desc: 'Map your assets, get your score and identify your priority vulnerabilities.',
      p1_f1: 'Automatic inventory', p1_f2: 'Initial security score', p1_f3: 'Vulnerability report',
      p2_badge: 'Most chosen', p2_level: 'Protection', p2_title: 'Active security',
      p2_desc: 'Fix your vulnerabilities, train your teams and achieve regulatory compliance.',
      p2_f1: 'Guided remediation plan', p2_f2: 'Awareness training', p2_f3: 'GDPR / NIS2 / ISO 27001 tracking',
      p3_level: 'Mastery', p3_title: 'Cyber-resilience',
      p3_desc: 'Anticipate threats, respond to incidents and maintain a lasting level of excellence.',
      p3_f1: 'Attack simulation', p3_f2: 'Red team & guided pentest', p3_f3: 'E DEFENCE certification',
    },

    // ── Certifications section ──
    certif: {
      badge: 'CERTIFICATIONS',
      title_1: 'Internationally recognized',
      title_2: 'accreditations',
      desc: 'Get E DEFENCE certifications and validated digital badges, shareable on LinkedIn and verifiable by recruiters.',
      f1: 'Verifiable digital badges',
      f2: 'Shareable on LinkedIn, CV, email',
      f3: 'CCST, Cisco CyberOps preparation',
      f4: 'Recognized in 190 countries',
      cta: 'Get my certification',
      c1_title: 'Introduction to Cybersecurity', c1_sub: 'Official E DEFENCE badge',
      c2_title: 'GDPR Compliance', c2_sub: 'Enterprise accreditation',
      c3_title: 'Network Audit', c3_sub: 'Technical certification',
      c4_title: 'Ethical Hacker', c4_sub: 'Advanced level',
    },

    // ── Plateformes section ──
    plateformes: {
      badge: 'OUR PLATFORMS',
      title_1: 'The E-DEFENCE',
      subtitle: 'Two complementary platforms to audit your security and certify your teams.',
      audit_type: 'SaaS Platform', audit_title: 'E-AUDIT 360',
      audit_desc: 'Unified Audit & Compliance 360° UEMOA platform — 10-module IT Audit, Web Audit, Compliance Hub with 12 frameworks, 14 additional services. Generate professional PDF reports in minutes.',
      audit_modules: 'IT Modules', audit_refs: 'Frameworks', audit_web: 'Web Audits', audit_ai: 'Claude Reports',
      audit_cta: 'Access E-AUDIT 360', audit_demo: 'Demo',
      academy_type: 'Certification Platform', academy_title: 'Cyber Academy',
      academy_desc: 'Phygital practical immersion platform for UEMOA cybersecurity — 10 certifications, k3s Cyber Range, TARGUI AI, Polygon blockchain badges. CinetPay Mobile Money accepted.',
      academy_certif: 'Certifications', academy_labs: 'Cyber Range Labs',
      academy_ai: 'TARGUI Tutor', academy_nft: 'Blockchain Badges',
      academy_cta: 'Join the Academy', academy_catalogue: 'Catalogue',
    },

    // ── Actualités section ──
    news: {
      badge: 'NEWS',
      title_1: 'AI Cyber-watch',
      title_2: 'AI',
      subtitle: 'Fresh information filtered and synthesized by AI — stay informed about cybersecurity threats and trends.',
      view_all: 'View all news',
    },

    // ── Contact section ──
    contact: {
      badge: 'CONTACT',
      title: 'Let\'s talk about your security',
      subtitle: 'Our team of experts will respond within 24 business hours.',
      first_name: 'First name', last_name: 'Last name',
      email: 'Professional email', org: 'Organization', message: 'Message',
      submit: 'Send message',
      success: 'Message sent. We will respond within 24 hours.',
      fp: 'Your first name', lp: 'Your last name',
      ep: 'contact@company.com', op: 'Your company name',
      mp: 'Describe your needs...',
    },
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
    const val = t(key);
    // Only set textContent if the value resolved (not equal to the key path)
    if (val !== key) el.textContent = val;
  });
  // data-i18n-placeholder: update placeholder attribute
  document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
    const key = el.getAttribute('data-i18n-placeholder');
    const val = t(key);
    if (val !== key) el.placeholder = val;
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
