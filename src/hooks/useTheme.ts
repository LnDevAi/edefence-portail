/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useEffect, useState, useCallback } from 'react'

const STORAGE_KEY = 'edefence:lightMode'

/**
 * useTheme
 * ─────────
 * Gère la bascule light / dark mode du portail E-DEFENCE.
 *
 * Usage :
 *   const { isLight, toggleTheme } = useTheme()
 *   <button onClick={toggleTheme}>Thème</button>
 */
export function useTheme() {
  const [isLight, setIsLight] = useState(false)

  // Restauration depuis localStorage au montage (côté client uniquement)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === '1') {
        document.body.classList.add('light-mode')
        setIsLight(true)
      }
    } catch (_) {}
  }, [])

  const toggleTheme = useCallback(() => {
    const next = !isLight
    setIsLight(next)
    document.body.classList.toggle('light-mode', next)
    try {
      localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
    } catch (_) {}
  }, [isLight])

  return { isLight, toggleTheme }
}
