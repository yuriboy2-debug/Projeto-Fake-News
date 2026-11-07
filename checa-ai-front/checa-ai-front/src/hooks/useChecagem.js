import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '../services/api.js'

const INTERVALO_MS = 3000
const MAX_TENTATIVAS = 10 // ~30 segundos

// Estados: idle | enviando | analisando | demorando | pronto | erro
// "analisando" = notícia cadastrada, mas veredito ainda null (a integração com a
// Google Fact Check salva o resultado depois). O hook consulta GET /noticias/:id até chegar.
export function useChecagem() {
  const [estado, setEstado] = useState('idle')
  const [resultado, setResultado] = useState(null)
  const [erro, setErro] = useState('')
  const timer = useRef(null)
  const rodada = useRef(0)

  const cancelar = useCallback(() => {
    clearTimeout(timer.current)
    rodada.current += 1
  }, [])

  useEffect(() => cancelar, [cancelar])

  const iniciar = useCallback(
    async (enviar) => {
      cancelar()
      const minha = rodada.current
      setErro('')
      setResultado(null)
      setEstado('enviando')
      try {
        let noticia = await enviar()
        if (minha !== rodada.current) return
        setResultado(noticia)

        let tentativas = 0
        while (noticia.veredito == null && tentativas < MAX_TENTATIVAS) {
          setEstado('analisando')
          await new Promise((r) => {
            timer.current = setTimeout(r, INTERVALO_MS)
          })
          if (minha !== rodada.current) return
          noticia = await api.buscarNoticia(noticia.id)
          if (minha !== rodada.current) return
          setResultado(noticia)
          tentativas += 1
        }
        setEstado(noticia.veredito == null ? 'demorando' : 'pronto')
      } catch (e) {
        if (minha !== rodada.current) return
        setErro(e.message || 'Algo deu errado. Tente novamente.')
        setEstado('erro')
      }
    },
    [cancelar]
  )

  const limpar = useCallback(() => {
    cancelar()
    setEstado('idle')
    setResultado(null)
    setErro('')
  }, [cancelar])

  return { estado, resultado, erro, iniciar, limpar }
}
