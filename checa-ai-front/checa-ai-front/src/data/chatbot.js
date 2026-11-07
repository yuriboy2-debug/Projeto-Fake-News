// Conteúdo oficial vindo de CHATBOT.xlsx (aba PERGUNTAS). Ver README, seção "Chatbot",
// para a lista de pequenas correções feitas no texto (typos, emoji, trechos não verificados).
// Cada item tem várias formas de perguntar; a resposta é escolhida por similaridade de palavras.
export const RESPOSTAS = [
  { perguntas: ['Oi', 'Olá', 'Bom dia', 'Boa tarde', 'Boa noite'], resposta: 'Olá! 👋 Seja bem-vindo(a) ao CHECA AI! Sou seu assistente virtual especializado em verificação de informações. Envie uma notícia, mensagem ou informação que deseja verificar. Vamos combater as fake news juntos!' },
  { perguntas: ['Como funciona?', 'O que você faz?'], resposta: 'Funciono assim: você me envia uma afirmação ou conteúdo suspeito. Eu busco na minha base de checagens, que reúne verificações de agências brasileiras, e, se encontrar algo relacionado, devolvo um veredito com a fonte original. Se eu não achar nada, aviso que não há evidências suficientes para confirmar ou desmentir, o que já é um alerta importante.' },
  { perguntas: ['Quais fontes você usa?'], resposta: 'Minha base é construída com checagens de sites confiáveis, como Aos Fatos, Boatos.org e G1 Fato ou Fake. São agências reconhecidas no combate à desinformação no Brasil.' },
  { perguntas: ['Você é confiável?', 'Posso confiar em você?'], resposta: 'Sou uma ferramenta de apoio, não uma autoridade final. Meu diferencial é que sempre cito a fonte da checagem quando encontro uma correspondência. Se eu não encontrar evidências, digo isso claramente em vez de inventar uma resposta. A decisão final de compartilhar ou não uma informação é sempre sua.' },
  { perguntas: ['E se você não souber a resposta?'], resposta: 'Se eu não encontrar nenhuma checagem relacionada na minha base, vou te dizer: “Não há evidências suficientes para verificar esta alegação”. Isso não significa que é verdade: significa que nem eu nem as agências que consulto já checaram esse conteúdo específico. Nesse caso, recomendo desconfiar e não compartilhar antes de uma verificação manual.' },
  { perguntas: ['Você é uma IA?', 'É um robô?'], resposta: 'Sim, sou um chatbot com inteligência artificial. Uso IA para buscar na base de checagens de sites brasileiros e montar a resposta. Mas o veredito (verdadeiro, falso ou inverificável) vem dos sites, não de mim.' },
  { perguntas: ['Essa imagem é verdadeira?', 'É montagem?', 'Como verificar uma imagem?'], resposta: 'Para checar uma imagem, use a aba “Imagem” na página inicial: você pode enviar o arquivo ou colar o endereço dela. Eu busco checagens que já usaram a mesma imagem. Uma técnica comum de fake news é usar fotos reais fora do contexto original; outra é a manipulação com IA. Se não houver checagem, confira também a data e a origem da imagem.' },
  { perguntas: ['Qual é a função do CHECA AI?'], resposta: 'Minha função é ajudar você a verificar notícias, identificar possíveis informações falsas, analisar fontes e incentivar o compartilhamento responsável de conteúdos.' },
  { perguntas: ['O que são Fake News?'], resposta: 'Fake News são informações falsas ou enganosas divulgadas como se fossem verdadeiras, podendo causar confusão, medo e desinformação na sociedade.' },
  { perguntas: ['Como saber se uma notícia é falsa?'], resposta: 'Verifique a fonte, a data de publicação, procure a mesma informação em outros veículos confiáveis e desconfie de títulos exagerados ou sensacionalistas.' },
  { perguntas: ['Posso enviar uma notícia para verificar?'], resposta: 'Claro! Envie o texto ou link da notícia. Vou ajudar você a investigar sua origem, contexto e evidências disponíveis.' },
  { perguntas: ['Toda notícia que circula nas redes sociais é verdadeira?'], resposta: 'Não! Nem tudo que circula nas redes sociais é verdadeiro. Algumas publicações podem conter informações falsas, manipuladas ou fora de contexto.' },
  { perguntas: ['Como identificar uma fonte confiável?'], resposta: 'Observe se o veículo identifica seus autores, apresenta referências, informa a data de publicação e possui histórico de responsabilidade jornalística.' },
  { perguntas: ['Uma notícia antiga pode ser considerada Fake News?'], resposta: 'Uma notícia antiga não é necessariamente falsa, mas pode ser compartilhada fora de contexto, dando a impressão de que um acontecimento antigo está ocorrendo atualmente.' },
  { perguntas: ['Imagens e vídeos também podem ser falsos?'], resposta: 'Sim! Imagens e vídeos podem ser editados, manipulados ou utilizados em contextos diferentes do original. Sempre procure a origem do material.' },
  { perguntas: ['O que significa notícia verdadeira?'], resposta: 'Significa que as informações apresentadas foram corroboradas por evidências e fontes confiáveis consultadas.' },
  { perguntas: ['O que significa notícia falsa?'], resposta: 'Significa que existem evidências confiáveis que contradizem a informação apresentada.' },
  { perguntas: ['O que significa informação suspeita?'], resposta: 'É uma informação que apresenta sinais de possível desinformação, mas ainda precisa de investigação para uma conclusão segura.' },
  { perguntas: ['O CHECA AI pode cometer erros?'], resposta: 'Sim. Como qualquer sistema tecnológico, posso apresentar limitações. Por isso, é importante consultar as fontes originais e não considerar uma análise automatizada como prova definitiva.' },
  { perguntas: ['Por que as pessoas compartilham Fake News?'], resposta: 'Muitas pessoas compartilham informações falsas por falta de conhecimento, confiança na fonte, emoções ou simplesmente por não verificarem o conteúdo antes de divulgá-lo.' },
  { perguntas: ['Quais são os perigos das Fake News?'], resposta: 'Elas podem provocar medo, prejudicar reputações, influenciar decisões, gerar conflitos e colocar a saúde e a segurança das pessoas em risco.' },
  { perguntas: ['Como evitar compartilhar notícias falsas?'], resposta: 'Antes de compartilhar, leia a notícia completa, confira a fonte, verifique a data e procure confirmações em outros canais confiáveis.' },
  { perguntas: ['O que devo fazer quando receber uma notícia suspeita?'], resposta: 'Não compartilhe imediatamente! Procure a origem da informação, consulte fontes confiáveis e utilize ferramentas de checagem.' },
  { perguntas: ['Como combater a desinformação?'], resposta: 'Compartilhando apenas informações verificadas, incentivando a educação digital e ajudando outras pessoas a desenvolverem o pensamento crítico.' },
  { perguntas: ['Como a inteligência artificial ajuda a combater Fake News?'], resposta: 'A inteligência artificial pode auxiliar na análise de textos, identificação de padrões suspeitos, comparação de informações e localização de possíveis fontes de confirmação.' },
  { perguntas: ['O CHECA AI verifica informações automaticamente?'], resposta: 'O CHECA AI pode utilizar recursos de inteligência artificial para auxiliar na análise, mas a confirmação depende da consulta a evidências e fontes confiáveis.' },
  { perguntas: ['O que é desinformação?'], resposta: 'É a divulgação de informações falsas ou enganosas que podem levar as pessoas a acreditar em algo que não corresponde à realidade.' },
  { perguntas: ['O que são Deepfakes?'], resposta: 'São conteúdos de áudio, imagem ou vídeo manipulados com inteligência artificial para simular pessoas, falas ou acontecimentos que não ocorreram daquela maneira.' },
  { perguntas: ['Posso confiar em tudo que a inteligência artificial responde?'], resposta: 'Não! A inteligência artificial pode cometer erros ou apresentar informações desatualizadas. Sempre confira as evidências e consulte fontes confiáveis.' },
  { perguntas: ['Quais fontes posso consultar para verificar notícias?'], resposta: 'Você pode consultar agências de checagem, veículos jornalísticos reconhecidos e órgãos oficiais. No Brasil, alguns exemplos são Agência Lupa, Aos Fatos e Fato ou Fake.' },
  { perguntas: ['O que significa checar uma informação?'], resposta: 'Significa investigar a origem, analisar as evidências e comparar a informação com fontes confiáveis antes de considerá-la verdadeira.' },
  { perguntas: ['Posso ajudar a combater as Fake News?'], resposta: 'Com certeza! Você pode contribuir verificando informações antes de compartilhar, orientando outras pessoas e denunciando conteúdos enganosos nas plataformas digitais.' },
  { perguntas: ['O CHECA AI substitui os jornalistas?'], resposta: 'Não! O CHECA AI é uma ferramenta de apoio à verificação de informações. O trabalho jornalístico continua sendo essencial para investigar, contextualizar e informar a sociedade.' },
  { perguntas: ['Obrigado pela ajuda!', 'Obrigada', 'Valeu'], resposta: 'Eu que agradeço! 💛 Lembre-se: informação responsável transforma a sociedade. Antes de compartilhar, cheque! Conte sempre com o CHECA AI.' },
  { perguntas: ['Tchau!', 'Até mais'], resposta: 'Tchau! Até a próxima. Precisando, é só chamar.' },
]

