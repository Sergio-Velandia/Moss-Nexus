import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import Layout from './components/layout/Layout'
import { GallerySkeleton } from './components/templates/TemplateCard'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

// Galería y detalle se descargan al visitarlas; mientras tanto se ve el esqueleto de la galería
const Templates = lazy(() => import('./pages/Templates'))
const TemplateDetail = lazy(() => import('./pages/TemplateDetail'))
const About = lazy(() => import('./pages/About'))
const Terms = lazy(() => import('./pages/Terms'))
const Privacy = lazy(() => import('./pages/Privacy'))

function PageSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-14">
      <div className="skeleton h-3 w-20 rounded" />
      <div className="skeleton mt-4 h-10 w-64 rounded-lg" />
      <div className="skeleton mt-4 h-4 w-full max-w-xl rounded" />
      <div className="skeleton mt-8 h-12 w-full rounded-xl" />
      <div className="mt-10">
        <GallerySkeleton />
      </div>
    </div>
  )
}

export default function App() {
  return (
    // reducedMotion="user": si el sistema pide menos movimiento, se omiten los desplazamientos
    <MotionConfig reducedMotion="user">
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route
              path="plantillas"
              element={
                <Suspense fallback={<PageSkeleton />}>
                  <Templates />
                </Suspense>
              }
            />
            <Route
              path="plantillas/:slug"
              element={
                <Suspense fallback={<PageSkeleton />}>
                  <TemplateDetail />
                </Suspense>
              }
            />
            <Route path="acerca" element={<About />} />
            <Route path="terminos" element={<Terms />} />
            <Route path="privacidad" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  )
}
