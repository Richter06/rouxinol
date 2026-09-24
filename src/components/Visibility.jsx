import { useEffect, useRef, useState } from 'react'

import '../styles/visibility.css'

const stages = [
  {
    id: 'presence',
    title: 'Aparecer.',
    question:
      'As pessoas procuram pelo que você faz e não encontram.',
    context:
      'Seu negócio pode ser bom. O problema é que, se ele não aparece, para muita gente ele simplesmente não existe.',
    answer:
      'Vamos dar um lugar para o seu negócio ser encontrado.',
    solution: 'LANDING PAGE OU SITE',
    visual: 'search',
  },

  {
    id: 'organization',
    title: 'Encontrar.',
    question:
      'Você sabe que tem tudo anotado em algum lugar. Só não sabe em qual.',
    context:
      'Planilhas, cadernos, mensagens e aquela informação importante que está “com alguém”. Uma hora isso cobra a conta.',
    answer:
      'Talvez esteja na hora de parar de procurar informação dentro do próprio negócio.',
    solution: 'SISTEMA',
    visual: 'system',
  },

  {
    id: 'processes',
    title: 'Simplificar.',
    question:
      'Você ainda perde tempo fazendo a mesma coisa toda semana.',
    context:
      'Copiar, conferir, responder, anotar, procurar, repetir. Pequenas tarefas parecem inofensivas até somarem um dia inteiro.',
    answer:
      'Se uma máquina pode fazer a parte chata, deixe ela fazer a parte chata.',
    solution: 'AUTOMAÇÃO E FERRAMENTAS',
    visual: 'process',
  },

  {
    id: 'data',
    title: 'Enxergar.',
    question:
      'Você tem números. Só não consegue enxergar o que eles estão dizendo.',
    context:
      'Vendas, clientes, pedidos e resultados existem. Mas quando tudo fica espalhado, até uma pergunta simples vira investigação.',
    answer:
      'Seus números não precisam parecer um interrogatório.',
    solution: 'DASHBOARD',
    visual: 'data',
  },

  {
    id: 'sales',
    title: 'Conectar.',
    question:
      'Você tem coisa boa para vender, mas parece que ninguém está olhando.',
    context:
      'O produto está lá. O preço está lá. Você está lá. E mesmo assim, parece que o cliente passou reto.',
    answer:
      'Talvez seu produto precise de uma experiência melhor para chegar até ele.',
    solution: 'CATÁLOGO OU LOJA',
    visual: 'commerce',
  },

  {
    id: 'custom',
    title: 'Criar.',
    question:
      'Você tem uma ideia que não cabe em nenhuma ferramenta pronta.',
    context:
      'Você explica o que precisa e sempre aparece alguém dizendo que existe uma plataforma para isso. Só que nenhuma resolve exatamente o seu problema.',
    answer:
      'Então talvez seja a ferramenta que esteja errada para o problema.',
    solution: 'PROJETO PERSONALIZADO',
    visual: 'network',
  },
]

const PARTICLE_COUNT = 34
const CUBE_COUNT = 10

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function createParticles() {
  return Array.from({ length: PARTICLE_COUNT }, (_, index) => ({
    id: `particle-${index}`,
    x: `${(index * 37.17) % 100}%`,
    y: `${(index * 61.73) % 100}%`,
    z: Math.round(((index * 83) % 100) - 50),
    size: 2 + ((index * 13) % 4),
    delay: `${(index % 8) * -0.7}s`,
    duration: `${5 + (index % 6)}s`,
  }))
}

function createCubes() {
  return Array.from({ length: CUBE_COUNT }, (_, index) => ({
    id: `cube-${index}`,
    x: `${10 + ((index * 47) % 80)}%`,
    y: `${8 + ((index * 31) % 78)}%`,
    z: -260 + ((index * 83) % 520),
    size: 16 + ((index * 17) % 34),
    rotateX: (index * 41) % 360,
    rotateY: (index * 67) % 360,
    rotateZ: (index * 23) % 360,
    delay: `${(index % 6) * -0.9}s`,
  }))
}

const particles = createParticles()
const cubes = createCubes()

function splitWords(text) {
  return text.split(' ').map((word, index) => (
    <span
      key={`${word}-${index}`}
      className="visibility__word"
      style={{
        '--word-delay': `${index * 28}ms`,
      }}
    >
      {word}
    </span>
  ))
}

function Particles({ stage }) {
  return (
    <div
      className={`visibility__particles visibility__particles--${stage}`}
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="visibility__particle"
          style={{
            '--x': particle.x,
            '--y': particle.y,
            '--z': `${particle.z}px`,
            '--size': `${particle.size}px`,
            '--delay': particle.delay,
            '--duration': particle.duration,
          }}
        />
      ))}
    </div>
  )
}

