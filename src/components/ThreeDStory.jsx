import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  Center,
  Environment,
  useGLTF,
} from '@react-three/drei'
import * as THREE from 'three'

import '../styles/three-story.css'


/* =========================================================
   MODELOS
   ========================================================= */

const MODELS = [
  {
    id: 'desktop',
    path: '/assets/3d/desktop.glb',
    eyebrow: 'NO COMPUTADOR',
    title: 'SUA MARCA EM QUALQUER FORMATO.',
    description:
      'Uma presença que apresenta, organiza e dá forma ao que você faz.',
  },

  {
    id: 'phone',
    path: '/assets/3d/phone.glb',
    eyebrow: 'NA PALMA DA MÃO',
    title: 'EM QUALQUER LUGAR.',
    description:
      'Porque a experiência não termina quando a tela muda.',
  },

  {
    id: 'microwave',
    path: '/assets/3d/microwave.glb',
    eyebrow: 'NO MICRO-ONDAS???',
    title: 'OK, QUASE QUALQUER LUGAR.',
    description:
      'No micro-ondas ainda não. Mas você entendeu a ideia.',
  },
]


/* =========================================================
   CONFIGURAÇÃO DOS OBJETOS 3D
   =========================================================

   É AQUI QUE VOCÊ VAI FAZER OS AJUSTES VISUAIS.

   Cada objeto possui sua própria configuração.

   ---------------------------------------------------------
   POSIÇÃO
   ---------------------------------------------------------

   x → esquerda / direita
   y → baixo / cima
   z → longe / perto

   Exemplos:

   x:  0.5  → direita
   x: -0.5  → esquerda

   y:  0.5  → cima
   y: -0.5  → baixo

   z:  0.5  → mais perto da câmera
   z: -0.5  → mais longe da câmera


   ---------------------------------------------------------
   ROTAÇÃO
   ---------------------------------------------------------

   x → inclinação para frente / trás
   y → giro esquerda / direita
   z → inclinação lateral

   Os valores são em RADIANOS.

   Exemplos:

   0
   0.1
   0.25
   0.5
   1


   ---------------------------------------------------------
   ESCALA
   ---------------------------------------------------------

   1   → tamanho original
   0.5 → metade
   2   → dobro


   ---------------------------------------------------------
   SCROLL MULTIPLIER
   ---------------------------------------------------------

   Controla quanto o objeto se desloca conforme
   a experiência avança no scroll.

   0   → quase parado
   1   → movimento normal
   2   → movimento forte


   ---------------------------------------------------------
   MOUSE ROTATION
   ---------------------------------------------------------

   Controla quanto o mouse influencia a rotação.

   0   → não reage ao mouse
   0.5 → reação sutil
   1   → reação normal
   2   → reação forte


   ---------------------------------------------------------
   FLOAT AMOUNT
   ---------------------------------------------------------

   Controla o pequeno movimento orgânico contínuo.

   0   → completamente parado
   0.5 → muito sutil
   1   → normal
   2   → bastante perceptível

   ========================================================= */

