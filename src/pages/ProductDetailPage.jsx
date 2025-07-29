import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useCart } from '../context/CartContext'; // <-- Importar el hook del carrito
import { FiShoppingCart, FiImage } from 'react-icons/fi';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart(); // <-- Obtener la función para añadir al carrito

    useEffect(() => {
        // ... (la lógica de fetchProduct se mantiene igual)
        const fetchProduct = async () => {
            if (!productId) return;
            setLoading(true);
            setError(null);
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select(`id, model, category, image_url, tags, brands ( name ), variants ( id, color, size, price, stock )`)
                    .eq('id', productId)
                    .single();
                if (error) throw error;
                setProduct(data);
                if (data && data.variants.length > 0) {
                    const availableVariant = data.variants.find(v => v.stock > 0);
                    setSelectedVariant(availableVariant || data.variants[0]);
                }
            } catch (e) {
                setError('No se pudo encontrar el producto.');
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);
    
    // Ahora esta función realmente añade el producto al estado global
    const handleAddToCart = () => {
        if (product && selectedVariant) {
            addToCart(product, selectedVariant);
        }
    };

    // ... (el resto del componente se mantiene igual)
    if (loading) return <div className="page-status-container"><div className="loader">Cargando producto...</div></div>;
    if (error) return <div className="page-status-container"><div className="error-message">{error}</div></div>;
    if (!product) return <div className="page-status-container"><div className="empty-state">Producto no encontrado.</div></div>;

    const availableSizes = [...new Set(product.variants.map(v => v.size))].sort((a, b) => parseFloat(a) - parseFloat(b));
    const availableColors = [...new Set(product.variants.map(v => v.color))];

    const handleSizeSelect = (size) => {
        const variant = product.variants.find(v => v.size === size && v.color === selectedVariant.color);
        if (variant) setSelectedVariant(variant);
    };
    
    const handleColorSelect = (color) => {
        const variant = product.variants.find(v => v.color === color);
        if (variant) setSelectedVariant(variant);
    };

    return (
        <div className="product-detail-page">
            <div className="product-detail-grid">
                <div className="product-gallery">
                    {product.image_url ? <img src={product.image_url} alt={`${product.brands?.name} ${product.model}`} /> : <div className="detail-no-image"><FiImage /></div>}
                </div>
                <div className="product-actions">
                    <span className="brand-name">{product.brands?.name || 'Marca Desconocida'}</span>
                    <h1>{product.model}</h1>
                    <span className="price">${selectedVariant ? selectedVariant.price.toFixed(2) : '0.00'}</span>
                    
                    <div className="variant-selector">
                        <label>Color:</label>
                        <div className="color-options">
                            {availableColors.map(color => (<button key={color} className={`color-chip ${selectedVariant?.color === color ? 'active' : ''}`} onClick={() => handleColorSelect(color)} style={{ backgroundColor: color ? color.toLowerCase() : '#ccc' }} title={color} />))}
                        </div>
                    </div>

                    <div className="variant-selector">
                        <label>Talla:</label>
                        <div className="size-options">
                            {availableSizes.map(size => {
                                const variantForSize = product.variants.find(v => v.size === size && v.color === selectedVariant?.color);
                                const isAvailable = variantForSize && variantForSize.stock > 0;
                                return (<button key={size} className={`size-chip ${selectedVariant?.size === size ? 'active' : ''}`} onClick={() => handleSizeSelect(size)} disabled={!isAvailable}>{size}</button>);
                            })}
                        </div>
                    </div>

                    <button className="add-to-cart-button" onClick={handleAddToCart} disabled={!selectedVariant || selectedVariant.stock === 0}>
                        <FiShoppingCart />
                        {selectedVariant?.stock > 0 ? 'Añadir al Carrito' : 'Agotado'}
                    </button>

                    <div className="product-tags-detail">
                        {product.tags?.map(tag => <span key={tag} className="tag-chip">{tag}</span>)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
