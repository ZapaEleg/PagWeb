import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importar páginas y componentes
import Header from './components/Header';
import HomePage from './pages/HomePage'; // <-- Asegúrate de importar HomePage
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import NotFoundPage from './pages/NotFoundPage';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} /> {/* <-- Asegúrate que la ruta principal use HomePage */}
          <Route path="/catalogo/:category" element={<CatalogPage />} />
          <Route path="/producto/:productId" element={<ProductDetailPage />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/confirmacion/:orderId" element={<OrderConfirmationPage />} />
          <Route path="/ortopedia" element={<div>Página de Ortopedia</div>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Chatbot />
    </>
  );
}

export default App;
