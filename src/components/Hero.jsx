import { useEffect, useState } from 'react'
import '../styles/hero.css'

const HERO_VIDEO = '/assets/videos/hero.mp4'

const words = [
  'aparecer',
  'crescer',
  'vender',
  'organizar',
  'começar',
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
      className={`hero ${isLoaded ? 'is-loaded' : ''}`}
      aria-labelledby="hero-title"
    >
      <div
        className="hero__background"
        aria-hidden="true"
      >
        <video
          className="hero__video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source
            src={HERO_VIDEO}
            type="video/mp4"
          />
        </video>

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