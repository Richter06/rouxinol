import { useEffect, useRef, useState } from 'react'
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

const clamp = (value, min, max) =>
  Math.max(min, Math.min(max, value))

function Preview({
  item,
  offset,
  active,
  total,
  index,
  onSelect,
}) {
  const distance = Math.abs(offset)

  if (distance > 3) {
    return null
  }

  return (
    <article
      className={`vitrine-preview ${
        active ? 'is-active' : ''
      }`}
      style={{
        '--offset': offset,
        '--abs': distance,
      }}
      aria-hidden={!active}
      onClick={() => {
        if (!active) {
          onSelect(index)
        }
      }}
    >
      <div className="vitrine-preview-window">
        {item.video ? (
          <video
            src={item.video}
            muted
            loop
            playsInline
            autoPlay={active}
            preload={active ? 'auto' : 'none'}
          />
        ) : (
          <div className="vitrine-demo-art">
            <span>{item.categoryLabel}</span>
            <i>ROUXINOL</i>
          </div>
        )}
      </div>

      {active && (
        <div className="vitrine-preview-copy">
          <span className="vitrine-count">
            {String(index + 1).padStart(2, '0')} /{' '}
            {String(total).padStart(2, '0')} · {item.segment}
          </span>

          <h3>{item.title}</h3>

          <p>{item.description}</p>

          {item.link ? (
            <a
              className="vitrine-text-cta"
              href={item.link}
              onClick={(event) => event.stopPropagation()}
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
        </div>
      )}
    </article>
  )
}

const VH_PER_PROJECT = 46
const VH_BASE = 92
const VH_MIN = 190

export default function Vitrine() {
  const root = useRef(null)
  const touch = useRef(null)

  const [category, setCategory] = useState('all')
  const [active, setActive] = useState(0)

  const items =
    category === 'all'
      ? projects
      : projects.filter(
          (project) => project.category === category,
        )

  const safeActive = clamp(
    active,
    0,
    Math.max(items.length - 1, 0),
  )

  const sectionHeight = Math.max(
    (items.length - 1) * VH_PER_PROJECT + VH_BASE,
    VH_MIN,
  )

  useEffect(() => {
    setActive(0)
  }, [category])

  useEffect(() => {
    const onScroll = () => {
      if (!root.current || !items.length) {
        return
      }

      const rect = root.current.getBoundingClientRect()

      const viewportHeight = window.innerHeight

      const startOffset = viewportHeight * 0.35

      const usableHeight = Math.max(
        rect.height -
          viewportHeight -
          startOffset,
        1,
      )

      const scrolled =
        -rect.top - startOffset

      const progress = clamp(
        scrolled / usableHeight,
        0,
        1,
      )

      const nextIndex = Math.round(
        progress *
          Math.max(
            items.length - 1,
            0,
          ),
      )

      setActive(nextIndex)
    }

    onScroll()

    window.addEventListener(
      'scroll',
      onScroll,
      {
        passive: true,
      },
    )

    window.addEventListener(
      'resize',
      onScroll,
    )

    return () => {
      window.removeEventListener(
        'scroll',
        onScroll,
      )

      window.removeEventListener(
        'resize',
        onScroll,
      )
    }
  }, [items.length])

  const move = (direction) => {
    setActive((value) =>
      clamp(
        value + direction,
        0,
        items.length - 1,
      ),
    )
  }

  const goTo = (index) => {
    setActive(
      clamp(
        index,
        0,
        items.length - 1,
      ),
    )
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      move(1)
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      move(-1)
    }
  }

  if (!items.length) {
    return null
  }

  return (
    <section
      className="vitrine"
      ref={root}
      id="vitrine"
      tabIndex="0"
      onKeyDown={handleKeyDown}
      style={{
        height: `${sectionHeight}vh`,
      }}
    >
      <div className="vitrine-sticky">
        <div className="section-kicker">
          UM POUCO DO QUE PODE SER FEITO
        </div>

        <div className="vitrine-head">
          <h2>
            E SE VOCÊ
            <br />
            <span>VISSE NA PRÁTICA?</span>
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
              aria-selected={
                category === categoryItem.id
              }
              className={
                category === categoryItem.id
                  ? 'is-active'
                  : ''
              }
              onClick={() =>
                setCategory(categoryItem.id)
              }
            >
              {categoryItem.label}
            </button>
          ))}
        </div>

        <div
          className="vitrine-roulette"
          onTouchStart={(event) => {
            touch.current =
              event.touches[0].clientX
          }}
          onTouchEnd={(event) => {
            const x =
              event.changedTouches[0].clientX

            const start =
              touch.current ?? x

            if (Math.abs(x - start) > 40) {
              move(x < start ? 1 : -1)
            }

            touch.current = null
          }}
        >
          {items.map((item, index) => (
            <Preview
              key={item.id}
              item={item}
              offset={index - safeActive}
              active={index === safeActive}
              total={items.length}
              index={index}
              onSelect={goTo}
            />
          ))}
        </div>
      </div>
    </section>
  )
}