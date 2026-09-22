import { useEffect, useState } from 'react'
import '../styles/hero.css'

const words = [
  'crescer',
  'lucrar',
  'aparecer',
  'desenvolver',
  'expandir',
]

const testimonials = [
  {
    quote:
      'A Rouxinol transformou uma ideia que eu tinha em algo que finalmente conseguia mostrar para meus clientes.',
    name: 'Nome do cliente',
    business: 'Negócio / segmento',
  },
  {
    quote:
      'Agora minha empresa tem uma presença digital que realmente representa o que eu faço.',
    name: 'Nome do cliente',
    business: 'Negócio / segmento',
  },
  {
    quote:
      'Eu sabia que precisava melhorar minha presença online, mas não sabia por onde começar. A Rouxinol ajudou a organizar tudo.',
    name: 'Nome do cliente',
    business: 'Negócio / segmento',
  },
]

const HERO_BACKGROUND = '/assets/hero-background.jpg'

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0)
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const [mousePosition, setMousePosition] = useState({
    x: 50,
    y: 50,
  })

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setWordIndex((current) => (current + 1) % words.length)
    }, 2800)

    return () => clearInterval(wordInterval)
  }, [])

  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setTestimonialIndex((current) => (current + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(testimonialInterval)
  }, [])

  function handleButtonMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect()

    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100

    setMousePosition({
      x,
      y,
    })
  }

  function handleButtonMouseLeave() {
    setMousePosition({
      x: 50,
      y: 50,
    })
  }

  const testimonial = testimonials[testimonialIndex]

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
          aria-label="Rouxinol — início"
        >
          ROUXINOL
        </a>
      </header>

      <div className="hero__layout">
        {/* ESQUERDA */}
        <div className="hero__aside">
          <div className="hero__testimonials">
            <div className="hero__testimonials-header">
              <span className="hero__testimonials-label">
                O QUE ESTÃO DIZENDO
              </span>

              <span className="hero__testimonials-count">
                0{testimonialIndex + 1} / 0{testimonials.length}
              </span>
            </div>

            <div
              className="hero__testimonial"
              key={testimonialIndex}
            >
              <div className="hero__stars">
                ★ ★ ★ ★ ★
              </div>

              <blockquote className="hero__quote">
                “{testimonial.quote}”
              </blockquote>

              <div className="hero__author">
                <span className="hero__author-name">
                  {testimonial.name}
                </span>

                <span className="hero__author-business">
                  {testimonial.business}
                </span>
              </div>
            </div>

            <div className="hero__testimonial-progress">
              {testimonials.map((_, index) => (
                <span
                  key={index}
                  className={
                    index === testimonialIndex
                      ? 'is-active'
                      : ''
                  }
                />
              ))}
            </div>
          </div>

          <a
            href="#necessidades"
            className="hero__cta"
            onMouseMove={handleButtonMouseMove}
            onMouseLeave={handleButtonMouseLeave}
            style={{
              '--mouse-x': `${mousePosition.x}%`,
              '--mouse-y': `${mousePosition.y}%`,
            }}
          >
            <span className="hero__cta-inner">
              <span className="hero__cta-label">
                QUERO COMEÇAR
              </span>

              <span className="hero__cta-arrow">
                ↗
              </span>
            </span>
          </a>
        </div>

        {/* DIREITA */}
        <div className="hero__content">
          <h1
            className="hero__title"
            id="hero-title"
          >
            <span className="hero__title-line">
              Um passarinho
            </span>

            <span className="hero__title-line hero__title-line--indent">
              me contou
            </span>

            <span className="hero__title-line">
              que você quer
            </span>

            <span className="hero__title-line hero__title-line--accent">
              <span className="hero__word-slot">
                <span
                  key={words[wordIndex]}
                  className="hero__word"
                >
                  {words[wordIndex]}
                  <span className="hero__dot">.</span>
                </span>
              </span>
            </span>
          </h1>
        </div>
      </div>
    </section>
  )
}