const OBJECT_CONFIG = {
  desktop: {
    /* POSIÇÃO MANUAL DO DESKTOP */
    position: {
      x: 1, // ← ESQUERDA / DIREITA
      y: 0,   // ← CIMA / BAIXO
      z: 0,   // ← PERTO / LONGE
    },

    /* ROTAÇÃO MANUAL DO DESKTOP */
    rotation: {
      x: 0, // ← INCLINAÇÃO FRENTE / TRÁS
      y: -0.50, // ← GIRO HORIZONTAL
      z: 0, // ← INCLINAÇÃO LATERAL
    },

    /* TAMANHO DO DESKTOP */
    scale: 0.55,

    /* QUANTO ELE SE MOVE COM O SCROLL */
    scrollMultiplier: 1.15,

    /* QUANTO O MOUSE AFETA O DESKTOP */
    mouseRotation: 1,

    /* QUANTO ELE FLUTUA PARADO */
    floatAmount: 1,
  },


  phone: {
    /* POSIÇÃO MANUAL DO CELULAR */
    position: {
      x: 1, // ← ESQUERDA / DIREITA
      y: 0, // ← CIMA / BAIXO
      z: 0, // ← PERTO / LONGE
    },

    /* ROTAÇÃO MANUAL DO CELULAR */
    rotation: {
      x: 0,    // ← INCLINAÇÃO FRENTE / TRÁS
      y: 0.12, // ← GIRO HORIZONTAL
      z: 0,    // ← INCLINAÇÃO LATERAL
    },

    /* TAMANHO DO CELULAR */
    scale: 0.40,

    /* QUANTO ELE SE MOVE COM O SCROLL */
    scrollMultiplier: 1.05,

    /* QUANTO O MOUSE AFETA O CELULAR */
    mouseRotation: 1,

    /* QUANTO ELE FLUTUA */
    floatAmount: 1,
  },


  microwave: {
    /* POSIÇÃO MANUAL DO MICRO-ONDAS */
    position: {
      x: 1, // ← ESQUERDA / DIREITA
      y: 0, // ← CIMA / BAIXO
      z: 0, // ← PERTO / LONGE
    },

    /* ROTAÇÃO MANUAL DO MICRO-ONDAS */
    rotation: {
      x: 0, // ← INCLINAÇÃO FRENTE / TRÁS
      y: 0, // ← GIRO HORIZONTAL
      z: 0, // ← INCLINAÇÃO LATERAL
    },

    /* TAMANHO DO MICRO-ONDAS */
    scale: 0.45,

    /* QUANTO ELE SE MOVE COM O SCROLL */
    scrollMultiplier: 0.8,

    /* QUANTO O MOUSE AFETA O MICRO-ONDAS */
    mouseRotation: 1,

    /* QUANTO ELE FLUTUA */
    floatAmount: 1,
  },
}


/* =========================================================
   FUNÇÕES AUXILIARES
   ========================================================= */

const clamp = (value, min, max) =>
  Math.min(Math.max(value, min), max)


const smoothstep = (
  edge0,
  edge1,
  value,
) => {
  const t = clamp(
    (value - edge0) /
      (edge1 - edge0),
    0,
    1,
  )

  return t * t * (3 - 2 * t)
}


const damp = (
  current,
  target,
  lambda,
  delta,
) => {
  return THREE.MathUtils.damp(
    current,
    target,
    lambda,
    delta,
  )
}


/* =========================================================
   OBJETO 3D
   ========================================================= */

