import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

// Importación de Componentes
import ProductCard from '../components/ProductCard';
import AnimatedSection from '../components/AnimatedSection';
import SkeletonProductCard from '../components/SkeletonProductCard';

// Importación de Íconos
import { FiArrowRight } from 'react-icons/fi';

import './HomePage.css';

const HomePage = () => {
    const [brands, setBrands] = useState([]);
    const [popularProducts, setPopularProducts] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [brandsRes, popularRes] = await Promise.all([
                    supabase.from('brands').select('id, name, logo_url').limit(8).not('logo_url', 'is', null),
                    supabase.rpc('get_products_by_tag', { tag_name: 'destacado' })
                ]);

                if (brandsRes.data) setBrands(brandsRes.data);
                
                if (popularRes.data) {
                    const grouped = popularRes.data.reduce((acc, product) => {
                        const category = product.category || 'otros';
                        if (!acc[category]) acc[category] = [];
                        acc[category].push(product);
                        return acc;
                    }, {});
                    setPopularProducts(grouped);
                }
            } catch (error) {
                console.error("Error fetching homepage data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="homepage">
            {/* --- Sección Héroe --- */}
            <section className="hero-section">
                <div className="hero-content">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        El Arte de Caminar con Estilo
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        Desde 1970, vistiendo los pasos de Chimalhuacán con calidad y confianza.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        <Link to="/catalogo/dama" className="btn btn-primary">Ver Colección Dama</Link>
                    </motion.div>
                </div>
            </section>

            {/* --- Sección de Marcas de Confianza --- */}
            <AnimatedSection className="brands-section">
                <h2 className="section-title">Nuestras Marcas de Prestigio</h2>
                <div className="brands-carousel">
                    {loading ? (
                        <p>Cargando marcas...</p>
                    ) : (
                        <Swiper
                            modules={[Autoplay]}
                            spaceBetween={50}
                            slidesPerView={2}
                            loop={true}
                            autoplay={{ delay: 2500, disableOnInteraction: false }}
                            breakpoints={{
                                640: { slidesPerView: 3 },
                                768: { slidesPerView: 4 },
                                1024: { slidesPerView: 6 },
                            }}
                        >
                            {brands.map(brand => (
                                <SwiperSlide key={brand.id} className="brand-logo">
                                    <img src={brand.logo_url} alt={`Logo de ${brand.name}`} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>
            </AnimatedSection>
            
            {/* --- Secciones de Productos Destacados por Categoría --- */}
            {loading ? (
                <AnimatedSection className="popular-products-section">
                    <div className="category-header">
                        <h2 className="section-title">Nuestros Destacados</h2>
                    </div>
                    <div className="product-grid">
                        {[...Array(4)].map((_, i) => <SkeletonProductCard key={i} />)}
                    </div>
                </AnimatedSection>
            ) : (
                Object.entries(popularProducts).map(([category, products]) => (
                    <AnimatedSection key={category} className="popular-products-section">
                        <div className="category-header">
                            <h2 className="section-title">Destacados de {category.charAt(0).toUpperCase() + category.slice(1)}</h2>
                            <Link to={`/catalogo/${category}`} className="see-all-link">
                                Ver Todo <FiArrowRight />
                            </Link>
                        </div>
                        <Swiper 
                            modules={[Navigation]} 
                            spaceBetween={30} 
                            slidesPerView={'auto'} 
                            navigation 
                            className="product-swiper"
                            breakpoints={{
                                320: { slidesPerView: 1.2, spaceBetween: 15 },
                                480: { slidesPerView: 2.2, spaceBetween: 20 },
                                768: { slidesPerView: 3, spaceBetween: 30 },
                                1024: { slidesPerView: 4, spaceBetween: 30 },
                            }}
                        >
                            {products.map(product => (
                                <SwiperSlide key={product.id}><ProductCard product={product}/></SwiperSlide>
                            ))}
                        </Swiper>
                    </AnimatedSection>
                ))
            )}

            {/* --- Sección Sobre Nosotros (Historia y Confianza) --- */}
            <AnimatedSection className="about-us-section">
                <div className="about-us-content">
                    <div className="about-us-text">
                        <span className="subtitle">Nuestra Historia</span>
                        <h2>Más de 50 Años de Tradición Familiar</h2>
                        <p>Fundada en 1970, Zapatería La Elegancia nació con la misión de ofrecer calzado duradero y de calidad a las familias de Chimalhuacán. Hoy, mantenemos ese legado, combinando la artesanía tradicional con las tendencias actuales para ofrecerte solo lo mejor.</p>
                        <Link to="/nosotros" className="btn btn-secondary">Conoce más de nosotros</Link>
                    </div>
                    <div className="about-us-image">
                        <img src="https://placehold.co/600x700/2c2a29/f8f5f2?text=Imagen+Taller" alt="Interior de la zapatería o taller artesanal" />
                    </div>
                </div>
            </AnimatedSection>

        </div>
    );
};

export default HomePage;
