import { useEffect, useRef, useState } from 'react'

import '../styles/growth.css'

const messages = [
  {
    number: '01',
    text: 'Seu negócio não precisa começar grande.',
  },
  {
    number: '02',
    text: 'Precisa começar certo.',
  },
  {
    number: '03',
    text: 'E quando ele crescer, a solução pode crescer junto.',
  },
  {
    number: '04',
    text: 'Do primeiro passo ao próximo capítulo.',
  },
]

const maintenancePlans = [
  {
    number: '01',
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
    number: '02',
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
    number: '03',
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
      {
        threshold: 0.15,
      },
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

      const scrollableHeight =
        story.offsetHeight - window.innerHeight

      if (scrollableHeight <= 0) {
        ticking = false
        return
      }

      const progress = Math.min(
        1,
        Math.max(
          0,
          -rect.top / scrollableHeight,
        ),
      )

      const index = Math.min(
        messages.length - 1,
        Math.floor(
          progress * messages.length,
        ),
      )

      setActiveMessage((current) =>
        current === index
          ? current
          : index,
      )

      ticking = false
    }

    const handleScroll = () => {
      if (ticking) return

      ticking = true

      window.requestAnimationFrame(
        updateMessage,
      )
    }

    updateMessage()

    window.addEventListener(
      'scroll',
      handleScroll,
      {
        passive: true,
      },
    )

    window.addEventListener(
      'resize',
      handleScroll,
    )

    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll,
      )

      window.removeEventListener(
        'resize',
        handleScroll,
      )
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`growth ${
        isVisible ? 'is-visible' : ''
      }`}
      id="growth"
      aria-labelledby="growth-title"
    >
      <div
        ref={storyRef}
        className="growth__story"
      >
        <div className="growth__story-sticky">
          <div
            className="growth__story-background"
            aria-hidden="true"
          />

          <div
            className="growth__story-overlay"
            aria-hidden="true"
          />

          <div className="growth__story-meta">
            <span>
              CRESCER É CONTINUAR
            </span>

            <span>
              {messages[activeMessage].number}
              <i>/</i>
              {String(messages.length).padStart(
                2,
                '0',
              )}
            </span>
          </div>

          <div
            className="growth__messages"
            aria-live="polite"
          >
            {messages.map((message, index) => {
              const isActive =
                activeMessage === index

              return (
                <div
                  key={message.number}
                  className={`growth__message ${
                    isActive
                      ? 'is-active'
                      : ''
                  }`}
                  aria-hidden={!isActive}
                >
                  <span className="growth__message-number">
                    {message.number}
                  </span>

                  <h2
                    id={
                      index === 0
                        ? 'growth-title'
                        : undefined
                    }
                  >
                    {message.text}
                  </h2>
                </div>
              )
            })}
          </div>

          <div className="growth__story-progress">
            {messages.map(
              (message, index) => (
                <span
                  key={message.number}
                  className={
                    activeMessage === index
                      ? 'is-active'
                      : ''
                  }
                />
              ),
            )}
          </div>

          <span className="growth__story-scroll">
            CONTINUE
            <span aria-hidden="true">
              ↓
            </span>
          </span>
        </div>
      </div>

      <section className="growth__maintenance">
        <div className="growth__maintenance-inner">
          <header className="growth__maintenance-header">
            <div>
              <span className="growth__maintenance-eyebrow">
                DEPOIS DO COMEÇO
              </span>

              <h2>
                O negócio muda.
                <span>
                  A solução também.
                </span>
              </h2>
            </div>

            <p>
              Sua presença digital não precisa
              ficar parada depois do lançamento.
              Ela pode acompanhar o momento do
              seu negócio.
            </p>
          </header>

          <div className="growth__plans">
            {maintenancePlans.map(
              (plan, index) => (
                <article
                  key={plan.name}
                  className={`growth__plan ${
                    plan.featured
                      ? 'is-featured'
                      : ''
                  }`}
                >
                  <div className="growth__plan-index">
                    <span>
                      {plan.number}
                    </span>

                    <span>
                      {plan.featured
                        ? 'CONTINUIDADE'
                        : index === 0
                          ? 'MANUTENÇÃO'
                          : 'EVOLUÇÃO'}
                    </span>
                  </div>

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
                    <strong>
                      {plan.price}
                    </strong>

                    <span>
                      {plan.period}
                    </span>
                  </div>

                  <p className="growth__plan-description">
                    {plan.description}
                  </p>

                  <ul className="growth__plan-list">
                    {plan.items.map(
                      (item) => (
                        <li key={item}>
                          <span aria-hidden="true">
                            +
                          </span>

                          {item}
                        </li>
                      ),
                    )}
                  </ul>

                  <a
                    href="#contact"
                    className="growth__plan-link"
                  >
                    CONHECER

                    <span aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </article>
              ),
            )}
          </div>

          <div className="growth__maintenance-bottom">
            <span>
              03 CAMINHOS DE CONTINUIDADE
            </span>

            <p>
              Planos e valores ilustrativos.
              A manutenção pode ser adaptada
              ao momento e às necessidades de
              cada negócio.
            </p>
          </div>
        </div>
      </section>
    </section>
  )
}