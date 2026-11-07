import { useEffect, useRef, useState } from 'react'
import { api } from '../services/api.js'
import { useChecagem } from '../hooks/useChecagem.js'
import { ehLinkHttp } from '../utils/formatar.js'
import ResultCard from './ResultCard.jsx'

const TIPOS = ['image/jpeg', 'image/png', 'image/webp']
const MAX_MB = 5

export default function ImageChecker() {
  const [arquivo, setArquivo] = useState(null)
  const [preview, setPreview] = useState('')
  const [link, setLink] = useState('')
  const [aviso, setAviso] = useState('')
  const [arrastando, setArrastando] = useState(false)
  const inputRef = useRef(null)
  const { estado, resultado, erro, iniciar, limpar } = useChecagem()

  // Cria e libera a URL de pré-visualização
  useEffect(() => {
    if (!arquivo) {
      setPreview('')
      return
    }
    const url = URL.createObjectURL(arquivo)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [arquivo])

  function escolher(f) {
    setAviso('')
    if (!f) return
    if (!TIPOS.includes(f.type)) {
      setAviso('Formato não aceito. Envie uma imagem JPG, PNG ou WebP.')
      return
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setAviso(`A imagem é grande demais. O limite é ${MAX_MB} MB.`)
      return
    }
    setArquivo(f)
    setLink('')
    limpar()
  }

  function soltar(e) {
    e.preventDefault()
    setArrastando(false)
    escolher(e.dataTransfer.files?.[0])
  }

  function enviar(e) {
    e.preventDefault()
    const url = link.trim()
    if (!arquivo && !url) {
      setAviso('Envie uma imagem ou cole o endereço dela.')
      return
    }
    if (!arquivo && !ehLinkHttp(url)) {
      setAviso('O endereço precisa começar com http:// ou https://')
      return
    }
    setAviso('')
    iniciar(() => api.checarImagem({ arquivo, link: arquivo ? undefined : url }))
  }

  function reiniciar() {
    setArquivo(null)
    setLink('')
    setAviso('')
    limpar()
    if (inputRef.current) inputRef.current.value = ''
  }

  const ocupado = estado === 'enviando' || estado === 'analisando'

  return (
    <form onSubmit={enviar} noValidate>
      <label
        className={`dropzone${arrastando ? ' dropzone-ativo' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setArrastando(true) }}
        onDragLeave={() => setArrastando(false)}
        onDrop={soltar}
      >
        <input
          ref={inputRef}
          className="sr-only"
          type="file"
          accept={TIPOS.join(',')}
          onChange={(e) => escolher(e.target.files?.[0])}
        />
        {preview ? (
          <img className="preview" src={preview} alt="Imagem escolhida para checagem" />
        ) : (
          <>
            <strong>Arraste a imagem aqui ou clique para escolher</strong>
            <span>JPG, PNG ou WebP, até {MAX_MB} MB</span>
          </>
        )}
      </label>

      {arquivo && (
        <p className="hint">{arquivo.name} <button type="button" className="link-btn" onClick={reiniciar}>Remover</button></p>
      )}

      {!arquivo && (
        <div className="field">
          <label htmlFor="imgLink">Ou cole o endereço da imagem</label>
          <input
            id="imgLink"
            type="url"
            inputMode="url"
            placeholder="https://site.com/foto.jpg"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>
      )}

      {aviso && <p className="field-error" role="alert">{aviso}</p>}

      <div className="checker-actions">
        <button className="btn" type="submit" disabled={ocupado}>
          {ocupado ? 'Verificando…' : 'Verificar imagem'}
        </button>
        <button className="btn btn-outline" type="button" onClick={reiniciar}>Limpar</button>
      </div>
      <p className="hint">Buscamos checagens que já usaram esta mesma imagem. Se não achar nada, confira também a data e o contexto.</p>

      <ResultCard estado={estado} resultado={resultado} erro={erro} />
    </form>
  )
}
