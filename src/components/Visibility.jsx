import { useEffect, useRef, useState } from 'react'

import '../styles/visibility.css'

const slides = [
  {
    id: 'presence',
    number: '01',
    category: 'PRESENÇA',
    question: 'As pessoas procuram pelo que você faz e não encontram.',
    context:
      'Seu negócio pode ser bom. O problema é que, se ele não aparece, para muita gente ele simplesmente não existe.',
    answer:
      'Então vamos dar um lugar para o seu negócio ser encontrado.',
    solution:
      'LANDING PAGE OU SITE',
    detail:
      'Uma presença própria para apresentar quem você é, o que oferece e por que alguém deveria escolher você.',
  },
  {
    id: 'organization',
    number: '02',
    category: 'ORGANIZAÇÃO',
    question: 'Você sabe que tem tudo anotado em algum lugar. Só não sabe em qual.',
    context:
      'Planilhas, cadernos, mensagens e aquela informação importante que está “com alguém”. Uma hora isso cobra a conta.',
    answer:
      'Talvez esteja na hora de parar de procurar informação dentro do próprio negócio.',
    solution:
      'SISTEMA',
    detail:
      'Uma solução feita para reunir cadastros, informações e operações em um único lugar.',
  },
  {
    id: 'processes',
    number: '03',
    category: 'PROCESSOS',
    question: 'Você ainda perde tempo fazendo a mesma coisa toda semana.',
    context:
      'Copiar, conferir, responder, anotar, procurar, repetir. Pequenas tarefas parecem inofensivas até somarem um dia inteiro.',
    answer:
      'Se uma máquina pode fazer a parte chata, deixe ela fazer a parte chata.',
    solution:
      'AUTOMAÇÃO E FERRAMENTAS',
    detail:
      'Experiências pensadas para reduzir tarefas repetitivas e deixar sua rotina mais simples.',
  },
  {
    id: 'data',
    number: '04',
    category: 'DADOS',
    question: 'Você tem números. Só não consegue enxergar o que eles estão dizendo.',
    context:
      'Vendas, clientes, pedidos e resultados existem. Mas quando tudo fica espalhado, até uma pergunta simples vira investigação.',
    answer:
      'Seus números não precisam parecer um interrogatório.',
    solution:
      'DASHBOARD',
    detail:
      'Uma visão mais clara das informações importantes para você entender o que está acontecendo.',
  },
  {
    id: 'sales',
    number: '05',
    category: 'VENDAS',
    question: 'Você tem coisa boa para vender, mas parece que ninguém está olhando.',
    context:
      'O produto está lá. O preço está lá. Você está lá. E mesmo assim, parece que o cliente passou reto.',
    answer:
      'Talvez seu produto não precise de mais esforço. Precise de uma experiência melhor para chegar até ele.',
    solution:
      'CATÁLOGO OU LOJA',
    detail:
      'Uma experiência para apresentar produtos, facilitar a descoberta e criar um caminho mais claro até a compra.',
  },
  {
    id: 'custom',
    number: '06',
    category: 'IDEIA',
    question: 'Você tem uma ideia que não cabe em nenhuma ferramenta pronta.',
    context:
      'Você explica o que precisa e sempre aparece alguém dizendo que existe uma plataforma para isso. Só que nenhuma resolve exatamente o seu problema.',
    answer:
      'Então talvez seja a ferramenta que esteja errada para o problema.',
    solution:
      'PROJETO PERSONALIZADO',
    detail:
      'Uma solução pensada a partir daquilo que seu negócio realmente precisa fazer.',
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
        threshold: 0.15,
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
    if (isPaused || !isVisible) {
      return undefined
    }

    const interval = setInterval(() => {
      setActiveIndex(
        (current) => (current + 1) % slides.length,
      )
    }, 7500)

    return () => clearInterval(interval)
  }, [isPaused, isVisible])

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
      <div className="visibility__ambient" aria-hidden="true">
        <span className="visibility__ambient-number">
          {activeSlide.number}
        </span>

        <span className="visibility__ambient-word">
          {activeSlide.category}
        </span>
      </div>

      <div className="visibility__inner">
        <header className="visibility__header">
          <div className="visibility__header-top">
            <span className="visibility__kicker">
              QUANDO A COISA NÃO ESTÁ FUNCIONANDO
            </span>

            <span className="visibility__counter">
              {activeSlide.number}
              <span>/</span>
              06
            </span>
          </div>

          <h2
            className="visibility__title"
            id="visibility-title"
          >
            Talvez o problema
            <span>não seja o seu negócio.</span>
          </h2>

          <p className="visibility__intro">
            Às vezes, o que está impedindo uma empresa de
            crescer não é falta de esforço. É falta de uma
            estrutura que acompanhe esse esforço.
          </p>
        </header>

        <div
          className="visibility__experience"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="visibility__index">
            <span className="visibility__index-line" />

            <div className="visibility__index-number">
              {activeSlide.number}
            </div>

            <span className="visibility__index-total">
              / 06
            </span>
          </div>

          <article
            className="visibility__problem"
            key={`problem-${activeSlide.id}`}
          >
            <div className="visibility__category">
              {activeSlide.category}
            </div>

            <h3 className="visibility__question">
              {activeSlide.question}
            </h3>

            <p className="visibility__context">
              {activeSlide.context}
            </p>
          </article>

          <div className="visibility__answer">
            <div className="visibility__answer-marker">
              <span />
              ROUXINOL
            </div>

            <div
              className="visibility__answer-content"
              key={`answer-${activeSlide.id}`}
            >
              <p className="visibility__answer-text">
                {activeSlide.answer}
              </p>

              <div className="visibility__solution">
                <span className="visibility__solution-label">
                  TALVEZ VOCÊ PRECISE DE
                </span>

                <strong>
                  {activeSlide.solution}
                </strong>

                <p>
                  {activeSlide.detail}
                </p>
              </div>
            </div>
          </div>
        </div>

        <footer className="visibility__footer">
          <div className="visibility__progress">
            <div className="visibility__progress-track">
              <span
                className="visibility__progress-fill"
                style={{
                  width: `${
                    ((activeIndex + 1) /
                      slides.length) *
                    100
                  }%`,
                }}
              />
            </div>

            <span className="visibility__progress-label">
              {activeSlide.number} / 06
            </span>
          </div>

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
                  aria-label={`Mostrar ${slide.category.toLowerCase()}`}
                >
                  <span>{slide.number}</span>
                </button>
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
        </footer>

        <div className="visibility__closing">
          <span className="visibility__closing-number">
            06
          </span>

          <p>
            Se alguma dessas situações parece familiar,
            <strong>
              {' '}talvez esteja na hora de fazer alguma coisa
              diferente.
            </strong>
          </p>
        </div>
      </div>
    </section>
  )
}