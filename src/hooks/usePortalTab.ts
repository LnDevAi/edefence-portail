'use client'

import { useState, useCallback } from 'react'

export type PortalTabId =
  | 'decouverte'
  | 'inventaire'
  | 'performance'
  | 'securite'
  | 'wifi'
  | 'antivirus'
  | 'conformite'
  | 'academy'

/**
 * usePortalTab
 * ─────────────
 * Retourne l'onglet actif et la fonction pour le changer.
 *
 * Usage :
 *   const { activeTab, setTab } = usePortalTab()
 *   <button onClick={() => setTab('securite')}>Sécurité</button>
 */
export function usePortalTab(initial: PortalTabId = 'decouverte') {
  const [activeTab, setActiveTab] = useState<PortalTabId>(initial)

  const setTab = useCallback((id: PortalTabId) => {
    setActiveTab(id)
  }, [])

  return { activeTab, setTab }
}
