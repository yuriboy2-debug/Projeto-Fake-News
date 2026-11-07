import { NIVEIS, PROPOSTAS, PASSOS, FAQ, FONTES } from '../data/aprender.js'

export default function Aprender() {
  return (
    <>
      <section className="dark-band">
        <div className="section">
          <div className="section-head">
            <span className="eyebrow">Trilha educativa</span>
            <h2>Aprender em qualquer idade. Evoluir em cada etapa.</h2>
            <p>Conteúdo em linguagem simples, exemplos do dia a dia e atividades progressivas para quem está começando e para quem quer verificar com mais profundidade.</p>
          </div>
          <div className="levels">
            {NIVEIS.map((n) => (
              <article className="level-card" key={n.titulo}>
                <span className="age">{n.idade}</span>
                <h3>{n.titulo}</h3>
                <p>{n.texto}</p>
                <ul>{n.itens.map((i) => <li key={i}>{i}</li>)}</ul>
              </article>
            ))}
          </div>
          <p className="band-note">As faixas são referências, não limites. Cada pessoa pode começar no nível que fizer sentido e avançar no próprio ritmo.</p>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <span className="eyebrow">Método de checagem</span>
          <h2>Quatro passos para investigar melhor</h2>
        </div>
        <ol className="steps">
          {PASSOS.map((p) => (
            <li className="step" key={p.titulo}>
              <strong>{p.titulo}</strong>
              <p>{p.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section">
        <div className="section-head">
          <span className="eyebrow">Propostas do projeto</span>
          <h2>Educação contra a desinformação para todos</h2>
        </div>
        <div className="proposal-wrap">
          {PROPOSTAS.map((p) => (
            <article className="proposal" key={p.titulo}>
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <span className="eyebrow">Fontes de checagem</span>
          <h2>Onde conferir uma informação</h2>
          <p>Consulte sempre a fonte original para ver o contexto completo de cada checagem.</p>
        </div>
        <ul className="fontes">
          {FONTES.map((f) => (
            <li key={f.nome}>
              <a className="btn btn-outline" href={f.url} target="_blank" rel="noopener noreferrer">{f.nome}</a>
            </li>
          ))}
        </ul>
      </section>

      <section className="section faq">
        <div className="section-head">
          <span className="eyebrow">Dúvidas frequentes</span>
          <h2>Verificar também é aprender</h2>
        </div>
        {FAQ.map((f) => (
          <details key={f.p}>
            <summary>{f.p}</summary>
            <p>{f.r}</p>
          </details>
        ))}
      </section>
    </>
  )
}
