import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import { FiMapPin, FiInstagram, FiFacebook, FiX, FiArrowRight } from 'react-icons/fi';
import { FaTiktok } from 'react-icons/fa'; // <-- CORRECCIÓN: Se añade la importación que faltaba
import ProductCard from '../components/ProductCard';
import './HomePage.css';

// Componente para animaciones de scroll
const AnimatedSection = ({ children }) => (
    <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
    >
        {children}
    </motion.section>
);

const HomePage = () => {
    const [brands, setBrands] = useState([]);
    const [popularProducts, setPopularProducts] = useState({});
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [brandProducts, setBrandProducts] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            const [brandsRes, popularRes] = await Promise.all([
                supabase.from('brands').select('*').not('logo_url', 'is', null),
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
        };
        fetchData();
    }, []);

    const handleBrandClick = async (brand) => {
        setSelectedBrand(brand);
        const { data } = await supabase.from('products').select(`*, brands(name), variants(price)`).eq('brand_id', brand.id).limit(20);
        const formatted = data.map(p => ({ ...p, price: p.variants?.[0]?.price || 0, brandName: p.brands.name }));
        setBrandProducts(formatted);
    };
    
    return (
        <div className="homepage-final">
            {/* El header ya no está aquí, se renderiza desde Layout.jsx */}
            
            <AnimatedSection>
                <div className="brands-section-reimagined">
                    <h2 className="section-title">Nuestras Marcas de Prestigio</h2>
                    <div className="brands-grid">
                        {brands.map(brand => (
                            <motion.div key={brand.id} className="brand-logo-card" onClick={() => handleBrandClick(brand)} whileHover={{scale: 1.1, boxShadow: "0 10px 20px rgba(0,0,0,0.1)"}}>
                                <img src={brand.logo_url} alt={brand.name}/>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </AnimatedSection>

            <AnimatePresence>
                {selectedBrand && (
                    <motion.div className="brand-modal-backdrop-reimagined" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                        <motion.div className="brand-modal-content-reimagined" initial={{scale:0.9, opacity: 0}} animate={{scale:1, opacity: 1}} exit={{scale:0.9, opacity: 0}} transition={{duration: 0.3}}>
                            <button onClick={() => setSelectedBrand(null)} className="close-modal-btn-reimagined"><FiX/></button>
                            <img src={selectedBrand.logo_url} alt={selectedBrand.name} className="modal-brand-logo-reimagined"/>
                            <div className="modal-product-grid-reimagined">
                                {brandProducts.length > 0 ? brandProducts.map(p => <ProductCard key={p.id} product={p}/>) : <p>No hay productos para esta marca.</p>}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatedSection>
                <section className="about-us-reimagined">
                    <h2>El Arte de Caminar con Estilo y Bienestar</h2>
                    <p>Desde 1970, somos más que una zapatería: somos artesanos de la confianza...</p>
                </section>
            </AnimatedSection>

            {Object.keys(popularProducts).length > 0 ? Object.entries(popularProducts).map(([category, products]) => (
                <AnimatedSection key={category}>
                    <section className="popular-products-category">
                        <div className="category-header">
                            <h2>Destacados de {category.charAt(0).toUpperCase() + category.slice(1)}</h2>
                            <Link to={`/catalogo/${category}`} className="see-all-link">Ver Todos <FiArrowRight/></Link>
                        </div>
                        <Swiper modules={[Navigation]} spaceBetween={30} slidesPerView={'auto'} navigation className="product-swiper">
                            {products.map(product => (
                                <SwiperSlide key={product.id}><ProductCard product={product}/></SwiperSlide>
                            ))}
                        </Swiper>
                    </section>
                </AnimatedSection>
            )) : (
                <AnimatedSection>
                    <section className="popular-products-category">
                        <div className="category-header"><h2>Nuestros Destacados</h2></div>
                        <p style={{textAlign: 'center', color: 'var(--text-muted)'}}>Próximamente encontrarás aquí nuestra selección especial de productos.</p>
                    </section>
                </AnimatedSection>
            )}

            <AnimatedSection>
                <section className="location-reimagined">
                    <div className="location-content">
                        <h2>El Punto de Encuentro de la Elegancia</h2>
                        <p><FiMapPin/> Av. Felipe Berriozabal Manzana 6 Lote 10, Ebanistas, 56363 Chimalhuacán, Méx.</p>
                        <a href="https://maps.app.goo.gl/gbvvSbKSwQToe2J99?g_st=ipc" target="_blank" rel="noopener noreferrer" className="map-cta">Obtener Direcciones</a>
                    </div>
                    <div className="map-embed-container">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.793739054718!2d-98.96633742575978!3d19.4213881404117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1e20436150a23%3A0x955210452395d85c!2sZapateria%20La%20Elegancia!5e0!3m2!1ses-419!2smx!4v1722374474149!5m2!1ses-419!2smx"
                            width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade">
                        </iframe>
                    </div>
                </section>
            </AnimatedSection>
            
            <AnimatedSection>
                <section className="social-proof-section">
                    <h2>Una Comunidad con Estilo Propio</h2>
                    <p>Sigue nuestro legado y descubre las últimas colecciones en nuestras redes.</p>
                    <div className="social-links-reimagined">
                        <a href="#"><FiFacebook/></a>
                        <a href="#"><FiInstagram/></a>
                        <a href="#"><FaTiktok/></a>
                    </div>
                </section>
            </AnimatedSection>
        </div>
    );
};

export default HomePage;
