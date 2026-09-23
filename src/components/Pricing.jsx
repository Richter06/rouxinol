import { useEffect, useRef, useState } from 'react'

import '../styles/pricing.css'

const categories = [
  {
    id: 'presence',
    eyebrow: 'PRESENÇA DIGITAL',
    name: 'Ser visto',
    description:
      'Para apresentar seu negócio com clareza, mostrar o que você oferece e criar um espaço próprio para sua marca na internet.',
    projects: [
      {
        name: 'Landing page',
        price: 'R$ 900',
      },
      {
        name: 'Site institucional',
        price: 'R$ 1.500',
      },
      {
        name: 'Catálogo / vitrine',
        price: 'R$ 1.800',
      },
    ],
  },
  {
    id: 'commercial',
    eyebrow: 'EXPERIÊNCIA COMERCIAL',
    name: 'Vender melhor',
    description:
      'Para organizar produtos, serviços e atendimentos e tornar mais simples o caminho entre conhecer seu negócio e entrar em contato.',
    projects: [
      {
        name: 'Agendamento',
        price: 'R$ 2.000',
      },
      {
        name: 'Loja virtual',
        price: 'R$ 2.500',
      },
    ],
  },
  {
    id: 'digital',
    eyebrow: 'SOLUÇÕES DIGITAIS',
    name: 'Organizar',
    description:
      'Para quando processos, informações e tarefas começam a ocupar tempo demais e precisam de uma solução mais organizada.',
    projects: [
      {
        name: 'Dashboard',
        price: 'R$ 3.000',
      },
      {
        name: 'Sistema de gestão',
        price: 'R$ 3.500',
      },
    ],
  },
  {
    id: 'custom',
    eyebrow: 'PROJETO PERSONALIZADO',
    name: 'Algo diferente',
    description:
      'Para necessidades que não cabem em uma solução pronta. O projeto começa entendendo o que seu negócio realmente precisa.',
    projects: [
      {
        name: 'Solução sob medida',
        price: 'Sob consulta',
      },
    ],
  },
]

export default function Pricing() {
  const sectionRef = useRef(null)

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const section = sectionRef.current

    if (!section) {
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.12,
      },
    )

    observer.observe(section)

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`pricing ${
        isVisible ? 'is-visible' : ''
      }`}
      id="pricing"
      aria-labelledby="pricing-title"
    >
      <div className="pricing__inner">

        <header className="pricing__header">

          <span className="pricing__eyebrow">
            INVESTIMENTO
          </span>

          <div className="pricing__heading">

            <div className="pricing__heading-main">

              <h2 id="pricing-title">
                Cada projeto
                <span>
                  começa de um jeito.
                </span>
              </h2>

            </div>

            <div className="pricing__intro">

              <p>
                Cada solução parte de um
                ponto de partida diferente.
              </p>

              <p>
                O valor final acompanha o
                que o projeto precisa.
              </p>

            </div>

          </div>

        </header>

        <div className="pricing__grid">

          {categories.map((category) => (
            <article
              key={category.id}
              className="pricing__card"
            >

              <div
                className="pricing__card-fill"
                aria-hidden="true"
              />

              <div className="pricing__card-content">

                <div className="pricing__card-top">

                  <span className="pricing__card-eyebrow">
                    {category.eyebrow}
                  </span>

                </div>

                <div className="pricing__card-heading">

                  <h3>
                    {category.name}
                  </h3>

                  <p>
                    {category.description}
                  </p>

                </div>

                <div className="pricing__projects">

                  <span className="pricing__projects-label">
                    SOLUÇÕES
                  </span>

                  {category.projects.map((project) => (
                    <div
                      className="pricing__project"
                      key={project.name}
                    >

                      <span className="pricing__project-name">
                        {project.name}
                      </span>

                      <span className="pricing__project-price">
                        {project.price === 'Sob consulta'
                          ? project.price
                          : `a partir de ${project.price}`}
                      </span>

                    </div>
                  ))}

                </div>

                <a
                  href="#contact"
                  className="pricing__card-cta"
                >
                  <span>
                    {category.id === 'custom'
                      ? 'CONVERSAR SOBRE O PROJETO'
                      : 'VER ESSA POSSIBILIDADE'}
                  </span>

                  <span aria-hidden="true">
                    ↗
                  </span>
                </a>

              </div>

            </article>
          ))}

        </div>

        <footer className="pricing__footer">

          <div className="pricing__footer-label">
            <span />
            VALORES INICIAIS
          </div>

          <p>
            O valor final depende do escopo,
            funcionalidades e complexidade
            de cada projeto.
          </p>

          <a href="#contact">
            NÃO SABE POR ONDE COMEÇAR?
            <span aria-hidden="true">
              ↗
            </span>
          </a>

        </footer>

      </div>
    </section>
  )
}