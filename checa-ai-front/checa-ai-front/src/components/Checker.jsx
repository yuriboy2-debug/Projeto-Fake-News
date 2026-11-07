import { useState } from 'react'
import { api } from '../services/api.js'
import { useChecagem } from '../hooks/useChecagem.js'
import { ehLinkHttp } from '../utils/formatar.js'
import ResultCard from './ResultCard.jsx'
import ImageChecker from './ImageChecker.jsx'

function TextoLink() {
  const [texto, setTexto] = useState('')
  const [aviso, setAviso] = useState('')
  const { estado, resultado, erro, iniciar, limpar } = useChecagem()

  function enviar(e) {
    e.preventDefault()
    const valor = texto.trim()
    if (!valor) {
      setAviso('Escreva ou cole um texto ou link para verificar.')
      return
    }
    setAviso('')
    // Se for só uma URL, vai no campo "link"; senão, no "conteudo".
    const dados = ehLinkHttp(valor) ? { link: valor } : { conteudo: valor }
    iniciar(() => api.checarTexto(dados))
  }

  function reiniciar() {
    setTexto('')
    setAviso('')
    limpar()
  }

  const ocupado = estado === 'enviando' || estado === 'analisando'

  return (
    <form onSubmit={enviar} noValidate>
      <label htmlFor="newsInput">Cole aqui o texto da notícia ou o link</label>
      <textarea
        id="newsInput"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Ex.: Uma mensagem afirma que uma nova regra começa amanhã. Qual é a fonte? Onde foi publicada?"
      />
      {aviso && <p className="field-error" role="alert">{aviso}</p>}
      <div className="checker-actions">
        <button className="btn" type="submit" disabled={ocupado}>{ocupado ? 'Verificando…' : 'Verificar'}</button>
        <button className="btn btn-outline" type="button" onClick={reiniciar}>Limpar</button>
      </div>
      <p className="hint">Dica: inclua o texto completo, a data e o nome do veículo, se houver.</p>
      <ResultCard estado={estado} resultado={resultado} erro={erro} textoOriginal={texto} />
    </form>
  )
}

const ABAS = [
  ['texto', 'Texto ou link'],
  ['imagem', 'Imagem'],
]

export default function Checker() {
  const [aba, setAba] = useState('texto')

  return (
    <div className="checker">
      <div className="tabs" role="tablist" aria-label="Tipo de conteúdo">
        {ABAS.map(([id, rotulo]) => (
          <button
            key={id}
            role="tab"
            id={`aba-${id}`}
            aria-selected={aba === id}
            aria-controls={`painel-${id}`}
            className={`tab${aba === id ? ' tab-ativa' : ''}`}
            onClick={() => setAba(id)}
            type="button"
          >
            {rotulo}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`painel-${aba}`} aria-labelledby={`aba-${aba}`}>
        {aba === 'texto' ? <TextoLink /> : <ImageChecker />}
      </div>
      <p className="notice">O CHECA AI não garante se um conteúdo é verdadeiro ou falso: ele mostra o que as agências de checagem já publicaram. Confirme sempre nas fontes originais.</p>
    </div>
  )
}
