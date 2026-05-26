'use client'

const SECTIONS = [
  {
    title: 'Portail',
    links: [
      { href: '#portail', label: 'Découverte' },
      { href: '#portail', label: 'Inventaire' },
      { href: '#portail', label: 'Sécurité' },
      { href: '#portail', label: 'Conformité' },
    ],
  },
  {
    title: 'Ressources',
    links: [
      { href: '#parcours',        label: 'Parcours guidés' },
      { href: '#certifications',  label: 'Certifications' },
      { href: '#features',        label: 'Fonctionnalités' },
      { href: '#contact',         label: 'Support' },
    ],
  },
  {
    title: 'Légal',
    links: [
      { href: '#', label: "Conditions d'utilisation" },
      { href: '#', label: 'Politique de confidentialité' },
      { href: '#', label: 'Mentions légales' },
    ],
  },
]

export default function Footer() {
  return (
    <footer style={{
      background: '#03070f',          /* fond ultra sombre */
      borderTop: '1px solid rgba(0,212,255,.06)',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '56px 40px 0',
      }}>

        {/* ── Ligne principale : logo + 3 colonnes ── */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '40px',
          marginBottom: '48px',
          flexWrap: 'wrap',
        }}>

          {/* Logo + description */}
          <div style={{ minWidth: '220px', maxWidth: '260px' }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '32px', height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #00bcd4, #009688)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <span style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700, fontSize: '17px',
                color: 'white',
              }}>
                E<span style={{ color: '#00d4ff' }}>DEFENCE</span>
              </span>
            </div>

            {/* Description */}
            <p style={{
              fontSize: '13px',
              color: '#4a6b8a',
              lineHeight: 1.75,
            }}>
              Portail de cybersécurité d&apos;entreprise. Auditez, sécurisez, conformez.
            </p>
          </div>

          {/* 3 colonnes de liens */}
          {SECTIONS.map((section) => (
            <div key={section.title} style={{ minWidth: '160px' }}>
              {/* Titre colonne — uppercase gras blanc*/}
              <div style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#e8f4ff',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                marginBottom: '20px',
              }}>
                {section.title}
              </div>

              {/* Liens */}
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {section.links.map(({ href, label }) => (
                  <li key={label}>
                    <a
                      href={href}
                      style={{
                        fontSize: '14px',
                        color: '#8aaac8',      /* couleur exacte des liens */
                        textDecoration: 'none',
                        transition: 'color .18s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#e8f4ff')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#8aaac8')}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Barre du bas ── */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,.05)',
          padding: '20px 0 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
        }}>
          <p style={{ fontSize: '13px', color: '#4a6b8a', margin: 0 }}>
            © 2026 E DEFENCE — Portail de cybersécurité d&apos;entreprise
          </p>
          <p style={{ fontSize: '13px', color: '#4a6b8a', margin: 0 }}>
            Portail E DEFENCE — Service sécurisé
          </p>
        </div>

      </div>
    </footer>
  )
}