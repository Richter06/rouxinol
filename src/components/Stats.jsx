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

const duration = 1400

function easeOutCubic(progress) {
  return 1 - Math.pow(1 - progress, 3)
}

export default function Stats() {
  const sectionRef = useRef(null)

  const [isVisible, setIsVisible] = useState(false)

  const [animatedValues, setAnimatedValues] = useState(
    stats.map((stat) => {
      if (stat.range) {
        return [0, 0]
      }

      return 0
    }),
  )

  const [sampleSize, setSampleSize] = useState(0)

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
        threshold: 0.25,
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
        (currentTime - startTime) / duration,
        1,
      )

      const easedProgress = easeOutCubic(progress)

      setAnimatedValues(
        stats.map((stat) => {
          if (stat.range) {
            return [
              stat.range[0] * easedProgress,
              stat.range[1] * easedProgress,
            ]
          }

          return stat.value * easedProgress
        }),
      )

      setSampleSize(
        Math.round(3081 * easedProgress),
      )

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [isVisible])

  function formatValue(value, decimals = 0) {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  }

  return (
    <section
      ref={sectionRef}
      className={`stats ${isVisible ? 'is-visible' : ''}`}
      id="stats"
      aria-labelledby="stats-title"
    >
      <div className="stats__inner">
        <header className="stats__header">
          <div className="stats__eyebrow">
            <span className="stats__eyebrow-dot" />
            O DIGITAL EM NÚMEROS
          </div>

          <div className="stats__heading">
            <h2 id="stats-title">
              O digital já mudou
              <br />
              <em>o jeito de fazer negócio.</em>
            </h2>

            <p>
              Não é uma promessa da Rouxinol.
              São dados do mercado mostrando o tamanho
              que a presença digital já ganhou.
            </p>
          </div>
        </header>

        <div className="stats__grid">
          {stats.map((stat, index) => (
            <article
              key={stat.title}
              className={`stats__item stats__item--${index + 1}`}
            >
              <div className="stats__number">
                {stat.range ? (
                  <>
                    {formatValue(
                      animatedValues[index][0],
                    )}
                    –
                    {formatValue(
                      animatedValues[index][1],
                    )}
                    {stat.suffix}
                  </>
                ) : (
                  <>
                    {formatValue(
                      animatedValues[index],
                      stat.decimals,
                    )}
                    {stat.suffix}
                  </>
                )}
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
          <span>FONTES</span>

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