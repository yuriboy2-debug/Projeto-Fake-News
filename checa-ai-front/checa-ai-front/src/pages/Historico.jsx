import { useState } from 'react'
import { api } from '../services/api.js'
import { useFetch } from '../hooks/useFetch.js'
import { VEREDITOS } from '../utils/vereditos.js'
import { formatarData, ehLinkHttp } from '../utils/formatar.js'

const LIMITE = 10

export default function Historico() {
  const [pagina, setPagina] = useState(1)
  const { dados, erro, carregando } = useFetch(() => api.historico({ pagina, limite: LIMITE }), [pagina])
  const totalPaginas = dados ? Math.max(1, Math.ceil(dados.total / LIMITE)) : 1

  return (
    <section className="section">
      <div className="section-head">
        <h2>Histórico de consultas</h2>
        <p>As verificações mais recentes feitas na plataforma.</p>
      </div>

      {carregando && <p className="loading"><span className="spinner" aria-hidden="true" />Carregando…</p>}
      {erro && <p className="field-error" role="alert">{erro}</p>}
      {dados && dados.itens.length === 0 && <p className="empty">Nenhuma consulta ainda. Verifique um conteúdo na página inicial para ele aparecer aqui.</p>}

      {dados && dados.itens.length > 0 && (
        <ul className="lista">
          {dados.itens.map((i) => {
            const v = VEREDITOS[i.veredito]
            const rotulo = i.titulo || i.link || i.conteudo
            return (
              <li key={i.id} className="lista-item">
                <div>
                  <strong>{rotulo}</strong>
                  {ehLinkHttp(i.link) && <div className="muted small">{i.link}</div>}
                  <div className="muted small">{formatarData(i.consultado_em)}</div>
                </div>
                {v ? <span className={`badge ${v.classe}`}>{v.rotulo}</span> : <span className="badge v-sem">Em análise</span>}
              </li>
            )
          })}
        </ul>
      )}

      {dados && dados.total > LIMITE && (
        <div className="paginacao">
          <button className="btn btn-outline" onClick={() => setPagina((p) => p - 1)} disabled={pagina <= 1}>Anterior</button>
          <span>Página {pagina} de {totalPaginas}</span>
          <button className="btn btn-outline" onClick={() => setPagina((p) => p + 1)} disabled={pagina >= totalPaginas}>Próxima</button>
        </div>
      )}
    </section>
  )
}
