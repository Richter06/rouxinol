import { useEffect, useRef, useState } from 'react'

import '../styles/growth.css'

const messages = [
  'Seu negócio não precisa começar grande.',
  'Precisa começar certo.',
  'E quando ele crescer, a solução pode crescer junto.',
  'Do primeiro passo ao próximo capítulo.',
]

const maintenancePlans = [
  {
    name: 'ANDORINHA',
    price: 'R$ 89',
    period: '/mês',
    description:
      'Para manter sua presença digital funcionando e atualizada.',
    items: [
      'Pequenos ajustes',
      'Atualizações de conteúdo',
      'Acompanhamento básico',
    ],
  },
  {
    name: 'SABIÁ',
    price: 'R$ 169',
    period: '/mês',
    description:
      'Para negócios que querem continuar melhorando depois do lançamento.',
    items: [
      'Tudo do Andorinha',
      'Novos conteúdos',
      'Melhorias recorrentes',
      'Acompanhamento próximo',
    ],
    featured: true,
  },
  {
    name: 'ROUXINOL',
    price: 'R$ 299',
    period: '/mês',
    description:
      'Para transformar a presença digital em uma ferramenta de crescimento.',
    items: [
      'Tudo do Sabiá',
      'Novas funcionalidades',
      'Aprimoramentos contínuos',
      'Prioridade no atendimento',
    ],
  },
]

export default function Growth() {
  const sectionRef = useRef(null)
  const storyRef = useRef(null)

  const [activeMessage, setActiveMessage] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.15 },
    )

    observer.observe(section)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const story = storyRef.current
    if (!story) return undefined

    let ticking = false

    const updateMessage = () => {
      const rect = story.getBoundingClientRect()
      const scrollableHeight = story.offsetHeight - window.innerHeight

      if (scrollableHeight <= 0) {
        ticking = false
        return
      }

      const progress = Math.min(
        1,
        Math.max(0, -rect.top / scrollableHeight),
      )

      const index = Math.min(
        messages.length - 1,
        Math.floor(progress * messages.length),
      )

      setActiveMessage((current) =>
        current === index ? current : index,
      )

      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateMessage)
        ticking = true
      }
    }

    updateMessage()

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    })

    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`growth ${isVisible ? 'is-visible' : ''}`}
      id="growth"
      aria-labelledby="growth-title"
    >
      <div ref={storyRef} className="growth__story">
        <div className="growth__story-sticky">
          <div
            className="growth__story-background"
            aria-hidden="true"
          />

          <div className="growth__messages" aria-live="polite">
            {messages.map((message, index) => {
              const isActive = activeMessage === index

              return (
                <div
                  key={message}
                  className={`growth__message ${
                    isActive ? 'is-active' : ''
                  }`}
                  aria-hidden={!isActive}
                >
                  <h2
                    id={
                      index === 0
                        ? 'growth-title'
                        : undefined
                    }
                  >
                    {message}
                  </h2>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <section className="growth__maintenance">
        <div className="growth__maintenance-inner">
          <header className="growth__maintenance-header">
            <div>
              <span className="growth__maintenance-eyebrow">
                E DEPOIS DO COMEÇO?
              </span>

              <h2>
                A gente pode
                <span>continuar junto.</span>
              </h2>
            </div>

            <p>
              Seu negócio muda. Sua presença digital também pode
              acompanhar esse movimento.
            </p>
          </header>

          <div className="growth__plans">
            {maintenancePlans.map((plan) => (
              <article
                key={plan.name}
                className={`growth__plan ${
                  plan.featured ? 'is-featured' : ''
                }`}
              >
                <div className="growth__plan-top">
                  <span className="growth__plan-name">
                    {plan.name}
                  </span>

                  {plan.featured && (
                    <span className="growth__plan-tag">
                      MAIS ESCOLHIDO
                    </span>
                  )}
                </div>

                <div className="growth__plan-price">
                  <strong>{plan.price}</strong>
                  <span>{plan.period}</span>
                </div>

                <p className="growth__plan-description">
                  {plan.description}
                </p>

                <ul className="growth__plan-list">
                  {plan.items.map((item) => (
                    <li key={item}>
                      <span aria-hidden="true">+</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className="growth__plan-link"
                >
                  CONHECER
                  <span aria-hidden="true">↗</span>
                </a>
              </article>
            ))}
          </div>

          <p className="growth__maintenance-note">
            Planos e valores ilustrativos. A manutenção pode ser
            adaptada ao momento e às necessidades de cada negócio.
          </p>
        </div>
      </section>
    </section>
  )
}