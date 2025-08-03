import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Importación de componentes principales
import Layout from './components/Layout';
import PageLoader from './components/PageLoader'; // Un componente para la carga de página

// Lazy-loading de las páginas para mejorar el rendimiento inicial
const HomePage = lazy(() => import('./pages/HomePage'));
const CatalogPage = lazy(() => import('./pages/CatalogPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage'));
const OffersPage = lazy(() => import('./pages/OffersPage'));
const AboutPage = lazy(() => import('./pages/AboutPage')); // Nueva página
const LoginPage = lazy(() => import('./pages/LoginPage')); // Nueva página
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  const location = useLocation();

  return (
    // Suspense se usa con lazy-loading para mostrar un fallback mientras carga el componente
    <Suspense fallback={<PageLoader />}>
      {/* AnimatePresence permite animar componentes cuando entran o salen del DOM */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Rutas que usan el Layout principal (Header/Footer) */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="catalogo/:category" element={<CatalogPage />} />
            <Route path="ofertas" element={<OffersPage />} />
            <Route path="producto/:productId" element={<ProductDetailPage />} />
            <Route path="carrito" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="confirmacion/:orderId" element={<OrderConfirmationPage />} />
            <Route path="nosotros" element={<AboutPage />} />
            <Route path="ortopedia" element={<div>Página de Ortopedia en construcción</div>} />
          </Route>
          
          {/* Rutas sin el Layout principal */}
          <Route path="/login" element={<LoginPage />} />

          {/* Ruta para todo lo demás */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default App;
