import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, useGLTF, useProgress } from '@react-three/drei'
import * as THREE from 'three'

import '../styles/visibility.css'

const PLANET_PATH = '/assets/3d/purple_planet.glb'

const topics = [
  {
    id: 'appear',
    label: 'APARECER',
    title: 'Ser encontrado começa antes do primeiro contato.',
    text: 'Uma presença digital clara cria um lugar para o seu negócio existir, ser descoberto e passar confiança.',
    solution: 'LANDING PAGE OU SITE',
  },
  {
    id: 'organize',
    label: 'ORGANIZAR',
    title: 'Informação boa não deveria ficar espalhada.',
    text: 'Sistemas sob medida colocam clientes, produtos, pedidos e rotina no mesmo lugar, sem transformar seu negócio em uma caça ao tesouro.',
    solution: 'SISTEMA',
  },
  {
    id: 'automate',
    label: 'AUTOMATIZAR',
    title: 'A parte repetitiva pode deixar de ser sua parte.',
    text: 'Automação e ferramentas ajudam a tirar do caminho tarefas que consomem tempo sem precisar consumir sua atenção.',
    solution: 'AUTOMAÇÃO E FERRAMENTAS',
  },
  {
    id: 'see',
    label: 'ENXERGAR',
    title: 'Seus números podem contar uma história melhor.',
    text: 'Dashboards transformam dados espalhados em uma visão simples para entender resultados e tomar decisões.',
    solution: 'DASHBOARD',
  },
  {
    id: 'sell',
    label: 'VENDER',
    title: 'Produto bom merece uma experiência à altura.',
    text: 'Catálogos e lojas digitais deixam seus produtos mais fáceis de descobrir, entender e escolher.',
    solution: 'CATÁLOGO OU LOJA',
  },
  {
    id: 'create',
    label: 'CRIAR',
    title: 'Nem toda ideia precisa caber numa ferramenta pronta.',
    text: 'Quando o problema é diferente, a solução também pode ser. Criamos experiências e ferramentas pensadas para o que você realmente precisa.',
    solution: 'PROJETO PERSONALIZADO',
  },
]

const orbitConfig = [
  {
    radiusX: 4.05,
    radiusY: 1.7,
    radiusZ: 1.35,
    speed: 0.115,
    phase: 0.15,
  },
  {
    radiusX: 3.45,
    radiusY: 1.45,
    radiusZ: 1.9,
    speed: -0.085,
    phase: 1.75,
  },
  {
    radiusX: 4.35,
    radiusY: 1.95,
    radiusZ: 0.9,
    speed: 0.075,
    phase: 3.2,
  },
  {
    radiusX: 3.2,
    radiusY: 1.3,
    radiusZ: 1.55,
    speed: -0.105,
    phase: 4.45,
  },
  {
    radiusX: 4.55,
    radiusY: 2.1,
    radiusZ: 1.15,
    speed: 0.06,
    phase: 5.4,
  },
  {
    radiusX: 3.75,
    radiusY: 1.6,
    radiusZ: 2.05,
    speed: -0.07,
    phase: 6.15,
  },
]

function LoadingPlanet() {
  const { progress } = useProgress()

  return (
    <Html center>
      <div
        className="visibility__planet-loader"
        aria-live="polite"
      >
        <span />
        <strong>{Math.round(progress)}%</strong>
      </div>
    </Html>
  )
}

