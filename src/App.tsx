import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { PokemonProvider } from './context/PokemonProvider'
import { DetailView } from './pages/DetailView'
import { GalleryView } from './pages/GalleryView'
import { ListView } from './pages/ListView'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <PokemonProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/list" replace />} />
            <Route path="list" element={<ListView />} />
            <Route path="gallery" element={<GalleryView />} />
            <Route path="pokemon/:id" element={<DetailView />} />
            <Route path="*" element={<Navigate to="/list" replace />} />
          </Route>
        </Routes>
      </PokemonProvider>
    </BrowserRouter>
  )
}
