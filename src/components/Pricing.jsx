import { useEffect, useRef, useState } from 'react'

import '../styles/pricing.css'

const solutions = [
  {
    number: '01',
    type: 'LANDING PAGE',
    eyebrow: 'PRESENÇA DIGITAL',
    title: 'Uma página para fazer seu negócio ser visto.',
    description:
      'Uma experiência focada em apresentar seu negócio, serviço, produto ou campanha com clareza e personalidade.',
    examples: ['Restaurante', 'Barbearia', 'Doceria', 'Profissional'],
    price: 'R$ 900',
    accent: 'purple',
  },
  {
    number: '02',
    type: 'SITE INSTITUCIONAL',
    eyebrow: 'PRESENÇA DIGITAL',
    title: 'Mais espaço para contar o que faz você diferente.',
    description:
      'Um site completo para apresentar sua empresa, seus serviços, sua história e construir confiança antes mesmo do primeiro contato.',
    examples: ['Empresa', 'Clínica', 'Escritório', 'Marca'],
    price: 'R$ 1.500',
    accent: 'yellow',
  },
  {
    number: '03',
    type: 'CATÁLOGO / VITRINE',
    eyebrow: 'EXPERIÊNCIA COMERCIAL',
    title: 'Seus produtos merecem mais do que uma lista.',
    description:
      'Uma vitrine digital para organizar produtos, serviços ou coleções e tornar a descoberta muito mais agradável.',
    examples: ['Produtos', 'Cardápios', 'Coleções', 'Portfólio'],
    price: 'R$ 1.800',
    accent: 'purple',
  },
  {
    number: '04',
    type: 'LOJA VIRTUAL',
    eyebrow: 'EXPERIÊNCIA COMERCIAL',
    title: 'Da descoberta até a compra.',
    description:
      'Uma experiência de venda pensada para apresentar seus produtos, facilitar a navegação e criar um caminho claro até a compra.',
    examples: ['Moda', 'Calçados', 'Autopeças', 'Artesanato'],
    price: 'R$ 2.500',
    accent: 'yellow',
  },
  {
    number: '05',
    type: 'SISTEMA / CRUD',
    eyebrow: 'SOLUÇÃO DIGITAL',
    title: 'Quando seu negócio precisa começar a trabalhar melhor.',
    description:
      'Sistemas para organizar cadastros, informações, processos e operações que já ficaram grandes demais para planilhas e anotações.',
    examples: ['Cadastros', 'Gestão', 'Estoque', 'Clientes'],
    price: 'R$ 3.500',
    accent: 'purple',
  },
  {
    number: '06',
    type: 'DASHBOARD',
    eyebrow: 'SOLUÇÃO DIGITAL',
    title: 'Tudo importante em um só lugar.',
    description:
      'Painéis para reunir informações, acompanhar indicadores e transformar dados espalhados em uma visão mais simples do negócio.',
    examples: ['Indicadores', 'Relatórios', 'Vendas', 'Métricas'],
    price: 'R$ 3.000',
    accent: 'yellow',
  },
  {
    number: '07',
    type: 'AGENDAMENTO',
    eyebrow: 'SOLUÇÃO DIGITAL',
    title: 'Menos mensagens. Mais organização.',
    description:
      'Uma experiência para organizar horários, reservas, serviços e atendimentos sem deixar a rotina presa a conversas intermináveis.',
    examples: ['Salão', 'Clínica', 'Consultório', 'Reservas'],
    price: 'R$ 2.000',
    accent: 'purple',
  },
  {
    number: '08',
    type: 'PROJETO PERSONALIZADO',
    eyebrow: 'ALGO DIFERENTE',
    title: 'Talvez o que você precisa ainda não tenha nome.',
    description:
      'Se nenhuma dessas soluções parece exatamente certa, podemos começar pela ideia, pelo problema ou pela oportunidade.',
    examples: ['Ideias', 'Integrações', 'Ferramentas', 'Experiências'],
    price: 'SOB MEDIDA',
    accent: 'yellow',
  },
]