function PlanetModel() {
  const { scene } = useGLTF(PLANET_PATH)
  const planetRef = useRef(null)

  const fit = useMemo(() => {
    scene.updateWorldMatrix(true, true)

    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    const maxSize =
      Math.max(size.x, size.y, size.z) || 1

    const scale = 2.75 / maxSize

    return {
      scale,
      position: [
        -center.x * scale,
        -center.y * scale,
        -center.z * scale,
      ],
    }
  }, [scene])

  useFrame((state, delta) => {
    if (!planetRef.current) {
      return
    }

    const pointerX = state.pointer.x
    const pointerY = state.pointer.y
    const elapsed = state.clock.elapsedTime

    const targetRotationX =
      pointerY * -0.09 +
      Math.sin(elapsed * 0.45) * 0.012

    const targetRotationY =
      elapsed * 0.055 +
      pointerX * 0.12

    const targetRotationZ =
      pointerX * -0.025

    planetRef.current.rotation.x =
      THREE.MathUtils.damp(
        planetRef.current.rotation.x,
        targetRotationX,
        3.2,
        delta,
      )

    planetRef.current.rotation.y =
      THREE.MathUtils.damp(
        planetRef.current.rotation.y,
        targetRotationY,
        2.8,
        delta,
      )

    planetRef.current.rotation.z =
      THREE.MathUtils.damp(
        planetRef.current.rotation.z,
        targetRotationZ,
        3.2,
        delta,
      )

    planetRef.current.position.y =
      THREE.MathUtils.damp(
        planetRef.current.position.y,
        Math.sin(elapsed * 0.7) * 0.055,
        2.8,
        delta,
      )
  })

  return (
    <group ref={planetRef}>
      <group
        scale={fit.scale}
        position={fit.position}
      >
        <primitive object={scene} />
      </group>
    </group>
  )
}

useGLTF.preload(PLANET_PATH)

function OrbitPath({
  radiusX,
  rotation = [Math.PI / 2.7, 0, 0],
  opacity = 0.22,
}) {
  return (
    <mesh rotation={rotation}>
      <torusGeometry
        args={[
          radiusX,
          0.006,
          8,
          96,
        ]}
      />

      <meshBasicMaterial
        color="#f4d72f"
        transparent
        opacity={opacity}
      />
    </mesh>
  )
}

function OrbitBubble({
  topic,
  index,
  selected,
  onSelect,
}) {
  const groupRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  const config = orbitConfig[index]

  useFrame((state, delta) => {
    if (!groupRef.current) {
      return
    }

    const time =
      state.clock.elapsedTime * config.speed +
      config.phase

    const x =
      Math.cos(time) * config.radiusX

    const y =
      Math.sin(time) * config.radiusY

    const z =
      Math.sin(time) * config.radiusZ

    const targetX =
      x + state.pointer.x * 0.08

    const targetY =
      y + state.pointer.y * 0.06

    groupRef.current.position.x =
      THREE.MathUtils.damp(
        groupRef.current.position.x,
        targetX,
        5,
        delta,
      )

    groupRef.current.position.y =
      THREE.MathUtils.damp(
        groupRef.current.position.y,
        targetY,
        5,
        delta,
      )

    groupRef.current.position.z =
      THREE.MathUtils.damp(
        groupRef.current.position.z,
        z,
        5,
        delta,
      )

    const targetScale = selected
      ? 1.22
      : hovered
        ? 1.1
        : 1

    const scale =
      THREE.MathUtils.damp(
        groupRef.current.scale.x,
        targetScale,
        7,
        delta,
      )

    groupRef.current.scale.setScalar(scale)
  })

  return (
    <group ref={groupRef}>
      <Html
        center
        distanceFactor={7}
        zIndexRange={[30, 0]}
      >
        <button
          type="button"
          className={`visibility__bubble ${
            selected ? 'is-selected' : ''
          } ${
            hovered ? 'is-hovered' : ''
          }`}
          aria-label={`Explorar ${topic.label}`}
          aria-pressed={selected}
          onClick={(event) => {
            event.stopPropagation()
            onSelect(topic.id)
          }}
          onPointerEnter={() =>
            setHovered(true)
          }
          onPointerLeave={() =>
            setHovered(false)
          }
        >
          <span className="visibility__bubble-dot" />

          <strong>
            {topic.label}
          </strong>
        </button>
      </Html>
    </group>
  )
}

