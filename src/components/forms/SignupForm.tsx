'use client'

interface SignupFormProps {
  onSwitch: () => void
  onClose: () => void
}

const inputStyle: React.CSSProperties = {
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
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '1.2px',
  textTransform: 'uppercase',
  color: '#7a9bbf',
  marginBottom: '8px',
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  )
}

export default function SignupForm({ onSwitch, onClose }: SignupFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onClose()
    // TODO : intégrer l'appel API inscription
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = 'rgba(0,212,255,0.5)'
    e.currentTarget.style.background = 'rgba(0,212,255,0.04)'
  }
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = 'rgba(0,212,255,0.15)'
    e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
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
        Accès gratuit
      </h2>

      {/* Sous-titre */}
      <p style={{
        fontSize: '14px',
        color: '#7a9bbf',
        marginBottom: '28px',
        fontWeight: 400,
      }}>
        Créez votre compte et démarrez votre audit
      </p>

      <form onSubmit={handleSubmit}>

        {/* Prénom + Nom */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>Prénom</label>
            <input type="text" required style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
          </div>
          <div>
            <label style={labelStyle}>Nom</label>
            <input type="text" required style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
          </div>
        </div>

        {/* Email */}
        <Field label="Email professionnel">
          <input
            type="email"
            placeholder="contact@entreprise.com"
            required
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </Field>

        {/* Organisation */}
        <Field label="Organisation">
          <input
            type="text"
            placeholder="Nom de votre entreprise"
            required
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </Field>

        {/* Mot de passe */}
        <Field label="Mot de passe">
          <input
            type="password"
            placeholder="8 caractères minimum"
            required
            minLength={8}
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </Field>

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
            marginTop: '4px',
            transition: 'opacity 0.2s, transform 0.1s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.98)')}
          onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          Créer mon compte gratuit
        </button>

      </form>

      {/* Switch */}
      <p style={{
        textAlign: 'center',
        fontSize: '13px',
        color: '#7a9bbf',
        marginTop: '20px',
      }}>
        Déjà un compte ?{' '}
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
          Se connecter
        </button>
      </p>
    </div>
  )
}
