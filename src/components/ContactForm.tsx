'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    const form = e.currentTarget
    form.reset()

    setShowSuccess(true)

    setTimeout(() => {
      setShowSuccess(false)
    }, 5000)
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 text-left"
      >
        <div className="grid grid-cols-2 gap-3">

          <div>
            <label className="block text-xs text-ed-muted uppercase tracking-wide mb-1.5">
              Prénom
            </label>

            <input
              type="text"
              placeholder="Votre prénom"
              className="ed-input text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-ed-muted uppercase tracking-wide mb-2">
              Nom
            </label>

            <input
              type="text"
              placeholder="Votre nom"
              className="ed-input text-sm"
              required
            />
          </div>

        </div>

        <div>
          <label className="block text-xs text-ed-muted uppercase tracking-wide mb-2">
            Email professionnel
          </label>

          <input
            type="email"
            placeholder="contact@entreprise.com"
            className="ed-input text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-ed-muted uppercase tracking-wide mb-2">
            Organisation
          </label>

          <input
            type="text"
            placeholder="Nom de votre entreprise"
            className="ed-input text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-ed-muted uppercase tracking-wide mb-2">
            Message
          </label>

          <textarea
            rows={4}
            placeholder="Décrivez votre besoin..."
            className="ed-input text-sm resize-none"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full h-[50px] py-3.5 text-sm font-semibold btn-primary"
          style={{
            color: '#07111f',
          }}
        >
          Envoyer le message
        </button>
      </form>

      {showSuccess && (
        <div
          className="mt-4 p-4 rounded-xl text-sm"
          style={{
            background: 'rgba(0,200,150,.08)',
            border: '1px solid rgba(0,200,150,.3)',
            color: '#00c896',
          }}
        >
          Message envoyé. Nous vous répondrons sous 24 heures.
        </div>
      )}
    </>
  )
}