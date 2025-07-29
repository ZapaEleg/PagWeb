import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { FiCheckCircle } from 'react-icons/fi';
import './OrderConfirmationPage.css';

const OrderConfirmationPage = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) return;
            try {
                const { data, error } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('id', orderId)
                    .single();
                if (error) throw error;
                setOrder(data);
            } catch (e) {
                console.error("Error fetching order:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    if (loading) return <div className="loader">Cargando confirmación...</div>;
    if (!order) return <div className="error-message">No se pudo encontrar tu pedido.</div>;

    return (
        <div className="confirmation-page">
            <FiCheckCircle className="success-icon" />
            <h2>¡Gracias por tu compra, {order.customer_name}!</h2>
            <p>Hemos recibido tu pedido. Tu número de orden es: <strong>#{order.id}</strong></p>
            
            <div className="payment-instructions">
                <h3>Siguientes Pasos: Pago por Transferencia</h3>
                <p>Para completar tu compra, por favor realiza una transferencia por el monto total de <strong>${order.total_amount.toFixed(2)}</strong> a la siguiente cuenta:</p>
                <ul>
                    <li><strong>Banco:</strong> [El Nombre de tu Banco]</li>
                    <li><strong>CLABE:</strong> [Tu Número de CLABE]</li>
                    <li><strong>Beneficiario:</strong> [Tu Nombre o Nombre del Negocio]</li>
                </ul>
                <p className="important-note">
                    Una vez realizada la transferencia, envía tu comprobante de pago a nuestro WhatsApp <strong>[Tu Número de WhatsApp]</strong> junto con tu número de orden <strong>#{order.id}</strong> para que podamos procesar tu pedido.
                </p>
            </div>
            <Link to="/" className="primary-button">Volver a la Tienda</Link>
        </div>
    );
};

export default OrderConfirmationPage;
