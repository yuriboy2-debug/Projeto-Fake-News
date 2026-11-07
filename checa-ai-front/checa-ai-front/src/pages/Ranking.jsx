import { useState } from 'react'
import { api } from '../services/api.js'
import { useFetch } from '../hooks/useFetch.js'
import { VEREDITOS } from '../utils/vereditos.js'

const PERIODOS = [
  ['', 'Todo o período'],
  ['7', 'Últimos 7 dias'],
  ['30', 'Últimos 30 dias'],
]

export default function Ranking() {
  const [dias, setDias] = useState('')
  const { dados, erro, carregando } = useFetch(() => api.ranking({ limite: 10, dias }), [dias])

  return (
    <section className="section">
      <div className="section-head">
        <h2>Conteúdos mais denunciados</h2>
        <p>Os boatos que mais receberam denúncias. Uma denúncia não é um veredito: confira a fonte da checagem.</p>
      </div>

      <div className="field field-inline">
        <label htmlFor="periodo">Período</label>
        <select id="periodo" value={dias} onChange={(e) => setDias(e.target.value)}>
          {PERIODOS.map(([v, r]) => <option key={v} value={v}>{r}</option>)}
        </select>
      </div>

      {carregando && <p className="loading"><span className="spinner" aria-hidden="true" />Carregando…</p>}
      {erro && <p className="field-error" role="alert">{erro}</p>}
      {dados && dados.itens.length === 0 && <p className="empty">Nenhuma denúncia neste período.</p>}

      {dados && dados.itens.length > 0 && (
        <ol className="lista ranking">
          {dados.itens.map((i) => {
            const v = VEREDITOS[i.veredito]
            return (
              <li key={i.id} className="lista-item">
                <span className="posicao" aria-label={`Posição ${i.posicao}`}>{i.posicao}º</span>
                <div className="grow">
                  <strong>{i.titulo}</strong>
                  <div className="muted small">{i.denuncias} {i.denuncias === 1 ? 'denúncia' : 'denúncias'} • {i.total_consultas} {i.total_consultas === 1 ? 'consulta' : 'consultas'}</div>
                </div>
                {v && <span className={`badge ${v.classe}`}>{v.rotulo}</span>}
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}
