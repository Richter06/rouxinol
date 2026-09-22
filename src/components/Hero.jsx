import { useEffect, useState } from 'react'

import '../styles/hero.css'

const words = [
  'crescer',
  'aparecer',
  'vender',
  'organizar',
  'começar',
]

const HERO_BACKGROUND = '/assets/hero-background.jpg'

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((current) => (current + 1) % words.length)
    }, 2800)

    return () => clearInterval(interval)
  }, [])

  return (
    <section
      className="hero"
      aria-labelledby="hero-title"
    >
      <div
        className="hero__background"
        aria-hidden="true"
      >
        <div
          className="hero__image"
          style={{
            backgroundImage: `url(${HERO_BACKGROUND})`,
          }}
        />

        <div className="hero__overlay" />
        <div className="hero__grain" />
      </div>

      <header className="hero__header">
        <a
          href="/"
          className="hero__brand"
          aria-label="Rouxinol, início"
        >
          <span className="hero__brand-mark">
            R
          </span>

          <span className="hero__brand-name">
            ROUXINOL
          </span>
        </a>

        <span className="hero__header-label">
          PRESENÇA DIGITAL / SOLUÇÕES DIGITAIS
        </span>
      </header>

      <div className="hero__content">
        <div className="hero__main">
          <div className="hero__headline">

            <p className="hero__bird">
              UM PASSARINHO
              <span>ME CONTOU.</span>
            </p>

            <h1
              className="hero__title"
              id="hero-title"
            >
              <span className="hero__title-line">
                Que seu negócio
              </span>

              <span className="hero__title-line hero__title-line--accent">
                quer
                <span className="hero__word-slot">
                  <span
                    key={words[wordIndex]}
                    className="hero__word"
                  >
                    {words[wordIndex]}
                  </span>
                </span>
                <span className="hero__dot">
                  .
                </span>
              </span>
            </h1>
          </div>

          <div className="hero__statement">
            <p className="hero__statement-lead">
              E, sinceramente?
            </p>

            <p className="hero__statement-text">
              Já estava na hora.
            </p>
          </div>
        </div>

        <div className="hero__bottom">
          <div className="hero__description">
            <span className="hero__description-label">
              ROUXINOL
            </span>

            <p>
              Sites, lojas e soluções digitais
              para negócios que têm alguma
              coisa para mostrar.
            </p>
          </div>

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

          <div
            className="hero__scroll"
            aria-hidden="true"
          >
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