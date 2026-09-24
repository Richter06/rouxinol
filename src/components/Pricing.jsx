import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import '../styles/pricing.css'

const categories = [
  {
    id: 'presence',
    eyebrow: 'PRESENÇA DIGITAL',
    name: 'Ser visto',
    description:
      'Para apresentar seu negócio com clareza, mostrar o que você oferece e criar um espaço próprio para sua marca na internet.',
    projects: [
      {
        name: 'Landing page',
        price: 'R$ 900',
        amount: 900,
      },
      {
        name: 'Site institucional',
        price: 'R$ 1.500',
        amount: 1500,
      },
      {
        name: 'Catálogo / vitrine',
        price: 'R$ 1.800',
        amount: 1800,
      },
    ],
  },
  {
    id: 'commercial',
    eyebrow: 'EXPERIÊNCIA COMERCIAL',
    name: 'Vender melhor',
    description:
      'Para organizar produtos, serviços e atendimentos e tornar mais simples o caminho entre conhecer seu negócio e entrar em contato.',
    projects: [
      {
        name: 'Agendamento',
        price: 'R$ 2.000',
        amount: 2000,
      },
      {
        name: 'Loja virtual',
        price: 'R$ 2.500',
        amount: 2500,
      },
    ],
  },
  {
    id: 'digital',
    eyebrow: 'SOLUÇÕES DIGITAIS',
    name: 'Organizar',
    description:
      'Para quando processos, informações e tarefas começam a ocupar tempo demais e precisam de uma solução mais organizada.',
    projects: [
      {
        name: 'Dashboard',
        price: 'R$ 3.000',
        amount: 3000,
      },
      {
        name: 'Sistema de gestão',
        price: 'R$ 3.500',
        amount: 3500,
      },
    ],
  },
  {
    id: 'custom',
    eyebrow: 'PROJETO PERSONALIZADO',
    name: 'Algo diferente',
    description:
      'Para necessidades que não cabem em uma solução pronta. O projeto começa entendendo o que seu negócio realmente precisa.',
    projects: [
      {
        name: 'Solução sob medida',
        price: 'Sob consulta',
      },
    ],
  },
]

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

function getReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/* Menor preço da categoria (usa o texto original, sem recalcular) */
function getStartingPrice(category) {
  const priced = category.projects.filter((project) => project.amount)

  if (priced.length === 0) {
    return null
  }

  return priced.reduce((min, project) =>
    project.amount < min.amount ? project : min,
  ).price
}

/* ---------------------------------------------------------
   Odômetro: o preço "corre" quando o painel abre
--------------------------------------------------------- */
function Price({ project, run, reduced }) {
  const [value, setValue] = useState(project.amount ?? 0)

  useLayoutEffect(() => {
    if (!project.amount) {
      return undefined
    }

    if (reduced || !run) {
      setValue(project.amount)
      return undefined
    }

    let frame = 0
    let start = null

    setValue(0)

    const tick = (now) => {
      if (start === null) {
        start = now
      }

      const t = clamp((now - start - 300) / 900, 0, 1)
      const eased = 1 - Math.pow(1 - t, 4)

      setValue(Math.round(project.amount * eased))

      if (t < 1) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frame)
  }, [run, reduced, project.amount])

  if (!project.amount) {
    return (
      <span className="pricing__project-price">
        {project.price}
      </span>
    )
  }

  return (
    <span className="pricing__project-price">
      a partir de R$ {value.toLocaleString('pt-BR')}
    </span>
  )
}