function Cubes({ stage }) {
  return (
    <div
      className={`visibility__cubes visibility__cubes--${stage}`}
      aria-hidden="true"
    >
      {cubes.map((cube) => (
        <span
          key={cube.id}
          className="visibility__cube"
          style={{
            '--x': cube.x,
            '--y': cube.y,
            '--z': `${cube.z}px`,
            '--size': `${cube.size}px`,
            '--rx': `${cube.rotateX}deg`,
            '--ry': `${cube.rotateY}deg`,
            '--rz': `${cube.rotateZ}deg`,
            '--delay': cube.delay,
          }}
        >
          <span className="visibility__cube-face visibility__cube-face--front" />
          <span className="visibility__cube-face visibility__cube-face--back" />
          <span className="visibility__cube-face visibility__cube-face--left" />
          <span className="visibility__cube-face visibility__cube-face--right" />
          <span className="visibility__cube-face visibility__cube-face--top" />
          <span className="visibility__cube-face visibility__cube-face--bottom" />
        </span>
      ))}
    </div>
  )
}

function SearchVisual() {
  return (
    <div className="visibility__visual-object visibility__visual-object--search">
      <div className="visibility__search-window">
        <div className="visibility__window-top">
          <span />
          <span />
          <span />
          <small>buscar</small>
        </div>

        <div className="visibility__search-bar">
          <span className="visibility__search-icon">⌕</span>
          <span>negócio perto de mim</span>
        </div>

        <div className="visibility__search-result">
          <div className="visibility__result-image" />

          <div>
            <strong>Seu negócio</strong>
            <span>Presença digital</span>
            <small>★★★★★</small>
          </div>

          <b>↗</b>
        </div>
      </div>

      <div className="visibility__floating-tag visibility__floating-tag--one">
        ENCONTRADO
      </div>

      <div className="visibility__floating-tag visibility__floating-tag--two">
        + PRESENÇA
      </div>
    </div>
  )
}

function SystemVisual() {
  return (
    <div className="visibility__visual-object visibility__visual-object--system">
      <div className="visibility__system-core">
        <span>ROUXINOL</span>
        <strong>SEU NEGÓCIO</strong>
      </div>

      <div className="visibility__system-node visibility__system-node--one">
        CLIENTES
      </div>

      <div className="visibility__system-node visibility__system-node--two">
        PRODUTOS
      </div>

      <div className="visibility__system-node visibility__system-node--three">
        PEDIDOS
      </div>

      <div className="visibility__system-node visibility__system-node--four">
        ROTINA
      </div>

      <span className="visibility__system-line visibility__system-line--one" />
      <span className="visibility__system-line visibility__system-line--two" />
      <span className="visibility__system-line visibility__system-line--three" />
      <span className="visibility__system-line visibility__system-line--four" />
    </div>
  )
}

function ProcessVisual() {
  return (
    <div className="visibility__visual-object visibility__visual-object--process">
      <div className="visibility__process-column visibility__process-column--one">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="visibility__process-arrow">→</div>

      <div className="visibility__process-column visibility__process-column--two">
        <span />
        <span />
        <span />
      </div>

      <div className="visibility__process-core">
        <span>1</span>
        <strong>AÇÃO</strong>
        <small>AUTOMÁTICA</small>
      </div>
    </div>
  )
}

