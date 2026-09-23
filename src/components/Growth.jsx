import { useEffect, useRef, useState } from 'react'

import '../styles/growth.css'

const stages = [
  {
    id: 'lancar',
    label: 'Lançar',
    title: 'Tudo começa quando vai para o ar.',
    description:
      'Seu site, catálogo ou sistema entra em funcionamento e começa a fazer parte do dia a dia do negócio.',
    points: [
      'Presença funcionando',
      'Conteúdo organizado',
      'Experiência pronta para receber pessoas',
    ],
    visual: 'LAUNCH',
  },
  {
    id: 'observar',
    label: 'Observar',
    title: 'Depois, a gente vê o que acontece.',
    description:
      'O negócio muda quando pessoas começam a usar. É daí que aparecem novas necessidades, ideias e oportunidades.',
    points: [
      'Novas necessidades',
      'Mudanças no negócio',
      'Oportunidades de melhoria',
    ],
    visual: 'OBSERVE',
  },
  {
    id: 'ajustar',
    label: 'Ajustar',
    title: 'O que funciona pode ficar melhor.',
    description:
      'Conteúdo, páginas e funcionalidades podem evoluir sem precisar começar tudo novamente.',
    points: [
      'Novos conteúdos',
      'Melhorias de experiência',
      'Ajustes conforme a rotina',
    ],
    visual: 'IMPROVE',
  },
  {
    id: 'expandir',
    label: 'Expandir',
    title: 'E quando o negócio cresce, a solução acompanha.',
    description:
      'Uma presença digital não precisa ficar presa ao momento em que foi criada. Ela pode ganhar novas possibilidades com o tempo.',
    points: [
      'Novas funcionalidades',
      'Novas áreas',
      'Novas possibilidades',
    ],
    visual: 'GROW',
  },
]

export default function Growth() {
  const sectionRef = useRef(null)

  const [activeStage, setActiveStage] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const section = sectionRef.current

    if (!section) {
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.12,
      },
    )

    observer.observe(section)

    return () => observer.disconnect()
  }, [])

  const active = stages[activeStage]

  return (
    <section
      ref={sectionRef}
      className={`growth ${
        isVisible ? 'is-visible' : ''
      }`}
      id="growth"
      aria-labelledby="growth-title"
    >
      <div className="growth__inner">

        {/* =====================================================
            INTRO
            ===================================================== */}

        <header className="growth__intro">
          <span className="growth__eyebrow">
            DEPOIS DO COMEÇO
          </span>

          <h2
            id="growth-title"
            className="growth__title"
          >
            O negócio muda.
            <span>
              A solução também.
            </span>
          </h2>

          <p className="growth__intro-text">
            Colocar algo no ar é só o começo.
            <br />
            O que vem depois também pode evoluir.
          </p>
        </header>


        {/* =====================================================
            EXPERIENCE
            ===================================================== */}

        <div className="growth__experience">

          {/* ===================================================
              NAVIGATION
              =================================================== */}

          <nav
            className="growth__nav"
            aria-label="Etapas de crescimento"
          >
            {stages.map((stage, index) => {
              const isActive =
                activeStage === index

              return (
                <button
                  key={stage.id}
                  type="button"
                  className={`growth__nav-item ${
                    isActive
                      ? 'is-active'
                      : ''
                  }`}
                  onClick={() =>
                    setActiveStage(index)
                  }
                  aria-selected={isActive}
                  role="tab"
                >
                  <span className="growth__nav-line">
                    <span />
                  </span>

                  <span className="growth__nav-label">
                    {stage.label}
                  </span>
                </button>
              )
            })}
          </nav>


          {/* ===================================================
              CONTENT
              =================================================== */}

          <div className="growth__content">

            <div
              className="growth__copy"
              key={active.id}
            >
              <span className="growth__copy-label">
                {active.label}
              </span>

              <h3>
                {active.title}
              </h3>

              <p>
                {active.description}
              </p>

              <ul>
                {active.points.map((point) => (
                  <li key={point}>
                    <span aria-hidden="true">
                      +
                    </span>

                    {point}
                  </li>
                ))}
              </ul>
            </div>


            {/* =================================================
                PRODUCT VISUAL
                ================================================= */}

            <div
              className="growth__visual"
              key={active.visual}
              aria-hidden="true"
            >
              <div className="growth__visual-window">

                <div className="growth__visual-top">
                  <span className="growth__visual-dot" />
                  <span className="growth__visual-dot" />
                  <span className="growth__visual-dot" />

                  <span className="growth__visual-address">
                    rouxinol.digital
                  </span>
                </div>


                <div className="growth__visual-body">

                  <div className="growth__visual-heading">
                    <span />
                    <span />
                    <span />
                  </div>

                  <div className="growth__visual-columns">

                    <div className="growth__visual-main">
                      <span />
                      <span />
                      <span />
                    </div>

                    <div className="growth__visual-side">
                      <span />
                      <span />
                    </div>

                  </div>

                  <div className="growth__visual-footer">
                    <span />
                    <span />
                    <span />
                  </div>

                </div>


                <div
                  className={`growth__visual-status growth__visual-status--${activeStage}`}
                >
                  <span className="growth__visual-status-dot" />

                  {active.label}

                  <strong>
                    {activeStage === 0 &&
                      'Pronto para começar'}

                    {activeStage === 1 &&
                      'Entendendo o momento'}

                    {activeStage === 2 &&
                      'Melhorando a experiência'}

                    {activeStage === 3 &&
                      'Pronto para crescer'}
                  </strong>
                </div>

              </div>
            </div>

          </div>

        </div>


        {/* =====================================================
            BOTTOM STATEMENT
            ===================================================== */}

        <div className="growth__bottom">

          <div className="growth__bottom-line">
            <span />
          </div>

          <div className="growth__bottom-copy">
            <span className="growth__bottom-label">
              CONTINUIDADE
            </span>

            <p>
              Você não precisa decidir tudo agora.
              Quando chegar a hora de mudar,
              a gente muda junto.
            </p>
          </div>

          <a
            href="#contact"
            className="growth__bottom-link"
          >
            <span>
              CONVERSAR SOBRE O PRÓXIMO PASSO
            </span>

            <span
              className="growth__bottom-arrow"
              aria-hidden="true"
            >
              ↗
            </span>
          </a>

        </div>

      </div>
    </section>
  )
}