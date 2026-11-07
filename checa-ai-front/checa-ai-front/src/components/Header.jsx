import { Link, NavLink } from 'react-router-dom'

export function Marca({ claro = false }) {
  return (
    <span className="brand" style={claro ? { color: 'white', justifyContent: 'center' } : undefined}>
      <span className="brand-mark" aria-hidden="true">✓</span>
      CHECA <span>AI</span>
    </span>
  )
}

export default function Header() {
  return (
    <>
      <div className="topbar">
        <span>Educação digital e pensamento crítico</span>
        <span>Antes de compartilhar, verifique a informação.</span>
      </div>
      <header className="site-header">
        <div className="nav">
          <Link to="/" aria-label="CHECA AI — página inicial"><Marca /></Link>
          <nav aria-label="Navegação principal">
            <NavLink to="/historico">Histórico</NavLink>
            <NavLink to="/ranking">Mais denunciadas</NavLink>
            <NavLink to="/aprender">Aprenda a verificar</NavLink>
          </nav>
          <Link className="nav-cta" to="/#verificar">Verificar conteúdo</Link>
        </div>
      </header>
    </>
  )
}
