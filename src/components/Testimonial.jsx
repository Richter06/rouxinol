import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import '../styles/testimonial.css'

const testimonials = [
  {
    id: 1,
    result: '+42%',
    count: { prefix: '+', to: 42, decimals: 0, suffix: '%' },
    resultLabel: 'novos contatos pelo site',
    quote:
      'Antes, quem queria conhecer nosso trabalho precisava mandar mensagem. Agora, a pessoa encontra tudo o que precisa e já chega muito mais preparada para conversar.',
    name: 'Marina Albuquerque',
    role: 'Fundadora',
    company: 'Studio Aurora',
    category: 'Estética e beleza',
    initials: 'MA',
    story:
      'O Studio Aurora precisava de uma presença digital que mostrasse a experiência do espaço sem deixar a cliente perdida. A nova estrutura reuniu serviços, informações e contato em um só lugar.',
  },
  {
    id: 2,
    result: '3,2×',
    count: { prefix: '', to: 3.2, decimals: 1, suffix: '×' },
    resultLabel: 'mais pedidos pelo catálogo',
    quote:
      'A gente tinha os produtos, mas ninguém conseguia enxergar tudo o que vendíamos. Depois do catálogo, ficou muito mais fácil apresentar as opções e receber pedidos.',
    name: 'Lucas Ferreira',
    role: 'Sócio',
    company: 'Casa Nativa',
    category: 'Casa e decoração',
    initials: 'LF',
    story:
      'A Casa Nativa precisava organizar dezenas de produtos sem transformar a experiência em uma loja complicada. O catálogo passou a concentrar produtos, informações e pedidos.',
  },
  {
    id: 3,
    result: '18h',
    count: { prefix: '', to: 18, decimals: 0, suffix: 'h' },
    resultLabel: 'economizadas por mês',
    quote:
      'O que mais mudou não foi só a aparência. Foi parar de fazer manualmente coisas que o sistema consegue resolver sozinho.',
    name: 'Rafael Mendes',
    role: 'Diretor',
    company: 'Norte Auto',
    category: 'Automotivo',
    initials: 'RM',
    story:
      'A Norte Auto precisava reduzir tarefas repetitivas na operação. A solução centralizou informações e automatizou etapas que antes dependiam de controles espalhados.',
  },
]

const TOTAL = testimonials.length

/* Profundidade dos cards (px, eixo Z) */
const CENTER_Z = 220
const SIDE_Z = -100

/* Física: rigidez / amortecimento (levemente subamortecido = "peso") */
const WHEEL_SPRING = { k: 140, c: 18 }
const SCROLL_SPRING = { k: 70, c: 17 }
const TILT_SPRING = { k: 60, c: 12 }
const HOVER_SPRING = { k: 170, c: 22 }

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const lerp = (a, b, t) => a + (b - a) * t
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)
const mod = (value, n) => ((value % n) + n) % n

function stepSpring(state, target, { k, c }, dt) {
  state.v += (k * (target - state.x) - c * state.v) * dt
  state.x += state.v * dt
}

function settle(state, target) {
  if (Math.abs(target - state.x) < 0.0005 && Math.abs(state.v) < 0.0005) {
    state.x = target
    state.v = 0
    return true
  }

  return false
}

function getPosition(index, activeIndex) {
  if (index === activeIndex) {
    return 'center'
  }

  if (
    (index === activeIndex - 1) ||
    (activeIndex === 0 && index === testimonials.length - 1)
  ) {
    return 'left'
  }

  return 'right'
}

function getReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/* ---------------------------------------------------------
   Odômetro: o número "corre" quando o card vira protagonista
--------------------------------------------------------- */
function formatCount({ prefix, decimals, suffix }, value) {
  const text = value.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return `${prefix}${text}${suffix}`
}

