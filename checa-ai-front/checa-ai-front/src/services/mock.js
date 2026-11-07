// Back-end falso em memória, para desenvolver o front sem o servidor rodando.
// Ative com VITE_USE_MOCK=true. O formato das respostas segue o README do back-end.
const espera = (ms) => new Promise((r) => setTimeout(r, ms))
const agora = () => new Date().toISOString().slice(0, 19).replace('T', ' ')

const noticias = []
const consultas = []

function classificar(base = '') {
  const t = base.toLowerCase()
  if (/urgente|compartilhe|vacina|fake|falso|golpe/.test(t))
    return { veredito: 'falso', fonte_checagem: 'Agência Lupa (exemplo)', url_checagem: 'https://lupa.news' }
  if (/contexto|enganos/.test(t))
    return { veredito: 'enganoso', fonte_checagem: 'Aos Fatos (exemplo)', url_checagem: 'https://www.aosfatos.org' }
  if (/ibge|oficial/.test(t))
    return { veredito: 'verdadeiro', fonte_checagem: 'G1 Fato ou Fake (exemplo)', url_checagem: 'https://g1.globo.com/fato-ou-fake/' }
  return { veredito: 'sem_checagem', fonte_checagem: null, url_checagem: null }
}

const publico = (n) => Object.fromEntries(Object.entries(n).filter(([k]) => !k.startsWith('_')))

function registrar({ chave, titulo, conteudo, link, tipo, base }) {
  let n = noticias.find((x) => x.chave === chave)
  const jaExistia = Boolean(n)
  if (!n) {
    n = {
      id: noticias.length + 1, chave, tipo, titulo,
      conteudo: conteudo || null, link: link || null,
      veredito: null, fonte_checagem: null, url_checagem: null,
      total_consultas: 0, total_denuncias: 0, correspondencias: [],
      criado_em: agora(), ultima_consulta_em: agora(),
      _buscas: 0, _base: base,
    }
    noticias.push(n)
  }
  n.total_consultas += 1
  n.ultima_consulta_em = agora()
  consultas.unshift({ id: consultas.length + 1, consultado_em: agora(), noticia_id: n.id })
  return { ...publico(n), ja_consultada_antes: jaExistia }
}

// Seed para as telas de histórico e ranking não nascerem vazias
;[
  ['Mensagem alarmista sobre vacina', 'urgente vacina', 4],
  ['Foto de enchente fora de contexto', 'fora de contexto', 2],
].forEach(([titulo, base, den]) => {
  const r = registrar({ chave: titulo, titulo, conteudo: titulo, tipo: 'texto', base })
  const n = noticias.find((x) => x.id === r.id)
  Object.assign(n, classificar(base), { total_denuncias: den })
})

export const api = {
  async checarTexto({ titulo, conteudo, link }) {
    await espera(500)
    const base = conteudo || link || ''
    if (base.trim().length < 5) throw Object.assign(new Error('Texto curto demais.'), { status: 400 })
    return registrar({
      chave: (link || conteudo).trim().toLowerCase(),
      titulo: titulo || (conteudo || link).slice(0, 60),
      conteudo, link, tipo: 'texto', base,
    })
  },

  async checarImagem({ arquivo, link }) {
    await espera(700)
    const nome = arquivo ? arquivo.name : link
    return registrar({
      chave: arquivo ? `img:${arquivo.name}:${arquivo.size}` : `img:${link}`,
      titulo: `Imagem: ${nome}`, link, tipo: 'imagem', base: nome,
    })
  },

  // Resolve o veredito na 2ª busca, simulando a integração com a Google Fact Check
  async buscarNoticia(id) {
    await espera(300)
    const n = noticias.find((x) => x.id === Number(id))
    if (!n) throw Object.assign(new Error('Notícia não encontrada.'), { status: 404 })
    n._buscas += 1
    if (n.veredito === null && n._buscas >= 2) {
      Object.assign(n, classificar(n._base))
      if (n.tipo === 'imagem' && n.veredito === 'falso') {
        n.correspondencias = [{ texto: 'Imagem circulou com legenda diferente da original (exemplo).', quem_afirmou: 'Perfil de exemplo' }]
      }
    }
    return publico(n)
  },

  async historico({ pagina = 1, limite = 20 } = {}) {
    await espera(300)
    const ini = (pagina - 1) * limite
    const itens = consultas.slice(ini, ini + limite).map((c) => {
      const n = noticias.find((x) => x.id === c.noticia_id)
      return { id: c.id, consultado_em: c.consultado_em, noticia_id: n.id, titulo: n.titulo, link: n.link, conteudo: n.conteudo, veredito: n.veredito }
    })
    return { pagina, limite, total: consultas.length, itens }
  },

  async ranking({ limite = 10 } = {}) {
    await espera(300)
    const itens = noticias
      .filter((n) => n.total_denuncias > 0)
      .sort((a, b) => b.total_denuncias - a.total_denuncias)
      .slice(0, limite)
      .map((n, i) => ({ posicao: i + 1, id: n.id, titulo: n.titulo, link: n.link, veredito: n.veredito, total_consultas: n.total_consultas, denuncias: n.total_denuncias }))
    return { periodo_dias: null, itens }
  },

  async denunciar(id) {
    await espera(300)
    const n = noticias.find((x) => x.id === Number(id))
    if (!n) throw Object.assign(new Error('Notícia não encontrada.'), { status: 404 })
    n.total_denuncias += 1
    return { ok: true }
  },
}
