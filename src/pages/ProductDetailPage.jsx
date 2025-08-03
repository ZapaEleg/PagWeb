import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiImage, FiAlertTriangle, FiClock } from 'react-icons/fi';

import ProductCard from '../components/ProductCard';
import AnimatedSection from '../components/AnimatedSection';
import SkeletonProductCard from '../components/SkeletonProductCard';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
    const { productId } = useParams();
    const { addToCart } = useCart();
    
    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductData = async () => {
            if (!productId) return;
            setLoading(true);
            setError(null);

            try {
                // 1. Obtener el producto principal
                const { data: productData, error: productError } = await supabase
                    .from('products')
                    .select(`*, brands (name), variants (*)`)
                    .eq('id', productId)
                    .single();

                if (productError) throw productError;
                setProduct(productData);

                if (productData && productData.variants.length > 0) {
                    const availableVariant = productData.variants.find(v => v.stock > 0);
                    setSelectedVariant(availableVariant || productData.variants[0]);
                }

                // 2. Obtener productos relacionados (simulando TensorFlow)
                // Estrategia: Buscar productos con al menos una etiqueta en común, excluyendo el actual.
                if (productData.tags && productData.tags.length > 0) {
                    const { data: relatedData, error: relatedError } = await supabase
                        .rpc('get_products_by_tags', { 
                            p_tags: productData.tags, 
                            exclude_id: productData.id, 
                            p_limit: 4 
                        });

                    if (relatedError) console.error("Error fetching related products:", relatedError);
                    else setRelatedProducts(relatedData);
                }

            } catch (e) {
                setError('No se pudo encontrar el producto.');
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, [productId]);

    const handleAddToCart = () => {
        if (product && selectedVariant) {
            addToCart(product, selectedVariant);
        }
    };

    if (loading) return <div className="page-status-container"><div className="loader">Cargando producto...</div></div>;
    if (error) return <div className="page-status-container"><div className="error-message">{error}</div></div>;
    if (!product) return <div className="page-status-container"><div className="empty-state">Producto no encontrado.</div></div>;

    const availableSizes = [...new Set(product.variants.map(v => v.size))].sort((a, b) => parseFloat(a) - parseFloat(b));
    const availableColors = [...new Set(product.variants.map(v => v.color))];

    const handleSizeSelect = (size) => {
        // Al cambiar talla, buscar la variante de esa talla con el color actual
        const variant = product.variants.find(v => v.size === size && v.color === selectedVariant.color);
        if (variant) setSelectedVariant(variant);
    };
    
    const handleColorSelect = (color) => {
        // Al cambiar color, buscar la primera variante disponible de ese color
        const variant = product.variants.find(v => v.color === color && v.stock > 0) || product.variants.find(v => v.color === color);
        if (variant) setSelectedVariant(variant);
    };

    const isLowStock = selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 5;

    return (
        <div className="product-detail-page">
            <motion.div 
                className="product-detail-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="product-gallery">
                    {product.image_url ? 
                        <img src={product.image_url} alt={`${product.brands?.name} ${product.model}`} /> : 
                        <div className="detail-no-image"><FiImage /></div>
                    }
                </div>
                <div className="product-actions">
                    <span className="brand-name">{product.brands?.name || 'Marca Desconocida'}</span>
                    <h1>{product.model}</h1>
                    <span className="price">${selectedVariant ? selectedVariant.price.toFixed(2) : '0.00'}</span>
                    
                    <div className="variant-selector">
                        <label>Color: {selectedVariant?.color}</label>
                        <div className="color-options">
                            {availableColors.map(color => (
                                <button 
                                    key={color} 
                                    className={`color-chip ${selectedVariant?.color === color ? 'active' : ''}`} 
                                    onClick={() => handleColorSelect(color)} 
                                    style={{ backgroundColor: color ? color.toLowerCase() : '#ccc' }} 
                                    title={color}
                                    aria-label={`Seleccionar color ${color}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="variant-selector">
                        <label>Talla:</label>
                        <div className="size-options">
                            {availableSizes.map(size => {
                                const variantForSize = product.variants.find(v => v.size === size && v.color === selectedVariant?.color);
                                const isAvailable = variantForSize && variantForSize.stock > 0;
                                return (
                                    <button 
                                        key={size} 
                                        className={`size-chip ${selectedVariant?.size === size ? 'active' : ''}`} 
                                        onClick={() => handleSizeSelect(size)} 
                                        disabled={!isAvailable}
                                        aria-label={`Seleccionar talla ${size}`}
                                    >
                                        {size}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {isLowStock && (
                        <div className="stock-alert low-stock">
                            <FiAlertTriangle /> ¡Últimas piezas! Quedan solo {selectedVariant.stock}.
                        </div>
                    )}

                    {selectedVariant?.stock === 0 && (
                        <div className="stock-alert out-of-stock">
                            <FiX /> Agotado en esta talla y color.
                        </div>
                    )}

                    <button className="btn btn-primary add-to-cart-button" onClick={handleAddToCart} disabled={!selectedVariant || selectedVariant.stock === 0}>
                        <FiShoppingCart />
                        {selectedVariant?.stock > 0 ? 'Añadir al Carrito' : 'Agotado'}
                    </button>

                    {selectedVariant?.stock === 0 && (
                        <button className="btn btn-secondary notify-button">
                            <FiClock /> Avísame cuando esté disponible
                        </button>
                    )}

                    <div className="product-description">
                        <h4>Descripción</h4>
                        <p>{product.description || "Descripción no disponible."}</p>
                        <ul>
                            <li><strong>Material:</strong> {product.material || 'No especificado'}</li>
                            <li><strong>Categoría:</strong> {product.category || 'No especificada'}</li>
                            <li><strong>Marca:</strong> {product.brands?.name || 'No especificada'}</li>
                        </ul>
                    </div>
                </div>
            </motion.div>

            {relatedProducts.length > 0 && (
                <AnimatedSection className="related-products-section">
                    <h2 className="section-title">Clientes también vieron</h2>
                    <div className="product-grid">
                        {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                </AnimatedSection>
            )}
        </div>
    );
};

export default ProductDetailPage;