function Counter({ count, active, run, reduced }) {
  const [value, setValue] = useState(active && !reduced ? 0 : count.to)

  useLayoutEffect(() => {
    if (reduced || !active) {
      setValue(count.to)
      return undefined
    }

    if (!run) {
      return undefined
    }

    let frame = 0
    let start = null

    setValue(0)

    const tick = (now) => {
      if (start === null) {
        start = now
      }

      const t = clamp((now - start) / 1300, 0, 1)
      const eased = 1 - Math.pow(1 - t, 4)

      setValue(count.to * eased)

      if (t < 1) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frame)
  }, [active, run, reduced, count])

  return <strong>{formatCount(count, value)}</strong>
}

export default function Testimonial() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const wheelRef = useRef(null)
  const cardRefs = useRef([])
  const targetRef = useRef(0)
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startTarget: 0,
  })
  const engineRef = useRef(null)

  const [activeIndex, setActiveIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [reduced] = useState(getReducedMotion)

  /* Entrada única da seção (máscaras do título, detalhes, palavras) */
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

  /* ---------------------------------------------------------
     Motor de movimento
     - roda só enquanto a seção está na viewport
     - dorme sozinho quando tudo estabiliza
     - escreve apenas transform / opacity / filter
  --------------------------------------------------------- */
  useLayoutEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    const wheel = wheelRef.current
    const cards = cardRefs.current

    if (!section || !stage || !wheel) {
      return undefined
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    let reducedMotion = motionQuery.matches
    let inView = false
    let frameId = 0
    let last = 0
    let exit = 0

    let cfg = readConfig()

    const pos = { x: targetRef.current, v: 0 }
    const prog = { x: 0, v: 0 }
    const tiltX = { x: 0, v: 0 }
    const tiltY = { x: 0, v: 0 }
    const hovers = testimonials.map(() => ({ x: 0, v: 0 }))
    const hoverTargets = testimonials.map(() => 0)

    let progTarget = 0
    let tiltTargetX = 0
    let tiltTargetY = 0

    function readConfig() {
      const styles = getComputedStyle(wheel)

      const read = (name, fallback) => {
        const parsed = parseFloat(styles.getPropertyValue(name))

        return Number.isFinite(parsed) ? parsed : fallback
      }

      return {
        spread: read('--spread', 365),
        sideY: read('--side-y', 35),
        sideRy: read('--side-ry', 22),
        sideRz: read('--side-rz', 3),
        sideScale: read('--side-scale', 0.86),
        sideOpacity: read('--side-opacity', 0.82),
      }
    }

    /* Scroll -> progresso contínuo e reversível (0 = pilha, 1 = leque) */
    function computeProgress() {
      if (reducedMotion) {
        progTarget = 1
        exit = 0
        return
      }

      const rect = stage.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const d = (rect.top + rect.height / 2 - vh / 2) / vh

      progTarget = clamp(1 - (d - 0.1) / 0.6, 0, 1)
      exit = clamp(-d / 0.9, 0, 1)
    }

    function render() {
      const fan = easeOutCubic(clamp(prog.x, 0, 1))
      const enter = clamp(fan * 1.8, 0, 1)

      for (let i = 0; i < cards.length; i += 1) {
        const card = cards[i]

        if (!card) {
          continue
        }

        let o = i - pos.x
        o -= TOTAL * Math.round(o / TOTAL)

        const a = Math.abs(o)
        const w = Math.min(a, 1)
        const c = 1 - w
        const dir = Math.sign(o)
        const h = hovers[i].x

        /* posição */
        let x = o * cfg.spread * fan
        let y = cfg.sideY * w * fan + (1 - fan) * w * 16
        let z =
          lerp(CENTER_Z, SIDE_Z, w) -
          Math.max(0, a - 1) * 320 -
          exit * 140

        /* rotação */
        let rx = 2 * w * fan
        let ry = -o * cfg.sideRy * fan
        const rz = o * cfg.sideRz * fan

        /* escala */
        let s =
          lerp(1, cfg.sideScale, w) -
          Math.max(0, a - 1) * 0.1
        s *= 1 - 0.05 * (1 - fan) * w

        /* mouse: inclinação sutil, só no card ativo */
        ry += tiltX.x * 5 * c
        rx -= tiltY.x * 4 * c

        /* hover com peso */
        z += h * 20 * c
        y -= h * (8 * c + 10 * w)
        x -= dir * 14 * h * w
        s += h * (0.015 * c + 0.03 * w)

        /* opacidade / foco */
        let opacity = lerp(1, cfg.sideOpacity, w)
        opacity += (1 - opacity) * h * w

        if (a > 1) {
          opacity *= clamp(1 - (a - 1) / 0.5, 0, 1)
        }

        opacity *= enter

        const blur = w * 1.2 * (1 - h)
        const saturate = lerp(1, 0.8, w * (1 - h))

        card.style.transform =
          `translate(-50%, -50%) translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) ` +
          `rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg) rotateZ(${rz.toFixed(3)}deg) ` +
          `scale(${s.toFixed(4)})`

        card.style.opacity = opacity.toFixed(3)
        card.style.filter =
          blur < 0.02 && saturate > 0.995
            ? 'none'
            : `blur(${blur.toFixed(2)}px) saturate(${saturate.toFixed(3)})`
        card.style.zIndex = String(Math.max(1, Math.round(10 - a * 5)))
        card.style.pointerEvents = a > 1.1 ? 'none' : 'auto'
      }
    }

    function frame(now) {
      frameId = 0

      const dt = clamp((now - last) / 1000, 0, 1 / 30)

      last = now

      computeProgress()

      let moving = false

      if (reducedMotion) {
        pos.x = targetRef.current
        pos.v = 0
        prog.x = 1
        prog.v = 0
        tiltX.x = 0
        tiltY.x = 0
      } else {
        stepSpring(pos, targetRef.current, WHEEL_SPRING, dt)
        stepSpring(prog, progTarget, SCROLL_SPRING, dt)
        stepSpring(tiltX, tiltTargetX, TILT_SPRING, dt)
        stepSpring(tiltY, tiltTargetY, TILT_SPRING, dt)

        hovers.forEach((state, i) => {
          stepSpring(state, hoverTargets[i], HOVER_SPRING, dt)
        })

        const settled = [
          settle(pos, targetRef.current),
          settle(prog, progTarget),
          settle(tiltX, tiltTargetX),
          settle(tiltY, tiltTargetY),
          ...hovers.map((state, i) => settle(state, hoverTargets[i])),
        ]

        moving = settled.includes(false)
      }

      render()

      if (moving && inView) {
        kick()
      }
    }

    function kick() {
      if (frameId) {
        return
      }

      last = performance.now()
      frameId = requestAnimationFrame(frame)
    }

    engineRef.current = { kick }

    /* estado inicial sem animação de "montagem" */
    computeProgress()
    prog.x = progTarget
    render()

    /* só anima enquanto a seção está perto da viewport */
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

    const onResize = () => {
      cfg = readConfig()
      kick()
    }

    const onMotionChange = (event) => {
      reducedMotion = event.matches
      kick()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    motionQuery.addEventListener('change', onMotionChange)

    /* mouse: inclinação do card ativo */
    const onSectionMove = (event) => {
      if (
        event.pointerType !== 'mouse' ||
        reducedMotion ||
        dragRef.current.active
      ) {
        return
      }

      const rect = stage.getBoundingClientRect()
      const near =
        event.clientY > rect.top - 80 && event.clientY < rect.bottom + 80

      tiltTargetX = near
        ? clamp((event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2), -1, 1)
        : 0

      tiltTargetY = near
        ? clamp((event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2), -1, 1)
        : 0

      kick()
    }

    const onSectionLeave = () => {
      tiltTargetX = 0
      tiltTargetY = 0
      kick()
    }

    section.addEventListener('pointermove', onSectionMove, { passive: true })
    section.addEventListener('pointerleave', onSectionLeave)

    /* hover com peso + luz que segue o cursor */
    const cardCleanups = cards.map((card, i) => {
      if (!card) {
        return () => {}
      }

      const onEnter = (event) => {
        if (event.pointerType !== 'mouse') {
          return
        }

        hoverTargets[i] = 1
        kick()
      }

      const onLeave = () => {
        hoverTargets[i] = 0
        kick()
      }

      const onMove = (event) => {
        if (event.pointerType !== 'mouse') {
          return
        }

        const rect = card.getBoundingClientRect()

        card.style.setProperty(
          '--mx',
          `${(((event.clientX - rect.left) / rect.width) * 100).toFixed(1)}%`,
        )

        card.style.setProperty(
          '--my',
          `${(((event.clientY - rect.top) / rect.height) * 100).toFixed(1)}%`,
        )
      }

      card.addEventListener('pointerenter', onEnter)
      card.addEventListener('pointerleave', onLeave)
      card.addEventListener('pointermove', onMove, { passive: true })

      return () => {
        card.removeEventListener('pointerenter', onEnter)
        card.removeEventListener('pointerleave', onLeave)
        card.removeEventListener('pointermove', onMove)
      }
    })

    /* arrastar para deslizar (mouse e toque) */
    const onDown = (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) {
        return
      }

      dragRef.current = {
        active: true,
        moved: false,
        startX: event.clientX,
        startTarget: targetRef.current,
      }
    }

    const onDrag = (event) => {
      const drag = dragRef.current

      if (!drag.active) {
        return
      }

      const dx = event.clientX - drag.startX

      if (!drag.moved && Math.abs(dx) > 8) {
        drag.moved = true

        try {
          stage.setPointerCapture(event.pointerId)
        } catch {
          /* ignora */
        }
      }

      if (drag.moved) {
        targetRef.current = clamp(
          drag.startTarget - dx / cfg.spread,
          drag.startTarget - 1.2,
          drag.startTarget + 1.2,
        )

        kick()
      }
    }

    const onUp = (event) => {
      const drag = dragRef.current

      if (!drag.active) {
        return
      }

      drag.active = false

      if (!drag.moved) {
        return
      }

      try {
        stage.releasePointerCapture(event.pointerId)
      } catch {
        /* ignora */
      }

      const base = Math.round(drag.startTarget)
      const delta = targetRef.current - base
      const snapped = base + (Math.abs(delta) > 0.2 ? Math.sign(delta) : 0)

      targetRef.current = snapped
      setActiveIndex(mod(snapped, TOTAL))
      kick()
    }

    stage.addEventListener('pointerdown', onDown)
    stage.addEventListener('pointermove', onDrag)
    stage.addEventListener('pointerup', onUp)
    stage.addEventListener('pointercancel', onUp)

    return () => {
      cancelAnimationFrame(frameId)
      viewObserver.disconnect()
      engineRef.current = null

      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      motionQuery.removeEventListener('change', onMotionChange)

      section.removeEventListener('pointermove', onSectionMove)
      section.removeEventListener('pointerleave', onSectionLeave)

      cardCleanups.forEach((cleanup) => cleanup())

      stage.removeEventListener('pointerdown', onDown)
      stage.removeEventListener('pointermove', onDrag)
      stage.removeEventListener('pointerup', onUp)
      stage.removeEventListener('pointercancel', onUp)
    }
  }, [])

  function selectTestimonial(index) {
    const base = Math.round(targetRef.current)

    let delta = mod(index - base, TOTAL)

    if (delta > TOTAL / 2) {
      delta -= TOTAL
    }

    targetRef.current = base + delta

    setActiveIndex(index)
    engineRef.current?.kick()
  }

  function handleKeyDown(event) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
      return
    }

    event.preventDefault()

    const step = event.key === 'ArrowRight' ? 1 : -1

    selectTestimonial(mod(activeIndex + step, TOTAL))
  }

  const active = testimonials[activeIndex]

  return (
    <section
      ref={sectionRef}
      className={`testimonial ${
        isVisible ? 'is-visible' : ''
      }`}
      id="testimonial"
      aria-labelledby="testimonial-title"
    >
      <div className="testimonial__inner">

        <header className="testimonial__header">
          <div className="testimonial__eyebrow">
            <span className="testimonial__eyebrow-dot" />
            HISTÓRIAS DE QUEM CONSTRUIU
          </div>

          <div className="testimonial__heading">
            <h2 id="testimonial-title">
              <span className="testimonial__line">
                <span>O projeto termina.</span>
              </span>

              <span className="testimonial__line">
                <em>O resultado continua.</em>
              </span>
            </h2>

            <p>
              Cada negócio começa de um lugar diferente.
              O que muda é o que acontece quando uma
              solução digital começa a trabalhar junto
              com ele.
            </p>
          </div>
        </header>

        <div
          ref={stageRef}
          className="testimonial__stage"
          aria-label="Histórias de clientes"
        >
          <div
            ref={wheelRef}
            className="testimonial__wheel"
            onKeyDown={handleKeyDown}
          >

            {testimonials.map((testimonial, index) => {
              const position = getPosition(
                index,
                activeIndex,
              )

              const isActive = position === 'center'

              return (
                <button
                  key={testimonial.id}
                  ref={(element) => {
                    cardRefs.current[index] = element
                  }}
                  type="button"
                  className={`testimonial-card testimonial-card--${position}`}
                  onClick={() => selectTestimonial(index)}
                  aria-label={
                    isActive
                      ? `História de ${testimonial.name}`
                      : `Ver história de ${testimonial.name}`
                  }
                  aria-pressed={isActive}
                >
                  <div className="testimonial-card__top">
                    <span className="testimonial-card__category">
                      {testimonial.category}
                    </span>

                    <span className="testimonial-card__number">
                      0{index + 1}
                    </span>
                  </div>

                  <div className="testimonial-card__result">
                    <Counter
                      count={testimonial.count}
                      active={isActive}
                      run={isActive && isVisible}
                      reduced={reduced}
                    />

                    <span>
                      {testimonial.resultLabel}
                    </span>
                  </div>

                  <div className="testimonial-card__quote">
                    <span className="testimonial-card__quote-mark">
                      “
                    </span>

                    <p>
                      {testimonial.quote
                        .split(' ')
                        .map((word, wordIndex) => (
                          <span key={wordIndex}>
                            <span
                              className="testimonial-card__word"
                              style={{ '--i': wordIndex }}
                            >
                              {word}
                            </span>{' '}
                          </span>
                        ))}
                    </p>
                  </div>

                  <div className="testimonial-card__person">
                    <div className="testimonial-card__avatar">
                      {testimonial.initials}
                    </div>

                    <div>
                      <strong>
                        {testimonial.name}
                      </strong>

                      <span>
                        {testimonial.role} ·{' '}
                        {testimonial.company}
                      </span>
                    </div>
                  </div>

                  {!isActive && (
                    <div className="testimonial-card__bottom">
                      <span>VER HISTÓRIA</span>

                      <span className="testimonial-card__arrow">
                        ↗
                      </span>
                    </div>
                  )}
                </button>
              )
            })}

          </div>
        </div>

        <div className="testimonial__details">
          <div className="testimonial__details-label">
            <span className="testimonial__details-dot" />
            SOBRE O PROJETO
            <span className="testimonial__details-count">
              0{activeIndex + 1}/0{TOTAL}
            </span>
          </div>

          <div
            className="testimonial__details-content"
            key={active.id}
          >
            <h3>
              <span>{active.company}</span>
            </h3>

            <p>
              {active.story}
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}