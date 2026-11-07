// Sinais de alerta simples, portados do protótipo em HTML. Só para texto.
// Servem para educar, não para dar veredito.
const SINAIS = [
  { nome: 'Linguagem alarmista', teste: /urgente|compartilhe|antes que apaguem|chocante|inacreditável|proibido/i, dica: 'A mensagem pode estar tentando provocar pressa ou emoção.' },
  { nome: 'Pedido de compartilhamento', teste: /compartilhe|encaminhe|mande para todos|envie para/i, dica: 'Pedidos insistentes para repassar merecem atenção.' },
  { nome: 'Afirmação sem fonte explícita', teste: /segundo especialistas|estão dizendo|pesquisadores afirmam|todo mundo sabe/i, dica: 'Procure nomes, links, documentos ou declarações originais.' },
  { nome: 'Data ou contexto', teste: /hoje|amanhã|ontem|nesta semana|última hora/i, dica: 'Confira quando o conteúdo foi publicado e se continua atual.' },
]

export function detectarSinais(texto) {
  if (!texto) return []
  return SINAIS.filter((s) => s.teste.test(texto))
}
