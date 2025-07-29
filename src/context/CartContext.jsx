import React, { createContext, useState, useContext } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product, variant) => {
        const existingItem = cartItems.find(item => item.variant.id === variant.id);
        if (existingItem) {
            if (existingItem.quantity < variant.stock) {
                setCartItems(cartItems.map(item =>
                    item.variant.id === variant.id ? { ...item, quantity: item.quantity + 1 } : item
                ));
                toast.info(`Cantidad actualizada.`);
            } else {
                toast.warn(`Stock máximo alcanzado.`);
            }
        } else {
            if (1 <= variant.stock) {
                const newItem = {
                    product: {
                        id: product.id,
                        model: product.model,
                        image_url: product.image_url,
                        brandName: product.brands.name,
                    },
                    variant: variant,
                    quantity: 1,
                };
                setCartItems([...cartItems, newItem]);
                toast.success(`${product.model} añadido al carrito.`);
            } else {
                 toast.error(`Producto agotado.`);
            }
        }
    };

    const removeFromCart = (variantId) => {
        setCartItems(cartItems.filter(item => item.variant.id !== variantId));
        toast.error("Producto eliminado del carrito.");
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartTotal = cartItems.reduce((total, item) => total + item.variant.price * item.quantity, 0);
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartTotal, totalItems }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};
