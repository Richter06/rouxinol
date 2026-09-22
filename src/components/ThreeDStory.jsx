import { Suspense, useEffect, useState } from 'react'
import '../styles/three-story.css'

import { Canvas } from '@react-three/fiber'
import {
  Center,
  Environment,
  OrbitControls,
  useGLTF,
} from '@react-three/drei'

const DESKTOP_MODEL = '/assets/3d/desktop.glb'
const MOBILE_MODEL = '/assets/3d/phone.glb'
const MICROWAVE_MODEL = '/assets/3d/microwave.glb'

const slides = [
  {
    id: 'desktop',
    number: '01',
    eyebrow: 'PRESENÇA',
    title: 'COMEÇA NA TELA.',
    description:
      'Seu negócio precisa de um lugar onde as pessoas possam chegar, entender e lembrar de você.',
    modelLabel: 'DESKTOP',
    modelPath: DESKTOP_MODEL,
    scale: 1,
    accent: 'purple',
  },
  {
    id: 'mobile',
    number: '02',
    eyebrow: 'CONTINUIDADE',
    title: 'CONTINUA COM ELAS.',
    description:
      'Porque hoje seu cliente pode conhecer sua marca no computador e terminar tudo pelo celular.',
    modelLabel: 'CELULAR',
    modelPath: MOBILE_MODEL,
    scale: 0.55,
    accent: 'yellow',
  },
  {
    id: 'microwave',
    number: '03',
    eyebrow: 'OK.',
    title: 'QUASE QUALQUER LUGAR.',
    description:
      'Não, a Rouxinol não vai colocar seu site no micro ondas.',
    modelLabel: 'MICRO ONDAS',
    modelPath: MICROWAVE_MODEL,
    scale: 1,
    accent: 'purple',
  },
]

function Model({ path, scale }) {
  const { scene } = useGLTF(path)

  return (
    <Center>
      <primitive
        object={scene}
        scale={scale}
      />
    </Center>
  )
}

function ModelScene({ path, scale }) {
  return (
    <Canvas
      camera={{
        position: [0, 0, 5],
        fov: 35,
        near: 0.1,
        far: 1000,
      }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
      }}
    >
      <ambientLight intensity={1.4} />

      <directionalLight
        position={[4, 5, 6]}
        intensity={2.8}
      />

      <directionalLight
        position={[-4, 2, -3]}
        intensity={1.2}
      />

      <Suspense fallback={null}>
        <Model
          path={path}
          scale={scale}
        />

        <Environment preset="studio" />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.8}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 1.8}
      />
    </Canvas>
  )
}

useGLTF.preload(DESKTOP_MODEL)
useGLTF.preload(MOBILE_MODEL)
useGLTF.preload(MICROWAVE_MODEL)

export default function ThreeDStory() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const activeSlide = slides[activeIndex]

  function goToSlide(index) {
    const normalizedIndex =
      (index + slides.length) % slides.length

    setActiveIndex(normalizedIndex)
  }

  function nextSlide() {
    goToSlide(activeIndex + 1)
  }

  function previousSlide() {
    goToSlide(activeIndex - 1)
  }

  useEffect(() => {
    if (isPaused) {
      return undefined
    }

    const interval = setInterval(() => {
      setActiveIndex(
        (current) =>
          (current + 1) % slides.length,
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
      className={`three-story three-story--${activeSlide.accent}`}
      id="experiencia"
      aria-labelledby="three-story-title"
      tabIndex="0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
    >
      <div className="three-story__background" />

      <div className="three-story__inner">
        <header className="three-story__header">
          <div className="three-story__meta">
            <span className="three-story__section-label">
              UMA IDEIA, VÁRIOS FORMATOS
            </span>

            <span className="three-story__counter">
              {activeSlide.number}
              <span>/</span>
              03
            </span>
          </div>

          <div className="three-story__heading">
            <p className="three-story__intro">
              Seu negócio não precisa ficar preso
              a um único lugar.
            </p>

            <h2
              id="three-story-title"
              className="three-story__title"
            >
              A mesma ideia.
              <span>Outros lugares.</span>
            </h2>
          </div>
        </header>

        <div className="three-story__stage">
          <div className="three-story__stage-line" />

          <div className="three-story__model">
            <div
              className="three-story__model-inner"
              key={activeSlide.id}
            >
              <ModelScene
                path={activeSlide.modelPath}
                scale={activeSlide.scale}
              />
            </div>
          </div>

          <div className="three-story__object-label">
            <span>
              {activeSlide.number}
            </span>

            <span>
              {activeSlide.modelLabel}
            </span>
          </div>

          <div className="three-story__orbit-mark">
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className="three-story__bottom">
          <div className="three-story__statement">
            <span className="three-story__eyebrow">
              {activeSlide.eyebrow}
            </span>

            <h3
              key={activeSlide.id}
              className="three-story__slide-title"
            >
              {activeSlide.title}
            </h3>
          </div>

          <div className="three-story__description">
            <p key={activeSlide.id}>
              {activeSlide.description}
            </p>

            {activeSlide.id === 'microwave' && (
              <span className="three-story__joke">
                MAS VOCÊ ENTENDEU.
              </span>
            )}
          </div>

          <div className="three-story__controls">
            <button
              type="button"
              className="three-story__arrow"
              onClick={previousSlide}
              aria-label="Modelo anterior"
            >
              ←
            </button>

            <div
              className="three-story__dots"
              role="tablist"
              aria-label="Selecionar formato"
            >
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  className={
                    index === activeIndex
                      ? 'three-story__dot is-active'
                      : 'three-story__dot'
                  }
                  onClick={() => goToSlide(index)}
                  role="tab"
                  aria-selected={
                    index === activeIndex
                  }
                  aria-label={`Mostrar ${slide.modelLabel.toLowerCase()}`}
                >
                  <span>
                    {slide.number}
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              className="three-story__arrow"
              onClick={nextSlide}
              aria-label="Próximo modelo"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}