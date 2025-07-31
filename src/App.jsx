import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importar Layout y páginas
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import NotFoundPage from './pages/NotFoundPage';
import OffersPage from './pages/OffersPage';

function App() {
  return (
    <Routes>
      {/* Todas las rutas que deben tener header y footer van dentro de Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="catalogo/:category" element={<CatalogPage />} />
        <Route path="ofertas" element={<OffersPage />} />
        <Route path="producto/:productId" element={<ProductDetailPage />} />
        <Route path="carrito" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="confirmacion/:orderId" element={<OrderConfirmationPage />} />
        <Route path="ortopedia" element={<div>Página de Ortopedia</div>} />
      </Route>
      
      {/* Rutas que no usan el Layout principal, como una futura página de login */}
      {/* <Route path="/login" element={<LoginPage />} /> */}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