function ModelObject({
  model,
  index,
  progressRef,
  pointerRef,
}) {
  const { scene } = useGLTF(model.path)

  const groupRef = useRef(null)

  /*
   * Pega a configuração correspondente ao modelo atual.
   *
   * desktop  → OBJECT_CONFIG.desktop
   * phone    → OBJECT_CONFIG.phone
   * microwave → OBJECT_CONFIG.microwave
   */

  const config =
    OBJECT_CONFIG[model.id]


  useFrame((state, delta) => {
    const group =
      groupRef.current

    if (!group) return


    const progress =
      progressRef.current

    const pointer =
      pointerRef.current


    /* =====================================================
       CONTROLE DO SCROLL
       ===================================================== */

    const segment =
      1 / MODELS.length

    const center =
      segment * (index + 0.5)

    const local =
      clamp(
        (progress - index * segment) /
          segment,
        0,
        1,
      )

    const distance =
      progress - center


    /* =====================================================
       PRESENÇA DO OBJETO
       ===================================================== */

    const presence =
      clamp(
        1 -
          Math.abs(distance) * 5.2,
        0,
        1,
      )


    /*
     * O desktop começa parcialmente presente
     * para a seção não nascer vazia.
     */

    const entryProgress =
      index === 0
        ? clamp(
            local + 0.08,
            0,
            1,
          )
        : local


    const enter =
      smoothstep(
        0,
        0.22,
        entryProgress,
      )


    const exit =
      1 -
      smoothstep(
        0.7,
        0.98,
        local,
      )


    const visibility =
      clamp(
        Math.min(
          enter,
          exit,
        ) * 1.35,
        0,
        1,
      )


    const isActive =
      Math.abs(distance) <
      segment * 0.72


    /* =====================================================
       MOVIMENTO ORGÂNICO
       =====================================================

       floatAmount vem do OBJECT_CONFIG.

       Se você colocar:

       floatAmount: 0

       o objeto para de flutuar.

       ===================================================== */

    const driftX =
      Math.sin(
        state.clock.elapsedTime * 0.55 +
          index * 1.8,
      ) *
      0.035 *
      config.floatAmount


    const driftY =
      Math.cos(
        state.clock.elapsedTime * 0.72 +
          index,
      ) *
      0.025 *
      config.floatAmount


    /* =====================================================
       MOVIMENTO DO MOUSE
       ===================================================== */

    const mousePower =
      config.mouseRotation


    const targetX =
      pointer.x *
        (
          0.1 +
          presence * 0.11
        ) *
        mousePower +
      (index - 1) * 0.02


    const targetY =
      pointer.y *
      (
        0.06 +
        presence * 0.08
      ) *
      mousePower


    /* =====================================================
       ROTAÇÃO FINAL
       =====================================================

       Junta:

       • rotação configurada manualmente
       • mouse
       • movimento orgânico
       • pequeno movimento do scroll

       ===================================================== */

    const targetRotationX =
      config.rotation.x -
      targetY +
      driftY +
      (
        isActive
          ? local * 0.08
          : 0
      )


    const targetRotationY =
      config.rotation.y +
      targetX +
      driftX


    const targetRotationZ =
      config.rotation.z +
      pointer.x *
        0.035 *
        mousePower


    /* =====================================================
       MOVIMENTO DO OBJETO NO SCROLL
       ===================================================== */

    const scrollMovement =
      index === 0
        ? -distance *
          config.scrollMultiplier
        : index === 1
          ? distance *
            config.scrollMultiplier
          : -distance *
            config.scrollMultiplier


    /* =====================================================
       ESCALA
       ===================================================== */

    const targetScale =
      config.scale *
      (
        0.82 +
        presence * 0.18
      ) *
      (
        visibility > 0
          ? 1
          : 0.0001
      )


    /* =====================================================
       POSIÇÃO X
       =====================================================

       config.position.x é seu ajuste manual.

       Exemplo:

       x: 0.5

       → move o objeto para a DIREITA.

       x: -0.5

       → move o objeto para a ESQUERDA.

       ===================================================== */

    group.position.x =
      damp(
        group.position.x,

        scrollMovement +
          config.position.x +
          pointer.x * 0.08,

        5.5,

        delta,
      )


    /* =====================================================
       POSIÇÃO Y
       =====================================================

       config.position.y controla a posição vertical.

       y positivo → sobe
       y negativo → desce

       ===================================================== */

    group.position.y =
      damp(
        group.position.y,

        config.position.y +
          Math.sin(
            local * Math.PI,
          ) *
            0.08 +
          pointer.y * 0.06,

        5.5,

        delta,
      )


    /* =====================================================
       POSIÇÃO Z
       =====================================================

       config.position.z controla profundidade.

       z positivo → aproxima
       z negativo → afasta

       ===================================================== */

    group.position.z =
      damp(
        group.position.z,

        config.position.z +
          presence * 0.1 -
          Math.abs(distance) * 0.9,

        5.5,

        delta,
      )


    /* =====================================================
       ROTAÇÃO X
       ===================================================== */

    group.rotation.x =
      damp(
        group.rotation.x,
        targetRotationX,
        5,
        delta,
      )


    /* =====================================================
       ROTAÇÃO Y
       ===================================================== */

    group.rotation.y =
      damp(
        group.rotation.y,
        targetRotationY,
        5,
        delta,
      )


    /* =====================================================
       ROTAÇÃO Z
       ===================================================== */

    group.rotation.z =
      damp(
        group.rotation.z,
        targetRotationZ,
        5,
        delta,
      )


    /* =====================================================
       ESCALA FINAL
       ===================================================== */

    const scale =
      damp(
        group.scale.x,
        targetScale,
        6,
        delta,
      )


    group.scale.setScalar(
      scale,
    )


    /* =====================================================
       ROTAÇÃO INTERNA DO GLB
       =====================================================

       Aqui estamos mexendo na cena que veio
       de dentro do arquivo GLB.

       Isso é diferente de group.rotation.

       ===================================================== */

    scene.rotation.y =
      damp(
        scene.rotation.y,

        config.rotation.y,

        3,

        delta,
      )
  })


  return (
    <group ref={groupRef}>
      <Center>
        <primitive
          object={scene}
          scale={1}
        />
      </Center>
    </group>
  )
}


