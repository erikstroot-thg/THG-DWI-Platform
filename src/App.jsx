import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import OverzichtPagina from './components/OverzichtPagina'
import DetailPagina from './components/DetailPagina'
import NieuwDwiPagina from './components/NieuwDwiPagina'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<OverzichtPagina />} />
        <Route path="/dwi/:id" element={<DetailPagina />} />
        <Route path="/nieuw" element={<NieuwDwiPagina />} />
      </Routes>
    </Layout>
  )
}