export default function Pricing() {
  const sectionRef = useRef(null)

  const [activeIndex, setActiveIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const section = sectionRef.current

    if (!section) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.05,
      },
    )

    observer.observe(section)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const section = sectionRef.current

    if (!section) return undefined

    let ticking = false

    const updateActiveIndex = () => {
      const rect = section.getBoundingClientRect()

      const scrollDistance =
        section.offsetHeight - window.innerHeight

      if (scrollDistance <= 0) {
        ticking = false
        return
      }

      const currentScroll =
        window.scrollY -
        (window.scrollY + rect.top)

      const clampedScroll = Math.max(
        0,
        Math.min(scrollDistance, currentScroll),
      )

      const progress =
        clampedScroll / scrollDistance

      const nextIndex = Math.min(
        solutions.length - 1,
        Math.floor(
          progress * solutions.length,
        ),
      )

      setActiveIndex((current) =>
        current === nextIndex
          ? current
          : nextIndex,
      )

      ticking = false
    }

    const handleScroll = () => {
      if (ticking) return

      ticking = true

      window.requestAnimationFrame(
        updateActiveIndex,
      )
    }

    updateActiveIndex()

    window.addEventListener(
      'scroll',
      handleScroll,
      { passive: true },
    )

    window.addEventListener(
      'resize',
      handleScroll,
    )

    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll,
      )

      window.removeEventListener(
        'resize',
        handleScroll,
      )
    }
  }, [])

  const scrollToSolution = (index) => {
    const section = sectionRef.current

    if (!section) return

    const scrollDistance =
      section.offsetHeight -
      window.innerHeight

    const progress =
      index / solutions.length

    const target =
      window.scrollY +
      section.getBoundingClientRect().top +
      progress * scrollDistance

    window.scrollTo({
      top: target,
      behavior: 'smooth',
    })
  }

  const active = solutions[activeIndex]

  return (
    <section
      ref={sectionRef}
      className={`pricing pricing--${active.accent} ${
        isVisible ? 'is-visible' : ''
      }`}
      id="pricing"
      aria-labelledby="pricing-title"
    >
      <div className="pricing__sticky">
        <div className="pricing__noise" aria-hidden="true" />

        <div className="pricing__inner">
          <header className="pricing__header">
            <div className="pricing__header-meta">
              <span className="pricing__eyebrow">
                INVESTIMENTO
              </span>

              <span className="pricing__counter">
                {active.number}
                <span>/</span>
                08
              </span>
            </div>

            <div className="pricing__heading-row">
              <h2 id="pricing-title">
                O que seu negócio
                <span>precisa construir?</span>
              </h2>

              <p>
                Não existe um tamanho único para todo
                negócio. Escolha o ponto de partida
                que mais combina com o que você quer
                colocar no mundo.
              </p>
            </div>
          </header>

          <div className="pricing__solutions">
            <nav
              className="pricing__nav"
              aria-label="Soluções da Rouxinol"
            >
              {solutions.map(
                (solution, index) => (
                  <button
                    key={solution.number}
                    type="button"
                    className={`pricing__nav-item ${
                      activeIndex === index
                        ? 'is-active'
                        : ''
                    }`}
                    onClick={() =>
                      scrollToSolution(index)
                    }
                    aria-current={
                      activeIndex === index
                        ? 'true'
                        : undefined
                    }
                  >
                    <span className="pricing__nav-number">
                      {solution.number}
                    </span>

                    <span className="pricing__nav-name">
                      {solution.type}
                    </span>

                    <span
                      className="pricing__nav-arrow"
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                  </button>
                ),
              )}
            </nav>

            <article
              className="pricing__main"
              key={active.number}
            >
              <div className="pricing__main-number">
                {active.number}
              </div>

              <div className="pricing__main-content">
                <div className="pricing__main-label">
                  <span className="pricing__main-line" />

                  {active.eyebrow}
                </div>

                <span className="pricing__main-type">
                  {active.type}
                </span>

                <h3>{active.title}</h3>

                <p className="pricing__main-description">
                  {active.description}
                </p>

                <div className="pricing__examples">
                  {active.examples.map(
                    (example) => (
                      <span key={example}>
                        {example}
                      </span>
                    ),
                  )}
                </div>
              </div>

              <div className="pricing__main-bottom">
                <div className="pricing__price">
                  <span>
                    {active.price === 'SOB MEDIDA'
                      ? 'INVESTIMENTO'
                      : 'A PARTIR DE'}
                  </span>

                  <strong>
                    {active.price}
                  </strong>
                </div>

                <a
                  href="#contact"
                  className="pricing__cta"
                >
                  <span>
                    {active.price === 'SOB MEDIDA'
                      ? 'FALAR SOBRE A IDEIA'
                      : 'CONVERSAR SOBRE O PROJETO'}
                  </span>

                  <span aria-hidden="true">
                    ↗
                  </span>
                </a>
              </div>
            </article>
          </div>

          <footer className="pricing__footer">
            <div className="pricing__progress">
              {solutions.map(
                (solution, index) => (
                  <button
                    key={solution.number}
                    type="button"
                    className={
                      activeIndex === index
                        ? 'is-active'
                        : ''
                    }
                    aria-label={`Ir para ${solution.type}`}
                    aria-current={
                      activeIndex === index
                        ? 'true'
                        : undefined
                    }
                    onClick={() =>
                      scrollToSolution(index)
                    }
                  />
                ),
              )}
            </div>

            <p>
              Valores iniciais. O investimento final
              depende do escopo e da complexidade
              de cada projeto.
            </p>

            <span className="pricing__scroll">
              ROLE PARA EXPLORAR
              <span aria-hidden="true">
                ↓
              </span>
            </span>
          </footer>
        </div>
      </div>
    </section>
  )
}