export default function Pricing() {
  const sectionRef = useRef(null)
  const gridRef = useRef(null)
  const bodyRefs = useRef([])

  const [isVisible, setIsVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [reduced] = useState(getReducedMotion)

  /* Entrada única: máscaras do título e primeiro painel */
  useEffect(() => {
    const section = sectionRef.current

    if (!section) {
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
        threshold: 0.12,
      },
    )

    observer.observe(section)

    return () => observer.disconnect()
  }, [])

  /* ---------------------------------------------------------
     Escada guiada pelo scroll
     O scroll vira --rise (0 a 1, com inércia). Os quatro
     degraus sobem em sequência e voltam ao rolar de volta.
     O loop só roda com a seção perto da viewport e dorme
     assim que o valor estabiliza.
  --------------------------------------------------------- */
  useLayoutEffect(() => {
    const section = sectionRef.current
    const grid = gridRef.current

    if (!section || !grid) {
      return undefined
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    let reducedMotion = motionQuery.matches
    let inView = false
    let frameId = 0
    let current = 0
    let target = 0

    function computeTarget() {
      if (reducedMotion) {
        target = 1
        return
      }

      const rect = grid.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const d = (rect.top + rect.height / 2 - vh / 2) / vh

      target = clamp(1 - (d - 0.05) / 0.5, 0, 1)
    }

    function tick() {
      frameId = 0

      computeTarget()

      if (reducedMotion) {
        current = target
      } else {
        current += (target - current) * 0.12

        if (Math.abs(target - current) < 0.001) {
          current = target
        }
      }

      grid.style.setProperty('--rise', current.toFixed(4))

      if (current !== target && inView) {
        kick()
      }
    }

    function kick() {
      if (!frameId) {
        frameId = requestAnimationFrame(tick)
      }
    }

    /* estado inicial sem animação de montagem */
    computeTarget()
    current = target
    grid.style.setProperty('--rise', current.toFixed(4))

    const viewObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting

        if (inView) {
          kick()
        }
      },
      { rootMargin: '20% 0px 20% 0px' },
    )

    viewObserver.observe(section)

    const onScroll = () => {
      if (inView) {
        kick()
      }
    }

    const onMotionChange = (event) => {
      reducedMotion = event.matches
      kick()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    motionQuery.addEventListener('change', onMotionChange)

    return () => {
      cancelAnimationFrame(frameId)
      viewObserver.disconnect()

      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      motionQuery.removeEventListener('change', onMotionChange)
    }
  }, [])

  function openPanel(event, index) {
    setActiveIndex(index)

    /* navegação por teclado: leva o foco para o conteúdo aberto */
    if (event.detail === 0) {
      requestAnimationFrame(() => {
        bodyRefs.current[index]?.focus({ preventScroll: true })
      })
    }
  }

  /* luz suave que segue o mouse dentro do painel */
  function handlePointerMove(event) {
    if (event.pointerType !== 'mouse') {
      return
    }

    const panel = event.target.closest('.pricing__panel')

    if (!panel) {
      return
    }

    const rect = panel.getBoundingClientRect()

    panel.style.setProperty(
      '--mx',
      `${(((event.clientX - rect.left) / rect.width) * 100).toFixed(1)}%`,
    )

    panel.style.setProperty(
      '--my',
      `${(((event.clientY - rect.top) / rect.height) * 100).toFixed(1)}%`,
    )
  }

  return (
    <section
      ref={sectionRef}
      className={`pricing ${
        isVisible ? 'is-visible' : ''
      }`}
      id="pricing"
      aria-labelledby="pricing-title"
    >
      <div className="pricing__inner">

        <header className="pricing__header">

          <span className="pricing__eyebrow">
            INVESTIMENTO
          </span>

          <div className="pricing__heading">

            <div className="pricing__heading-main">

              <h2 id="pricing-title">
                <span className="pricing__line">
                  <span>Cada projeto</span>
                </span>

                <span className="pricing__line pricing__line--accent">
                  <span>começa de um jeito.</span>
                </span>
              </h2>

            </div>

            <div className="pricing__intro">

              <p>
                Cada solução parte de um
                ponto de partida diferente.
              </p>

              <p>
                O valor final acompanha o
                que o projeto precisa.
              </p>

            </div>

          </div>

        </header>

        <p className="pricing__hint">
          Escolha um ponto de partida para ver as soluções
        </p>

        <div
          ref={gridRef}
          className="pricing__grid"
          onPointerMove={handlePointerMove}
        >

          {categories.map((category, index) => {
            const isActive = index === activeIndex
            const startingPrice = getStartingPrice(category)

            return (
              <article
                key={category.id}
                className={`pricing__panel ${
                  isActive ? 'is-active' : ''
                }`}
                style={{ '--i': index }}
              >

                <button
                  type="button"
                  className="pricing__tab"
                  aria-expanded={isActive}
                  aria-controls={`pricing-body-${category.id}`}
                  tabIndex={isActive ? -1 : 0}
                  onClick={(event) => openPanel(event, index)}
                >
                  <span className="pricing__tab-number">
                    0{index + 1}
                  </span>

                  <span className="pricing__tab-name">
                    {category.name}
                  </span>

                  <span className="pricing__tab-foot">
                    <span className="pricing__tab-price">
                      {startingPrice ? (
                        <>
                          <small>a partir de</small>
                          {startingPrice}
                        </>
                      ) : (
                        'Sob consulta'
                      )}
                    </span>

                    <span
                      className="pricing__tab-plus"
                      aria-hidden="true"
                    />
                  </span>
                </button>

                <div
                  ref={(element) => {
                    bodyRefs.current[index] = element
                  }}
                  id={`pricing-body-${category.id}`}
                  className="pricing__body"
                  tabIndex={-1}
                >
                  <div className="pricing__body-inner">
                    <div className="pricing__body-pad">

                      <span
                        className="pricing__card-eyebrow pricing__reveal"
                        style={{ '--k': 0 }}
                      >
                        {category.eyebrow}
                      </span>

                      <div className="pricing__card-heading">

                        <h3
                          className="pricing__reveal"
                          style={{ '--k': 1 }}
                        >
                          {category.name}
                        </h3>

                        <p
                          className="pricing__reveal"
                          style={{ '--k': 2 }}
                        >
                          {category.description}
                        </p>

                      </div>

                      <div className="pricing__projects">

                        <span
                          className="pricing__projects-label pricing__reveal"
                          style={{ '--k': 3 }}
                        >
                          SOLUÇÕES
                        </span>

                        {category.projects.map((project, projectIndex) => (
                          <div
                            className="pricing__project pricing__reveal"
                            style={{ '--k': 4 + projectIndex }}
                            key={project.name}
                          >

                            <span className="pricing__project-name">
                              {project.name}
                            </span>

                            <Price
                              project={project}
                              run={isActive && isVisible}
                              reduced={reduced}
                            />

                          </div>
                        ))}

                      </div>

                      <a
                        href="#contact"
                        className="pricing__card-cta pricing__reveal"
                        style={{ '--k': 7 }}
                      >
                        <span>
                          {category.id === 'custom'
                            ? 'CONVERSAR SOBRE O PROJETO'
                            : 'VER ESSA POSSIBILIDADE'}
                        </span>

                        <span aria-hidden="true">
                          ↗
                        </span>
                      </a>

                    </div>
                  </div>
                </div>

              </article>
            )
          })}

        </div>

        <footer className="pricing__footer">

          <div className="pricing__footer-label">
            <span />
            VALORES INICIAIS
          </div>

          <p>
            O valor final depende do escopo,
            funcionalidades e complexidade
            de cada projeto.
          </p>

          <a href="#contact">
            NÃO SABE POR ONDE COMEÇAR?
            <span aria-hidden="true">
              ↗
            </span>
          </a>

        </footer>

      </div>
    </section>
  )
}