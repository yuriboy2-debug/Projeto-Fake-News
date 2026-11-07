// O SQLite devolve "2026-10-31 18:58:48" (UTC, sem fuso). Converte para o horário local.
export function formatarData(valor) {
  if (!valor) return ''
  const iso = valor.includes('T') ? valor : valor.replace(' ', 'T') + 'Z'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return valor
  return d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

export const ehLinkHttp = (url) => /^https?:\/\/\S+$/i.test((url || '').trim())