function DataVisual() {
  return (
    <div className="visibility__visual-object visibility__visual-object--data">
      <div className="visibility__data-grid">
        <span className="visibility__data-bar" />
        <span className="visibility__data-bar" />
        <span className="visibility__data-bar" />
        <span className="visibility__data-bar" />
        <span className="visibility__data-bar" />
        <span className="visibility__data-bar" />
        <span className="visibility__data-bar" />
      </div>

      <div className="visibility__data-card">
        <small>VISÃO GERAL</small>
        <strong>84,7%</strong>
        <span>crescimento</span>
      </div>

      <div className="visibility__data-orbit">
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}

function CommerceVisual() {
  return (
    <div className="visibility__visual-object visibility__visual-object--commerce">
      <div className="visibility__commerce-card visibility__commerce-card--back">
        <span />
        <span />
        <span />
      </div>

      <div className="visibility__commerce-card visibility__commerce-card--front">
        <div className="visibility__commerce-image" />

        <div className="visibility__commerce-copy">
          <small>CATÁLOGO</small>
          <strong>Seu produto</strong>
          <span>R$ 149,90</span>
        </div>

        <button type="button">VER PRODUTO</button>
      </div>
    </div>
  )
}

function NetworkVisual({ mouse }) {
  const rotateX = mouse.y * -7
  const rotateY = mouse.x * 10

  return (
    <div
      className="visibility__network-scene"
      style={{
        '--network-rotate-x': `${rotateX}deg`,
        '--network-rotate-y': `${rotateY}deg`,
      }}
    >
      <div className="visibility__network-space">
        <div className="visibility__network-node visibility__network-node--center">
          <span>R</span>
        </div>

        <div className="visibility__network-node visibility__network-node--one">
          <span>01</span>
        </div>

        <div className="visibility__network-node visibility__network-node--two">
          <span>02</span>
        </div>

        <div className="visibility__network-node visibility__network-node--three">
          <span>03</span>
        </div>

        <div className="visibility__network-node visibility__network-node--four">
          <span>04</span>
        </div>

        <div className="visibility__network-node visibility__network-node--five">
          <span>05</span>
        </div>

        <span className="visibility__network-line visibility__network-line--one" />
        <span className="visibility__network-line visibility__network-line--two" />
        <span className="visibility__network-line visibility__network-line--three" />
        <span className="visibility__network-line visibility__network-line--four" />
        <span className="visibility__network-line visibility__network-line--five" />

        <span className="visibility__network-ring visibility__network-ring--one" />
        <span className="visibility__network-ring visibility__network-ring--two" />
      </div>

      <div className="visibility__network-caption">
        <span>EXPLORE THE SPACE</span>
        <strong>YOUR IDEA</strong>
      </div>
    </div>
  )
}

function StageVisual({ stage, mouse }) {
  return (
    <div className="visibility__visual">
      <div className="visibility__visual-grid" />

      <div className="visibility__visual-depth">
        <span className="visibility__depth-ring visibility__depth-ring--one" />
        <span className="visibility__depth-ring visibility__depth-ring--two" />
        <span className="visibility__depth-ring visibility__depth-ring--three" />
      </div>

      <Particles stage={stage.visual} />
      <Cubes stage={stage.visual} />

      <div
        className="visibility__visual-camera"
        style={{
          '--mouse-x': mouse.x,
          '--mouse-y': mouse.y,
        }}
      >
        {stage.visual === 'search' && <SearchVisual />}
        {stage.visual === 'system' && <SystemVisual />}
        {stage.visual === 'process' && <ProcessVisual />}
        {stage.visual === 'data' && <DataVisual />}
        {stage.visual === 'commerce' && <CommerceVisual />}
        {stage.visual === 'network' && <NetworkVisual mouse={mouse} />}
      </div>
    </div>
  )
}

export default function Visibility() {
  const sectionRef = useRef(null)
  const targetProgressRef = useRef(0)
  const smoothProgressRef = useRef(0)
  const frameRef = useRef(null)

  const [activeIndex, setActiveIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [scrollProgress, setScrollProgress] = useState(0)

  const activeStage = stages[activeIndex]

  useEffect(() => {
    const element = sectionRef.current

    if (!element) {
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        threshold: 0.08,
      },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const element = sectionRef.current

    if (!element) {
      return undefined
    }

    function calculateProgress() {
      const rect = element.getBoundingClientRect()
      const total = rect.height - window.innerHeight

      if (total <= 0) {
        targetProgressRef.current = 0
        return
      }

      targetProgressRef.current = clamp(
        -rect.top / total,
        0,
        1,
      )
    }

    function animate() {
      const target = targetProgressRef.current
      const current = smoothProgressRef.current

      const difference = target - current

      smoothProgressRef.current += difference * 0.18

      if (Math.abs(difference) < 0.0001) {
        smoothProgressRef.current = target
      }

      const nextProgress = smoothProgressRef.current

      setScrollProgress(nextProgress)

      const nextIndex = Math.min(
        stages.length - 1,
        Math.floor(nextProgress * stages.length),
      )

      setActiveIndex((currentIndex) =>
        currentIndex === nextIndex
          ? currentIndex
          : nextIndex,
      )

      frameRef.current =
        window.requestAnimationFrame(animate)
    }

    calculateProgress()

    frameRef.current =
      window.requestAnimationFrame(animate)

    window.addEventListener(
      'scroll',
      calculateProgress,
      { passive: true },
    )

    window.addEventListener(
      'resize',
      calculateProgress,
    )

    return () => {
      window.removeEventListener(
        'scroll',
        calculateProgress,
      )

      window.removeEventListener(
        'resize',
        calculateProgress,
      )

      if (frameRef.current) {
        window.cancelAnimationFrame(
          frameRef.current,
        )
      }
    }
  }, [])

  useEffect(() => {
    const element = sectionRef.current

    if (!element) {
      return undefined
    }

    function handleMouseMove(event) {
      const rect = element.getBoundingClientRect()

      const x =
        ((event.clientX - rect.left) / rect.width - 0.5) * 2

      const y =
        ((event.clientY - rect.top) / rect.height - 0.5) * 2

      setMouse({
        x: clamp(x, -1, 1),
        y: clamp(y, -1, 1),
      })
    }

    function handleMouseLeave() {
      setMouse({
        x: 0,
        y: 0,
      })
    }

    element.addEventListener(
      'mousemove',
      handleMouseMove,
    )

    element.addEventListener(
      'mouseleave',
      handleMouseLeave,
    )

    return () => {
      element.removeEventListener(
        'mousemove',
        handleMouseMove,
      )

      element.removeEventListener(
        'mouseleave',
        handleMouseLeave,
      )
    }
  }, [])

  const timelineProgress =
    scrollProgress * stages.length

  const stageProgress =
    timelineProgress - activeIndex

  const normalizedStageProgress =
    clamp(stageProgress, 0, 1)

  const stageAngle =
    normalizedStageProgress * 8 - 4

  const stageDepth =
    normalizedStageProgress * 80

  return (
    <section
      ref={sectionRef}
      className={`visibility ${
        isVisible ? 'is-visible' : ''
      }`}
      id="visibilidade"
      aria-labelledby="visibility-title"
      style={{
        '--mouse-x': mouse.x,
        '--mouse-y': mouse.y,
        '--scroll-progress': scrollProgress,
        '--stage-progress': normalizedStageProgress,
        '--stage-angle': `${stageAngle}deg`,
        '--stage-depth': `${stageDepth}px`,
      }}
    >
      <div className="visibility__sticky">
        <div className="visibility__world">
          <div className="visibility__stars" />
          <div className="visibility__fog visibility__fog--one" />
          <div className="visibility__fog visibility__fog--two" />

          <div className="visibility__cursor-light" />

          <div className="visibility__camera">
            <div
              className="visibility__stage-transition"
              key={activeStage.id}
            >
              <StageVisual
                stage={activeStage}
                mouse={mouse}
              />
            </div>
          </div>
        </div>

        <div className="visibility__timeline" aria-hidden="true">
          <div className="visibility__timeline-track">
            <span
              className="visibility__timeline-progress"
              style={{
                transform: `scaleY(${scrollProgress})`,
              }}
            />
          </div>

          {stages.map((stage, index) => {
            const pointProgress =
              index / (stages.length - 1)

            const reached =
              scrollProgress >= pointProgress

            return (
              <span
                key={stage.id}
                className={`visibility__timeline-point ${
                  reached ? 'is-reached' : ''
                } ${
                  index === activeIndex
                    ? 'is-active'
                    : ''
                }`}
                style={{
                  '--point-progress': pointProgress,
                }}
              >
                <span />
              </span>
            )
          })}
        </div>

        <div className="visibility__content">
          <header className="visibility__header">
            <div className="visibility__eyebrow">
              <span />
              <strong>POR QUE PRESENÇA DIGITAL?</strong>
            </div>

            <h2 id="visibility-title">
              <span className="visibility__headline-line">
                Sua presença começa
              </span>

              <span className="visibility__headline-line visibility__headline-line--accent">
                antes do primeiro contato.
              </span>
            </h2>

            <p>
              Não basta ter algo bom para oferecer.
              É preciso criar um caminho para que as
              pessoas encontrem, entendam e escolham.
            </p>
          </header>

          <div
            className="visibility__stage-copy"
            key={activeStage.id}
          >
            <div className="visibility__stage-meta">
              <span>{activeStage.category}</span>

              <span>
                {activeStage.id === stages[stages.length - 1].id
                  ? '06'
                  : String(activeIndex + 1).padStart(2, '0')}
                {' / 06'}
              </span>
            </div>

            <h3>{activeStage.title}</h3>

            <p className="visibility__stage-question">
              {splitWords(activeStage.question)}
            </p>

            <div className="visibility__stage-detail">
              <p>{activeStage.context}</p>

              <span>{activeStage.solution}</span>
            </div>
          </div>

          <div className="visibility__hint">
            <span>SCROLL TO EXPLORE</span>

            <i />
          </div>

          <div className="visibility__stage-label">
            <span>ROUXINOL</span>
            <strong>{activeStage.category}</strong>
          </div>
        </div>
      </div>
    </section>
  )
}