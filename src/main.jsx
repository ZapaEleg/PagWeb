import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// CORRECCIÓN: Aseguramos que la ruta al archivo sea exacta.
// Debe estar en una carpeta 'context' y el archivo llamarse 'CartContext.jsx'
import { CartProvider } from './context/CartContext';

import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider> {/* Envolvemos la App con el proveedor del carrito */}
        <App />
        <ToastContainer position="bottom-right" autoClose={3000} />
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
