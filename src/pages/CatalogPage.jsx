import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ProductCard from '../components/ProductCard';
import SkeletonProductCard from '../components/SkeletonProductCard';
import './CatalogPage.css';

const CatalogPage = () => {
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('featured'); // Opciones: featured, price_asc, price_desc

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            
            if (!category) {
                setLoading(false);
                return;
            }

            try {
                // Usamos una función RPC para obtener los datos ya formateados
                const { data, error } = await supabase.rpc('get_products_by_category', { p_category: category });

                if (error) throw error;
                
                setProducts(data);
            } catch (e) {
                setError('No se pudieron cargar los productos.');
                console.error("Error fetching catalog:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category]);

    const sortedProducts = useMemo(() => {
        let sortableProducts = [...products];
        if (sortBy === 'price_asc') {
            sortableProducts.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price_desc') {
            sortableProducts.sort((a, b) => b.price - a.price);
        }
        // 'featured' es el orden por defecto de la BD, que podemos mejorar
        // con un campo `popularity_score` en el futuro.
        return sortableProducts;
    }, [products, sortBy]);

    const displayCategoryTitle = category ? category.charAt(0).toUpperCase() + category.slice(1) : "Catálogo";

    return (
        <div className="catalog-page">
            <header className="catalog-header">
                <h1>{displayCategoryTitle}</h1>
                <div className="catalog-controls">
                    <div className="product-count">
                        {sortedProducts.length} productos
                    </div>
                    <div className="sort-control">
                        <label htmlFor="sort-by">Ordenar por:</label>
                        <select id="sort-by" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="featured">Destacados</option>
                            <option value="price_asc">Precio: Menor a Mayor</option>
                            <option value="price_desc">Precio: Mayor a Menor</option>
                        </select>
                    </div>
                </div>
            </header>

            <div className="catalog-content">
                {/* Aquí podrían ir filtros más avanzados en el futuro */}
                <aside className="catalog-filters">
                    <h3>Filtros</h3>
                    {/* Placeholder para filtros futuros */}
                    <p>Próximamente...</p>
                </aside>

                <main className="product-grid-container">
                    {loading && (
                        <div className="product-grid">
                            {[...Array(8)].map((_, i) => <SkeletonProductCard key={i} />)}
                        </div>
                    )}
                    {error && <div className="error-message">{error}</div>}
                    
                    {!loading && !error && (
                        <div className="product-grid">
                            {sortedProducts.length > 0 ? (
                                sortedProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))
                            ) : (
                                <p>No hay productos en esta categoría por el momento.</p>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default CatalogPage;
