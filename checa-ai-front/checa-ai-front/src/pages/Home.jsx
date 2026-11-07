import { Link } from 'react-router-dom'
import Checker from '../components/Checker.jsx'

const COMO_FUNCIONA = [
  { icone: '🔎', titulo: 'Pesquisar', texto: 'Procuramos o conteúdo no nosso histórico e em bases de checagem integradas, seja texto, link ou imagem.' },
  { icone: '🧭', titulo: 'Entender', texto: 'Mostramos a fonte, o veredito encontrado e o que fazer quando não há checagem.' },
  { icone: '🎓', titulo: 'Aprender', texto: 'Damos dicas e passos para que cada pessoa aprenda a verificar sozinha.' },
]

export default function Home() {
  return (
    <>
      <section className="hero" id="inicio">
        <div className="hero-inner">
          <div>
            <span className="eyebrow">Informação se verifica</span>
            <h1>Não acredite em tudo. <em>Checa AI!</em></h1>
            <p>Verifique links, textos e imagens suspeitos e aprenda a reconhecer notícias duvidosas, investigar fontes e compartilhar com responsabilidade. Para pessoas de 9 a 70 anos.</p>
            <div className="hero-actions">
              <Link className="btn btn-yellow" to="/#verificar">Quero checar um conteúdo</Link>
              <Link className="btn btn-outline" to="/aprender">Aprender a identificar fake news</Link>
            </div>
          </div>
          <div className="hero-card">
            <span className="mini-label">Pense antes de compartilhar</span>
            <div className="fake-post">
              <small>Mensagem recebida • encaminhada muitas vezes</small>
              <strong>“URGENTE! Descoberta que vai mudar tudo. Compartilhe antes que apaguem!”</strong>
              <p>Não apresenta fonte, data ou evidência verificável.</p>
            </div>
            <div className="warning"><strong>⚠ Sinal de alerta:</strong> urgência exagerada e pedido para compartilhar sem conferir.</div>
          </div>
        </div>
      </section>

      <section className="section" id="verificar">
        <div className="section-head">
          <h2>Recebeu algo suspeito?</h2>
          <p>Cole o texto ou o endereço da publicação, ou envie uma imagem. Mostramos se alguma agência de checagem já analisou esse conteúdo.</p>
        </div>
        <Checker />
      </section>

      <section className="section" id="como-funciona">
        <div className="section-head">
          <h2>Da dúvida à informação responsável</h2>
          <p>O objetivo não é só dar uma resposta, mas ensinar a chegar a uma conclusão com base em evidências.</p>
        </div>
        <div className="grid-3">
          {COMO_FUNCIONA.map((c) => (
            <article className="feature" key={c.titulo}>
              <div className="icon" aria-hidden="true">{c.icone}</div>
              <h3>{c.titulo}</h3>
              <p>{c.texto}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
