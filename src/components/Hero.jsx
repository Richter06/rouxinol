import { useEffect, useState } from 'react'

import '../styles/hero.css'

const words = [
  'aparecer',
  'crescer',
  'vender',
  'organizar',
  'começar',
]

const services = [
  {
    id: 'site',
    label: 'SITE',
    position: 'top-left',
  },
  {
    id: 'loja',
    label: 'LOJA',
    position: 'top-right',
  },
  {
    id: 'catalogo',
    label: 'CATÁLOGO',
    position: 'middle-left',
  },
  {
    id: 'sistema',
    label: 'SISTEMA',
    position: 'middle-right',
  },
  {
    id: 'solucao',
    label: 'SUA IDEIA',
    position: 'bottom',
  },
]

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 80)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex(
        (current) => (current + 1) % words.length,
      )
    }, 2800)

    return () => clearInterval(interval)
  }, [])

  return (
    <section
      className={`hero ${
        isLoaded ? 'is-loaded' : ''
      }`}
      aria-labelledby="hero-title"
    >
      <div
        className="hero__background"
        aria-hidden="true"
      >
        <div className="hero__wash" />
        <div className="hero__grain" />
      </div>

      <header className="hero__header">
        <a
          href="/"
          className="hero__brand"
          aria-label="Rouxinol, início"
        >
          <span className="hero__brand-name">
            ROUXINOL
          </span>
        </a>

        <span className="hero__header-label">
          PRESENÇA DIGITAL / SOLUÇÕES DIGITAIS
        </span>
      </header>

      <div className="hero__content">
        <div className="hero__intro">
          <p className="hero__bird">
            UM PASSARINHO
            <span>ME CONTOU.</span>
          </p>

          <h1
            className="hero__title"
            id="hero-title"
          >
            Que seu negócio
            <span className="hero__title-accent">
              quer{' '}
              <span className="hero__word-slot">
                <span
                  key={words[wordIndex]}
                  className="hero__word"
                >
                  {words[wordIndex]}
                </span>
              </span>
              .
            </span>
          </h1>

          <p className="hero__subtitle">
            E ele provavelmente estava certo.
            <span>
              A gente só veio ajudar.
            </span>
          </p>

          <a
            href="#necessidades"
            className="hero__cta"
          >
            <span className="hero__cta-label">
              QUERO COMEÇAR
            </span>

            <span
              className="hero__cta-arrow"
              aria-hidden="true"
            >
              ↗
            </span>
          </a>
        </div>

        <div
          className="hero__network"
          aria-hidden="true"
        >
          <div className="hero__network-orbit hero__network-orbit--outer" />
          <div className="hero__network-orbit hero__network-orbit--inner" />

          <div className="hero__network-line hero__network-line--one" />
          <div className="hero__network-line hero__network-line--two" />
          <div className="hero__network-line hero__network-line--three" />
          <div className="hero__network-line hero__network-line--four" />
          <div className="hero__network-line hero__network-line--five" />

          {services.map((service) => (
            <div
              key={service.id}
              className={`hero__service hero__service--${service.position}`}
            >
              <span className="hero__service-dot" />

              <span className="hero__service-label">
                {service.label}
              </span>
            </div>
          ))}

          <div className="hero__network-center">
            <span className="hero__network-center-bird">
              R
            </span>

            <span className="hero__network-center-name">
              ROUXINOL
            </span>
          </div>
        </div>

        <div className="hero__bottom">
          <p className="hero__description">
            Sites, lojas e soluções digitais
            para negócios que têm alguma
            coisa para mostrar.
          </p>

          <div className="hero__scroll">
            <span className="hero__scroll-line" />

            <span className="hero__scroll-text">
              DESCUBRA
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}