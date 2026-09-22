import { useEffect, useRef, useState } from 'react'
import '../styles/visibility.css'

const slides = [
  {
    id: 'presence',
    number: '01',
    category: 'PRESENÇA',
    withoutTitle:
      'Seu potencial fica escondido.',
    withoutDescription:
      'Seu negócio existe, mas pode passar despercebido por quem procura exatamente o que você oferece.',
    withTitle:
      'Seu negócio ganha espaço para ser encontrado.',
    withDescription:
      'Uma presença digital própria cria um ponto de contato para sua marca aparecer, explicar e ser lembrada.',
  },

  {
    id: 'organization',
    number: '02',
    category: 'ORGANIZAÇÃO',
    withoutTitle:
      'Informações importantes ficam espalhadas.',
    withoutDescription:
      'Cadastros, registros e tarefas podem acabar divididos entre planilhas, mensagens e anotações.',
    withTitle:
      'Seu negócio pode ter um lugar próprio para se organizar.',
    withDescription:
      'Uma solução personalizada pode reunir informações, cadastros e operações em um único ambiente.',
  },

  {
    id: 'processes',
    number: '03',
    category: 'PROCESSOS',
    withoutTitle:
      'Tarefas repetitivas consomem tempo.',
    withoutDescription:
      'Quando tudo depende de processos manuais, pequenas tarefas podem acabar tomando mais tempo do que deveriam.',
    withTitle:
      'Processos complicados podem ficar mais simples.',
    withDescription:
      'Ferramentas específicas podem transformar etapas repetitivas em fluxos mais claros e práticos.',
  },

  {
    id: 'data',
    number: '04',
    category: 'DADOS',
    withoutTitle:
      'Os dados existem, mas estão difíceis de entender.',
    withoutDescription:
      'Informações importantes podem estar espalhadas, dificultando enxergar o que realmente está acontecendo.',
    withTitle:
      'Seus dados podem contar uma história mais clara.',
    withDescription:
      'Dashboards e relatórios ajudam a transformar informações espalhadas em uma visão mais organizada do negócio.',
  },

  {
    id: 'sales',
    number: '05',
    category: 'VENDAS',
    withoutTitle:
      'Produtos e pedidos ficam espalhados por vários lugares.',
    withoutDescription:
      'Informações, produtos e contatos podem acabar divididos entre diferentes canais e conversas.',
    withTitle:
      'Sua operação pode ganhar um espaço próprio.',
    withDescription:
      'Catálogos, lojas e outras soluções podem organizar melhor a experiência de quem conhece e compra da sua marca.',
  },

  {
    id: 'custom',
    number: '06',
    category: 'IDEIA',
    withoutTitle:
      'Sua ideia não cabe em uma solução pronta.',
    withoutDescription:
      'Nem todo problema de negócio se encaixa perfeitamente em uma ferramenta que já existe.',
    withTitle:
      'A solução pode ser pensada em torno do seu problema.',
    withDescription:
      'Quando a necessidade é diferente, a Rouxinol pode construir uma solução personalizada para aquilo que você imaginou.',
  },
]