/* =========================================================
   CENA THREE.JS
   ========================================================= */

function ThreeScene({
  progressRef,
  pointerRef,
}) {
  return (
    <Canvas
      camera={{
        position: [
          0,
          0.05,
          5.8,
        ],

        fov: 31,

        near: 0.1,

        far: 100,
      }}

      dpr={[
        1,
        1.5,
      ]}

      gl={{
        antialias: true,
        alpha: true,
        powerPreference:
          'high-performance',
      }}

      frameloop="always"
    >

      <ambientLight
        intensity={1.65}
      />

      <directionalLight
        position={[
          4,
          5,
          7,
        ]}
        intensity={2.4}
      />

      <directionalLight
        position={[
          -5,
          2,
          1,
        ]}
        intensity={1.25}
      />

      <pointLight
        position={[
          0,
          -2,
          4,
        ]}
        intensity={0.55}
        color="#f4d72f"
      />

      <Suspense fallback={null}>

        {MODELS.map(
          (
            model,
            index,
          ) => (
            <ModelObject
              key={model.id}
              model={model}
              index={index}
              progressRef={
                progressRef
              }
              pointerRef={
                pointerRef
              }
            />
          ),
        )}

        <Environment
          preset="studio"
          environmentIntensity={
            0.7
          }
        />

      </Suspense>

    </Canvas>
  )
}


/* =========================================================
   PRELOAD DOS MODELOS
   =========================================================

   Mantemos o preload porque a troca entre os modelos
   precisa acontecer imediatamente durante o scroll.

   ========================================================= */

MODELS.forEach(
  (model) => {
    useGLTF.preload(
      model.path,
    )
  },
)


/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */

