import { useEffect, useRef, useState } from 'react'
import { api } from '../services/api.js'
import { useChecagem } from '../hooks/useChecagem.js'
import { ehLinkHttp } from '../utils/formatar.js'
import { mensagemVeredito } from '../utils/vereditos.js'
import { BOAS_VINDAS, SUGESTOES, responder } from '../data/chatbot.js'

// Link ou texto longo = a pessoa enviou um conteúdo para verificar (categoria "Verificação de notícias").
const deveVerificar = (t) => ehLinkHttp(t) || t.length >= 120

export default function Chatbot() {
  const [aberto, setAberto] = useState(false)
  const [msgs, setMsgs] = useState([{ de: 'bot', texto: BOAS_VINDAS }])
  const [texto, setTexto] = useState('')
  const fim = useRef(null)
  const aguardando = useRef(false)
  const { estado, resultado, erro, iniciar } = useChecagem()
  const ocupado = estado === 'enviando' || estado === 'analisando'

  useEffect(() => {
    fim.current?.scrollIntoView?.({ block: 'end' })
  }, [msgs, aberto])

  // Quando a checagem termina, o bot responde no chat.
  useEffect(() => {
    if (!aguardando.current) return
    let resposta = null
    if (estado === 'pronto') resposta = mensagemVeredito(resultado)
    else if (estado === 'demorando') resposta = { texto: 'A análise está demorando. Seu conteúdo foi registrado: veja o resultado depois, na página de Histórico.' }
    else if (estado === 'erro') resposta = { texto: `Não consegui verificar agora. ${erro}` }
    if (resposta) {
      aguardando.current = false
      setMsgs((m) => [...m, { de: 'bot', ...resposta }])
    }
  }, [estado, resultado, erro])

  function enviar(valor) {
    const pergunta = valor.trim()
    if (!pergunta || ocupado) return
    setTexto('')
    if (deveVerificar(pergunta)) {
      setMsgs((m) => [...m, { de: 'user', texto: pergunta }, { de: 'bot', texto: 'Vou verificar. Pode levar alguns segundos…' }])
      aguardando.current = true
      iniciar(() => api.checarTexto(ehLinkHttp(pergunta) ? { link: pergunta } : { conteudo: pergunta }))
    } else {
      setMsgs((m) => [...m, { de: 'user', texto: pergunta }, { de: 'bot', texto: responder(pergunta) }])
    }
  }

  return (
    <>
      {aberto && (
        <section className="chat" aria-label="Chat com o CHECA AI">
          <div className="chat-head">
            <strong>CHECA AI</strong>
            <button type="button" onClick={() => setAberto(false)} aria-label="Fechar chat">×</button>
          </div>
          <div className="chat-msgs" role="log" aria-live="polite">
            {msgs.map((m, i) => (
              <p key={i} className={`msg msg-${m.de}`}>
                {m.texto}
                {m.link && (
                  <>
                    {' '}
                    <a href={m.link} target="_blank" rel="noopener noreferrer">Ver checagem</a>
                  </>
                )}
              </p>
            ))}
            {msgs.length === 1 && (
              <div className="chips">
                {SUGESTOES.map((s) => (
                  <button key={s} type="button" onClick={() => enviar(s)}>{s}</button>
                ))}
              </div>
            )}
            <div ref={fim} />
          </div>
          <form className="chat-form" onSubmit={(e) => { e.preventDefault(); enviar(texto) }}>
            <label htmlFor="chatInput" className="sr-only">Sua pergunta, ou o texto ou link que quer verificar</label>
            <input id="chatInput" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Pergunte ou cole um link" autoComplete="off" />
            <button className="btn" type="submit" disabled={ocupado}>{ocupado ? '…' : 'Enviar'}</button>
          </form>
        </section>
      )}
      <button className="chat-fab" type="button" onClick={() => setAberto((a) => !a)} aria-expanded={aberto}>
        {aberto ? 'Fechar chat' : 'Tirar dúvida'}
      </button>
    </>
  )
}
