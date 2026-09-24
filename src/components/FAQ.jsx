import { useEffect, useRef, useState } from 'react'

import '../styles/faq.css'

const questions = [
  {
    id: 'how',
    label: 'Como funciona?',
    answer: [
      'É mais simples do que parece. Você conta o que precisa e a gente transforma a ideia em um projeto.',
      'Durante a produção, você acompanha cada etapa e participa das decisões importantes.',
    ],
    followUps: [
      { label: 'Posso acompanhar tudo?', target: 'changes' },
      { label: 'Quanto tempo leva?', target: 'time' },
      { label: 'Quanto custa?', target: 'price' },
    ],
  },

  {
    id: 'price',
    label: 'Quanto custa?',
    answer: [
      'Depende do que você precisa. Temos projetos a partir de R$ 900 e também criamos soluções sob medida.',
      'Na parte de preços você consegue ver alguns exemplos e entender o que entra em cada tipo de projeto.',
    ],
    followUps: [
      { label: 'Quando eu pago?', target: 'payment' },
      { label: 'E se eu quiser algo diferente?', target: 'idea' },
      { label: 'Como funciona?', target: 'how' },
    ],
  },

  {
    id: 'time',
    label: 'Quanto tempo leva?',
    answer: [
      'Cada projeto tem seu próprio ritmo. Uma página simples não leva o mesmo tempo que uma loja ou um sistema.',
      'Antes de começar, combinamos uma previsão que faça sentido para o projeto.',
    ],
    followUps: [
      { label: 'Posso acompanhar tudo?', target: 'changes' },
      { label: 'E se eu mudar de ideia?', target: 'cancel' },
      { label: 'Como funciona?', target: 'how' },
    ],
  },

  {
    id: 'tech',
    label: 'Preciso entender de tecnologia?',
    answer: [
      'Não. Você não precisa saber absolutamente nada sobre tecnologia para ter uma presença digital.',
      'Você pode simplesmente contar o que gostaria de ter ou qual problema quer resolver. A gente cuida da parte técnica.',
    ],
    followUps: [
      { label: 'Tenho uma ideia diferente', target: 'idea' },
      { label: 'Como funciona?', target: 'how' },
      { label: 'Vocês fazem manutenção?', target: 'maintenance' },
    ],
  },

  {
    id: 'hosting',
    label: 'Vocês cuidam da hospedagem e do domínio?',
    answer: [
      'Podemos cuidar dessa parte com você e orientar o que for necessário.',
      'A ideia é não deixar você perdido depois que o projeto estiver pronto.',
    ],
    followUps: [
      { label: 'Vocês fazem manutenção?', target: 'maintenance' },
      { label: 'E se eu quiser algo novo depois?', target: 'new' },
      { label: 'Como funciona?', target: 'how' },
    ],
  },

  {
    id: 'changes',
    label: 'Posso pedir alterações?',
    answer: [
      'Claro. O projeto vai sendo apresentado por etapas justamente para você acompanhar e dizer o que faz sentido.',
      'Assim, os ajustes acontecem durante a produção e não só quando tudo já estiver pronto.',
    ],
    followUps: [
      { label: 'E se eu não gostar do resultado?', target: 'result' },
      { label: 'Quanto tempo leva?', target: 'time' },
      { label: 'Quando eu pago?', target: 'payment' },
    ],
  },

  {
    id: 'result',
    label: 'E se eu não gostar do resultado?',
    answer: [
      'Você vai acompanhando a evolução do projeto em cada etapa, então não precisa esperar tudo ficar pronto para descobrir como está ficando.',
      'A gente apresenta o que foi feito, você diz o que gostou, o que não gostou e o que gostaria de mudar. Vamos ajustando juntos durante o processo.',
      'E se mesmo assim você perceber que o projeto não está do jeito que esperava, tudo bem. Você pode cancelar a produção.',
      'O pagamento do projeto principal só é feito no final, então você não precisa pagar por algo que decidiu não levar adiante.',
    ],
    followUps: [
      { label: 'Posso pedir alterações?', target: 'changes' },
      { label: 'Quando eu pago?', target: 'payment' },
      { label: 'E se eu mudar de ideia?', target: 'cancel' },
    ],
  },

  {
    id: 'maintenance',
    label: 'Vocês fazem manutenção?',
    answer: [
      'Podemos continuar cuidando do projeto depois que ele estiver no ar.',
      'Isso pode incluir ajustes, melhorias e novas funções conforme sua necessidade.',
    ],
    followUps: [
      { label: 'E se eu quiser algo novo depois?', target: 'new' },
      { label: 'Vocês cuidam da hospedagem?', target: 'hosting' },
      { label: 'Tenho uma ideia diferente', target: 'idea' },
    ],
  },

  {
    id: 'idea',
    label: 'Tenho uma ideia diferente. E agora?',
    answer: [
      'Melhor ainda. Você não precisa encaixar sua ideia em uma categoria pronta.',
      'Conta para a gente o que você imaginou e descobrimos juntos qual é a melhor forma de transformar isso em algo real.',
    ],
    followUps: [
      { label: 'Quero conversar sobre isso', target: 'contact' },
      { label: 'Como funciona?', target: 'how' },
      { label: 'Quanto custa?', target: 'price' },
    ],
  },

  {
    id: 'payment',
    label: 'Quando eu pago?',
    answer: [
      'O pagamento do projeto principal é feito no final da produção.',
      'Durante o caminho, você acompanha o que está sendo construído e pode decidir se quer continuar.',
    ],
    followUps: [
      { label: 'E se eu não gostar do resultado?', target: 'result' },
      { label: 'E se eu mudar de ideia?', target: 'cancel' },
      { label: 'Como funciona?', target: 'how' },
    ],
  },

  {
    id: 'cancel',
    label: 'E se eu mudar de ideia?',
    answer: [
      'Acontece. Nem toda ideia continua fazendo sentido depois que começa a tomar forma.',
      'Se você decidir não seguir com o projeto principal, pode cancelar a produção. O pagamento principal acontece somente no final.',
    ],
    followUps: [
      { label: 'E se eu não gostar do resultado?', target: 'result' },
      { label: 'Posso pedir alterações?', target: 'changes' },
      { label: 'Tenho outra ideia', target: 'idea' },
    ],
  },

  {
    id: 'new',
    label: 'E se eu quiser algo novo depois?',
    answer: [
      'O projeto não precisa parar onde começou.',
      'Se sua marca crescer, sua necessidade mudar ou surgir uma ideia nova, podemos continuar evoluindo a solução.',
    ],
    followUps: [
      { label: 'Vocês fazem manutenção?', target: 'maintenance' },
      { label: 'Tenho uma ideia diferente', target: 'idea' },
      { label: 'Como funciona?', target: 'how' },
    ],
  },
]

