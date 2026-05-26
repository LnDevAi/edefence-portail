'use client'

import { useState } from 'react'

/* ── Styles partagés pour tous les inputs ── */
const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#0d1a2d',
  border: '1px solid #1a2f4a',
  borderRadius: '10px',
  padding: '14px 16px',
  fontSize: '14px',
  color: '#e8f4ff',
  fontFamily: 'inherit',
  outline: 'none',
  transition: 'border-color .2s',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 600,
  color: '#4a6b8a',
  textTransform: 'uppercase',
  letterSpacing: '1.5px',
  marginBottom: '5px',
}

export default function ContactSection() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.currentTarget.reset()
    setSent(true)
    setTimeout(() => setSent(false), 5000)
  }

  return (
    <section
      id="contact"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        background: '#07111f',
      }}
    >
      <div style={{ width: '90%', maxWidth: '550px' }}>

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: '2px' }}>
          <div style={{
            display: 'inline-block',
            fontSize: '11px', fontWeight: 600,
            letterSpacing: '2px', textTransform: 'uppercase',
            padding: '6px 16px', borderRadius: '999px',
            marginBottom: '4px',
            background: 'rgba(0,188,212,.1)',
            border: '1px solid rgba(0,188,212,.35)',
            color: '#00d4ff',
          }}>
            CONTACT
          </div>

          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
            fontWeight: 700,
            color: '#e8f4ff',
            marginBottom: '12px',
            lineHeight: 1.2,
          }}>
            Parlons de votre sécurité
          </h2>

          <p style={{ fontSize: '14px', color: '#4a6b8a', lineHeight: 1.7 }}>
            Notre équipe d&apos;experts vous répond sous 24 heures ouvrées.
          </p>
        </div>

        {/* ── Formulaire ── */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Prénom + Nom côte à côte */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Prénom</label>
              <input
                type="text"
                placeholder="Votre prénom"
                required
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = '#00d4ff')}
                onBlur={e  => (e.currentTarget.style.borderColor = '#1a2f4a')}
              />
            </div>
            <div>
              <label style={labelStyle}>Nom</label>
              <input
                type="text"
                placeholder="Votre nom"
                required
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = '#00d4ff')}
                onBlur={e  => (e.currentTarget.style.borderColor = '#1a2f4a')}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={labelStyle}>Email professionnel</label>
            <input
              type="email"
              placeholder="contact@entreprise.com"
              required
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = '#00d4ff')}
              onBlur={e  => (e.currentTarget.style.borderColor = '#1a2f4a')}
            />
          </div>

          {/* Organisation */}
          <div>
            <label style={labelStyle}>Organisation</label>
            <input
              type="text"
              placeholder="Nom de votre entreprise"
              required
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = '#00d4ff')}
              onBlur={e  => (e.currentTarget.style.borderColor = '#1a2f4a')}
            />
          </div>

          {/* Message */}
          <div>
            <label style={labelStyle}>Message</label>
            <textarea
              placeholder="Décrivez votre besoin..."
              rows={5}
              required
              style={{
                ...inputStyle,
                resize: 'none',
                lineHeight: 1.7,
              }}
              onFocus={e => (e.currentTarget.style.borderColor = '#00d4ff')}
              onBlur={e  => (e.currentTarget.style.borderColor = '#1a2f4a')}
            />
          </div>

          {/* Bouton — cyan plein, large, arrondi*/}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: 600,
              color: '#03070f',
              background: '#00d4ff',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              letterSpacing: '.2px',
              transition: 'opacity .18s, transform .1s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '.88' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
            onMouseDown={e  => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(.99)' }}
            onMouseUp={e    => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
          >
            Envoyer le message
          </button>

          {/* Confirmation */}
          {sent && (
            <div style={{
              padding: '14px 18px',
              borderRadius: '10px',
              fontSize: '13px',
              background: 'rgba(0,200,150,.08)',
              border: '1px solid rgba(0,200,150,.3)',
              color: '#00c896',
              textAlign: 'center',
            }}>
              Message envoyé. Nous vous répondrons sous 24 heures.
            </div>
          )}

        </form>
      </div>
    </section>
  )
}