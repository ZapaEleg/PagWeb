import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom'; // Importar Link
import { FiTrash2 } from 'react-icons/fi';
import './CartPage.css';

const CartPage = () => {
    const { cartItems, cartTotal, removeFromCart } = useCart();

    if (cartItems.length === 0) {
        return <div className="empty-cart">Tu carrito de compras está vacío.</div>;
    }

    return (
        <div className="cart-page">
            <h1>Tu Carrito de Compras</h1>
            <div className="cart-grid">
                <div className="cart-items">
                    {cartItems.map(item => (
                        <div key={item.variant.id} className="cart-item">
                            <img src={item.product.image_url} alt={item.product.model} className="item-image" />
                            <div className="item-details">
                                <h4>{item.product.brandName} {item.product.model}</h4>
                                <p>Talla: {item.variant.size}, Color: {item.variant.color}</p>
                                <p>Precio: ${item.variant.price.toFixed(2)}</p>
                            </div>
                            <div className="item-quantity">Cantidad: {item.quantity}</div>
                            <div className="item-subtotal">${(item.variant.price * item.quantity).toFixed(2)}</div>
                            <button onClick={() => removeFromCart(item.variant.id)} className="remove-button"><FiTrash2/></button>
                        </div>
                    ))}
                </div>
                <div className="cart-summary">
                    <h3>Resumen del Pedido</h3>
                    <div className="summary-row"><span>Subtotal:</span><span>${cartTotal.toFixed(2)}</span></div>
                    <div className="summary-row total"><span>Total:</span><span>${cartTotal.toFixed(2)}</span></div>
                    {/* Enlace a la página de checkout */}
                    <Link to="/checkout" className="primary-button checkout-button">Proceder al Pago</Link>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
