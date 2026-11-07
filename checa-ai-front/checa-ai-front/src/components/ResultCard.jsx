import { useState } from 'react'
import { api } from '../services/api.js'
import { VEREDITOS } from '../utils/vereditos.js'
import { detectarSinais } from '../utils/sinais.js'
import { ehLinkHttp } from '../utils/formatar.js'
import { PASSOS } from '../data/aprender.js'

const MOTIVOS = [
  ['boato', 'Boato'],
  ['golpe', 'Golpe'],
  ['enganoso', 'Enganoso'],
  ['outro', 'Outro'],
]

function Denunciar({ id }) {
  const [motivo, setMotivo] = useState('boato')
  const [estado, setEstado] = useState('idle') // idle | enviando | ok | erro

  async function enviar() {
    setEstado('enviando')
    try {
      await api.denunciar(id, motivo)
      setEstado('ok')
    } catch {
      setEstado('erro')
    }
  }

  if (estado === 'ok') return <p className="report-ok" role="status">Denúncia registrada. Obrigado por ajudar.</p>

  return (
    <div className="report">
      <label htmlFor={`motivo-${id}`}>Quer denunciar este conteúdo?</label>
      <div className="report-row">
        <select id={`motivo-${id}`} value={motivo} onChange={(e) => setMotivo(e.target.value)}>
          {MOTIVOS.map(([v, r]) => <option key={v} value={v}>{r}</option>)}
        </select>
        <button type="button" className="btn btn-outline" onClick={enviar} disabled={estado === 'enviando'}>
          {estado === 'enviando' ? 'Enviando…' : 'Denunciar'}
        </button>
      </div>
      {estado === 'erro' && <p className="field-error" role="alert">Não foi possível registrar a denúncia. Tente de novo.</p>}
    </div>
  )
}

export default function ResultCard({ estado, resultado, erro, textoOriginal }) {
  if (estado === 'idle') return null

  if (estado === 'erro') {
    return (
      <div className="result result-erro" role="alert">
        <h3>Não foi possível checar</h3>
        <p>{erro}</p>
      </div>
    )
  }

  if (estado === 'enviando' || estado === 'analisando') {
    return (
      <div className="result" role="status" aria-live="polite">
        <p className="loading"><span className="spinner" aria-hidden="true" />
          {estado === 'enviando' ? 'Enviando…' : 'Consultando agências de checagem… isso pode levar alguns segundos.'}
        </p>
      </div>
    )
  }

  if (estado === 'demorando') {
    return (
      <div className="result" role="status">
        <h3>A análise está demorando</h3>
        <p>Seu conteúdo foi registrado. Você pode ver o resultado depois, na página de Histórico.</p>
      </div>
    )
  }

  // estado === 'pronto'
  const v = VEREDITOS[resultado.veredito] || VEREDITOS.sem_checagem
  const sinais = detectarSinais(textoOriginal)
  const mostrarPassos = resultado.veredito === 'sem_checagem' || resultado.veredito === 'enganoso'

  return (
    <div className={`result ${v.classe}`} aria-live="polite">
      <span className={`badge ${v.classe}`}>{v.rotulo}</span>
      <p className="result-text">{v.texto}</p>

      {resultado.fonte_checagem && (
        <p>
          <strong>Fonte da checagem:</strong>{' '}
          {ehLinkHttp(resultado.url_checagem)
            ? <a href={resultado.url_checagem} target="_blank" rel="noopener noreferrer">{resultado.fonte_checagem}</a>
            : resultado.fonte_checagem}
        </p>
      )}

      {resultado.ja_consultada_antes && (
        <p className="muted">Este conteúdo já foi consultado {resultado.total_consultas} {resultado.total_consultas === 1 ? 'vez' : 'vezes'}.</p>
      )}

      {resultado.correspondencias?.length > 0 && (
        <div>
          <strong>Onde esta imagem já apareceu em checagens:</strong>
          <ul className="result-list">
            {resultado.correspondencias.map((c, i) => (
              <li key={i}>{c.texto}{c.quem_afirmou ? ` (quem afirmou: ${c.quem_afirmou})` : ''}</li>
            ))}
          </ul>
        </div>
      )}

      {sinais.length > 0 && (
        <div>
          <strong>Sinais de alerta no texto:</strong>
          <ul className="result-list">
            {sinais.map((s) => <li key={s.nome}><strong>{s.nome}:</strong> {s.dica}</li>)}
          </ul>
        </div>
      )}

      {mostrarPassos && (
        <div>
          <strong>Para investigar por conta própria:</strong>
          <ol className="result-list">
            {PASSOS.map((p) => <li key={p.titulo}><strong>{p.titulo}:</strong> {p.texto}</li>)}
          </ol>
        </div>
      )}

      <Denunciar id={resultado.id} />
    </div>
  )
}
