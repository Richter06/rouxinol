import { useEffect, useRef, useState } from 'react'

import '../styles/cta.css'

const products = [
  {
    id: 'site',
    label: 'Um site',
    description: 'Um lugar para sua marca existir de verdade.',
  },
  {
    id: 'loja',
    label: 'Uma loja',
    description: 'Para transformar visita em venda.',
  },
  {
    id: 'catalogo',
    label: 'Um catálogo',
    description: 'Tudo o que você oferece, organizado.',
  },
  {
    id: 'sistema',
    label: 'Um sistema',
    description: 'Para deixar o trabalho menos complicado.',
  },
  {
    id: 'ideia',
    label: 'Tenho uma ideia',
    description: 'Você explica. A gente descobre o resto.',
  },
]

export default function CTA() {
  const sectionRef = useRef(null)

  const [isVisible, setIsVisible] = useState(false)
  const [activeProduct, setActiveProduct] = useState('site')

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

  const active = products.find(
    (product) => product.id === activeProduct,
  )

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
      >
        <span className="cta__orb cta__orb--one" />
        <span className="cta__orb cta__orb--two" />
      </div>

      <div className="cta__inner">

        <header className="cta__header">
          <span className="cta__eyebrow">
            PODE COMEÇAR POR AQUI
          </span>

          <h2
            id="cta-title"
            className="cta__title"
          >
            O que você
            <span>precisa?</span>
          </h2>

          <p className="cta__intro">
            Escolha uma direção.
            <br />
            O resto a gente conversa.
          </p>
        </header>


        <div className="cta__interface">

          <div className="cta__card">

            <div className="cta__card-header">
              <span className="cta__card-label">
                VAMOS COMEÇAR POR AQUI
              </span>

              <span className="cta__card-status">
                <span />
                ONLINE
              </span>
            </div>


            <div className="cta__choices">
              {products.map((product) => {
                const isActive =
                  activeProduct === product.id

                return (
                  <button
                    key={product.id}
                    type="button"
                    className={`cta__choice ${
                      isActive ? 'is-active' : ''
                    }`}
                    onClick={() =>
                      setActiveProduct(product.id)
                    }
                    aria-pressed={isActive}
                  >
                    <span className="cta__choice-left">

                      <span className="cta__choice-indicator">
                        <span />
                      </span>

                      <span className="cta__choice-name">
                        {product.label}
                      </span>

                    </span>

                    <span className="cta__choice-arrow">
                      ↗
                    </span>
                  </button>
                )
              })}
            </div>


            <div className="cta__response">

              <span className="cta__response-line" />

              <p
                key={activeProduct}
                className="cta__response-text"
              >
                {active.description}
              </p>

            </div>


            <div className="cta__card-footer">

              <span className="cta__footer-note">
                Sem compromisso.
              </span>

              <a
                href="#contact"
                className="cta__button"
              >
                <span>
                  VAMOS CONVERSAR
                </span>

                <span
                  className="cta__button-icon"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </a>

            </div>

          </div>

        </div>


        <footer className="cta__footer">
          <span>
            ROUXINOL
          </span>

          <span>
            PRESENÇA DIGITAL · SOLUÇÕES DIGITAIS
          </span>
        </footer>

      </div>
    </section>
  )
}