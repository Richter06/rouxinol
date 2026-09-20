import { useEffect, useRef, useState } from 'react'

const categories = [
  {
    id: 'all',
    label: 'TODOS',
  },
  {
    id: 'landing',
    label: 'LANDING PAGE',
  },
  {
    id: 'store',
    label: 'LOJA VIRTUAL',
  },
  {
    id: 'catalog',
    label: 'CATÁLOGO',
  },
  {
    id: 'booking',
    label: 'AGENDAMENTO',
  },
  {
    id: 'system',
    label: 'SISTEMAS',
  },
  {
    id: 'dashboard',
    label: 'DASHBOARDS',
  },
]

/**
 * Adicione os projetos reais aqui.
 *
 * video:
 *   caminho do vídeo dentro de /public
 *   exemplo:
 *   '/assets/videos/restaurante.mp4'
 *
 * link:
 *   URL do projeto publicado
 *   exemplo:
 *   'https://seusite.com'
 *
 * Enquanto o projeto ainda não tiver vídeo/link,
 * deixe a string vazia.
 */
const projects = [
  {
    id: 'restaurante',
    number: '01',
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
    number: '02',
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
    number: '03',
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
    number: '04',
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
    number: '05',
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
    number: '06',
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
    number: '07',
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
    number: '08',
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
    number: '09',
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

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export default function Vitrine() {
  const stageRef = useRef(null)
  const dragStartRef = useRef(null)

  const [activeCategory, setActiveCategory] = useState('all')
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const filteredProjects =
    activeCategory === 'all'
      ? projects
      : projects.filter(
          (project) =>
            project.category === activeCategory,
        )

  const activeProject =
    filteredProjects[
      clamp(
        activeIndex,
        0,
        Math.max(
          filteredProjects.length - 1,
          0,
        ),
      )
    ]

  useEffect(() => {
    setActiveIndex(0)
  }, [activeCategory])

  useEffect(() => {
    const element = stageRef.current

    if (!element) {
      return undefined
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting)
        },
        {
          threshold: 0.18,
        },
      )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  function goToProject(index) {
    if (!filteredProjects.length) {
      return
    }

    setActiveIndex(
      clamp(
        index,
        0,
        filteredProjects.length - 1,
      ),
    )
  }

  function nextProject() {
    if (!filteredProjects.length) {
      return
    }

    setActiveIndex(
      (current) =>
        (current + 1) %
        filteredProjects.length,
    )
  }

  function previousProject() {
    if (!filteredProjects.length) {
      return
    }

    setActiveIndex(
      (current) =>
        (current - 1 + filteredProjects.length) %
        filteredProjects.length,
    )
  }

  function handlePointerDown(event) {
    dragStartRef.current = event.clientX
    setIsDragging(true)
  }

  function handlePointerMove(event) {
    if (dragStartRef.current === null) {
      return
    }

    const distance =
      event.clientX -
      dragStartRef.current

    if (Math.abs(distance) < 70) {
      return
    }

    if (distance < 0) {
      nextProject()
    } else {
      previousProject()
    }

    dragStartRef.current = null
  }

  function handlePointerUp() {
    dragStartRef.current = null
    setIsDragging(false)
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      nextProject()
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      previousProject()
    }
  }

  function getRelativePosition(index) {
    if (!filteredProjects.length) {
      return 0
    }

    const total = filteredProjects.length

    let difference =
      index - activeIndex

    if (difference > total / 2) {
      difference -= total
    }

    if (difference < -total / 2) {
      difference += total
    }

    return difference
  }

  if (!activeProject) {
    return null
  }

  return (
    <section
      className={`vitrine ${
        isVisible ? 'is-visible' : ''
      }`}
      id="vitrine"
      ref={stageRef}
      aria-labelledby="vitrine-title"
      tabIndex="0"
      onKeyDown={handleKeyDown}
    >
      <div
        className="vitrine__background"
        aria-hidden="true"
      >
        <div className="vitrine__orb vitrine__orb--one" />
        <div className="vitrine__orb vitrine__orb--two" />
      </div>

      <div className="vitrine__header">
        <div className="vitrine__header-copy">
          <span className="vitrine__eyebrow">
            UM POUCO DO QUE PODE SER FEITO
          </span>

          <h2
            className="vitrine__title"
            id="vitrine-title"
          >
            E se você
            <span>
              visse na prática?
            </span>
          </h2>
        </div>

        <p className="vitrine__intro">
          Algumas ideias ficam melhores
          quando você pode vê-las
          funcionando.
        </p>
      </div>

      <div className="vitrine__filters">
        <div className="vitrine__filter-label">
          ENCONTRE UMA IDEIA
        </div>

        <div
          className="vitrine__filter-list"
          role="tablist"
          aria-label="Categorias de projetos"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={
                activeCategory === category.id
              }
              className={`vitrine__filter ${
                activeCategory === category.id
                  ? 'is-active'
                  : ''
              }`}
              onClick={() =>
                setActiveCategory(
                  category.id,
                )
              }
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="vitrine__stage-wrap">
        <button
          type="button"
          className="vitrine__nav vitrine__nav--previous"
          onClick={previousProject}
          aria-label="Projeto anterior"
        >
          <span>←</span>
        </button>

        <div
          className={`vitrine__stage ${
            isDragging ? 'is-dragging' : ''
          }`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={
            isDragging
              ? handlePointerUp
              : undefined
          }
        >
          {filteredProjects.map(
            (project, index) => {
              const relative =
                getRelativePosition(index)

              const absolute =
                Math.abs(relative)

              const isActive =
                relative === 0

              const x =
                relative === 0
                  ? 0
                  : relative < 0
                    ? -52
                    : 52

              const scale =
                isActive
                  ? 1
                  : Math.max(
                      0.72,
                      0.88 -
                        (absolute - 1) *
                          0.05,
                    )

              const opacity =
                absolute > 2
                  ? 0
                  : isActive
                    ? 1
                    : Math.max(
                        0.18,
                        0.62 -
                          (absolute - 1) *
                            0.18,
                      )

              const rotate =
                relative === 0
                  ? 0
                  : relative < 0
                    ? -2.5
                    : 2.5

              const zIndex =
                50 -
                absolute * 10

              return (
                <article
                  key={project.id}
                  className={`vitrine__project ${
                    isActive
                      ? 'is-active'
                      : ''
                  }`}
                  style={{
                    '--project-x': `${x}%`,
                    '--project-scale': scale,
                    '--project-opacity': opacity,
                    '--project-rotate': `${rotate}deg`,
                    zIndex,
                  }}
                  aria-hidden={!isActive}
                >
                  <div className="vitrine__media">
                    {project.video ? (
                      <video
                        src={project.video}
                        autoPlay={isActive}
                        muted
                        loop
                        playsInline
                        preload={
                          isActive
                            ? 'auto'
                            : 'none'
                        }
                        aria-label={`Prévia em vídeo de ${project.title}`}
                      />
                    ) : (
                      <div className="vitrine__media-placeholder">
                        <span className="vitrine__media-index">
                          {project.number}
                        </span>

                        <div className="vitrine__media-center">
                          <span>
                            VÍDEO DO PROJETO
                          </span>

                          <strong>
                            PREVIEW
                          </strong>
                        </div>

                        <span className="vitrine__media-note">
                          /assets/videos/
                        </span>
                      </div>
                    )}

                    <div className="vitrine__media-overlay" />

                    <span className="vitrine__media-corner">
                      {project.categoryLabel}
                    </span>

                    <span className="vitrine__media-status">
                      {project.video
                        ? 'REPRODUZINDO'
                        : 'AGUARDANDO VÍDEO'}
                    </span>
                  </div>

                  {isActive && (
                    <div className="vitrine__project-info">
                      <div className="vitrine__project-meta">
                        <span>
                          {project.categoryLabel}
                        </span>

                        <span>
                          {project.segment}
                        </span>

                        <span>
                          {project.number}
                          {' '}
                          /
                          {' '}
                          {String(
                            filteredProjects.length,
                          ).padStart(2, '0')}
                        </span>
                      </div>

                      <h3>
                        {project.title}
                      </h3>

                      <p>
                        {project.description}
                      </p>

                      <div className="vitrine__project-action">
                        {project.link ? (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noreferrer"
                            onPointerDown={(event) =>
                              event.stopPropagation()
                            }
                          >
                            VER MODELO
                            <span>↗</span>
                          </a>
                        ) : (
                          <span className="is-disabled">
                            LINK DO PROJETO
                            <span>↗</span>
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </article>
              )
            },
          )}
        </div>

        <button
          type="button"
          className="vitrine__nav vitrine__nav--next"
          onClick={nextProject}
          aria-label="Próximo projeto"
        >
          <span>→</span>
        </button>
      </div>

      <div className="vitrine__footer">
        <div className="vitrine__counter">
          <strong>
            {String(
              activeIndex + 1,
            ).padStart(2, '0')}
          </strong>

          <span />

          <small>
            {String(
              filteredProjects.length,
            ).padStart(2, '0')}
          </small>
        </div>

        <span className="vitrine__gesture">
          ARRASTE PARA EXPLORAR
          <b>↔</b>
        </span>

        <div className="vitrine__dots">
          {filteredProjects.map(
            (project, index) => (
              <button
                key={project.id}
                type="button"
                className={
                  index === activeIndex
                    ? 'is-active'
                    : ''
                }
                onClick={() =>
                  goToProject(index)
                }
                aria-label={`Ir para projeto ${index + 1}`}
              />
            ),
          )}
        </div>
      </div>
    </section>
  )
}