const introMessages = [
  {
    id: 'welcome',
    type: 'rouxinol',
    text: 'Oi. Tem alguma coisa que você quer saber antes de começar?',
  },
  {
    id: 'welcome-2',
    type: 'rouxinol',
    text: 'Pode escolher uma pergunta. A gente explica sem complicar.',
  },
]

function getQuestion(id) {
  return questions.find((question) => question.id === id)
}

export default function FAQ() {
  const [messages, setMessages] = useState(introMessages)
  const [activeQuestion, setActiveQuestion] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isAnswering, setIsAnswering] = useState(false)

  const chatRef = useRef(null)
  const sectionRef = useRef(null)

  useEffect(() => {
    const element = sectionRef.current

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
        threshold: 0.12,
      },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const chat = chatRef.current

    if (!chat) {
      return
    }

    requestAnimationFrame(() => {
      chat.scrollTo({
        top: chat.scrollHeight,
        behavior: 'smooth',
      })
    })
  }, [messages, isAnswering])

  function chooseQuestion(question) {
    if (!question || isAnswering) {
      return
    }

    setActiveQuestion(question.id)
    setIsAnswering(true)

    setMessages((current) => [
      ...current,
      {
        id: `user-${question.id}-${current.length}`,
        type: 'user',
        text: question.label,
      },
    ])

    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        ...question.answer.map((text, index) => ({
          id: `answer-${question.id}-${current.length}-${index}`,
          type: 'rouxinol',
          text,
        })),
      ])

      setIsAnswering(false)
    }, 420)
  }

  function chooseFollowUp(followUp) {
    if (!followUp || isAnswering) {
      return
    }

    if (followUp.target === 'contact') {
      document
        .querySelector('#contact')
        ?.scrollIntoView({
          behavior: 'smooth',
        })

      return
    }

    const question = getQuestion(followUp.target)

    if (question) {
      chooseQuestion(question)
    }
  }

  function showAllQuestions() {
    setActiveQuestion(null)
  }

  function resetChat() {
    setMessages(introMessages)
    setActiveQuestion(null)
    setIsAnswering(false)
  }

  const active = activeQuestion
    ? getQuestion(activeQuestion)
    : null

  const visibleFollowUps = active
    ? active.followUps
    : questions.map((question) => ({
        label: question.label,
        target: question.id,
      }))

  return (
    <section
      ref={sectionRef}
      className={`faq ${isVisible ? 'is-visible' : ''}`}
      id="faq"
      aria-labelledby="faq-title"
    >
      <div className="faq__orb faq__orb--one" />
      <div className="faq__orb faq__orb--two" />

      <div className="faq__inner">

        <header className="faq__header">

          <div className="faq__eyebrow">
            <span className="faq__eyebrow-dot" />
            ANTES DE COMEÇAR
          </div>

          <h2
            id="faq-title"
            className="faq__title"
          >
            Pode perguntar.
          </h2>

          <p className="faq__intro">
            Algumas coisas ficam mais fáceis quando alguém explica
            de verdade.
          </p>

        </header>

        <div className="faq__interface">

          <div className="faq__chat">

            <div className="faq__chat-top">

              <div className="faq__identity">

                <div className="faq__avatar">
                  R
                </div>

                <div className="faq__identity-copy">
                  <strong>Rouxinol</strong>

                  <span>
                    Estamos por aqui
                  </span>
                </div>

              </div>

              <button
                type="button"
                className="faq__reset"
                onClick={resetChat}
                disabled={isAnswering}
              >
                <span />
                NOVA CONVERSA
              </button>

            </div>

            <div className="faq__status">
              <span className="faq__status-dot" />
              <span>respostas simples, sem complicação</span>
            </div>

            <div
              ref={chatRef}
              className="faq__messages"
              aria-live="polite"
              aria-label="Conversa com a Rouxinol"
            >

              {messages.map((message) => (

                <div
                  key={message.id}
                  className={`faq__message faq__message--${message.type}`}
                >

                  {message.type === 'rouxinol' && (
                    <span className="faq__message-name">
                      ROUXINOL
                    </span>
                  )}

                  <p>
                    {message.text}
                  </p>

                </div>

              ))}

              {isAnswering && (
                <div className="faq__message faq__message--rouxinol faq__message--typing">

                  <span className="faq__message-name">
                    ROUXINOL
                  </span>

                  <div className="faq__typing">
                    <i />
                    <i />
                    <i />
                  </div>

                </div>
              )}

            </div>

            <div className="faq__questions">

              <div className="faq__questions-head">

                <span className="faq__questions-label">
                  {active
                    ? 'TALVEZ ISSO TAMBÉM AJUDE'
                    : 'O QUE VOCÊ QUER SABER?'}
                </span>

                {active && (
                  <button
                    type="button"
                    className="faq__all"
                    onClick={showAllQuestions}
                    disabled={isAnswering}
                  >
                    Ver todas
                  </button>
                )}

              </div>

              <div className="faq__question-list">

                {visibleFollowUps.map((followUp) => (

                  <button
                    key={`${followUp.target}-${followUp.label}`}
                    type="button"
                    className="faq__question"
                    onClick={() => chooseFollowUp(followUp)}
                    disabled={isAnswering}
                  >

                    <span>
                      {followUp.label}
                    </span>

                    <span
                      className="faq__question-arrow"
                      aria-hidden="true"
                    >
                      ↗
                    </span>

                  </button>

                ))}

              </div>

            </div>

          </div>

        </div>

        <div className="faq__closing">

          <span className="faq__closing-line" />

          <div>
            <p>
              Ainda ficou alguma coisa na cabeça?
            </p>

            <a href="#contact">
              Pode falar com a gente <span>↗</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  )
}