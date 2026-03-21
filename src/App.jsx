import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import OverzichtPagina from './components/OverzichtPagina'
import DetailPagina from './components/DetailPagina'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<OverzichtPagina />} />
        <Route path="/dwi/:id" element={<DetailPagina />} />
      </Routes>
    </Layout>
  )
}
