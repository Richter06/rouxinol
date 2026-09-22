import { useEffect, useRef, useState } from 'react'
import '../styles/cta.css'

const paths = [
  {
    number: '01',
    label: 'QUERO COLOCAR MEU NEGÓCIO NA INTERNET',
    detail: 'Uma presença digital para começar a ser encontrado.',
  },
  {
    number: '02',
    label: 'QUERO MELHORAR O QUE JÁ TENHO',
    detail: 'Uma experiência mais clara, bonita e útil para o seu negócio.',
  },
  {
    number: '03',
    label: 'QUERO ORGANIZAR MEU NEGÓCIO',
    detail: 'Uma solução para deixar processos e informações no lugar.',
  },
  {
    number: '04',
    label: 'QUERO VENDER PELA INTERNET',
    detail: 'Uma experiência pensada para apresentar e vender seus produtos.',
  },
  {
    number: '05',
    label: 'TENHO UMA IDEIA DIFERENTE',
    detail: 'Então talvez a solução precise começar justamente por ela.',
  },
]

export default function CTA() {
  const sectionRef = useRef(null)

  const [isVisible, setIsVisible] = useState(false)
  const [activePath, setActivePath] = useState(4)

  useEffect(() => {
    const element = sectionRef.current

    if (!element) {
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.2,
      },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`cta ${
        isVisible ? 'is-visible' : ''
      }`}
      id="cta"
      aria-labelledby="cta-title"
    >
      <div
        className="cta__background"
        aria-hidden="true"
      >
        <span className="cta__line cta__line--one" />
        <span className="cta__line cta__line--two" />

        <span className="cta__orb cta__orb--one" />
        <span className="cta__orb cta__orb--two" />
      </div>

      <div className="cta__inner">
        <header className="cta__header">
          <span className="cta__eyebrow">
            CADA NEGÓCIO COMEÇA DE UM LUGAR
          </span>

          <h2
            className="cta__title"
            id="cta-title"
          >
            E agora,
            <span>o que você imagina?</span>
          </h2>

          <p className="cta__intro">
            Você não precisa chegar com tudo
            decidido. Escolha um ponto de
            partida — ou invente o seu.
          </p>
        </header>

        <div className="cta__paths">
          {paths.map((path, index) => {
            const isActive =
              activePath === index

            return (
              <a
                key={path.number}
                href="#contact"
                className={`cta__path ${
                  isActive
                    ? 'is-active'
                    : ''
                }`}
                onMouseEnter={() =>
                  setActivePath(index)
                }
                onFocus={() =>
                  setActivePath(index)
                }
              >
                <span className="cta__path-number">
                  {path.number}
                </span>

                <span className="cta__path-label">
                  {path.label}
                </span>

                <span className="cta__path-detail">
                  {path.detail}
                </span>

                <span
                  className="cta__path-arrow"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </a>
            )
          })}
        </div>

        <footer className="cta__footer">
          <span>
            SEM FÓRMULA PRONTA.
          </span>

          <span className="cta__footer-center">
            <b>
              {String(
                activePath + 1,
              ).padStart(2, '0')}
            </b>

            <span />

            {String(
              paths.length,
            ).padStart(2, '0')}
          </span>

          <span>
            VAMOS ENCONTRAR O CAMINHO.
          </span>
        </footer>
      </div>
    </section>
  )
}