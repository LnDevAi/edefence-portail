# E-Defence — Portail de Cybersécurité

Portail unifié de cybersécurité d'entreprise — audits automatisés, inventaire des actifs, conformité réglementaire et formation certifiante.

## Branches

| Branche | Rôle |
|---------|------|
| `main` | Production stable |
| `dev` | Intégration continue |
| `feature/frontend-neya` | Développement UI/UX portail |
| `feature/security-zombre` | Sécurité & infrastructure |

## Stack Technique

| Couche | Technologie |
|--------|-------------|
| Portail Web | HTML5 / CSS3 / JavaScript |
| Scripts d'Audit | Python 3.x (python-nmap, reportlab) |
| Application Mobile | Flutter (Android / iOS) |
| Base de Données | PostgreSQL |
| SOC | Wazuh All-in-One (Ubuntu Server 24.04) |
| Pare-feu / Réseau | OPNsense (Protectli) |
| Infrastructure | Docker / Nginx / VPS sécurisé |

## Modules

- **Audit Flash** — Analyse externe rapide (ports, SSL/TLS, en-têtes HTTP) + effet frustration / capture de leads
- **Audit Complet** — Scan de vulnérabilités approfondi + rapport PDF téléchargeable
- **Hub Conformité** — Auto-évaluation CIL (Burkina Faso), RGPD, ISO 27001, PCI-DSS, RNS
- **Cyber-Academy** — Portail de formations certifiantes (CPCB, CDPO, WASO…)
- **SOC Central** — Wazuh + OPNsense, télémétrie des menaces en temps réel
- **SOS Vol** — App Flutter : Localiser / Siffler / Effacer les données à distance
- **Espace Client** — Tableau de bord multi-onglets (Découverte, Inventaire, Performance, Sécurité, Antivirus…)

## Démarrage rapide

```bash
git clone https://github.com/LnDevAi/edefence-portail.git
cd edefence-portail
# Portail web : ouvrir edefence_portail.html dans un navigateur
# Scripts d'audit (Python) :
pip install -r requirements.txt
python audit/flash.py --target <ip_ou_domaine>
```

## Conformité & Certifications

ISO 27001 · NIS2 · CIL (Burkina Faso) · RGPD · PCI-DSS

## Contributeurs

- [@MoussaNEYA](https://github.com/MoussaNEYA) — UI/UX Portail
- [@Yamalr](https://github.com/Yamalr) — Sécurité & Infrastructure
- [@burkinabe](https://github.com/burkinabe) — SOC, Scripts d'Audit, Mobile

---

**E-DEFENCE** · Ouaga 2000, derrière INSD, vers Rectorat UCAO · Ouagadougou, Burkina Faso
[www.edefence.tech](https://www.edefence.tech) · info@edefence.tech
