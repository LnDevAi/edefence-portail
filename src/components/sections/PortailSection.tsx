'use client'

import { useState } from 'react'

// ─── Type des onglets ────────────────────────────────────────────
export type PortalTabId =
  | 'decouverte'
  | 'inventaire'
  | 'performance'
  | 'securite'
  | 'wifi'
  | 'antivirus'
  | 'conformite'
  | 'academy'

const TABS: { id: PortalTabId; label: string }[] = [
  { id: 'decouverte',  label: 'Découverte'     },
  { id: 'inventaire',  label: 'Inventaire'     },
  { id: 'performance', label: 'Performance'    },
  { id: 'securite',    label: 'Sécurité'       },
  { id: 'wifi',        label: 'Audit WiFi'     },
  { id: 'antivirus',   label: 'Antivirus'      },
  { id: 'conformite',  label: 'Hub Conformité' },
  { id: 'academy',     label: 'Cyber-Academy'  },
]

// ─── Composants réutilisables ────────────────────────────────────

type BadgeVariant = 'ok' | 'warn' | 'crit' | 'info' | 'locked'

function Badge({ variant, children }: { variant: BadgeVariant; children: React.ReactNode }) {
  const styles: Record<BadgeVariant, React.CSSProperties> = {
    ok:     { background:'rgba(0,200,150,.12)',  border:'1px solid rgba(0,200,150,.3)',  color:'#00c896' },
    warn:   { background:'rgba(255,165,0,.12)', border:'1px solid rgba(255,165,0,.3)',  color:'#ffa500' },
    crit:   { background:'rgba(255,59,92,.12)', border:'1px solid rgba(255,59,92,.3)',  color:'#ff3b5c' },
    info:   { background:'rgba(0,212,255,.12)', border:'1px solid rgba(0,212,255,.3)',  color:'#00d4ff' },
    locked: { background:'rgba(255,255,255,.05)',border:'1px solid #1e3a5f',            color:'#4a6b8a' },
  }
  return (
    <span style={{
      display:'inline-block', padding:'2px 8px', borderRadius:4,
      fontSize:11, fontWeight:600, letterSpacing:'0.5px', textTransform:'uppercase',
      ...styles[variant],
    }}>
      {children}
    </span>
  )
}

function StatMini({ label, value, sub, color = 'white' }: {
  label: string; value: string; sub?: string; color?: string
}) {
  return (
    <div style={{
      background:'rgba(255,255,255,.03)',
      border:'1px solid rgba(0,212,255,.1)',
      borderRadius:12, padding:16,
    }}>
      <div style={{ fontSize:10, color:'#4a6b8a', textTransform:'uppercase', letterSpacing:'1px', marginBottom:4 }}>{label}</div>
      <div style={{ fontFamily:"'Space Grotesk',system-ui,sans-serif", fontSize:30, fontWeight:700, color }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:'#4a6b8a', marginTop:4 }}>{sub}</div>}
    </div>
  )
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ background:'rgba(255,255,255,.07)', borderRadius:99, height:4, overflow:'hidden' }}>
      <div style={{ width:`${value}%`, height:'100%', background:color, borderRadius:99 }} />
    </div>
  )
}

function SecLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:10,
      fontSize:10, fontWeight:600, letterSpacing:'2px', textTransform:'uppercase',
      color:'#00d4ff', marginBottom:14,
    }}>
      {children}
      <div style={{ flex:1, height:1, background:'#1e3a5f' }} />
    </div>
  )
}

const TH_STYLE: React.CSSProperties = {
  textAlign:'left', padding:'8px 12px', color:'#4a6b8a',
  fontSize:10, textTransform:'uppercase', letterSpacing:'1px',
  borderBottom:'1px solid #1e3a5f',
}
const TD_STYLE: React.CSSProperties = {
  padding:'10px 12px',
  borderBottom:'1px solid rgba(30,58,95,.4)',
  color:'#e8f4ff', fontSize:12,
}

