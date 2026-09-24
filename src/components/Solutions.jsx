import { useEffect, useRef, useState } from 'react'

import '../styles/solutions.css'

const solutions = [
  {
    id: 'landing',
    number: '01',
    category: 'VISIBILIDADE',
    name: 'Landing Page',
    question:
      'Precisa colocar uma ideia na frente das pessoas certas?',
    description:
      'Uma página criada para apresentar seu negócio, serviço ou oferta com clareza e levar quem chegou até você para uma ação.',
    keywords: ['aparecer', 'apresentar', 'converter'],
  },
  {
    id: 'institutional',
    number: '02',
    category: 'PRESENÇA',
    name: 'Site Institucional',
    question:
      'Seu negócio precisa de um espaço próprio na internet?',
    description:
      'Um site completo para apresentar sua empresa, sua história, seus serviços e tudo aquilo que faz sua marca ser reconhecida.',
    keywords: ['empresa', 'marca', 'presença'],
  },
  {
    id: 'catalog',
    number: '03',
    category: 'PRODUTOS',
    name: 'Catálogo Digital',
    question:
      'Tem produtos para mostrar?',
    description:
      'Um espaço organizado para apresentar seus produtos de forma simples, bonita e fácil de consultar — sem depender de mandar foto por foto.',
    keywords: ['produtos', 'organização', 'apresentação'],
  },
  {
    id: 'booking',
    number: '04',
    category: 'PROCESSOS',
    name: 'Agendamento',
    question:
      'Seus clientes precisam marcar horários com você?',
    description:
      'Uma solução para organizar horários, disponibilidade e agendamentos e deixar uma parte da sua rotina mais simples.',
    keywords: ['horários', 'clientes', 'organização'],
  },
  {
    id: 'management',
    number: '05',
    category: 'ORGANIZAÇÃO',
    name: 'Sistema de Gestão',
    question:
      'Sua operação está espalhada por planilhas, mensagens e anotações?',
    description:
      'Uma ferramenta pensada para reunir cadastros, registros e operações em um único lugar, de acordo com a realidade do seu negócio.',
    keywords: ['gestão', 'cadastros', 'processos'],
  },
  {
    id: 'dashboard',
    number: '06',
    category: 'DADOS',
    name: 'Dashboard',
    question:
      'Você tem números, mas sente que eles não dizem nada?',
    description:
      'Uma visão mais clara dos seus dados para acompanhar informações importantes e entender melhor o que está acontecendo no negócio.',
    keywords: ['dados', 'visão', 'decisões'],
  },
  {
    id: 'store',
    number: '07',
    category: 'VENDAS',
    name: 'Loja Virtual',
    question:
      'Quer vender pela internet com um espaço próprio?',
    description:
      'Uma loja digital para apresentar seus produtos, organizar sua operação e criar uma experiência de compra própria para sua marca.',
    keywords: ['vender', 'produtos', 'online'],
  },
  {
    id: 'custom',
    number: '08',
    category: 'IDEIA',
    name: 'Solução Personalizada',
    question:
      'Sua ideia não cabe em nenhuma dessas opções?',
    description:
      'Nem todo problema vem com um nome pronto. Quando a necessidade é diferente, a solução pode ser pensada em torno dela.',
    keywords: ['ideia', 'necessidade', 'sob medida'],
  },
]

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export default function Solutions() {
  const sectionRef = useRef(null)
  const frameRef = useRef(null)

  const targetProgressRef = useRef(0)
  const smoothProgressRef = useRef(0)

  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({
    x: 50,
    y: 50,
  })

  useEffect(() => {
    const section = sectionRef.current

    if (!section) {
      return undefined
    }

    function calculateProgress() {
      const rect = section.getBoundingClientRect()

      const scrollableDistance =
        rect.height - window.innerHeight

      if (scrollableDistance <= 0) {
        targetProgressRef.current = 0
        return
      }

      const rawProgress =
        -rect.top / scrollableDistance

      targetProgressRef.current = clamp(
        rawProgress,
        0,
        1,
      )
    }

    function animate() {
      const target = targetProgressRef.current
      const current = smoothProgressRef.current

      const difference = target - current

      smoothProgressRef.current += difference * 0.16

      if (Math.abs(difference) < 0.0001) {
        smoothProgressRef.current = target
      }

      setProgress(smoothProgressRef.current)

      frameRef.current =
        window.requestAnimationFrame(animate)
    }

    function requestProgressUpdate() {
      calculateProgress()
    }

    calculateProgress()

    frameRef.current =
      window.requestAnimationFrame(animate)

    window.addEventListener(
      'scroll',
      requestProgressUpdate,
      { passive: true },
    )

    window.addEventListener(
      'resize',
      requestProgressUpdate,
    )

    return () => {
      window.removeEventListener(
        'scroll',
        requestProgressUpdate,
      )

      window.removeEventListener(
        'resize',
        requestProgressUpdate,
      )

      if (frameRef.current) {
        window.cancelAnimationFrame(
          frameRef.current,
        )
      }
    }
  }, [])

  useEffect(() => {
    const section = sectionRef.current

    if (!section) {
      return undefined
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting)
        },
        {
          threshold: 0.08,
        },
      )

    observer.observe(section)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const section = sectionRef.current

    if (!section) {
      return undefined
    }

    function handlePointerMove(event) {
      const rect =
        section.getBoundingClientRect()

      const x =
        ((event.clientX - rect.left) /
          rect.width) *
        100

      const y =
        ((event.clientY - rect.top) /
          rect.height) *
        100

      setMousePosition({
        x: clamp(x, 0, 100),
        y: clamp(y, 0, 100),
      })
    }

    function handlePointerLeave() {
      setMousePosition({
        x: 50,
        y: 50,
      })
    }

    section.addEventListener(
      'pointermove',
      handlePointerMove,
    )

    section.addEventListener(
      'pointerleave',
      handlePointerLeave,
    )

    return () => {
      section.removeEventListener(
        'pointermove',
        handlePointerMove,
      )

      section.removeEventListener(
        'pointerleave',
        handlePointerLeave,
      )
    }
  }, [])

  const wheelPosition =
    progress * (solutions.length - 1)

  const activeIndex = clamp(
    Math.round(wheelPosition),
    0,
    solutions.length - 1,
  )

  const activeSolution =
    solutions[activeIndex]

  function goToSolution(index) {
    const section = sectionRef.current

    if (!section) {
      return
    }

    const targetProgress =
      index / (solutions.length - 1)

    const sectionTop =
      window.scrollY +
      section.getBoundingClientRect().top

    const scrollableDistance =
      section.offsetHeight -
      window.innerHeight

    window.scrollTo({
      top:
        sectionTop +
        targetProgress *
          scrollableDistance,
      behavior: 'smooth',
    })
  }

  function handleKeyDown(event) {
    if (
      event.key !== 'ArrowDown' &&
      event.key !== 'ArrowRight' &&
      event.key !== 'ArrowUp' &&
      event.key !== 'ArrowLeft'
    ) {
      return
    }

    event.preventDefault()

    if (
      event.key === 'ArrowDown' ||
      event.key === 'ArrowRight'
    ) {
      goToSolution(
        Math.min(
          activeIndex + 1,
          solutions.length - 1,
        ),
      )

      return
    }

    goToSolution(
      Math.max(
        activeIndex - 1,
        0,
      ),
    )
  }

  return (
    <section
      ref={sectionRef}
      className={`solutions ${
        isVisible ? 'is-visible' : ''
      }`}
      id="solucoes"
      aria-labelledby="solutions-title"
      tabIndex="0"
      onKeyDown={handleKeyDown}
      style={{
        '--mouse-x': `${mousePosition.x}%`,
        '--mouse-y': `${mousePosition.y}%`,
      }}
    >
      <div className="solutions__sticky">
        <div
          className="solutions__background"
          aria-hidden="true"
        >
          <div className="solutions__background-glow" />
          <div className="solutions__background-shape" />
        </div>

        <div className="solutions__intro">
          <span className="solutions__eyebrow">
            NÃO SABE POR ONDE COMEÇAR?
          </span>

          <h2
            className="solutions__title"
            id="solutions-title"
          >
            <span className="solutions__title-line">
              Mas como saber
            </span>

            <span className="solutions__title-line solutions__title-line--accent">
              o que você precisa?
            </span>
          </h2>

          <p className="solutions__lead">
            Você não precisa saber
            o nome da solução.
            <strong>
              {' '}
              Precisa saber o que
              quer resolver.
            </strong>
          </p>
        </div>

        <div className="solutions__roulette">
          <div className="solutions__roulette-window">
            <div className="solutions__roulette-list">
              {solutions.map(
                (solution, index) => {
                  const distance =
                    index -
                    wheelPosition

                  const absoluteDistance =
                    Math.abs(distance)

                  const isActive =
                    index === activeIndex

                  const translateY =
                    distance * 118

                  const scale =
                    isActive
                      ? 1
                      : Math.max(
                          0.68,
                          1 -
                            absoluteDistance *
                              0.13,
                        )

                  const opacity =
                    absoluteDistance > 2.5
                      ? 0
                      : Math.max(
                          0.18,
                          1 -
                            absoluteDistance *
                              0.34,
                        )

                  const blur =
                    isActive
                      ? 0
                      : Math.min(
                          absoluteDistance *
                            1.2,
                          4,
                        )

                  const translateX =
                    distance === 0
                      ? 0
                      : distance > 0
                        ? Math.min(
                            absoluteDistance *
                              22,
                            70,
                          )
                        : Math.max(
                            absoluteDistance *
                              -22,
                            -70,
                          )

                  const rotation =
                    clamp(
                      distance * -1.8,
                      -5,
                      5,
                    )

                  return (
                    <button
                      key={solution.id}
                      type="button"
                      className={`solutions__item ${
                        isActive
                          ? 'is-active'
                          : ''
                      }`}
                      onClick={() =>
                        goToSolution(index)
                      }
                      aria-label={`${solution.category}: ${solution.name}`}
                      aria-current={
                        isActive
                          ? 'step'
                          : undefined
                      }
                      style={{
                        '--item-y': `${translateY}px`,
                        '--item-x': `${translateX}px`,
                        '--item-scale': scale,
                        '--item-opacity': opacity,
                        '--item-blur': `${blur}px`,
                        '--item-rotate': `${rotation}deg`,
                        '--item-distance':
                          absoluteDistance,
                        zIndex:
                          100 -
                          Math.round(
                            absoluteDistance *
                              10,
                          ),
                      }}
                    >
                      <span className="solutions__item-number">
                        {solution.number}
                      </span>

                      <span className="solutions__item-content">
                        <span className="solutions__item-category">
                          {solution.category}
                        </span>

                        <span className="solutions__item-name">
                          {solution.name}
                        </span>
                      </span>

                      <span className="solutions__item-arrow">
                        ↗
                      </span>
                    </button>
                  )
                },
              )}
            </div>
          </div>

          <div
            className="solutions__active"
            key={activeSolution.id}
          >
            <div className="solutions__active-top">
              <span>
                {activeSolution.category}
              </span>

              <span>
                {activeSolution.number}
                {' / '}
                08
              </span>
            </div>

            <h3 className="solutions__active-question">
              {activeSolution.question}
            </h3>

            <p className="solutions__active-description">
              {activeSolution.description}
            </p>

            <div className="solutions__keywords">
              {activeSolution.keywords.map(
                (keyword, index) => (
                  <span
                    key={keyword}
                    style={{
                      '--keyword-delay': `${
                        index * 70
                      }ms`,
                    }}
                  >
                    {keyword}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="solutions__footer">
          <div className="solutions__progress">
            <span>
              {activeSolution.number}
            </span>

            <span className="solutions__progress-line">
              <span
                style={{
                  transform:
                    `scaleX(${progress})`,
                }}
              />
            </span>

            <span>
              08
            </span>
          </div>

          <span className="solutions__scroll-hint">
            ROLE PARA DESCOBRIR
            <span className="solutions__scroll-arrow">
              ↓
            </span>
          </span>
        </div>
      </div>
    </section>
  )
}