'use client'

const FEATURES = [
  {
    title: 'Audit automatisé',
    description: 'Analyse complète de votre parc informatique, de votre réseau et de vos configurations en quelques minutes.',
    iconBg: 'rgba(0,188,212,.15)',
    iconBorder: '1px solid rgba(0,188,212,.2)',
    color: '#00d4ff',
    icon: (<><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></>),
  },
  {
    title: 'Score de sécurité',
    description: "Un score global clair avec des axes d'amélioration priorisés pour guider vos actions correctrices.",
    iconBg: 'rgba(0,200,150,.15)',
    iconBorder: '1px solid rgba(0,200,150,.2)',
    color: '#00c896',
    icon: (<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>),
  },
  {
    title: 'Alertes en temps réel',
    description: 'Détection et notification immédiate de toute activité suspecte sur votre infrastructure.',
    iconBg: 'rgba(255,165,0,.15)',
    iconBorder: '1px solid rgba(255,165,0,.2)',
    color: '#ffa500',
    icon: (<><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>),
  },
  {
    title: 'Rapports de conformité',
    description: 'Vérification automatique de votre conformité RGPD, ISO 27001 et NIS2 avec recommandations détaillées.',
    iconBg: 'rgba(0,188,212,.15)',
    iconBorder: '1px solid rgba(0,188,212,.2)',
    color: '#00d4ff',
    icon: (<><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/></>),
  },
  {
    title: 'Formation des équipes',
    description: "Modules de sensibilisation intégrés pour former l'ensemble de votre organisation aux bonnes pratiques.",
    iconBg: 'rgba(0,200,150,.15)',
    iconBorder: '1px solid rgba(0,200,150,.2)',
    color: '#00c896',
    icon: (<><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></>),
  },
  {
    title: 'Gestion des incidents',
    description: 'Procédures de réponse guidées pour contenir et résoudre les incidents de sécurité efficacement.',
    iconBg: 'rgba(255,59,92,.15)',
    iconBorder: '1px solid rgba(255,59,92,.2)',
    color: '#ff3b5c',
    icon: (<><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></>),
  },
]

export default function FeaturesSection() {
  return (
    <section
      id="features"
      style={{
        padding: '80px 0',
        background: 'rgba(0,212,255,.02)',
        borderTop: '1px solid rgba(0,212,255,.06)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'inline-block',
            fontSize: '11px', fontWeight: 600,
            letterSpacing: '2px', textTransform: 'uppercase',
            padding: '6px 14px', borderRadius: '999px',
            marginBottom: '16px',
            background: 'rgba(0,200,150,.08)',
            border: '1px solid rgba(0,200,150,.35)',
            color: '#00c896',
          }}>
            FONCTIONNALITÉS
          </div>

          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(1.8rem,4vw,2.6rem)',
            fontWeight: 700,
            color: '#e8f4ff',
            marginBottom: '12px',
            lineHeight: 1.15,
          }}>
            Tout ce dont vous avez besoin
          </h2>

          <p style={{
            fontSize: '14px',
            color: '#4a6b8a',
            maxWidth: '520px',
            margin: '0 auto',
            lineHeight: 1.75,
          }}>
            Une plateforme conçue pour les équipes IT et les dirigeants qui veulent
            maîtriser leur sécurité sans complexité.
          </p>
        </div>

        {/* ── Grille 3×2 ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
        }}>
          {FEATURES.map((f) => (
            <div
              key={f.title}
              style={{
                /* fond bleu nuit opaque */
                background: 'rgba(10,22,40,.85)',
                border: '1px solid rgba(255,255,255,.07)',
                borderRadius: '16px',
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0',
                transition: 'border-color .2s, transform .2s',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = f.iconBorder.replace('1px solid ', '')
                el.style.transform = 'translateY(-3px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = 'rgba(255,255,255,.07)'
                el.style.transform = 'translateY(0)'
              }}
            >
              {/* Icône — carré arrondi en haut à gauche */}
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: f.iconBg,
                border: f.iconBorder,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                flexShrink: 0,
              }}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={f.color}
                  strokeWidth="1.8"
                >
                  {f.icon}
                </svg>
              </div>

              {/* Titre */}
              <div style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#e8f4ff',
                marginBottom: '10px',
                fontFamily: 'Space Grotesk, sans-serif',
              }}>
                {f.title}
              </div>

              {/* Description */}
              <p style={{
                fontSize: '13px',
                color: '#4a6b8a',
                lineHeight: 1.75,
                margin: 0,
              }}>
                {f.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}