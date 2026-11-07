import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Chatbot from './components/Chatbot.jsx'
import Home from './pages/Home.jsx'
import Aprender from './pages/Aprender.jsx'
import Historico from './pages/Historico.jsx'
import Ranking from './pages/Ranking.jsx'

// Rola até a âncora (#verificar) ou volta ao topo ao trocar de página.
function ScrollAoNavegar() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0 })
    }
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <ScrollAoNavegar />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aprender" element={<Aprender />} />
          <Route path="/historico" element={<Historico />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <Chatbot />
    </>
  )
}
