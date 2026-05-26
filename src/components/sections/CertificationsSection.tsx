'use client'

interface CertificationsSectionProps {
  onOpenModal: (type: 'login' | 'signup') => void
}

const CERTIFS = [
  {
    title: 'Introduction Cybersécurité',
    subtitle: 'Badge E DEFENCE officiel',
    iconBg: 'rgba(0,188,212,.15)',
    borderColor: 'rgba(0,188,212,.35)',
    color: '#00d4ff',
    icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  },
  {
    title: 'Conformité RGPD',
    subtitle: 'Accréditation entreprise',
    iconBg: 'rgba(0,200,150,.15)',
    borderColor: 'rgba(0,200,150,.35)',
    color: '#00c896',
    icon: (
      <>
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </>
    ),
  },
  {
    title: 'Audit Réseau',
    subtitle: 'Certification technique',
    iconBg: 'rgba(255,165,0,.15)',
    borderColor: 'rgba(255,165,0,.35)',
    color: '#ffa500',
    icon: <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />,
  },
  {
    title: 'Ethical Hacker',
    subtitle: 'Niveau avancé',
    iconBg: 'rgba(255,59,92,.15)',
    borderColor: 'rgba(255,59,92,.35)',
    color: '#ff3b5c',
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" />
      </>
    ),
  },
]

const CHECK_ITEMS = [
  'Badges numériques vérifiables',
  'Partageables LinkedIn, CV, e-mail',
  'Préparation CCST, CyberOps Cisco',
  'Reconnus dans 190 pays',
]

export default function CertificationsSection({ onOpenModal }: CertificationsSectionProps) {
  return (
    <section
      id="certifications"
      className="py-20"
      style={{ background: 'rgba(0,212,255,.02)', borderTop: '1px solid rgba(0,212,255,.06)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── Ligne unique : gauche + droite ── */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '4px', flexWrap: 'wrap' }}>

          {/* ── Gauche ── */}
          <div style={{ flex: '1 1 320px', minWidth: '230px' }}>
            <div
              className="inline-block text-xs font-semibold tracking-widest px-3 py-1.5 rounded-full mb-5"
              style={{ background: 'rgba(255,165,0,.08)', border: '1px solid rgba(255,165,0,.35)', color: '#ffa500' }}
            >
              CERTIFICATIONS
            </div>

            <h2 className="font-display font-bold text-4xl text-white mb-4">
              Des accréditations reconnues{' '}
              <span className="g-text-warm">à l&apos;international</span>
            </h2>

            <p className="text-ed-muted text-base mb-6 leading-relaxed">
              Obtenez des certifications E-DEFENCE et des badges numériques validés,<br />
              partageables sur LinkedIn et vérifiables par vos recruteurs.
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {CHECK_ITEMS.map((item) => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#4a6b8a' }}>
                  <span style={{
                    width: '20px', height: '20px', borderRadius: '4px',
                    background: 'rgba(0,200,150,.15)', color: '#00c896',
                    fontSize: '11px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0,
                  }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <button
              onClick={() => onOpenModal('signup')}
              className="btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, color: '#07111f' }}
            >
              Obtenir ma certification
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* ── Droite : 4 cartes 2×2 ── */}
          <div style={{
            flex: '0 0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(180px, 220px))',
            gap: '12px',
          }}>
            {CERTIFS.map((c) => (
              <div
                key={c.title}
                style={{
                  background: 'rgba(13,30,51,.8)',
                  border: '1px solid rgba(255,255,255,.07)',
                  borderRadius: '16px',
                  padding: '20px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'border-color .2s, transform .2s',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.borderColor = c.borderColor
                  el.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.borderColor = 'rgba(255,255,255,.07)'
                  el.style.transform = 'translateY(0)'
                }}
              >
                {/* Icône */}
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: c.iconBg, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  marginBottom: '12px', flexShrink: 0,
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c.color} strokeWidth="2">
                    {c.icon}
                  </svg>
                </div>

                {/* Titre */}
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#e8f4ff', marginBottom: '6px' }}>
                  {c.title}
                </div>

                {/* Sous-titre */}
                <div style={{ fontSize: '18px', color: '#4a6b8a' }}>
                  {c.subtitle}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}