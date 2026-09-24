import { useEffect, useRef, useState } from 'react'
import '../styles/stats.css'

const stats = [
  {
    value: 40,
    suffix: '%',
    decimals: 0,
    title: 'do faturamento',
    description:
      'é a proporção média das vendas por canais digitais entre pequenos negócios brasileiros pesquisados pelo Sebrae.',
    source: 'Sebrae · Transformação Digital nos Pequenos Negócios',
  },
  {
    value: 59.2,
    suffix: '%',
    decimals: 1,
    title: 'operam sozinhos',
    description:
      'dos pequenos negócios que vendem online concentram a operação digital em uma única pessoa.',
    source: 'Sebrae + E-Commerce Brasil · Radar Mercado Digital 2026',
  },
  {
    range: [5, 10],
    suffix: '%',
    decimals: 0,
    title: 'mais receita',
    description:
      'foi o aumento estimado após novos estabelecimentos entrarem em plataformas de listagem online em um estudo publicado na Management Science.',
    source: 'Management Science · 2026',
  },
  {
    value: 70,
    suffix: '%',
    decimals: 0,
    title: 'já vendem digitalmente',
    description:
      'aproximadamente das micro e pequenas empresas brasileiras utilizam ferramentas digitais para realizar vendas.',
    source: 'Sebrae · Transformação Digital nos Pequenos Negócios',
  },
]

const duration = 1500

function easeOutCubic(progress) {
  return 1 - Math.pow(1 - progress, 3)
}

function formatValue(value, decimals = 0) {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

function AnimatedNumber({
  value,
  decimals = 0,
  suffix = '',
  isVisible,
}) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (!isVisible) {
      setDisplayValue(0)
      return undefined
    }

    const startTime = performance.now()
    let animationFrame

    function animate(currentTime) {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1,
      )

      const easedProgress = easeOutCubic(progress)

      setDisplayValue(value * easedProgress)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [isVisible, value])

  return (
    <span className="stats__odometer">
      {formatValue(displayValue, decimals)}
      {suffix}
    </span>
  )
}

function AnimatedRange({
  range,
  suffix = '',
  isVisible,
}) {
  const [displayRange, setDisplayRange] = useState([0, 0])

  useEffect(() => {
    if (!isVisible) {
      setDisplayRange([0, 0])
      return undefined
    }

    const startTime = performance.now()
    let animationFrame

    function animate(currentTime) {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1,
      )

      const easedProgress = easeOutCubic(progress)

      setDisplayRange([
        range[0] * easedProgress,
        range[1] * easedProgress,
      ])

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [isVisible, range])

  return (
    <span className="stats__odometer">
      {formatValue(displayRange[0])}
      <span className="stats__range-dash">–</span>
      {formatValue(displayRange[1])}
      {suffix}
    </span>
  )
}

function StatNumber({ stat, isVisible }) {
  if (stat.range) {
    return (
      <AnimatedRange
        range={stat.range}
        suffix={stat.suffix}
        isVisible={isVisible}
      />
    )
  }

  return (
    <AnimatedNumber
      value={stat.value}
      decimals={stat.decimals}
      suffix={stat.suffix}
      isVisible={isVisible}
    />
  )
}

export default function Stats() {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [sampleSize, setSampleSize] = useState(0)
  const [lineProgress, setLineProgress] = useState(0)

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

  useEffect(() => {
    if (!isVisible) {
      return undefined
    }

    const startTime = performance.now()
    let animationFrame

    function animate(currentTime) {
      const progress = Math.min(
        (currentTime - startTime) / 1800,
        1,
      )

      const easedProgress = easeOutCubic(progress)

      setSampleSize(Math.round(3081 * easedProgress))
      setLineProgress(easedProgress)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [isVisible])

  return (
    <section
      ref={sectionRef}
      className={`stats ${
        isVisible ? 'is-visible' : ''
      }`}
      id="stats"
      aria-labelledby="stats-title"
    >
      <div className="stats__inner">

        <header className="stats__header">

          <div className="stats__eyebrow">
            <span className="stats__eyebrow-dot" />

            <span>
              O DIGITAL EM NÚMEROS
            </span>
          </div>

          <div className="stats__heading">

            <h2 id="stats-title">
              <span className="stats__title-line">
                O digital já mudou
              </span>

              <span className="stats__title-line stats__title-line--accent">
                o jeito de fazer negócio.
              </span>
            </h2>

            <p>
              Não é uma promessa da Rouxinol.
              São dados do mercado mostrando o tamanho
              que a presença digital já ganhou.
            </p>

          </div>

        </header>

        <div
          className="stats__timeline"
          aria-hidden="true"
        >
          <div className="stats__timeline-track">
            <div
              className="stats__timeline-progress"
              style={{
                transform: `scaleX(${lineProgress})`,
              }}
            />
          </div>

          <div className="stats__timeline-dot stats__timeline-dot--1" />
          <div className="stats__timeline-dot stats__timeline-dot--2" />
          <div className="stats__timeline-dot stats__timeline-dot--3" />
          <div className="stats__timeline-dot stats__timeline-dot--4" />
        </div>

        <div className="stats__grid">

          {stats.map((stat, index) => (
            <article
              key={stat.title}
              className={`stats__item stats__item--${index + 1}`}
              style={{
                '--item-delay': `${index * 110}ms`,
              }}
            >
              <div className="stats__number">

                <StatNumber
                  stat={stat}
                  isVisible={isVisible}
                />

              </div>

              <div className="stats__content">

                <h3>
                  {stat.title}
                </h3>

                <p>
                  {stat.description}
                </p>

                <span className="stats__source">
                  {stat.source}
                </span>

              </div>

              <span
                className="stats__corner"
                aria-hidden="true"
              />
            </article>
          ))}

        </div>

        <div className="stats__bottom">

          <div className="stats__bottom-number">

            <strong>
              {sampleSize.toLocaleString('pt-BR')}
            </strong>

            <span>
              empresários ouvidos no
              <br />
              Radar Mercado Digital 2026
            </span>

          </div>

          <div className="stats__bottom-copy">

            <span className="stats__bottom-label">
              E TEM OUTRA PARTE DA HISTÓRIA
            </span>

            <p>
              Estar no digital é só o começo.
              A diferença aparece quando a tecnologia
              começa a tirar trabalho das suas costas
              e ajudar o negócio a funcionar melhor.
            </p>

          </div>

        </div>

        <div className="stats__note">

          <span>
            FONTES
          </span>

          <p>
            Sebrae · E-Commerce Brasil · Management Science · OECD.
            Os resultados variam conforme setor, negócio,
            mercado e forma de implementação.
          </p>

        </div>

      </div>
    </section>
  )
}