'use client'

export default function ParcoursSection() {
  const parcours = [
    {
      level: 'DÉCOUVERTE',
      title: 'Audit initial',
      description: 'Cartographiez votre parc, obtenez votre score et identifiez vos vulnérabilités prioritaires.',
      iconBg: 'rgba(0,188,212,.15)',
      iconBorder: '1px solid rgba(0,188,212,.25)',
      color: '#00d4ff',
      featured: false,
      icon: (
        <>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4l3 3" />
        </>
      ),
      items: ['Inventaire automatique', 'Score de sécurité initial', 'Rapport de vulnérabilités'],
    },
    {
      level: 'PROTECTION',
      title: 'Sécurisation active',
      description: 'Corrigez vos failles, formez vos équipes et atteignez la conformité réglementaire.',
      iconBg: 'rgba(0,200,150,.15)',
      iconBorder: '1px solid rgba(0,200,150,.25)',
      color: '#00c896',
      featured: true,
      badge: 'Le plus choisi',
      icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
      items: ['Plan de remédiation guidé', 'Formations sensibilisation', 'Suivi RGPD / NIS2 / ISO 27001'],
    },
    {
      level: 'MAÎTRISE',
      title: 'Cyber-résilience',
      description: "Anticipez les menaces, répondez aux incidents et maintenez un niveau d'excellence durable.",
      iconBg: 'rgba(255,165,0,.15)',
      iconBorder: '1px solid rgba(255,165,0,.25)',
      color: '#ffa500',
      featured: false,
      icon: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
      items: ["Simulation d'attaques", 'Red team & pentest guidé', 'Certification E DEFENCE'],
    },
  ]

  return (
    <section id="parcours" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'inline-block',
            fontSize: '11px', fontWeight: 600,
            letterSpacing: '2px', textTransform: 'uppercase',
            padding: '6px 14px', borderRadius: '999px',
            marginBottom: '16px',
            background: 'rgba(0,212,255,.08)',
            border: '1px solid rgba(0,212,255,.35)',
            color: '#00d4ff',
          }}>
            PARCOURS GUIDÉS
          </div>

          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(1.8rem,4vw,2.5rem)',
            fontWeight: 700, color: '#e8f4ff',
            marginBottom: '12px', lineHeight: 1.2,
          }}>
            De la découverte à l&apos;expertise
          </h2>

          <p style={{ fontSize: '14px', color: '#4a6b8a', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
            Trois niveaux d&apos;accompagnement pour sécuriser votre organisation progressivement.
          </p>
        </div>

        {/* Cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
          {parcours.map((item) => (
            <div
              key={item.title}
              style={{
                /* fond bleu nuit opaque */
                background: 'rgba(10,22,40,.9)',
                border: item.featured
                  ? '2px solid rgba(0,188,212,.6)'   /* bordure cyan épaisse sur la carte du milieu */
                  : '1px solid rgba(255,255,255,.08)',
                borderRadius: '16px',
                padding: '5px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0',
                transition: 'transform .2s, border-color .2s',
                position: 'relative',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}
            >
              {/* Badge "Le plus choisi" — en haut, avant l'icône */}
              {item.featured && (
                <div style={{
                  display: 'inline-block',
                  fontSize: '11px', fontWeight: 600,
                  padding: '4px 10px', borderRadius: '6px',
                  marginBottom: '16px',
                  background: 'rgba(0,200,150,.15)',
                  border: '1px solid rgba(0,200,150,.4)',
                  color: '#00c896',
                  width: 'fit-content',
                }}>
                  {item.badge}
                </div>
              )}

              {/* Icône */}
              <div style={{
                width: '44px', height: '44px',
                borderRadius: '12px',
                background: item.iconBg,
                border: item.iconBorder,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '20px', flexShrink: 0,
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2">
                  {item.icon}
                </svg>
              </div>

              {/* Niveau */}
              <div style={{
                fontSize: '10px', fontWeight: 600,
                letterSpacing: '2px', textTransform: 'uppercase',
                color: '#4a6b8a', marginBottom: '8px',
              }}>
                {item.level}
              </div>

              {/* Titre */}
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '22px', fontWeight: 700,
                color: '#e8f4ff', marginBottom: '12px',
              }}>
                {item.title}
              </div>

              {/* Description */}
              <p style={{
                fontSize: '13px', color: '#4a6b8a',
                lineHeight: 1.7, marginBottom: '20px',
              }}>
                {item.description}
              </p>

              {/* Liste des features */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {item.items.map((feature) => (
                  <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* Check icon */}
                    <div style={{
                      width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0,
                      background: 'rgba(0,200,150,.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#00c896" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span style={{ fontSize: '13px', color: '#4a6b8a' }}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}