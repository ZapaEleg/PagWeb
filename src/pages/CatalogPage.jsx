import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Se importa Link para la navegación
import { supabase } from '../supabaseClient';
import './CatalogPage.css';

const CatalogPage = () => {
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            setProducts([]);
            
            if (!category) {
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('products')
                    .select(`
                        id, model, image_url,
                        brands ( name ), 
                        variants ( price )
                    `)
                    .eq('category', category)
                    .not('variants', 'is', null)
                    .limit(50);

                if (error) throw error;
                
                const validProducts = data.filter(p => p.brands && p.variants && p.variants.length > 0);

                const formattedProducts = validProducts.map(p => ({
                    id: p.id,
                    model: p.model,
                    image_url: p.image_url,
                    price: p.variants[0].price,
                    brandName: p.brands.name
                }));

                setProducts(formattedProducts);
            } catch (e) {
                setError('No se pudieron cargar los productos.');
                console.error("Error detallado al consultar Supabase:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category]);

    const displayCategoryTitle = category ? category.charAt(0).toUpperCase() + category.slice(1) : "Catálogo";

    return (
        <div className="catalog-page">
            <header className="catalog-header">
                <h1>{displayCategoryTitle}</h1>
            </header>

            {loading && <div className="loader">Cargando productos...</div>}
            {error && <div className="error-message">{error}</div>}
            
            {!loading && !error && (
                <div className="product-grid">
                    {products.length > 0 ? (
                        products.map(product => (
                            // Se envuelve la tarjeta en un componente Link para hacerla navegable
                            <Link to={`/producto/${product.id}`} key={product.id} className="product-grid-card">
                                <div className="product-image">
                                    {product.image_url ? 
                                        <img src={product.image_url} alt={`${product.brandName} ${product.model}`} /> : 
                                        <div className="image-placeholder"></div>}
                                </div>
                                <div className="product-info">
                                    <span className="brand">{product.brandName}</span>
                                    <h3 className="model">{product.model}</h3>
                                    <span className="price">${product.price.toFixed(2)}</span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p>No hay productos en esta categoría por el momento.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CatalogPage;
