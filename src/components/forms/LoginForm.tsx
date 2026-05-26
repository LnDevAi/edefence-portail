'use client'

interface LoginFormProps {
  onSwitch: () => void
  onClose: () => void
}

export default function LoginForm({ onSwitch, onClose }: LoginFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onClose()
    // TODO : intégrer l'appel API auth
  }

  return (
    <div style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>

      {/* Titre */}
      <h2 style={{
        fontSize: '26px',
        fontWeight: 800,
        color: '#ffffff',
        marginBottom: '6px',
        letterSpacing: '-0.3px',
      }}>
        Bon retour
      </h2>

      {/* Sous-titre */}
      <p style={{
        fontSize: '14px',
        color: '#7a9bbf',
        marginBottom: '28px',
        fontWeight: 400,
      }}>
        Connectez-vous à votre espace E&#8209;DEFENCE
      </p>

      <form onSubmit={handleSubmit}>

        {/* Email */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
            color: '#7a9bbf',
            marginBottom: '8px',
          }}>
            Email
          </label>
          <input
            type="email"
            placeholder="contact@entreprise.com"
            required
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(0,212,255,0.15)',
              borderRadius: '10px',
              padding: '12px 16px',
              fontSize: '14px',
              color: '#e8f4ff',
              fontFamily: 'inherit',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s, background 0.2s',
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = 'rgba(0,212,255,0.5)'
              e.currentTarget.style.background = 'rgba(0,212,255,0.04)'
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = 'rgba(0,212,255,0.15)'
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
            }}
          />
        </div>

        {/* Mot de passe */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
            color: '#7a9bbf',
            marginBottom: '8px',
          }}>
            Mot de passe
          </label>
          <input
            type="password"
            placeholder="••••••••"
            required
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(0,212,255,0.15)',
              borderRadius: '10px',
              padding: '12px 16px',
              fontSize: '14px',
              color: '#e8f4ff',
              fontFamily: 'inherit',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s, background 0.2s',
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = 'rgba(0,212,255,0.5)'
              e.currentTarget.style.background = 'rgba(0,212,255,0.04)'
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = 'rgba(0,212,255,0.15)'
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
            }}
          />
        </div>

        {/* Bouton */}
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '14px',
            background: 'linear-gradient(135deg, #00d4ff, #00a8cc)',
            border: 'none',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: 700,
            color: '#07111f',
            cursor: 'pointer',
            fontFamily: 'inherit',
            letterSpacing: '0.2px',
            transition: 'opacity 0.2s, transform 0.1s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.98)')}
          onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          Se connecter
        </button>

      </form>

      {/* Switch */}
      <p style={{
        textAlign: 'center',
        fontSize: '13px',
        color: '#7a9bbf',
        marginTop: '20px',
      }}>
        Pas de compte ?{' '}
        <button
          onClick={onSwitch}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#00d4ff',
            fontSize: '13px',
            fontFamily: 'inherit',
            fontWeight: 600,
            padding: 0,
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
          }}
        >
          Créer un accès gratuit
        </button>
      </p>
    </div>
  )
}
