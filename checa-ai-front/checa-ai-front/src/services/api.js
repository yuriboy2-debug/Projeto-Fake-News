// Camada única de comunicação com o back-end.
// Se uma rota ou campo mudar no back-end, o ajuste é feito só neste arquivo.
import * as mock from './mock.js'

const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')
const USAR_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

async function request(caminho, opcoes = {}) {
  let res
  try {
    res = await fetch(BASE + caminho, opcoes)
  } catch {
    throw new ApiError('Não foi possível conectar ao servidor. Tente novamente em instantes.', 0)
  }
  let dados = null
  try {
    dados = await res.json()
  } catch {
    // resposta sem corpo
  }
  if (!res.ok) throw new ApiError(dados?.erro || 'Algo deu errado. Tente novamente.', res.status)
  return dados
}

const enviarJson = (metodo, corpo) => ({
  method: metodo,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(corpo),
})

function query(params = {}) {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q.set(k, v)
  })
  const s = q.toString()
  return s ? `?${s}` : ''
}

const real = {
  // POST /noticias — texto e/ou link
  checarTexto: ({ titulo, conteudo, link }) => request('/noticias', enviarJson('POST', { titulo, conteudo, link })),
  // GET /noticias/:id — usado para acompanhar o veredito (polling)
  buscarNoticia: (id) => request(`/noticias/${id}`),
  // GET /historico
  historico: (params) => request('/historico' + query(params)),
  // GET /ranking
  ranking: (params) => request('/ranking' + query(params)),
  // POST /noticias/:id/denunciar
  denunciar: (id, motivo) => request(`/noticias/${id}/denunciar`, enviarJson('POST', { motivo })),
  // POST /imagens — CONTRATO PROPOSTO (ainda não existe no back-end). Ver README.
  checarImagem: ({ arquivo, link }) => {
    const form = new FormData()
    if (arquivo) form.append('imagem', arquivo)
    if (link) form.append('link', link)
    return request('/imagens', { method: 'POST', body: form })
  },
}

export const api = USAR_MOCK ? mock.api : real
