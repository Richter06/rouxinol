import { useEffect, useRef, useState } from 'react'

import '../styles/footer.css'

const navigation = [
  {
    title: 'NAVEGAR',
    links: [
      { label: 'Início', href: '#hero' },
      { label: 'Soluções', href: '#solutions' },
      { label: 'Visibilidade', href: '#visibility' },
      { label: 'Investimento', href: '#pricing' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Contato', href: '#contact' },
    ],
  },
  {
    title: 'O QUE FAZEMOS',
    links: [
      { label: 'Sites', href: '#solutions' },
      { label: 'Lojas', href: '#solutions' },
      { label: 'Catálogos', href: '#solutions' },
      { label: 'Sistemas', href: '#solutions' },
      { label: 'Dashboards', href: '#solutions' },
      { label: 'Sua ideia', href: '#solutions' },
    ],
  },
]

const closingWords = ['Um', 'passarinho', 'me', 'contou.']

const timelineSteps = [
  { id: 'cta', label: 'CONVITE' },
  { id: 'nav', label: 'MAPA' },
  { id: 'brand', label: 'IDENTIDADE' },
  { id: 'end', label: 'FIM' },
]

function RevealWords({ words }) {
  return (
    <span className="footer__reveal">
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="footer__reveal-word"
          style={{ '--word-index': index }}
          aria-hidden="true"
        >
          {word}
        </span>
      ))}
    </span>
  )
}

