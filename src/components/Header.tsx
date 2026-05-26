/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'

interface HeaderProps {
  onOpenModal: (type: 'login' | 'signup') => void
}

const NAV_LINKS = [
  { href: '#portail',        label: 'Portail' },
  { href: '#features',       label: 'Fonctionnalités' },
  { href: '#parcours',       label: 'Parcours' },
  { href: '#certifications', label: 'Certifications' },
  { href: '#contact',        label: 'Contact' },
]

export default function Header({ onOpenModal }: HeaderProps) {
  const [isLight, setIsLight] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem('edefence:lightMode') === '1') {
        document.body.classList.add('light-mode')
        setIsLight(true)
      }
    } catch (_) {}
  }, [])

  const toggleTheme = () => {
    const next = !isLight
    setIsLight(next)
    document.body.classList.toggle('light-mode', next)
    try { localStorage.setItem('edefence:lightMode', next ? '1' : '0') } catch (_) {}
  }

  return (
    <nav data-theme="dark" style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: '#030811',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,.06)',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
    }}>
      
      <div style={{
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        gap: '0',
      }}>

        {/* ── Logo ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div style={{
            width: '32px', height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #00bcd4, #009688)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>

          {/* <Image src="/LOGO.jpeg" alt="Logo E-DEFENCE" width={35} height={35} className="object-contain rounded-full"/> */}

          </div>
          <span style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700, fontSize: '17px',
            color: 'white', letterSpacing: '-.2px',
            whiteSpace: 'nowrap',
          }}>
            E<span style={{ color: '#00d4ff' }}>-DEFENCE</span>
          </span>
        </div>

        {/* ── Liens horizontaux ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '36px',
          marginLeft: '48px',
          flex: 1,
        }}>
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              style={{
                fontSize: '14px',
                color: '#8aaac8',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'color .18s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#e8f4ff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#8aaac8')}
            >
              {label}
            </a>
          ))}
        </div>

        {/* ── Boutons horizontaux ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <button
            onClick={() => onOpenModal('login')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '14px', color: '#8aaac8',
              padding: '7px 14px', borderRadius: '8px',
              transition: 'color .18s', fontFamily: 'inherit',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#e8f4ff')}
            onMouseLeave={e => (e.currentTarget.style.color = '#8aaac8')}
          >
            Connexion
          </button>

          <button
            onClick={() => onOpenModal('signup')}
            style={{
              background: '#00d4ff',
              color: '#030811',
              border: 'none', cursor: 'pointer',
              fontSize: '14px', fontWeight: 700,
              padding: '9px 22px',
              borderRadius: '10px',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
              transition: 'opacity .18s, transform .1s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '.88' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
            onMouseDown={e  => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(.97)' }}
            onMouseUp={e    => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
          >
            Accès gratuit
          </button>

          <button
            onClick={toggleTheme}
            aria-label={isLight ? 'Mode sombre' : 'Mode clair'}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#8aaac8', padding: '6px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '6px', transition: 'color .18s', flexShrink: 0,
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#e8f4ff')}
            onMouseLeave={e => (e.currentTarget.style.color = '#8aaac8')}
          >
            {isLight ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
              </svg>
            )}
          </button>
        </div>

      </div>
    </nav>
  )
}