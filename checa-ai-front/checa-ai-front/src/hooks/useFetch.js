import { useEffect, useState } from 'react'

// Carrega dados de uma função async sempre que `deps` mudar.
export function useFetch(carregar, deps) {
  const [dados, setDados] = useState(null)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    let cancelado = false
    setCarregando(true)
    setErro('')
    carregar()
      .then((d) => !cancelado && setDados(d))
      .catch((e) => !cancelado && setErro(e.message || 'Não foi possível carregar.'))
      .finally(() => !cancelado && setCarregando(false))
    return () => {
      cancelado = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { dados, erro, carregando }
}
