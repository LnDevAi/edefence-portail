import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
        mono:    ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        // ── Palette E-DEFENCE — copie exacte des variables CSS de adefence.html ──
        ed: {
          bg:      '#07111f',   // fond principal dark
          surface: '#0d1e33',   // panneaux et cartes de 2e niveau
          card:    '#112240',   // cartes internes (portail)
          border:  '#1e3a5f',   // bordures et séparateurs
          blue:    '#00d4ff',   // accent1 — cyan électrique
          green:   '#00c896',   // accent2 — vert teal
          red:     '#ff3b5c',   // alerte critique
          warn:    '#ffa500',   // avertissement orange
          muted:   '#4a6b8a',   // texte secondaire / labels
          text:    '#e8f4ff',   // texte principal clair
          dark:    '#00a8cc',   // variante foncée du bleu (gradient btn)
        },
      },

      // tailwind.config.js
      theme: {
        extend: {
          colors: {
            'ed-muted': '#9ca3af', // gris clair
            'ed-blue': '#00d4ff',  // bleu portail
          },
        },
      },


      backgroundImage: {
        // Gradients réutilisables en className Tailwind
        'ed-btn':  'linear-gradient(135deg, #00d4ff, #00a8cc)',
        'ed-logo': 'linear-gradient(135deg, #00d4ff, #00c896)',
        'ed-hero': `
          radial-gradient(ellipse 70% 50% at 65% 30%, rgba(0,212,255,0.12) 0%, transparent 60%),
          radial-gradient(ellipse 50% 40% at 10% 70%, rgba(0,200,150,0.08) 0%, transparent 50%)
        `,
      },
      borderColor: {
        'ed-glow': 'rgba(0,212,255,0.12)',
        'ed-glow-hover': 'rgba(0,212,255,0.4)',
      },
      boxShadow: {
        'ed-glow': '0 8px 32px rgba(0,212,255,0.08)',
        'ed-card': '0 4px 16px rgba(0,0,0,0.3)',
      },
      // Taille de texte fluide (clamp) pour le h1 du hero
      fontSize: {
        'hero': 'clamp(2.8rem, 6vw, 5rem)',
      },
      animation: {
        'pulse-slow': 'pulse-anim 2s ease-in-out infinite',
        'fade-up-1':  'fadeUp 0.6s 0.05s ease both',
        'fade-up-2':  'fadeUp 0.6s 0.15s ease both',
        'fade-up-3':  'fadeUp 0.6s 0.25s ease both',
        'fade-up-4':  'fadeUp 0.6s 0.35s ease both',
      },
      keyframes: {
        'pulse-anim': {
          '0%, 100%': { opacity: '1' },
          '50%':       { opacity: '0.3' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