export default function ThreeDStory() {

  const sectionRef =
    useRef(null)


  const progressRef =
    useRef(0)


  const targetProgressRef =
    useRef(0)


  const pointerRef =
    useRef({
      x: 0,
      y: 0,
    })


  const targetPointerRef =
    useRef({
      x: 0,
      y: 0,
    })


  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0)


  useEffect(() => {

    const section =
      sectionRef.current


    if (!section) {
      return undefined
    }


    /* =====================================================
       ATUALIZAÇÃO DO SCROLL
       ===================================================== */

    const updateScroll =
      () => {

        const rect =
          section.getBoundingClientRect()


        const scrollable =
          rect.height -
          window.innerHeight


        if (
          scrollable <= 0
        ) {
          targetProgressRef.current =
            0

          return
        }


        const nextProgress =
          clamp(
            -rect.top /
              scrollable,
            0,
            1,
          )


        targetProgressRef.current =
          nextProgress


        const nextIndex =
          Math.min(
            MODELS.length - 1,

            Math.floor(
              nextProgress *
                MODELS.length,
            ),
          )


        setActiveIndex(
          (current) =>
            current ===
            nextIndex
              ? current
              : nextIndex,
        )
      }


    /* =====================================================
       MOVIMENTO DO MOUSE
       ===================================================== */

    const updatePointer =
      (event) => {

        const rect =
          section.getBoundingClientRect()


        const x =
          clamp(
            (
              (
                event.clientX -
                rect.left
              ) /
                rect.width -
              0.5
            ) * 2,

            -1,

            1,
          )


        const y =
          clamp(
            (
              (
                event.clientY -
                rect.top
              ) /
                rect.height -
              0.5
            ) * 2,

            -1,

            1,
          )


        targetPointerRef.current.x =
          x

        targetPointerRef.current.y =
          y
      }


    /* =====================================================
       RESET DO MOUSE
       ===================================================== */

    const resetPointer =
      () => {

        targetPointerRef.current.x =
          0

        targetPointerRef.current.y =
          0
      }


    /* =====================================================
       ANIMAÇÃO SUAVE
       ===================================================== */

    let frame


    const animate =
      () => {

        progressRef.current +=
          (
            targetProgressRef.current -
            progressRef.current
          ) * 0.085


        pointerRef.current.x +=
          (
            targetPointerRef.current.x -
            pointerRef.current.x
          ) * 0.08


        pointerRef.current.y +=
          (
            targetPointerRef.current.y -
            pointerRef.current.y
          ) * 0.08


        frame =
          requestAnimationFrame(
            animate,
          )
      }


    updateScroll()


    frame =
      requestAnimationFrame(
        animate,
      )


    window.addEventListener(
      'scroll',
      updateScroll,
      {
        passive: true,
      },
    )


    window.addEventListener(
      'resize',
      updateScroll,
    )


    section.addEventListener(
      'pointermove',
      updatePointer,
    )


    section.addEventListener(
      'pointerleave',
      resetPointer,
    )


    return () => {

      window.removeEventListener(
        'scroll',
        updateScroll,
      )


      window.removeEventListener(
        'resize',
        updateScroll,
      )


      section.removeEventListener(
        'pointermove',
        updatePointer,
      )


      section.removeEventListener(
        'pointerleave',
        resetPointer,
      )


      cancelAnimationFrame(
        frame,
      )
    }

  }, [])


  return (
    <section
      ref={sectionRef}
      className="three-story"
      id="experiencia"
      aria-labelledby="three-story-title"
    >

      <div className="three-story__sticky">

        <div
          className="three-story__background"
          aria-hidden="true"
        />

        <div
          className="three-story__grain"
          aria-hidden="true"
        />


        <div className="three-story__topline">

          <span>
            UMA IDEIA,
            VÁRIOS LUGARES.
          </span>

          <span>
            ROUXINOL
          </span>

        </div>


        <div className="three-story__copy">

          <p className="three-story__eyebrow">
            SUA IDENTIDADE
          </p>


          <h2 id="three-story-title">

            Em qualquer lugar.

            <span>
              Em qualquer formato.
            </span>

          </h2>


          <p className="three-story__intro">
            Porque uma boa ideia não deveria
            depender de uma única tela.
          </p>

        </div>


        <div className="three-story__canvas">

          <ThreeScene
            progressRef={
              progressRef
            }
            pointerRef={
              pointerRef
            }
          />

        </div>


        <div
          className="three-story__side-note"
          aria-hidden="true"
        >

          <span>
            ARRASTE
          </span>

          <span>
            OU ROLE
          </span>

        </div>


        <div className="three-story__bottom">

          <div className="three-story__chapter">

            <span>
              {
                MODELS[
                  activeIndex
                ].eyebrow
              }
            </span>

          </div>


          <div className="three-story__statement">

            <p className="three-story__statement-title">

              {
                MODELS[
                  activeIndex
                ].title
              }

            </p>


            <p className="three-story__statement-description">

              {
                MODELS[
                  activeIndex
                ].description
              }

            </p>

          </div>


          <div
            className="three-story__progress"
            aria-hidden="true"
          >

            {MODELS.map(
              (
                model,
                index,
              ) => (

                <span
                  key={
                    model.id
                  }

                  className={
                    index ===
                    activeIndex
                      ? 'is-active'
                      : ''
                  }
                />

              ),
            )}

          </div>

        </div>

      </div>

    </section>
  )
}