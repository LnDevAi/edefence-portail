'use client'

import { useModal } from '@/hooks/useModal'
import Header from '@/components/Header'
import Modal from '@/components/Modal'
import PortailSection from '@/components/sections/PortailSection'
import FeaturesSection from '@/components/sections/FeaturesSection'
import ParcoursSection from '@/components/sections/ParcoursSection'
import CertificationsSection from '@/components/sections/CertificationsSection'
import ContactSection from '@/components/sections/ContactSection'
import Footer from '@/components/Footer'

export default function HomePage() {
  const { modal, openModal, closeModal } = useModal()

  return (
    <>

      {/* Navigation */}
      <Header onOpenModal={openModal} />

      {/* ── HERO ── */}
      <section className="hero-bg grid-overlay min-h-screen flex items-center pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 w-full">
          <div className="max-w-3xl mx-auto text-center">
            <div
              className="inline-flex items-center justify-center gap-6 w-[400px] h-[40px] px-6 py-3 rounded-full text-xs font-medium mb-8 anim-1"
              style={{ background: 'rgba(0,212,255,.08)', border: '3px solid rgba(0,212,255,.25)', color: '#00d4ff' }}
            >
              <div className="pulse-dot"/>
              <h5>Protection active — Portail de cybersécurité entreprise</h5>
            </div>
            
            <h1
              className="font-display font-bold leading-none mb-6 anim-2"
              style={{ fontSize: 'clamp(2.8rem,6vw,5rem)' }}
            >
              Sécurisez votre<br/>organisation avec<br/>
              <span className="g-text">E-DEFENCE</span>
            </h1>
            <p className="text-ed-muted text-lg leading-relaxed mb-8 max-w-xl mx-auto anim-3">
              Portail unifié audit, inventaire et de formation en cybersécurité.
              Diagnostiquez vos vulnérabilités, corrigez-les, formez vos équipes.
            </p>

            {/* Boutons accéder au portail & obtenir un audit gratuit */}

            <div className="flex flex-wrap sm:flex-row  items-center justify-center gap-6 sm:gap-8 anim-4 " 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px' }}>
              <div className="order-1 sm:order-1 mt-4 sm:mt-5">
              <a
                href="#portail"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 w-[200px] h-[50px] rounded-xl font-semibold text-sm btn-primary transition-all duration-200 hover:scale-[1.02]"
                style={{ color: '#07111f' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4l3 3" />
                </svg>
                Accéder au portail
              </a>
              </div>
              <div className="order-2 sm:order-2 ml-8 sm:ml-0">
              <button
                onClick={() => openModal('signup')}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 w-[200px] h-[50px] rounded-xl text-sm btn-ghost transition-all duration-200 hover:scale-[1.02]"
              >
                Obtenir mon audit gratuit
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
              </button>
              </div>
            </div>
            {/* KPIs */}
            <br />
            <div className="flex flex-wrap justify-center gap-8 mt-12 anim-4" 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px' }}>
              {[
                { value: '+2 400', label: 'Entreprises protégées'},
                { value: '8',       label: 'Modules de sécurité' },
                { value: 'ISO 27001', label: 'Référentiel couvert' },
                { value: 'NIS2',    label: 'Conformité vérifiée' },
              ].map(({ value, label }, i) => (
                <div key={i} className={i > 0 ? 'flex gap-8' : ' '}>
                  {i > 0 && <div className="w-px bg-white/10 self-stretch" />}
                  <div>
                    <div className="text-2xl font-bold text-white font-display">{value}</div>
                    <div className="text-xs text-ed-muted mt-0.5">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PORTAIL 8 ONGLETS ── */}
      <PortailSection />
      
      {/* ── FONCTIONNALITÉS ── */}
      <FeaturesSection />

      {/* ── PARCOURS GUIDÉS ── */}
      <ParcoursSection />
      <br />
      <br />
      {/* ── CERTIFICATIONS ── */}
      <CertificationsSection onOpenModal={openModal}/>

      {/* ── CONTACT ── */}
      <ContactSection />

      {/* ── FOOTER ── */}
      <Footer />

      {/* ── MODAL ── */}
      {modal && (
        <Modal
          type={modal}
          onClose={closeModal}
          onSwitch={openModal}
        />
      )}
    </>
  )
}