function PlanetScene({
  selectedId,
  onSelect,
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{
        position: [0, 0, 9],
        fov: 42,
      }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      onPointerMissed={() =>
        onSelect(null)
      }
    >
      <ambientLight intensity={1.4} />

      <directionalLight
        position={[4, 5, 5]}
        intensity={2.1}
      />

      <pointLight
        position={[-3, 1, 4]}
        intensity={18}
        distance={12}
        color="#f4d72f"
      />

      <pointLight
        position={[3, -2, 2]}
        intensity={10}
        distance={10}
        color="#5b21b6"
      />

      <Suspense
        fallback={<LoadingPlanet />}
      >
        <group>
          <OrbitPath
            radiusX={3.55}
            opacity={0.15}
          />

          <OrbitPath
            radiusX={4.25}
            rotation={[
              Math.PI / 2.25,
              0.15,
              0.1,
            ]}
            opacity={0.1}
          />

          <PlanetModel />

          {topics.map((topic, index) => (
            <OrbitBubble
              key={topic.id}
              topic={topic}
              index={index}
              selected={
                selectedId === topic.id
              }
              onSelect={onSelect}
            />
          ))}
        </group>
      </Suspense>
    </Canvas>
  )
}

export default function Visibility() {
  const [selectedId, setSelectedId] =
    useState(null)

  const selectedTopic =
    topics.find(
      (topic) =>
        topic.id === selectedId,
    ) ?? null

  return (
    <section
      className="visibility"
      id="visibilidade"
      aria-labelledby="visibility-title"
    >
      <div className="visibility__sticky">
        <div className="visibility__world">
          <div
            className="visibility__stars"
            aria-hidden="true"
          />

          <div
            className="visibility__fog visibility__fog--one"
            aria-hidden="true"
          />

          <div
            className="visibility__fog visibility__fog--two"
            aria-hidden="true"
          />

          <div
            className="visibility__cursor-light"
            aria-hidden="true"
          />

          <div
            className="visibility__canvas"
            aria-hidden="true"
          >
            <PlanetScene
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>

          <div className="visibility__content">
            <header className="visibility__header">
              <div className="visibility__eyebrow">
                <span />

                <strong>
                  O QUE VOCÊ QUER COLOCAR EM ÓRBITA?
                </strong>
              </div>

              <h2 id="visibility-title">
                <span className="visibility__headline-line">
                  Sua presença pode
                </span>

                <span className="visibility__headline-line visibility__headline-line--accent">
                  ir muito além.
                </span>
              </h2>

              <p>
                Explore as possibilidades ao redor
                do seu negócio. Clique em uma órbita
                para descobrir onde podemos chegar.
              </p>
            </header>

            <div
              className={`visibility__topic-info ${
                selectedTopic
                  ? 'is-open'
                  : ''
              }`}
              aria-live="polite"
              aria-atomic="true"
            >
              {selectedTopic ? (
                <>
                  <div className="visibility__topic-meta">
                    <span>
                      {selectedTopic.label}
                    </span>

                    <button
                      type="button"
                      className="visibility__topic-close"
                      onClick={() =>
                        setSelectedId(null)
                      }
                      aria-label="Fechar informações"
                    >
                      FECHAR
                    </button>
                  </div>

                  <h3>
                    {selectedTopic.title}
                  </h3>

                  <p>
                    {selectedTopic.text}
                  </p>

                  <strong>
                    {selectedTopic.solution}
                  </strong>
                </>
              ) : (
                <div className="visibility__topic-empty">
                  <span>
                    EXPLORE AS ÓRBITAS
                  </span>

                  <p>
                    Escolha uma possibilidade
                    para saber mais.
                  </p>
                </div>
              )}
            </div>

            <div
              className="visibility__stage-label"
              aria-hidden="true"
            >
              <span>ROUXINOL</span>
              <strong>VISIBILIDADE</strong>
            </div>

            <div
              className="visibility__hint"
              aria-hidden="true"
            >
              <span>
                MOVE · EXPLORE · CLICK
              </span>

              <i />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}