export default function Footer() {
  const footerRef = useRef(null)
  const lightRef = useRef(null)
  const ctaRef = useRef(null)
  const stageRef = useRef(null)
  const stageInnerRef = useRef(null)
  const closingRef = useRef(null)
  const navRef = useRef(null)
  const brandRef = useRef(null)
  const endRef = useRef(null)

  const [isVisible, setIsVisible] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [activeSections, setActiveSections] = useState(() => new Set())

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    const element = footerRef.current

    if (!element) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.08 },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const element = footerRef.current

    if (!element) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold: 0 },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const sections = [
      { id: 'cta', el: closingRef.current },
      { id: 'nav', el: navRef.current },
      { id: 'brand', el: brandRef.current },
      { id: 'end', el: endRef.current },
    ].filter((section) => section.el)

    if (!sections.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        setActiveSections((previous) => {
          const next = new Set(previous)

          entries.forEach((entry) => {
            const match = sections.find(
              (section) => section.el === entry.target,
            )

            if (match && entry.isIntersecting) {
              next.add(match.id)
            }
          })

          return next
        })
      },
      { threshold: 0.35 },
    )

    sections.forEach((section) => observer.observe(section.el))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const footer = footerRef.current
    const light = lightRef.current

    if (!footer || !light) return undefined

    const mediaQuery = window.matchMedia(
      '(hover: hover) and (pointer: fine)',
    )

    if (!mediaQuery.matches || prefersReducedMotion) {
      return undefined
    }

    let targetX = 50
    let targetY = 50
    let currentX = 50
    let currentY = 50
    let frame

    function handlePointerMove(event) {
      const rect = footer.getBoundingClientRect()

      targetX = ((event.clientX - rect.left) / rect.width) * 100
      targetY = ((event.clientY - rect.top) / rect.height) * 100
    }

    function animate() {
      currentX += (targetX - currentX) * 0.1
      currentY += (targetY - currentY) * 0.1

      light.style.setProperty('--light-x', `${currentX}%`)
      light.style.setProperty('--light-y', `${currentY}%`)

      frame = requestAnimationFrame(animate)
    }

    footer.addEventListener('pointermove', handlePointerMove)
    frame = requestAnimationFrame(animate)

    return () => {
      footer.removeEventListener('pointermove', handlePointerMove)
      cancelAnimationFrame(frame)
    }
  }, [prefersReducedMotion])

  useEffect(() => {
    const button = ctaRef.current

    if (!button) return undefined

    const mediaQuery = window.matchMedia(
      '(hover: hover) and (pointer: fine)',
    )

    if (!mediaQuery.matches || prefersReducedMotion) {
      return undefined
    }

    const pull = 0.35
    const maxOffset = 16

    function handlePointerMove(event) {
      const rect = button.getBoundingClientRect()

      const relativeX =
        event.clientX - (rect.left + rect.width / 2)

      const relativeY =
        event.clientY - (rect.top + rect.height / 2)

      const offsetX = Math.max(
        Math.min(relativeX * pull, maxOffset),
        -maxOffset,
      )

      const offsetY = Math.max(
        Math.min(relativeY * pull, maxOffset),
        -maxOffset,
      )

      button.style.setProperty('--mx', `${offsetX}px`)
      button.style.setProperty('--my', `${offsetY}px`)
    }

    function handlePointerLeave() {
      button.style.setProperty('--mx', '0px')
      button.style.setProperty('--my', '0px')
    }

    button.addEventListener('pointermove', handlePointerMove)
    button.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      button.removeEventListener('pointermove', handlePointerMove)
      button.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [prefersReducedMotion])

  useEffect(() => {
    const stage = stageRef.current
    const inner = stageInnerRef.current

    if (!stage || !inner) return undefined

    const mediaQuery = window.matchMedia(
      '(hover: hover) and (pointer: fine)',
    )

    if (!mediaQuery.matches || prefersReducedMotion) {
      return undefined
    }

    const maxTilt = 4

    function handlePointerMove(event) {
      const rect = stage.getBoundingClientRect()

      const px = (event.clientX - rect.left) / rect.width - 0.5
      const py = (event.clientY - rect.top) / rect.height - 0.5

      inner.style.setProperty(
        '--tilt-x',
        `${(py * maxTilt * -1).toFixed(2)}deg`,
      )

      inner.style.setProperty(
        '--tilt-y',
        `${(px * maxTilt).toFixed(2)}deg`,
      )
    }

    function handlePointerLeave() {
      inner.style.setProperty('--tilt-x', '0deg')
      inner.style.setProperty('--tilt-y', '0deg')
    }

    stage.addEventListener('pointermove', handlePointerMove)
    stage.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      stage.removeEventListener('pointermove', handlePointerMove)
      stage.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [prefersReducedMotion])

  const railProgress =
    (activeSections.size / timelineSteps.length) * 100

  return (
    <footer
      ref={footerRef}
      className={[
        'footer',
        isVisible ? 'is-visible' : '',
        isInView ? 'is-in-view' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        ref={lightRef}
        className="footer__light"
        aria-hidden="true"
      />

      <div className="footer__frame">
        <div className="footer__rail" aria-hidden="true">
          <span className="footer__rail-track">
            <span
              className="footer__rail-progress"
              style={{ '--rail-progress': `${railProgress}%` }}
            />
          </span>

          <ul className="footer__rail-dots">
            {timelineSteps.map((step) => (
              <li
                key={step.id}
                className={`footer__rail-dot ${
                  activeSections.has(step.id) ? 'is-active' : ''
                }`}
              >
                <span className="footer__rail-dot-marker" />
                <span className="footer__rail-dot-label">
                  {step.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__content">
          <section
            className="footer__closing"
            ref={closingRef}
            data-section="cta"
          >
            <div className="footer__closing-header">
              <span className="footer__eyebrow">
                ÚLTIMO CAPÍTULO
              </span>

              <span className="footer__closing-line" />
            </div>

            <div className="footer__closing-grid">
              <div className="footer__statement">
                <p className="footer__statement-small">
                  MAS TALVEZ SEJA
                  <br />
                  SÓ O COMEÇO.
                </p>

                <div className="footer__curtain-wrap">
                  <span
                    className="footer__curtain"
                    aria-hidden="true"
                  />

                  <h2>
                    <RevealWords words={closingWords} />
                  </h2>
                </div>

                <p className="footer__statement-subtitle">
                  Que seu negócio{' '}
                  <span>quer crescer.</span>
                </p>
              </div>

              <div className="footer__closing-action">
                <div className="footer__closing-note">
                  <span className="footer__status-dot" />
                  <span>ROUXINOL ESTÁ ONLINE</span>
                </div>

                <p>
                  Se você chegou até aqui, talvez esteja na hora de
                  colocar sua ideia para voar.
                </p>

                <a
                  href="#contact"
                  ref={ctaRef}
                  className="footer__primary-link"
                >
                  <span className="footer__primary-link-face">
                    <span>VAMOS CONVERSAR</span>

                    <span
                      className="footer__primary-arrow"
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </section>

          <div className="footer__divider" />

          <section
            className="footer__navigation"
            ref={navRef}
            data-section="nav"
          >
            <div className="footer__brand-column">
              <a
                href="#hero"
                className="footer__wordmark"
                aria-label="Rouxinol — voltar ao início"
              >
                ROUXINOL
              </a>

              <div className="footer__brand-meta">
                <p>
                  Presença digital para quem tem alguma coisa para
                  mostrar.
                </p>
              </div>
            </div>

            <div className="footer__link-groups">
              {navigation.map((group, groupIndex) => (
                <div
                  className="footer__link-group"
                  key={group.title}
                >
                  <span className="footer__group-title">
                    {group.title}
                  </span>

                  <nav aria-label={group.title}>
                    {group.links.map((link, linkIndex) => (
                      <a
                        href={link.href}
                        key={link.label}
                        className="footer__link"
                        style={{
                          '--strip-index':
                            groupIndex * 6 + linkIndex,
                        }}
                      >
                        <span className="footer__link-mask">
                          <span className="footer__link-strip" />

                          <span className="footer__link-text">
                            {link.label}
                          </span>
                        </span>

                        <span
                          className="footer__link-arrow"
                          aria-hidden="true"
                        >
                          ↗
                        </span>
                      </a>
                    ))}
                  </nav>
                </div>
              ))}
            </div>

            <div className="footer__contact-column">
              <span className="footer__group-title">
                QUER COMEÇAR?
              </span>

              <a
                href="#contact"
                className="footer__contact-link"
              >
                Falar com a Rouxinol
                <span aria-hidden="true">↗</span>
              </a>

              <span className="footer__contact-description">
                Uma ideia, um problema ou simplesmente uma pergunta.
              </span>
            </div>
          </section>

          <section
            className="footer__brand-stage"
            ref={(node) => {
              brandRef.current = node
              stageRef.current = node
            }}
            data-section="brand"
          >
            <div
              className="footer__brand-stage-inner"
              ref={stageInnerRef}
            >
              <div className="footer__brand-stage-top">
                <span>
                  ROUXINOL / {new Date().getFullYear()}
                </span>

                <span>
                  PRESENÇA DIGITAL
                  <i />
                  SOLUÇÕES DIGITAIS
                </span>
              </div>

              <div
                className="footer__giant-word"
                aria-hidden="true"
              >
                ROUXINOL
              </div>
            </div>
          </section>

          <div
            className="footer__bottom"
            ref={endRef}
            data-section="end"
          >
            <span>
              © {new Date().getFullYear()} ROUXINOL
            </span>

            <span>
              FEITO PARA QUEM TEM ALGUMA COISA PARA MOSTRAR.
            </span>

            <a href="#hero">
              VOLTAR AO TOPO
              <span aria-hidden="true">↑</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}