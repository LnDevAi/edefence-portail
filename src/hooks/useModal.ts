'use client'
import { useState, useCallback } from 'react'

export type ModalType = 'login' | 'signup' | null

export function useModal() {
  const [modal, setModal] = useState<ModalType>(null)

  const openModal  = useCallback((type: 'login' | 'signup') => setModal(type), [])
  const closeModal = useCallback(() => setModal(null), [])
  const switchModal = useCallback((type: 'login' | 'signup') => setModal(type), [])

  return { modal, openModal, closeModal, switchModal }
}