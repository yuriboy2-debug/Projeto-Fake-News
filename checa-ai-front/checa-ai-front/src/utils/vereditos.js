// Vereditos aceitos pelo back-end: falso, verdadeiro, enganoso, sem_checagem.
// Regra do projeto: "sem checagem" NUNCA é tratado como falso nem como verdadeiro.
export const VEREDITOS = {
  falso: {
    rotulo: 'Falso',
    classe: 'v-falso',
    texto: 'Uma agência de checagem classificou este conteúdo como falso.',
  },
  enganoso: {
    rotulo: 'Enganoso',
    classe: 'v-enganoso',
    texto: 'Há checagem indicando que o conteúdo engana, distorce ou está fora de contexto.',
  },
  verdadeiro: {
    rotulo: 'Verdadeiro',
    classe: 'v-verdadeiro',
    texto: 'Uma agência de checagem confirmou este conteúdo.',
  },
  sem_checagem: {
    rotulo: 'Sem checagem encontrada',
    classe: 'v-sem',
    texto: 'Não encontramos uma checagem correspondente. Isso não quer dizer que seja verdadeiro nem falso.',
  },
}

// Texto do veredito para o chatbot (categorias "notícia falsa / verdadeira / informação duvidosa").
export function mensagemVeredito(r) {
  const v = VEREDITOS[r.veredito] || VEREDITOS.sem_checagem
  let texto = `${v.rotulo}. ${v.texto}`
  if (r.fonte_checagem) texto += ` Fonte: ${r.fonte_checagem}.`
  if (r.veredito === 'sem_checagem') texto += ' Por precaução, não compartilhe antes de uma verificação manual.'
  return { texto, link: /^https?:\/\/\S+$/i.test(r.url_checagem || '') ? r.url_checagem : null }
}