export const BOAS_VINDAS = RESPOSTAS[0].resposta

export const SUGESTOES = [
  'Como funciona?',
  'O que são Fake News?',
  'Como saber se uma notícia é falsa?',
  'Quais fontes você usa?',
]

export const FALLBACK =
  'Ainda não sei responder a essa pergunta. Tente perguntar de outro jeito ou escolha uma das sugestões. Para checar um conteúdo, cole aqui o texto ou o link da notícia.'

// ---- Busca da resposta: similaridade de palavras entre a pergunta e as perguntas da planilha ----
const STOP = new Set(['o', 'a', 'os', 'as', 'um', 'uma', 'de', 'da', 'do', 'das', 'dos', 'e', 'em', 'que', 'eu', 'voce', 'voces', 'vc', 'para', 'por', 'pra', 'pela', 'pelo', 'com', 'se', 'na', 'no', 'nas', 'nos', 'ao', 'me', 'te', 'ou', 'tudo', 'toda'])

const normalizar = (s) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, ' ')

const tokens = (s) =>
  normalizar(s)
    .split(/\s+/)
    .filter((w) => w && !STOP.has(w))
    .map((w) => (w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w))

const INDICE = RESPOSTAS.flatMap((r) => r.perguntas.map((p) => ({ t: new Set(tokens(p)), resposta: r.resposta })))
const LIMIAR = 0.5

export function responder(texto) {
  const q = new Set(tokens(texto))
  if (!q.size) return FALLBACK
  let melhor = null
  let nota = 0
  for (const item of INDICE) {
    if (!item.t.size) continue
    let comuns = 0
    q.forEach((w) => item.t.has(w) && (comuns += 1))
    const s = comuns / Math.sqrt(q.size * item.t.size)
    if (s > nota) {
      nota = s
      melhor = item
    }
  }
  return melhor && nota >= LIMIAR ? melhor.resposta : FALLBACK
}
