import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './CheckoutPage.css';

const TARIFA_ENVIO_LOCAL = 60.00; // Tarifa fija para envío local

const CheckoutPage = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
    const [deliveryMethod, setDeliveryMethod] = useState('recoger');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const finalTotal = deliveryMethod === 'envio' ? cartTotal + TARIFA_ENVIO_LOCAL : cartTotal;

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (cartItems.length === 0) {
            toast.error("Tu carrito está vacío.");
            return;
        }
        if (!formData.name || !formData.phone) {
            toast.error("Por favor, completa tu nombre y teléfono.");
            return;
        }
        if (deliveryMethod === 'envio' && !formData.address) {
            toast.error("Por favor, ingresa tu dirección de envío.");
            return;
        }

        setIsProcessing(true);

        try {
            // 1. Insertar la orden principal
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert({
                    customer_name: formData.name,
                    customer_phone: formData.phone,
                    delivery_method: deliveryMethod,
                    shipping_address: deliveryMethod === 'envio' ? formData.address : null,
                    total_amount: finalTotal,
                    status: 'pendiente_pago'
                })
                .select('id')
                .single();

            if (orderError) throw orderError;

            // 2. Insertar los artículos de la orden
            const orderItems = cartItems.map(item => ({
                order_id: orderData.id,
                variant_id: item.variant.id,
                quantity: item.quantity,
                price_at_purchase: item.variant.price,
                product_details: { // Guardamos un "snapshot" de los detalles
                    brand: item.product.brandName,
                    model: item.product.model,
                    color: item.variant.color,
                    size: item.variant.size,
                }
            }));

            const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
            if (itemsError) throw itemsError;

            // 3. Limpiar el carrito y redirigir
            clearCart();
            toast.success("¡Pedido realizado con éxito!");
            navigate(`/confirmacion/${orderData.id}`);

        } catch (error) {
            toast.error("Hubo un error al procesar tu pedido: " + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="checkout-page">
            <h1>Finalizar Compra</h1>
            <div className="checkout-grid">
                <div className="checkout-form card-style">
                    <form onSubmit={handlePlaceOrder}>
                        <h3>Tus Datos</h3>
                        <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Nombre Completo" required />
                        <input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="Número de WhatsApp" required />
                        
                        <h3>Método de Entrega</h3>
                        <div className="delivery-options">
                            <label className={deliveryMethod === 'recoger' ? 'active' : ''}>
                                <input type="radio" name="delivery" value="recoger" checked={deliveryMethod === 'recoger'} onChange={() => setDeliveryMethod('recoger')} />
                                Recoger en Tienda (Gratis)
                            </label>
                            <label className={deliveryMethod === 'envio' ? 'active' : ''}>
                                <input type="radio" name="delivery" value="envio" checked={deliveryMethod === 'envio'} onChange={() => setDeliveryMethod('envio')} />
                                Envío a Domicilio (+${TARIFA_ENVIO_LOCAL.toFixed(2)})
                            </label>
                        </div>

                        {deliveryMethod === 'envio' && (
                            <textarea name="address" value={formData.address} onChange={handleInputChange} placeholder="Tu dirección completa..." required rows="3"></textarea>
                        )}
                    </form>
                </div>
                <div className="checkout-summary card-style">
                    <h3>Resumen del Pedido</h3>
                    {cartItems.map(item => (
                        <div key={item.variant.id} className="summary-item">
                            <span>{item.quantity}x {item.product.model} (Talla {item.variant.size})</span>
                            <span>${(item.variant.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="summary-row">
                        <span>Subtotal:</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    {deliveryMethod === 'envio' && (
                         <div className="summary-row">
                            <span>Envío:</span>
                            <span>${TARIFA_ENVIO_LOCAL.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="summary-row total">
                        <span>Total a Pagar:</span>
                        <span>${finalTotal.toFixed(2)}</span>
                    </div>
                    <button onClick={handlePlaceOrder} className="primary-button checkout-button" disabled={isProcessing}>
                        {isProcessing ? 'Procesando...' : 'Realizar Pedido'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
