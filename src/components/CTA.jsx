import { useEffect, useRef, useState } from 'react'

import '../styles/cta.css'

const paths = [
  {
    number: '01',
    label: 'EU PRECISO APARECER',
    detail: 'Meu negócio é bom, mas parece que ninguém sabe que ele existe.',
    response: 'Então vamos dar um jeito de fazer ele aparecer.',
  },
  {
    number: '02',
    label: 'EU PRECISO EXPLICAR',
    detail: 'Eu passo mais tempo explicando minha empresa do que trabalhando nela.',
    response: 'Talvez esteja na hora de deixar seu site fazer um pouco desse trabalho.',
  },
  {
    number: '03',
    label: 'EU PRECISO ORGANIZAR',
    detail: 'Eu tenho uma planilha para tudo. O problema é que agora tenho uma planilha pras planilhas.',
    response: 'Acho que está na hora de organizar essa casa.',
  },
  {
    number: '04',
    label: 'EU PRECISO VENDER',
    detail: 'Eu tenho coisa boa para vender. Só não consigo fazer as pessoas chegarem até ela.',
    response: 'Então vamos parar de deixar seus produtos escondidos.',
  },
  {
    number: '05',
    label: 'EU TENHO UM PROBLEMA',
    detail: 'Meu problema é tão específico que eu nem sei explicar direito.',
    response: 'Melhor ainda. Pode começar me contando do seu jeito.',
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
        threshold: 0.15,
      },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const active = paths[activePath]

  return (
    <section
      ref={sectionRef}
      className={`cta ${isVisible ? 'is-visible' : ''}`}
      id="cta"
      aria-labelledby="cta-title"
    >
      <div
        className="cta__background"
        aria-hidden="true"
      />

      <div className="cta__inner">
        <header className="cta__header">
          <div className="cta__header-meta">
            <span className="cta__eyebrow">
              01 — STARTING POINT
            </span>

            <span className="cta__header-index">
              ROUXINOL / 05
            </span>
          </div>

          <div className="cta__heading">
            <h2
              className="cta__title"
              id="cta-title"
            >
              E se a gente
              <span>começar pela sua ideia?</span>
            </h2>

            <p className="cta__intro">
              Você não precisa saber exatamente qual solução
              precisa. Comece pelo que você quer mudar.
            </p>
          </div>
        </header>

        <div className="cta__content">
          <div className="cta__paths">
            <div className="cta__paths-label">
              POR ONDE COMEÇAMOS?
            </div>

            <div className="cta__path-list">
              {paths.map((path, index) => {
                const isActive = activePath === index

                return (
                  <a
                    key={path.number}
                    href="#contact"
                    className={`cta__path ${
                      isActive ? 'is-active' : ''
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

                    <span className="cta__path-copy">
                      <strong>
                        {path.label}
                      </strong>

                      <span>
                        {path.detail}
                      </span>
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
          </div>

          <div className="cta__response">
            <div className="cta__response-number">
              {active.number}
            </div>

            <div className="cta__response-content">
              <span className="cta__response-label">
                TALVEZ O PRIMEIRO PASSO SEJA
              </span>

              <p
                key={activePath}
                className="cta__response-text"
              >
                {active.response}
              </p>

              <p className="cta__response-detail">
                {active.detail}
              </p>

              <a
                href="#contact"
                className="cta__response-link"
              >
                CONVERSAR SOBRE O PROJETO
                <span aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>
          </div>
        </div>

        <footer className="cta__footer">
          <p>
            Você não precisa chegar com tudo decidido.
            A gente pode descobrir o caminho juntos.
          </p>

          <span>
            05 / 05
          </span>
        </footer>
      </div>
    </section>
  )
}