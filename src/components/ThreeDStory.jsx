import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  Bounds,
  Center,
  Environment,
  OrbitControls,
  useGLTF,
} from '@react-three/drei'

/* =========================================================
   CAMINHOS DOS MODELOS 3D
   ========================================================= */

const DESKTOP_MODEL = '/assets/3d/desktop.glb'
const MOBILE_MODEL = '/assets/3d/phone.glb'
const MICROWAVE_MODEL = '/assets/3d/microwave.glb'

/* =========================================================
   CONFIGURAÇÃO DOS MODELOS
   ========================================================= */

const slides = [
  {
    id: 'desktop',
    eyebrow: 'SUA IDENTIDADE',
    title: 'EM QUALQUER LUGAR.',
    description:
      'Sua presença digital precisa funcionar onde seus clientes estiverem.',
    modelLabel: 'MODELO 3D — DESKTOP',
    modelPath: DESKTOP_MODEL,
    scale: 1,
  },

  {
    id: 'mobile',
    eyebrow: 'SUA IDENTIDADE',
    title: 'EM QUALQUER FORMATO.',
    description:
      'Do computador ao celular, sua marca continua sendo reconhecida.',
    modelLabel: 'MODELO 3D — CELULAR',
    modelPath: MOBILE_MODEL,
    scale: 0.55,
  },

  {
    id: 'microwave',
    eyebrow: '',
    title: 'QUALQUER MESMO.',
    description:
      'Ok. Talvez não literalmente qualquer lugar.',
    modelLabel: 'MODELO 3D — MICRO-ONDAS',
    modelPath: MICROWAVE_MODEL,
    scale: 1,
  },
]

/* =========================================================
   MODELO
   ========================================================= */

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

/* =========================================================
   CENA 3D
   ========================================================= */

function ModelScene({ path, scale }) {
  return (
    <Canvas
      camera={{
        position: [0, 0, 5],
        fov: 38,
        near: 0.1,
        far: 1000,
      }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
      }}
    >
      {/* =================================================
          ILUMINAÇÃO
          ================================================= */}

      <ambientLight intensity={1.5} />

      <directionalLight
        position={[4, 5, 6]}
        intensity={3}
      />

      <directionalLight
        position={[-4, 2, -3]}
        intensity={1.5}
      />

      {/* =================================================
          MODELO
          ================================================= */}

      <Suspense fallback={null}>
        <Bounds
          fit
          clip
          observe
          margin={1.05}
        >
          <Model
            path={path}
            scale={scale}
          />
        </Bounds>

        <Environment preset="studio" />
      </Suspense>

      {/* =================================================
          ROTAÇÃO
          ================================================= */}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={1}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 1.8}
      />
    </Canvas>
  )
}

/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */

export default function ThreeDStory() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const activeSlide = slides[activeIndex]

  /* =======================================================
     NAVEGAÇÃO
     ======================================================= */

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

  /* =======================================================
     AUTOPLAY
     ======================================================= */

  useEffect(() => {
    if (isPaused) {
      return
    }

    const interval = setInterval(() => {
      setActiveIndex(
        (current) =>
          (current + 1) % slides.length,
      )
    }, 6500)

    return () => clearInterval(interval)
  }, [isPaused])

  /* =======================================================
     TECLADO
     ======================================================= */

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

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <section
      className="three-story"
      id="experiencia"
      aria-labelledby="three-story-title"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex="0"
    >
      <div className="three-story__inner">

        {/* =================================================
            TEXTO
            ================================================= */}

        <div className="three-story__copy">

          <span className="three-story__kicker">
            UMA IDEIA, VÁRIOS FORMATOS
          </span>

          <h2
            className="three-story__title"
            id="three-story-title"
          >
            Imagine seu negócio
            <span>
              em vários formatos.
            </span>
          </h2>

          <p className="three-story__description">
            Seu negócio não precisa ficar preso a um único lugar.
            A Rouxinol cria experiências que acompanham a forma
            como seus clientes encontram, conhecem e usam sua marca.
          </p>

          {/* =================================================
              FRASES LATERAIS
              ================================================= */}

          <div className="three-story__statement">

            <div className="three-story__statement-item">
              <span className="three-story__statement-mark">
                /
              </span>

              <p>
                Uma presença digital que faz sentido
                <strong>
                  {' '}onde ela aparece.
                </strong>
              </p>
            </div>

            <div className="three-story__statement-item">
              <span className="three-story__statement-mark">
                /
              </span>

              <p>
                Uma marca que continua sendo
                <strong>
                  {' '}reconhecida em qualquer formato.
                </strong>
              </p>
            </div>

            <div className="three-story__statement-item">
              <span className="three-story__statement-mark">
                /
              </span>

              <p>
                Uma experiência pensada para
                <strong>
                  {' '}acompanhar o seu negócio.
                </strong>
              </p>
            </div>

          </div>
        </div>

        {/* =================================================
            VITRINE
            ================================================= */}

        <div className="three-story__showcase">

          <div className="three-story__stage">

            <div
              className="three-story__model"
              key={activeSlide.id}
            >
              <ModelScene
                path={activeSlide.modelPath}
                scale={activeSlide.scale}
              />
            </div>

            <div className="three-story__stage-glow" />

          </div>

          {/* =================================================
              INFORMAÇÕES DO SLIDE
              ================================================= */}

          <div className="three-story__slide-info">

            <div
              className="three-story__slide-copy"
              key={activeSlide.id}
            >

              {/* =============================================
                  EYEBROW
                  ============================================= */}

              {activeSlide.eyebrow && (
                <span className="three-story__slide-eyebrow">
                  {activeSlide.eyebrow}
                </span>
              )}

              <h3 className="three-story__slide-title">
                {activeSlide.title}
              </h3>

              <p className="three-story__slide-description">
                {activeSlide.description}
              </p>

              {/* =============================================
                  COMPLEMENTO DO MICRO-ONDAS
                  ============================================= */}

              {activeSlide.id === 'microwave' && (
                <div
                  className="three-story__microwave-joke"
                  key="microwave-joke"
                >
                  <span className="three-story__microwave-joke-label">
                    MAS VOCÊ ENTENDEU.
                  </span>

                  <p>
                    Seu negócio precisa estar
                    <strong>
                      {' '}onde seus clientes estão.
                    </strong>
                  </p>
                </div>
              )}

            </div>

            {/* =================================================
                CONTROLES
                ================================================= */}

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
                    aria-label={
                      `Mostrar ${slide.modelLabel.toLowerCase()}`
                    }
                  />
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

      </div>
    </section>
  )
}