// ────────────────────────────────────────────────────────────────
// SECTION PRINCIPALE
// ────────────────────────────────────────────────────────────────
export default function PortailSection() {
  const [activeTab, setActiveTab] = useState<PortalTabId>('decouverte')

  return (
    <section id="portail" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-[80%]">

        {/* En-tête section */}
        <div className="text-center mb-10">
          <div
            className="inline-block text-xs font-semibold tracking-widest w-[200px] px-3 py-1.5 rounded-full mb-4"
            style={{ background:'rgba(0,200,150,.08)', border:'1px solid rgba(0,200,150,.25)', color:'#00c896' }}
          >
            PORTAIL UNIFIÉ
          </div>
          <h2 className="font-display font-bold text-4xl text-white mb-3">
            Tableau de bord E-DEFENCE
          </h2>
          <p style={{ color:'#4a6b8a', maxWidth:480, margin:'0 auto', fontSize:14 }}>
            Centralisez votre posture de sécurité en un seul espace. Huit modules, une vision complète.
          </p>
        </div>

        {/* ── Console Shell ── */}
        <div style={{ borderRadius:20, overflow:'hidden', border:'1px solid #1e3a5f', background:'#0d1e33' }}>

          {/* Barre de titre macOS */}
          <div style={{
            display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'10px 20px', background:'#07111f', borderBottom:'1px solid #1e3a5f',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              {/* Boutons macOS */}
              <div style={{ display:'flex', gap:6 }}>
                {['#ff5f57','#febc2e','#28c840'].map((c, i) => (
                  <div key={i} style={{ width:12, height:12, borderRadius:'50%', background:c }} />
                ))}
              </div>
              <span style={{ fontFamily:'monospace', fontSize:12, color:'#4a6b8a' }}>
                Console E-DEFENCE — Portail sécurisé
              </span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              {/* Point pulse animé */}
              <span style={{
                display:'inline-block', width:7, height:7, borderRadius:'50%',
                background:'#00c896', animation:'pulse 2s ease-in-out infinite',
              }} />
              <span style={{ fontSize:12, color:'#4a6b8a' }}>Protection active</span>
              <span style={{
                fontSize:12, fontWeight:700, padding:'3px 10px', borderRadius:6,
                background:'rgba(0,212,255,.15)', color:'#00d4ff',
              }}>
                Score : 42/100
              </span>
            </div>
          </div>

          {/* Barre des onglets */}
          <div style={{
            display:'flex', overflowX:'auto', background:'#07111f',
            borderBottom:'2px solid #1e3a5f', scrollbarWidth:'none',
          }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding:'12px 18px',
                  fontSize:11, fontWeight:500, letterSpacing:'0.8px', textTransform:'uppercase',
                  whiteSpace:'nowrap', background:'none', border:'none',
                  borderBottom: activeTab === tab.id ? '2px solid #00d4ff' : '2px solid transparent',
                  marginBottom:-2,
                  color: activeTab === tab.id ? '#00d4ff' : '#4a6b8a',
                  cursor:'pointer', transition:'all .2s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Contenu des onglets */}
          <div style={{ padding:24, minHeight:420, background:'#0d1e33' }}>
            {activeTab === 'decouverte'  && <TabDecouverte />}
            {activeTab === 'inventaire'  && <TabInventaire />}
            {activeTab === 'performance' && <TabPerformance />}
            {activeTab === 'securite'    && <TabSecurite />}
            {activeTab === 'wifi'        && <TabWifi />}
            {activeTab === 'antivirus'   && <TabAntivirus />}
            {activeTab === 'conformite'  && <TabConformite />}
            {activeTab === 'academy'     && <TabAcademy />}
          </div>
        </div>
      </div>

      {/* Animation pulse CSS globale */}
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
      `}</style>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   TAB : DÉCOUVERTE
═══════════════════════════════════════════════════════════════ */
function TabDecouverte() {
  // Circumférence du cercle SVG (r=54)
  const C = 2 * Math.PI * 54
  const score = 42
  const offset = C - (score / 100) * C

  const barItems = [
    { label:'Réseau',    value:28, color:'#ff3b5c' },
    { label:'Endpoints', value:54, color:'#ffa500' },
    { label:'Identités', value:61, color:'#ffa500' },
    { label:'Données',   value:19, color:'#ff3b5c' },
  ]

  const alerts = [
    { time:"Aujourd'hui 08:42", msg:<>Tentative d&apos;accès non autorisé — <span style={{ color:'#ff3b5c', fontFamily:'monospace', fontSize:12 }}>192.168.1.47</span></>, alertColor:'#ff3b5c', bg:'rgba(255,59,92,.06)',  border:'rgba(255,59,92,.2)' },
    { time:"Aujourd'hui 06:15", msg:<>Certificat SSL expiré — <span style={{ color:'#ffa500', fontFamily:'monospace', fontSize:12 }}>portail-rh.local</span></>,           alertColor:'#ffa500', bg:'rgba(255,165,0,.06)', border:'rgba(255,165,0,.2)' },
    { time:'Hier 22:30',        msg:<>Scan réseau terminé — <span style={{ color:'#00c896' }}>47 équipements cartographiés</span></>,                                       alertColor:'#00c896', bg:'rgba(0,200,150,.06)',  border:'rgba(0,200,150,.2)' },
    { time:'Hier 14:11',        msg:<>Malware détecté — <span style={{ color:'#ff3b5c', fontFamily:'monospace', fontSize:12 }}>WORKSTATION-12</span></>,                    alertColor:'#ff3b5c', bg:'rgba(255,59,92,.06)',  border:'rgba(255,59,92,.2)' },
  ]

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:24 }}>

      {/* Colonne gauche : score anneau */}
      <div>
        <SecLabel>Score global</SecLabel>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'12px 0' }}>
          {/* Anneau SVG — rotate(-90) pour partir à midi */}
          <svg width="130" height="130" viewBox="0 0 130 130" style={{ transform:'rotate(-90deg)', marginBottom:10 }}>
            <circle cx="65" cy="65" r="54" fill="none" stroke="#1e3a5f" strokeWidth="10" />
            <circle
              cx="65" cy="65" r="54" fill="none" stroke="#ffa500" strokeWidth="10"
              strokeDasharray={C.toFixed(1)} strokeDashoffset={offset.toFixed(1)}
              strokeLinecap="round"
            />
            {/* Le texte "42" contourne le rotate en appliquant rotate(90) */}
            <text
              x="65" y="65"
              dominantBaseline="middle" textAnchor="middle"
              fill="#ffa500" fontSize="26" fontWeight="700"
              transform="rotate(90,65,65)"
              style={{ fontFamily:"'Space Grotesk',system-ui,sans-serif" }}
            >
              {score}
            </text>
          </svg>

          <div style={{ fontSize:10, color:'#4a6b8a', letterSpacing:'2px', textTransform:'uppercase' }}>
            Score cyber global
          </div>

          {/* Barres de progression */}
          <div style={{ marginTop:14, width:'100%', display:'flex', flexDirection:'column', gap:10 }}>
            {barItems.map(({ label, value, color }) => (
              <div key={label}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:4 }}>
                  <span style={{ color:'#4a6b8a' }}>{label}</span>
                  <span style={{ color, fontWeight:600 }}>{value}/100</span>
                </div>
                <ProgressBar value={value} color={color} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Colonne droite : alertes */}
      <div>
        <SecLabel>Alertes récentes</SecLabel>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {alerts.map((a, i) => (
            <div key={i} style={{
              display:'flex', gap:12, padding:'11px 14px', borderRadius:10,
              background:a.bg, border:`1px solid ${a.border}`,
            }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:a.alertColor, flexShrink:0, marginTop:5 }} />
              <div>
                <div style={{ fontSize:11, color:'#4a6b8a', marginBottom:3 }}>{a.time}</div>
                <div style={{ fontSize:13, color:'#e8f4ff' }}>{a.msg}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   TAB : INVENTAIRE
═══════════════════════════════════════════════════════════════ */
function TabInventaire() {
  return (
    <>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:22 }}>
        <StatMini label="Postes"   value="23" sub="18 Windows · 5 macOS" />
        <StatMini label="Serveurs" value="8"  sub="3 hors garantie"      color="#ffa500" />
        <StatMini label="Mobiles"  value="16" sub="9 non gérés MDM"      />
      </div>

      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>
              {['Équipement','Adresse IP','Système','Dernière MAJ','Statut'].map(h => (
                <th key={h} style={TH_STYLE}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { name:'WORKSTATION-01', ip:'192.168.1.10', os:'Windows 11',      upd:'2025-05-18', variant:'ok'     as BadgeVariant, label:'OK'       },
              { name:'WORKSTATION-12', ip:'192.168.1.22', os:'Windows 10',      upd:'2024-11-02', variant:'crit'   as BadgeVariant, label:'Compromis' },
              { name:'SRV-PROD-01',    ip:'192.168.0.5',  os:'Ubuntu 22.04',    upd:'2025-04-30', variant:'ok'     as BadgeVariant, label:'OK'       },
              { name:'SRV-BACKUP',     ip:'192.168.0.8',  os:'Win Server 2016', upd:'2023-08-14', variant:'crit'   as BadgeVariant, label:'EOL'      },
              { name:'LAPTOP-DG',      ip:'192.168.1.31', os:'macOS 14',        upd:'2025-05-19', variant:'ok'     as BadgeVariant, label:'OK'       },
              { name:'MOBILE-CEO',     ip:'DHCP',         os:'iOS 17',          upd:'2025-03-01', variant:'warn'   as BadgeVariant, label:'Non MDM'  },
            ].map(row => (
              <tr key={row.name}>
                <td style={{ ...TD_STYLE, fontFamily:'monospace', fontSize:11 }}>{row.name}</td>
                <td style={{ ...TD_STYLE, fontFamily:'monospace', fontSize:11 }}>{row.ip}</td>
                <td style={TD_STYLE}>{row.os}</td>
                <td style={{ ...TD_STYLE, fontFamily:'monospace', fontSize:11 }}>{row.upd}</td>
                <td style={TD_STYLE}><Badge variant={row.variant}>{row.label}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════
   TAB : PERFORMANCE
═══════════════════════════════════════════════════════════════ */
function TabPerformance() {
  return (
    <>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:22 }}>
        <StatMini label="Disponibilité"  value="99.2%" sub="30 derniers jours"      color="#00c896" />
        <StatMini label="Latence moy."   value="48 ms" sub="Seuil critique : 30 ms" color="#ffa500" />
        <StatMini label="Bande passante" value="7.2 Gb" sub="Capacité totale : 10 Gb" />
      </div>

      <SecLabel>Charge des serveurs</SecLabel>

      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>
              {['Serveur','CPU','RAM','Disque','Statut'].map(h => (
                <th key={h} style={TH_STYLE}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { name:'SRV-PROD-01', cpu:'34%', ram:'58%', disk:'41%', variant:'ok'   as BadgeVariant, label:'Nominal'      },
              { name:'SRV-PROD-02', cpu:'87%', ram:'91%', disk:'78%', variant:'crit' as BadgeVariant, label:'Surcharge'    },
              { name:'SRV-BACKUP',  cpu:'12%', ram:'22%', disk:'94%', variant:'warn' as BadgeVariant, label:'Disque plein' },
              { name:'SRV-DMZ',     cpu:'45%', ram:'61%', disk:'33%', variant:'ok'   as BadgeVariant, label:'Nominal'      },
            ].map(row => (
              <tr key={row.name}>
                <td style={{ ...TD_STYLE, fontFamily:'monospace', fontSize:11 }}>{row.name}</td>
                <td style={TD_STYLE}>{row.cpu}</td>
                <td style={TD_STYLE}>{row.ram}</td>
                <td style={TD_STYLE}>{row.disk}</td>
                <td style={TD_STYLE}><Badge variant={row.variant}>{row.label}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════
   TAB : SÉCURITÉ — avec tunnel frustration
═══════════════════════════════════════════════════════════════ */
function TabSecurite() {
  const [unlocked, setUnlocked] = useState(false)
  const [org,      setOrg]      = useState('')
  const [email,    setEmail]    = useState('')
  const [size,     setSize]     = useState('')

  const unlock = () => {
    if (!org || !email || !size) return
    setUnlocked(true)
  }

  const inputStyle: React.CSSProperties = {
    width:'100%', background:'rgba(255,255,255,.05)',
    border:'1px solid #1e3a5f', borderRadius:8,
    padding:'9px 13px', fontSize:13, color:'#e8f4ff', fontFamily:'inherit',
  }

  return (
    <>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:22 }}>
        <StatMini label="Vulnérabilités critiques" value="7"  sub="Action immédiate requise" color="#ff3b5c" />
        <StatMini label="CVE détectés"             value="23" sub="dont 3 zero-day"         color="#ffa500" />
      </div>

      {/* Table floutée — se révèle après déblocage */}
      <div style={{
        overflowX:'auto', marginBottom:16,
        filter: unlocked ? 'none' : 'blur(5px)',
        pointerEvents: unlocked ? 'auto' : 'none',
        transition:'filter .4s',
      }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>
              {['Vulnérabilité','CVE','CVSS','Cible','Priorité'].map(h => (
                <th key={h} style={TH_STYLE}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { name:'RCE OpenSSL',  cve:'CVE-2024-1234',  cvss:'9.8',  target:'SRV-PROD-01'   },
              { name:'Auth Bypass',  cve:'CVE-2024-5678',  cvss:'8.1',  target:'Portail RH'    },
              { name:'SMBv1 exposé', cve:'CVE-2017-0144',  cvss:'9.3',  target:'WORKSTATION-12'},
              { name:'Log4Shell',    cve:'CVE-2021-44228', cvss:'10.0', target:'APP-LEGACY'    },
            ].map(row => (
              <tr key={row.cve}>
                <td style={TD_STYLE}>{row.name}</td>
                <td style={{ ...TD_STYLE, fontFamily:'monospace', color:'#ff3b5c' }}>{row.cve}</td>
                <td style={{ ...TD_STYLE, fontWeight:700, color:'#ff3b5c' }}>{row.cvss}</td>
                <td style={{ ...TD_STYLE, fontFamily:'monospace', fontSize:11 }}>{row.target}</td>
                <td style={TD_STYLE}><Badge variant="crit">Critique</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Gate de déblocage */}
      {!unlocked ? (
        <div style={{ borderRadius:12, padding:20, border:'1px solid rgba(0,212,255,.3)', background:'rgba(0,212,255,.04)' }}>
          <div style={{ display:'flex', gap:12, marginBottom:16 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2" style={{ flexShrink:0, marginTop:2 }}>
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <div>
              <div style={{ fontWeight:600, color:'#e8f4ff', fontSize:14, marginBottom:4 }}>
                Rapport de vulnérabilités verrouillé
              </div>
              <div style={{ fontSize:12, color:'#4a6b8a', lineHeight:1.6 }}>
                Vos{' '}
                <span style={{ color:'#ff3b5c', fontWeight:600 }}>7 vulnérabilités critiques</span>
                {' '}et le plan de remédiation complet sont disponibles. Débloquez l&apos;accès en renseignant votre organisation.
              </div>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16 }}>
            <div>
              <label style={{ display:'block', fontSize:11, color:'#4a6b8a', textTransform:'uppercase', letterSpacing:'1px', marginBottom:6 }}>
                Organisation
              </label>
              <input
                type="text" placeholder="Nom de votre entreprise"
                value={org} onChange={e => setOrg(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display:'block', fontSize:11, color:'#4a6b8a', textTransform:'uppercase', letterSpacing:'1px', marginBottom:6 }}>
                Email professionnel
              </label>
              <input
                type="email" placeholder="contact@entreprise.com"
                value={email} onChange={e => setEmail(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display:'block', fontSize:11, color:'#4a6b8a', textTransform:'uppercase', letterSpacing:'1px', marginBottom:6 }}>
                Taille de l&apos;équipe
              </label>
              <select
                value={size} onChange={e => setSize(e.target.value)}
                style={{ ...inputStyle, background:'#07111f' }}
              >
                <option value="">Sélectionner...</option>
                <option>1 – 10 personnes</option>
                <option>11 – 50 personnes</option>
                <option>51 – 200 personnes</option>
                <option>200+ personnes</option>
              </select>
            </div>
          </div>

          <button
            onClick={unlock}
            style={{
              padding:'9px 20px', borderRadius:9, fontSize:13, fontWeight:700,
              background:'linear-gradient(135deg,#00d4ff,#00a8cc)',
              color:'#07111f', border:'none', cursor:'pointer',
            }}
          >
            Débloquer le rapport complet
          </button>
        </div>
      ) : (
        <div style={{
          borderRadius:12, padding:16,
          border:'1px solid rgba(0,200,150,.3)', background:'rgba(0,200,150,.06)',
          display:'flex', alignItems:'center', gap:12,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00c896" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><path d="M8 12l3 3 5-5" />
          </svg>
          <div>
            <div style={{ fontWeight:600, color:'#00c896', fontSize:13 }}>Accès débloqué</div>
            <div style={{ fontSize:12, color:'#4a6b8a', marginTop:2 }}>
              Votre rapport complet a été envoyé. Un expert E DEFENCE vous contactera sous 24h.
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════
   TAB : AUDIT WIFI
═══════════════════════════════════════════════════════════════ */
function TabWifi() {
  const networks = [
    { ssid:'CORP-NET-5G',          mac:'AA:BB:CC:11:22:33 · WPA3 · Canal 36', accentColor:'#00d4ff', signalBars:4, variant:'ok'   as BadgeVariant, label:'Autorisé',     border:'#1e3a5f',              bg:'rgba(255,255,255,.02)' },
    { ssid:'CORP-NET-5G (copie)',   mac:'FF:EE:DD:99:88:77 · WPA2 · Canal 36', accentColor:'#ff3b5c', signalBars:4, variant:'crit' as BadgeVariant, label:'Evil Twin',    border:'rgba(255,59,92,.3)',   bg:'rgba(255,59,92,.04)'  },
    { ssid:'FREEWIFI-BUREAU',       mac:'11:22:33:44:55:00 · Ouvert · Canal 1', accentColor:'#ffa500', signalBars:1, variant:'warn' as BadgeVariant, label:'Non sécurisé', border:'#1e3a5f',              bg:'rgba(255,255,255,.02)' },
  ]

  return (
    <>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:22 }}>
        <StatMini label="Réseaux autorisés" value="5" color="#00c896" />
        <StatMini label="Réseaux suspects"  value="2" sub="Evil Twin détecté" color="#ff3b5c" />
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {networks.map(n => (
          <div key={n.ssid} style={{
            display:'flex', alignItems:'center', gap:14,
            padding:'11px 14px', borderRadius:12,
            background:n.bg, border:`1px solid ${n.border}`,
          }}>
            {/* Icône WiFi */}
            <div style={{
              width:36, height:36, borderRadius:9, flexShrink:0,
              background:`${n.accentColor}1a`,
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={n.accentColor} strokeWidth="2">
                <path d="M5 12.55a11 11 0 0114.08 0" />
                <path d="M1.42 9a16 16 0 0121.16 0" />
                <path d="M8.53 16.11a6 6 0 016.95 0" />
                <circle cx="12" cy="20" r="1" fill={n.accentColor} />
              </svg>
            </div>

            {/* Infos réseau */}
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:500, color: n.accentColor === '#ff3b5c' ? '#ff3b5c' : '#e8f4ff' }}>
                {n.ssid}
              </div>
              <div style={{ fontSize:11, color:'#4a6b8a', fontFamily:'monospace', marginTop:2 }}>
                {n.mac}
              </div>
            </div>

            {/* Barres de signal */}
            <div style={{ display:'flex', gap:2, alignItems:'flex-end' }}>
              {[6, 10, 14, 18].map((h, i) => (
                <div key={i} style={{
                  width:5, borderRadius:2, height:h,
                  background: i < n.signalBars ? n.accentColor : '#1e3a5f',
                }} />
              ))}
            </div>

            <Badge variant={n.variant}>{n.label}</Badge>
          </div>
        ))}
      </div>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════
   TAB : ANTIVIRUS
═══════════════════════════════════════════════════════════════ */
function TabAntivirus() {
  return (
    <>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:22 }}>
        <StatMini label="Protégés"        value="34"  sub="sur 47 équipements" color="#00c896" />
        <StatMini label="Non protégés"    value="13"  sub="Action requise"     color="#ff3b5c" />
        <StatMini label="Menaces bloquées"value="189" sub="Ce mois-ci"         color="#ffa500" />
      </div>

      <SecLabel>Détections récentes</SecLabel>

      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>
              {['Menace','Machine','Type','Action','Date'].map(h => (
                <th key={h} style={TH_STYLE}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { name:'Trojan.Win32.Agent', machine:'WORKSTATION-12', type:'Trojan',     variant:'crit' as BadgeVariant, label:'Quarantaine', date:'21/05/26' },
              { name:'Ransom.WannaCry',    machine:'LAPTOP-07',      type:'Ransomware', variant:'ok'   as BadgeVariant, label:'Bloqué',      date:'20/05/26' },
              { name:'PUP.Optional.Tool',  machine:'WORKSTATION-05', type:'PUP',        variant:'warn' as BadgeVariant, label:'Ignoré',      date:'19/05/26' },
              { name:'Spyware.Keylogger',  machine:'SRV-PROD-02',    type:'Spyware',    variant:'ok'   as BadgeVariant, label:'Supprimé',    date:'18/05/26' },
            ].map(row => (
              <tr key={row.name}>
                <td style={TD_STYLE}>{row.name}</td>
                <td style={{ ...TD_STYLE, fontFamily:'monospace', fontSize:11 }}>{row.machine}</td>
                <td style={TD_STYLE}>{row.type}</td>
                <td style={TD_STYLE}><Badge variant={row.variant}>{row.label}</Badge></td>
                <td style={{ ...TD_STYLE, fontFamily:'monospace', fontSize:11 }}>{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════
   TAB : HUB CONFORMITÉ
═══════════════════════════════════════════════════════════════ */
function TabConformite() {
  const scores = [
    { label:'RGPD',      value:67, color:'#ffa500' },
    { label:'ISO 27001', value:41, color:'#ff3b5c' },
    { label:'NIS2',      value:58, color:'#ffa500' },
  ]

  const items = [
    { icon:'✓', title:'Registre des traitements RGPD',       ref:'Art. 30 RGPD',          variant:'ok'   as BadgeVariant, label:'Conforme',      iconBg:'rgba(0,200,150,.15)', iconColor:'#00c896' },
    { icon:'✗', title:'Politique de mots de passe renforcée',ref:'ISO 27001 — A.9.4',     variant:'crit' as BadgeVariant, label:'Non conforme',  iconBg:'rgba(255,59,92,.15)', iconColor:'#ff3b5c' },
    { icon:'!', title:"Plan de continuité d'activité (PCA)", ref:'NIS2 — Art. 21',         variant:'warn' as BadgeVariant, label:'En cours',      iconBg:'rgba(255,165,0,.15)', iconColor:'#ffa500' },
    { icon:'✗', title:'Chiffrement des données au repos',    ref:'ISO 27001 — A.10',       variant:'crit' as BadgeVariant, label:'Non conforme',  iconBg:'rgba(255,59,92,.15)', iconColor:'#ff3b5c' },
    { icon:'✓', title:'Procédure de notification violation', ref:'Art. 33 RGPD · délai 72h',variant:'ok'  as BadgeVariant, label:'Conforme',      iconBg:'rgba(0,200,150,.15)', iconColor:'#00c896' },
  ]

  return (
    <>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:22 }}>
        {scores.map(s => (
          <div key={s.label} style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(0,212,255,.1)', borderRadius:12, padding:16 }}>
            <div style={{ fontSize:10, color:'#4a6b8a', textTransform:'uppercase', letterSpacing:'1px', marginBottom:8 }}>{s.label}</div>
            <div style={{ fontFamily:"'Space Grotesk',system-ui,sans-serif", fontSize:30, fontWeight:700, color:s.color, marginBottom:8 }}>{s.value}%</div>
            <ProgressBar value={s.value} color={s.color} />
          </div>
        ))}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {items.map(item => (
          <div key={item.title} style={{
            display:'flex', alignItems:'center', gap:12,
            padding:'11px 14px', borderRadius:10,
            background:'rgba(255,255,255,.02)', border:'1px solid #1e3a5f',
          }}>
            <div style={{
              width:28, height:28, borderRadius:'50%', flexShrink:0,
              background:item.iconBg, color:item.iconColor,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:11, fontWeight:700,
            }}>
              {item.icon}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, color:'#e8f4ff' }}>{item.title}</div>
              <div style={{ fontSize:11, color:'#4a6b8a', marginTop:2 }}>{item.ref}</div>
            </div>
            <Badge variant={item.variant}>{item.label}</Badge>
          </div>
        ))}
      </div>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════
   TAB : CYBER-ACADEMY
═══════════════════════════════════════════════════════════════ */
function TabAcademy() {
  const courses = [
    { level:'Niveau 1 · 45 min',   title:'Phishing & ingénierie sociale',     progress:100, variant:'ok'     as BadgeVariant, label:'Terminé',    color:'#00c896', locked:false },
    { level:'Niveau 1 · 30 min',   title:'Mots de passe et authentification MFA', progress:60,  variant:'warn'   as BadgeVariant, label:'En cours',   color:'#ffa500', locked:false },
    { level:'Niveau 2 · 1h15',     title:'Ransomware — réflexes essentiels', progress:0,   variant:'info'   as BadgeVariant, label:'Disponible', color:'#00d4ff', locked:false },
    { level:'Niveau 2 · 1h',       title:'Sécurité des postes de travail',   progress:0,   variant:'info'   as BadgeVariant, label:'Disponible', color:'#00d4ff', locked:false },
    { level:'Niveau 3 · 2h',       title:'RGPD pour les équipes',            progress:0,   variant:'info'   as BadgeVariant, label:'Disponible', color:'#00d4ff', locked:false },
    { level:'Certification · 8h',  title:'Cyber-Analyste E DEFENCE',         progress:0,   variant:'locked' as BadgeVariant, label:'Verrouillé', color:'#1e3a5f', locked:true  },
  ]

  return (
    <>
      <SecLabel>Formations disponibles</SecLabel>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
        {courses.map(c => (
          <div key={c.title} style={{
            borderRadius:14, padding:16,
            background:'rgba(255,255,255,.02)',
            border:'1px solid #1e3a5f',
            opacity: c.locked ? 0.6 : 1,
            transition:'border-color .25s, transform .25s',
          }}>
            {/* En-tête niveau + badge */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
              <div style={{ fontSize:10, color:'#4a6b8a' }}>{c.level}</div>
              <Badge variant={c.variant}>{c.label}</Badge>
            </div>

            {/* Titre formation */}
            <div style={{ fontSize:13, fontWeight:600, color:'#e8f4ff', marginBottom:14, lineHeight:1.4 }}>
              {c.title}
            </div>

            {/* Barre de progression */}
            <ProgressBar value={c.progress} color={c.color} />
            <div style={{ fontSize:11, color:'#4a6b8a', marginTop:6 }}>
              {c.progress === 100
                ? '100% complété'
                : c.progress > 0
                  ? `${c.progress}% complété`
                  : c.locked
                    ? 'Prérequis requis'
                    : 'Non commencé'}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}