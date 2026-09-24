import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import '../styles/vitrine.css'

const categories = [
  { id: 'all', label: 'TODOS' },
  { id: 'landing', label: 'LANDING PAGE' },
  { id: 'store', label: 'LOJA VIRTUAL' },
  { id: 'catalog', label: 'CATÁLOGO' },
  { id: 'booking', label: 'AGENDAMENTO' },
  { id: 'system', label: 'SISTEMAS' },
  { id: 'dashboard', label: 'DASHBOARDS' },
]

const projects = [
  {
    id: 'restaurante',
    category: 'landing',
    categoryLabel: 'LANDING PAGE',
    segment: 'RESTAURANTE',
    title: 'Presença que abre o apetite.',
    description:
      'Uma experiência digital pensada para apresentar o restaurante, destacar seus diferenciais e facilitar o próximo passo.',
    video: '',
    link: '',
  },

  {
    id: 'barbearia',
    category: 'landing',
    categoryLabel: 'LANDING PAGE',
    segment: 'BARBEARIA',
    title: 'Seu trabalho merece ser encontrado.',
    description:
      'Uma presença própria para mostrar serviços, estilo, localização e transformar curiosidade em agendamento.',
    video: '',
    link: '',
  },

  {
    id: 'doceria',
    category: 'landing',
    categoryLabel: 'LANDING PAGE',
    segment: 'DOCERIA',
    title: 'Uma vitrine para dar vontade.',
    description:
      'Uma página visual para apresentar produtos, identidade e formas de contato de maneira simples e convidativa.',
    video: '',
    link: '',
  },

  {
    id: 'tenis',
    category: 'store',
    categoryLabel: 'LOJA VIRTUAL',
    segment: 'TÊNIS',
    title: 'Do catálogo ao carrinho.',
    description:
      'Uma experiência de compra pensada para apresentar produtos com clareza e deixar a jornada mais direta.',
    video: '',
    link: '',
  },

  {
    id: 'autopecas',
    category: 'store',
    categoryLabel: 'LOJA VIRTUAL',
    segment: 'AUTOPEÇAS',
    title: 'Encontrar o produto certo.',
    description:
      'Uma estrutura digital organizada para apresentar peças, categorias e informações importantes sem complicação.',
    video: '',
    link: '',
  },

  {
    id: 'catalogo-moda',
    category: 'catalog',
    categoryLabel: 'CATÁLOGO',
    segment: 'MODA',
    title: 'Tudo no lugar certo.',
    description:
      'Um catálogo digital para apresentar coleções e produtos de forma organizada, visual e fácil de consultar.',
    video: '',
    link: '',
  },

  {
    id: 'salao',
    category: 'booking',
    categoryLabel: 'AGENDAMENTO',
    segment: 'SALÃO',
    title: 'Menos conversa. Mais horário marcado.',
    description:
      'Uma experiência criada para facilitar a escolha de serviços e organizar o caminho até o agendamento.',
    video: '',
    link: '',
  },

  {
    id: 'gestao',
    category: 'system',
    categoryLabel: 'SISTEMA',
    segment: 'GESTÃO',
    title: 'Quando organizar muda tudo.',
    description:
      'Uma solução pensada para reunir informações e tornar a operação do negócio mais clara.',
    video: '',
    link: '',
  },

  {
    id: 'vendas',
    category: 'dashboard',
    categoryLabel: 'DASHBOARD',
    segment: 'VENDAS',
    title: 'Números que começam a fazer sentido.',
    description:
      'Uma visão organizada dos dados importantes para acompanhar o negócio com mais clareza.',
    video: '',
    link: '',
  },
]

/* Altura da seção (o scroll dentro dela percorre os projetos) */
const VH_PER_PROJECT = 46
const VH_BASE = 92
const VH_MIN = 190
const START_OFFSET = 0.35

/* Física (rigidez / amortecimento) */
const POS_SPRING = { k: 120, c: 20 }
const SLOT_SPRING = { k: 130, c: 19 }
const PRESENCE_SPRING = { k: 110, c: 18 }
const TILT_SPRING = { k: 60, c: 12 }

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))
const pad = (value) => String(value).padStart(2, '0')

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

function getReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/* Geometria do scroll dentro da seção */
function getMetrics(element) {
  const rect = element.getBoundingClientRect()
  const vh = window.innerHeight || 1
  const startOffset = vh * START_OFFSET
  const usable = Math.max(rect.height - vh - startOffset, 1)

  return { rect, startOffset, usable }
}

export default function Vitrine() {
  const root = useRef(null)
  const stageRef = useRef(null)
  const railRef = useRef(null)
  const cardRefs = useRef([])
  const videoRefs = useRef({})

  const itemsRef = useRef(projects)
  const activeRef = useRef(0)
  const inViewRef = useRef(false)
  const engineRef = useRef(null)
  const scrollToRef = useRef(() => {})
  const syncVideosRef = useRef(() => {})
  const firstCategoryRun = useRef(true)

  const [category, setCategory] = useState('all')
  const [active, setActive] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [reduced] = useState(getReducedMotion)

  const items = useMemo(
    () =>
      category === 'all'
        ? projects
        : projects.filter((project) => project.category === category),
    [category],
  )

  itemsRef.current = items

  const activeIndex = clamp(active, 0, Math.max(items.length - 1, 0))
  const current = items[activeIndex]

  const sectionHeight = Math.max(
    (items.length - 1) * VH_PER_PROJECT + VH_BASE,
    VH_MIN,
  )

  /* navegação: tudo passa pelo scroll (uma única fonte de verdade) */
  function scrollToIndex(index) {
    const element = root.current
    const n = itemsRef.current.length

    if (!element || n < 1) {
      return
    }

    const target = clamp(index, 0, n - 1)
    const { rect, startOffset, usable } = getMetrics(element)
    const progress = n > 1 ? target / (n - 1) : 0
    const delta = rect.top + startOffset + progress * usable

    window.scrollTo({
      top: window.scrollY + delta,
      behavior: reduced ? 'auto' : 'smooth',
    })
  }

  scrollToRef.current = scrollToIndex

  /* filtro: reorganiza os cards e volta ao início do percurso */
  useLayoutEffect(() => {
    if (firstCategoryRun.current) {
      firstCategoryRun.current = false
      return
    }

    activeRef.current = -1

    const element = root.current

    if (element) {
      const rect = element.getBoundingClientRect()

      if (rect.top < 0) {
        window.scrollTo({
          top: window.scrollY + rect.top,
          behavior: 'instant',
        })
      }
    }

    engineRef.current?.kick()
  }, [category])

  /* vídeo só toca no projeto ativo e com a seção visível */
  useEffect(() => {
    syncVideosRef.current()
  }, [activeIndex, category])

  /* ---------------------------------------------------------
     Motor de movimento
     - scroll -> posição contínua (com "ímã" nos projetos)
     - molas dão inércia à posição, aos slots e à presença
     - só roda com a seção perto da viewport e dorme ao estabilizar
  --------------------------------------------------------- */
  useLayoutEffect(() => {
    const section = root.current
    const stage = stageRef.current

    if (!section || !stage) {
      return undefined
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    let reducedMotion = motionQuery.matches
    let inView = false
    let frameId = 0
    let last = 0
    let targetPos = 0
    let tiltTargetX = 0
    let tiltTargetY = 0
    let cfg = readConfig()

    const initialList = itemsRef.current

    const pos = { x: 0, v: 0 }
    const tiltX = { x: 0, v: 0 }
    const tiltY = { x: 0, v: 0 }

    const slots = projects.map((project) => {
      const index = initialList.findIndex((item) => item.id === project.id)

      return { x: Math.max(index, 0), v: 0 }
    })

    const presences = projects.map((project) => ({
      x: initialList.some((item) => item.id === project.id) ? 1 : 0,
      v: 0,
    }))

    function readConfig() {
      const styles = getComputedStyle(stage)

      const read = (name, fallback) => {
        const parsed = parseFloat(styles.getPropertyValue(name))

        return Number.isFinite(parsed) ? parsed : fallback
      }

      return {
        stride: read('--stride', 290),
        depth: read('--depth', 150),
        ry: read('--ry', 6),
      }
    }

    function computeTarget(n) {
      if (n <= 1) {
        targetPos = 0
        return
      }

      const { rect, startOffset, usable } = getMetrics(section)
      const progress = clamp((-rect.top - startOffset) / usable, 0, 1)
      const raw = progress * (n - 1)
      const base = Math.floor(raw)
      const frac = raw - base

      /* ímã: o percurso "demora" no projeto e passa rápido entre eles */
      let s = clamp((frac - 0.2) / 0.6, 0, 1)
      s = s * s * (3 - 2 * s)

      targetPos = Math.min(base + s, n - 1)
    }

    function render() {
      const list = itemsRef.current
      const n = list.length

      for (let i = 0; i < projects.length; i += 1) {
        const card = cardRefs.current[i]

        if (!card) {
          continue
        }

        const presence = clamp(presences[i].x, 0, 1)

        if (presence < 0.01) {
          card.style.visibility = 'hidden'
          card.style.pointerEvents = 'none'
          continue
        }

        const o = slots[i].x - pos.x
        const a = Math.abs(o)
        const c = 1 - Math.min(a, 1)

        const x = o * cfg.stride
        const y = (1 - presence) * 24
        const z = -a * cfg.depth
        const ry = -o * cfg.ry + tiltX.x * 4 * c
        const rx = -tiltY.x * 3 * c
        const scale =
          clamp(1 - a * 0.09, 0.7, 1) * (0.92 + 0.08 * presence)

        let opacity = clamp(1 - a * 0.28, 0.12, 1)

        if (a > 2.6) {
          opacity *= clamp(1 - (a - 2.6) / 0.8, 0, 1)
        }

        opacity *= presence

        const blur = Math.min(a, 3) * 0.9

        card.style.visibility = 'visible'
        card.style.transform =
          `translate(-50%, -50%) translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) ` +
          `rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg) scale(${scale.toFixed(4)})`
        card.style.opacity = opacity.toFixed(3)
        card.style.filter = blur < 0.05 ? 'none' : `blur(${blur.toFixed(2)}px)`
        card.style.zIndex = String(Math.max(1, 50 - Math.round(a * 10)))
        card.style.pointerEvents = presence > 0.5 && a < 3 ? 'auto' : 'none'
      }

      stage.style.setProperty('--tx', tiltX.x.toFixed(3))
      stage.style.setProperty('--ty', tiltY.x.toFixed(3))

      railRef.current?.style.setProperty(
        '--pos',
        clamp(pos.x, 0, Math.max(n - 1, 0)).toFixed(3),
      )

      const index = clamp(Math.round(pos.x), 0, Math.max(n - 1, 0))

      if (index !== activeRef.current) {
        activeRef.current = index
        setActive(index)
      }
    }

    function frame(now) {
      frameId = 0

      const dt = clamp((now - last) / 1000, 0, 1 / 30)

      last = now

      const list = itemsRef.current

      computeTarget(list.length)

      let moving = false

      projects.forEach((project, i) => {
        const index = list.findIndex((item) => item.id === project.id)
        const slot = slots[i]
        const presence = presences[i]
        const presenceTarget = index >= 0 ? 1 : 0

        /* quem volta com o filtro aparece já no seu lugar */
        if (index >= 0 && presence.x < 0.02) {
          slot.x = index
          slot.v = 0
        }

        const slotTarget = index >= 0 ? index : slot.x

        if (reducedMotion) {
          slot.x = slotTarget
          slot.v = 0
          presence.x = presenceTarget
          presence.v = 0
          return
        }

        stepSpring(slot, slotTarget, SLOT_SPRING, dt)
        stepSpring(presence, presenceTarget, PRESENCE_SPRING, dt)

        const slotSettled = settle(slot, slotTarget)
        const presenceSettled = settle(presence, presenceTarget)

        if (!slotSettled || !presenceSettled) {
          moving = true
        }
      })

      if (reducedMotion) {
        pos.x = targetPos
        pos.v = 0
        tiltX.x = 0
        tiltY.x = 0
      } else {
        stepSpring(pos, targetPos, POS_SPRING, dt)
        stepSpring(tiltX, tiltTargetX, TILT_SPRING, dt)
        stepSpring(tiltY, tiltTargetY, TILT_SPRING, dt)

        const settled = [
          settle(pos, targetPos),
          settle(tiltX, tiltTargetX),
          settle(tiltY, tiltTargetY),
        ]

        if (settled.includes(false)) {
          moving = true
        }
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

    /* estado inicial sem animação de montagem */
    computeTarget(initialList.length)
    pos.x = targetPos
    render()

    function syncVideos() {
      const activeId = itemsRef.current[activeRef.current]?.id

      Object.entries(videoRefs.current).forEach(([id, video]) => {
        if (!video) {
          return
        }

        if (id === activeId && inViewRef.current) {
          video.play?.().catch(() => {})
        } else {
          video.pause?.()
        }
      })
    }

    syncVideosRef.current = syncVideos

    const viewObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        inViewRef.current = inView

        if (inView) {
          setIsVisible(true)
          kick()
        }

        syncVideos()
      },
      { rootMargin: '15% 0px 15% 0px' },
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

    /* mouse: inclinação sutil e parallax interno no projeto ativo */
    const onStageMove = (event) => {
      if (event.pointerType !== 'mouse' || reducedMotion) {
        return
      }

      const rect = stage.getBoundingClientRect()

      tiltTargetX = clamp(
        (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2),
        -1,
        1,
      )

      tiltTargetY = clamp(
        (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2),
        -1,
        1,
      )

      kick()
    }

    const onStageLeave = () => {
      tiltTargetX = 0
      tiltTargetY = 0
      kick()
    }

    stage.addEventListener('pointermove', onStageMove, { passive: true })
    stage.addEventListener('pointerleave', onStageLeave)

    /* luz que segue o cursor dentro da janela do projeto */
    const cardCleanups = cardRefs.current.map((card) => {
      if (!card) {
        return () => {}
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

      card.addEventListener('pointermove', onMove, { passive: true })

      return () => card.removeEventListener('pointermove', onMove)
    })

    /* arrastar para deslizar: o gesto move o scroll da página */
    let drag = null

    const onDown = (event) => {
      const n = itemsRef.current.length

      if (n < 2 || (event.pointerType === 'mouse' && event.button !== 0)) {
        return
      }

      const { usable } = getMetrics(section)

      drag = {
        moved: false,
        startX: event.clientX,
        startScroll: window.scrollY,
        pxPerItem: usable / (n - 1),
        startIndex: activeRef.current,
      }
    }

    const onDrag = (event) => {
      if (!drag) {
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
        const range = drag.pxPerItem * 1.3
        const top = clamp(
          drag.startScroll - (dx / cfg.stride) * drag.pxPerItem,
          drag.startScroll - range,
          drag.startScroll + range,
        )

        window.scrollTo({ top, behavior: 'instant' })
      }
    }

    const onUp = (event) => {
      if (!drag) {
        return
      }

      const finished = drag

      drag = null

      if (!finished.moved) {
        return
      }

      try {
        stage.releasePointerCapture(event.pointerId)
      } catch {
        /* ignora */
      }

      const dx = event.clientX - finished.startX
      const n = itemsRef.current.length

      let index = clamp(Math.round(targetPos), 0, n - 1)

      if (index === finished.startIndex && Math.abs(dx) > 40) {
        index = clamp(finished.startIndex + (dx < 0 ? 1 : -1), 0, n - 1)
      }

      scrollToRef.current(index)
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

      stage.removeEventListener('pointermove', onStageMove)
      stage.removeEventListener('pointerleave', onStageLeave)

      cardCleanups.forEach((cleanup) => cleanup())

      stage.removeEventListener('pointerdown', onDown)
      stage.removeEventListener('pointermove', onDrag)
      stage.removeEventListener('pointerup', onUp)
      stage.removeEventListener('pointercancel', onUp)
    }
  }, [])

  function handleKeyDown(event) {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      scrollToIndex(activeIndex + 1)
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      scrollToIndex(activeIndex - 1)
    }
  }

  if (!items.length || !current) {
    return null
  }

  return (
    <section
      className={`vitrine ${isVisible ? 'is-visible' : ''}`}
      ref={root}
      id="vitrine"
      tabIndex="0"
      onKeyDown={handleKeyDown}
      style={{
        height: `${sectionHeight}vh`,
      }}
    >
      <div className="vitrine-sticky">

        <div className="vitrine-side">

          <div className="vitrine-side-top">
            <div className="vitrine-kicker">
              UM POUCO DO QUE PODE SER FEITO
            </div>

            <div className="vitrine-head">
              <h2>
                <span className="vitrine-line">
                  <span>E SE VOCÊ</span>
                </span>

                <span className="vitrine-line vitrine-line--accent">
                  <span>VISSE NA PRÁTICA?</span>
                </span>
              </h2>

              <p>
                Algumas ideias ficam melhores
                quando você pode vê-las
                funcionando.
              </p>
            </div>

            <div
              className="vitrine-filters"
              role="tablist"
              aria-label="Categorias de projetos"
            >
              {categories.map((categoryItem) => (
                <button
                  key={categoryItem.id}
                  type="button"
                  role="tab"
                  aria-selected={category === categoryItem.id}
                  className={
                    category === categoryItem.id
                      ? 'is-active'
                      : ''
                  }
                  onClick={() => setCategory(categoryItem.id)}
                >
                  {categoryItem.label}
                </button>
              ))}
            </div>
          </div>

          <div className="vitrine-side-bottom">
            <div className="vitrine-caption" aria-live="polite">
              <div
                className="vitrine-caption-inner"
                key={`${category}-${current.id}`}
              >
                <span className="vitrine-count">
                  {pad(activeIndex + 1)} / {pad(items.length)} ·{' '}
                  {current.segment}
                </span>

                <h3 className="vitrine-title">
                  {current.title.split(' ').map((word, index) => (
                    <Fragment key={index}>
                      <span className="vitrine-word">
                        <span style={{ '--i': index }}>{word}</span>
                      </span>{' '}
                    </Fragment>
                  ))}
                </h3>

                <p>{current.description}</p>

                <div className="vitrine-actions">
                  {current.link ? (
                    <a
                      className="vitrine-text-cta"
                      href={current.link}
                    >
                      VER MODELO
                      <span>→</span>
                    </a>
                  ) : (
                    <span className="vitrine-text-cta is-disabled">
                      LINK DO PROJETO
                      <span>→</span>
                    </span>
                  )}

                  <a
                    className="vitrine-text-cta vitrine-text-cta--contact"
                    href="#contact"
                  >
                    QUERO ALGO ASSIM
                    <span>↗</span>
                  </a>
                </div>
              </div>
            </div>

            <div
              ref={railRef}
              className="vitrine-rail"
              style={{ '--n': items.length, '--pos': 0 }}
              role="group"
              aria-label="Ir para o projeto"
            >
              <span
                className="vitrine-rail-marker"
                aria-hidden="true"
              />

              {items.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className={index === activeIndex ? 'is-active' : ''}
                  aria-label={`Ir para ${item.segment.toLowerCase()}: ${item.title}`}
                  aria-current={index === activeIndex}
                  onClick={() => scrollToIndex(index)}
                >
                  {pad(index + 1)}
                </button>
              ))}
            </div>
          </div>

        </div>

        <div
          ref={stageRef}
          className="vitrine-stage"
          role="group"
          aria-label="Projetos"
        >
          {projects.map((item, index) => {
            const listIndex = items.findIndex(
              (entry) => entry.id === item.id,
            )

            const isActive = listIndex === activeIndex

            return (
              <article
                key={item.id}
                ref={(element) => {
                  cardRefs.current[index] = element
                }}
                className={`vitrine-card ${
                  isActive ? 'is-active' : ''
                }`}
                aria-hidden={!isActive}
                onClick={() => {
                  if (listIndex >= 0 && !isActive) {
                    scrollToIndex(listIndex)
                  }
                }}
              >
                <div className="vitrine-window">
                  {item.video ? (
                    <video
                      ref={(element) => {
                        videoRefs.current[item.id] = element
                      }}
                      src={item.video}
                      muted
                      loop
                      playsInline
                      preload={isActive ? 'auto' : 'none'}
                    />
                  ) : (
                    <div className="vitrine-demo-art">
                      <span>{item.categoryLabel}</span>
                      <i>ROUXINOL</i>
                    </div>
                  )}

                  <span className="vitrine-tag">
                    {item.segment}
                  </span>
                </div>
              </article>
            )
          })}
        </div>

      </div>
    </section>
  )
}