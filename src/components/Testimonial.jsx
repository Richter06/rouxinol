import { useEffect, useRef, useState } from 'react'

import '../styles/testimonial.css'

const testimonials = [
  {
    id: 1,
    result: '+42%',
    resultLabel: 'novos contatos pelo site',
    quote:
      'Antes, quem queria conhecer nosso trabalho precisava mandar mensagem. Agora, a pessoa encontra tudo o que precisa e já chega muito mais preparada para conversar.',
    name: 'Marina Albuquerque',
    role: 'Fundadora',
    company: 'Studio Aurora',
    category: 'Estética e beleza',
    initials: 'MA',
    story:
      'O Studio Aurora precisava de uma presença digital que mostrasse a experiência do espaço sem deixar a cliente perdida. A nova estrutura reuniu serviços, informações e contato em um só lugar.',
  },
  {
    id: 2,
    result: '3,2×',
    resultLabel: 'mais pedidos pelo catálogo',
    quote:
      'A gente tinha os produtos, mas ninguém conseguia enxergar tudo o que vendíamos. Depois do catálogo, ficou muito mais fácil apresentar as opções e receber pedidos.',
    name: 'Lucas Ferreira',
    role: 'Sócio',
    company: 'Casa Nativa',
    category: 'Casa e decoração',
    initials: 'LF',
    story:
      'A Casa Nativa precisava organizar dezenas de produtos sem transformar a experiência em uma loja complicada. O catálogo passou a concentrar produtos, informações e pedidos.',
  },
  {
    id: 3,
    result: '18h',
    resultLabel: 'economizadas por mês',
    quote:
      'O que mais mudou não foi só a aparência. Foi parar de fazer manualmente coisas que o sistema consegue resolver sozinho.',
    name: 'Rafael Mendes',
    role: 'Diretor',
    company: 'Norte Auto',
    category: 'Automotivo',
    initials: 'RM',
    story:
      'A Norte Auto precisava reduzir tarefas repetitivas na operação. A solução centralizou informações e automatizou etapas que antes dependiam de controles espalhados.',
  },
]

function getPosition(index, activeIndex) {
  if (index === activeIndex) {
    return 'center'
  }

  if (
    (index === activeIndex - 1) ||
    (activeIndex === 0 && index === testimonials.length - 1)
  ) {
    return 'left'
  }

  return 'right'
}

export default function Testimonial() {
  const sectionRef = useRef(null)

  const [activeIndex, setActiveIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = sectionRef.current

    if (!element) {
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.2,
      },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  function selectTestimonial(index) {
    setActiveIndex(index)
  }

  const active = testimonials[activeIndex]

  return (
    <section
      ref={sectionRef}
      className={`testimonial ${
        isVisible ? 'is-visible' : ''
      }`}
      id="testimonial"
      aria-labelledby="testimonial-title"
    >
      <div className="testimonial__inner">

        <header className="testimonial__header">
          <div className="testimonial__eyebrow">
            <span className="testimonial__eyebrow-dot" />
            HISTÓRIAS DE QUEM CONSTRUIU
          </div>

          <div className="testimonial__heading">
            <h2 id="testimonial-title">
              O projeto termina.
              <br />
              <em>O resultado continua.</em>
            </h2>

            <p>
              Cada negócio começa de um lugar diferente.
              O que muda é o que acontece quando uma
              solução digital começa a trabalhar junto
              com ele.
            </p>
          </div>
        </header>

        <div
          className="testimonial__stage"
          aria-label="Histórias de clientes"
        >
          <div className="testimonial__wheel">

            {testimonials.map((testimonial, index) => {
              const position = getPosition(
                index,
                activeIndex,
              )

              const isActive = position === 'center'

              return (
                <button
                  key={testimonial.id}
                  type="button"
                  className={`testimonial-card testimonial-card--${position}`}
                  onClick={() => selectTestimonial(index)}
                  aria-label={
                    isActive
                      ? `História de ${testimonial.name}`
                      : `Ver história de ${testimonial.name}`
                  }
                  aria-pressed={isActive}
                >
                  <div className="testimonial-card__top">
                    <span className="testimonial-card__category">
                      {testimonial.category}
                    </span>

                    <span className="testimonial-card__number">
                      0{index + 1}
                    </span>
                  </div>

                  <div className="testimonial-card__result">
                    <strong>
                      {testimonial.result}
                    </strong>

                    <span>
                      {testimonial.resultLabel}
                    </span>
                  </div>

                  <div className="testimonial-card__quote">
                    <span className="testimonial-card__quote-mark">
                      “
                    </span>

                    <p>
                      {testimonial.quote}
                    </p>
                  </div>

                  <div className="testimonial-card__person">
                    <div className="testimonial-card__avatar">
                      {testimonial.initials}
                    </div>

                    <div>
                      <strong>
                        {testimonial.name}
                      </strong>

                      <span>
                        {testimonial.role} ·{' '}
                        {testimonial.company}
                      </span>
                    </div>
                  </div>

                  {!isActive && (
                    <div className="testimonial-card__bottom">
                      <span>VER HISTÓRIA</span>

                      <span className="testimonial-card__arrow">
                        ↗
                      </span>
                    </div>
                  )}
                </button>
              )
            })}

          </div>
        </div>

        <div className="testimonial__details">
          <div className="testimonial__details-label">
            <span />
            SOBRE O PROJETO
          </div>

          <div className="testimonial__details-content">
            <h3>
              {active.company}
            </h3>

            <p>
              {active.story}
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}