export default function Visibility() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const visibilityRef = useRef(null)

  const activeSlide = slides[activeIndex]

  useEffect(() => {
    const element = visibilityRef.current

    if (!element) {
      return
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

  function goToSlide(index) {
    const normalizedIndex =
      (index + slides.length) % slides.length

    setActiveIndex(normalizedIndex)
  }

  function nextSlide() {
    setActiveIndex(
      (current) => (current + 1) % slides.length,
    )
  }

  function previousSlide() {
    setActiveIndex(
      (current) =>
        (current - 1 + slides.length) % slides.length,
    )
  }

  useEffect(() => {
    if (isPaused) {
      return
    }

    const interval = setInterval(() => {
      setActiveIndex(
        (current) => (current + 1) % slides.length,
      )
    }, 7000)

    return () => clearInterval(interval)
  }, [isPaused])

  function handleKeyDown(event) {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      nextSlide()
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      previousSlide()
    }
  }

  return (
    <section
      ref={visibilityRef}
      className={`visibility ${
        isVisible ? 'is-visible' : ''
      }`}
      id="visibilidade"
      aria-labelledby="visibility-title"
      tabIndex="0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
    >
      <div className="visibility__inner">

        {/* =================================================
            CABEÇALHO
            ================================================= */}

        <header className="visibility__header">

          <span className="visibility__kicker">
            VISIBILIDADE
          </span>

          <h2
            className="visibility__title"
            id="visibility-title"
          >
            Seu negócio pode precisar
            <span>
              de mais do que uma página.
            </span>
          </h2>

          <p className="visibility__intro">
            Pode ser presença. Pode ser organização.
            Pode ser uma ferramenta, um sistema ou
            uma ideia que ainda não tem nome.
          </p>

        </header>

        {/* =================================================
            LINHA / TRAJETÓRIA
            ================================================= */}

        <div
          className="visibility__trajectory"
          aria-hidden="true"
        >
          <svg
            className="visibility__trajectory-svg"
            viewBox="0 0 1200 280"
            preserveAspectRatio="none"
          >
            <path
              className="visibility__trajectory-shadow"
              d="
                M -20 220
                C 120 235, 160 190, 275 205
                C 390 220, 390 155, 505 175
                C 625 198, 655 110, 755 135
                C 865 162, 875 70, 980 92
                C 1060 108, 1130 52, 1220 45
              "
            />

            <path
              className="visibility__trajectory-line"
              d="
                M -20 220
                C 120 235, 160 190, 275 205
                C 390 220, 390 155, 505 175
                C 625 198, 655 110, 755 135
                C 865 162, 875 70, 980 92
                C 1060 108, 1130 52, 1220 45
              "
            />
          </svg>

          <span className="visibility__trajectory-label visibility__trajectory-label--start">
            SEM ROUXINOL
          </span>

          <span className="visibility__trajectory-label visibility__trajectory-label--end">
            COM ROUXINOL
          </span>
        </div>

        {/* =================================================
            COMPARADOR
            ================================================= */}

        <div
          className="visibility__comparison"
          aria-live="polite"
          aria-atomic="true"
        >

          <article
            className="visibility__side visibility__side--without"
            key={`without-${activeSlide.id}`}
          >
            <div className="visibility__side-top">

              <span className="visibility__side-label">
                SEM ROUXINOL
              </span>

              <span className="visibility__slide-number">
                {activeSlide.number} / 06
              </span>

            </div>

            <div className="visibility__side-content">

              <span className="visibility__category">
                {activeSlide.category}
              </span>

              <h3 className="visibility__side-title">
                {activeSlide.withoutTitle}
              </h3>

              <p className="visibility__side-description">
                {activeSlide.withoutDescription}
              </p>

            </div>
          </article>

          <div
            className="visibility__divider"
            aria-hidden="true"
          >
            <span />
          </div>

          <article
            className="visibility__side visibility__side--with"
            key={`with-${activeSlide.id}`}
          >
            <div className="visibility__side-top">

              <span className="visibility__side-label">
                COM ROUXINOL
              </span>

              <span className="visibility__active-mark">
                ●
              </span>

            </div>

            <div className="visibility__side-content">

              <span className="visibility__category">
                {activeSlide.category}
              </span>

              <h3 className="visibility__side-title">
                {activeSlide.withTitle}
              </h3>

              <p className="visibility__side-description">
                {activeSlide.withDescription}
              </p>

            </div>
          </article>

        </div>

        {/* =================================================
            CONTROLES
            ================================================= */}

        <div className="visibility__controls">

          <button
            type="button"
            className="visibility__arrow"
            onClick={previousSlide}
            aria-label="Situação anterior"
          >
            ←
          </button>

          <div
            className="visibility__dots"
            role="tablist"
            aria-label="Selecionar situação"
          >
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                className={
                  index === activeIndex
                    ? 'visibility__dot is-active'
                    : 'visibility__dot'
                }
                onClick={() => goToSlide(index)}
                role="tab"
                aria-selected={
                  index === activeIndex
                }
                aria-label={
                  `Mostrar ${slide.category.toLowerCase()}`
                }
              />
            ))}
          </div>

          <button
            type="button"
            className="visibility__arrow"
            onClick={nextSlide}
            aria-label="Próxima situação"
          >
            →
          </button>

        </div>

        {/* =================================================
            FECHAMENTO
            ================================================= */}

        <div className="visibility__closing">

          <span className="visibility__closing-mark">
            /
          </span>

          <p>
            Não importa o tamanho da ideia.
            <strong>
              {' '}A solução pode crescer com ela.
            </strong>
          </p>

        </div>

      </div>
    </section>
  )
}