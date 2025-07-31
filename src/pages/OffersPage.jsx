import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ProductCard from '../components/ProductCard'; // Reutilizamos la tarjeta de producto
import './CatalogPage.css'; // Reutilizamos los estilos del catálogo

const CATEGORIES = ['dama', 'caballero', 'niña', 'niño', 'ortopedia'];

const OffersPage = () => {
    const [allOffers, setAllOffers] = useState([]);
    const [filteredOffers, setFilteredOffers] = useState([]);
    const [activeFilter, setActiveFilter] = useState('todos');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOffers = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase.rpc('get_products_by_tag', { tag_name: 'oferta' });
                if (error) throw error;
                
                // Necesitamos la categoría para filtrar, así que hacemos una consulta adicional
                const productIds = data.map(p => p.id);
                const { data: productsWithCategory, error: categoryError } = await supabase
                    .from('products')
                    .select('id, category')
                    .in('id', productIds);

                if (categoryError) throw categoryError;

                // Unimos los datos
                const offersWithCategory = data.map(offer => {
                    const productInfo = productsWithCategory.find(p => p.id === offer.id);
                    return { ...offer, category: productInfo?.category || 'sin-categoria' };
                });

                setAllOffers(offersWithCategory);
                setFilteredOffers(offersWithCategory);

            } catch (e) {
                setError('No se pudieron cargar las ofertas.');
                console.error("Error fetching offers:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchOffers();
    }, []);

    const handleFilter = (category) => {
        setActiveFilter(category);
        if (category === 'todos') {
            setFilteredOffers(allOffers);
        } else {
            setFilteredOffers(allOffers.filter(p => p.category === category));
        }
    };

    return (
        <div className="catalog-page">
            <header className="catalog-header">
                <h1>Ofertas Especiales</h1>
                <div className="category-filters">
                    <button onClick={() => handleFilter('todos')} className={activeFilter === 'todos' ? 'active' : ''}>
                        Todos
                    </button>
                    {CATEGORIES.map(cat => (
                         <button key={cat} onClick={() => handleFilter(cat)} className={activeFilter === cat ? 'active' : ''}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    ))}
                </div>
            </header>

            {loading && <div className="loader">Cargando ofertas...</div>}
            {error && <div className="error-message">{error}</div>}
            
            {!loading && !error && (
                <div className="product-grid">
                    {filteredOffers.length > 0 ? (
                        filteredOffers.map(product => (
                            <ProductCard key={product.id} product={product} badgeText="Oferta" />
                        ))
                    ) : (
                        <p>No hay ofertas disponibles en esta categoría por el momento.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default OffersPage;
