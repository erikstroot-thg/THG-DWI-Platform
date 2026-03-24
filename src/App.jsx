import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import OverzichtPagina from './components/OverzichtPagina'
import DetailPagina from './components/DetailPagina'
import NieuwDwiPagina from './components/NieuwDwiPagina'
import BeheerPagina from './components/BeheerPagina'
import DwiEditor from './components/DwiEditor'
import VijfSPagina from './components/VijfSPagina'
import IstSollGapPagina from './components/IstSollGapPagina'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<OverzichtPagina />} />
        <Route path="/dwi/:id" element={<DetailPagina />} />
        <Route path="/dwi/:id/bewerken" element={<DwiEditor />} />
        <Route path="/nieuw" element={<NieuwDwiPagina />} />
        <Route path="/beheer" element={<BeheerPagina />} />
        <Route path="/5s" element={<VijfSPagina />} />
        <Route path="/ist-soll-gap" element={<IstSollGapPagina />} />
      </Routes>
    </Layout>
  )
}
