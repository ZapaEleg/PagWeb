import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { toast } from 'react-toastify';
import { useInView } from 'react-intersection-observer';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { FiChevronDown, FiMapPin, FiPhone, FiInstagram, FiFacebook } from 'react-icons/fi';
import { FaTiktok } from 'react-icons/fa';
import './HomePage.css';

// --- Componente Reutilizable para Efecto de Scroll ---
const FadeInSection = ({ children }) => {
    const { ref, inView } = useInView({
        triggerOnce: true, // La animación solo ocurre una vez
        threshold: 0.1, // Se activa cuando el 10% del elemento es visible
    });

    return (
        <section ref={ref} className={`fade-in-section ${inView ? 'is-visible' : ''}`}>
            {children}
        </section>
    );
};

// --- Componente para el Acordeón de FAQ ---
const FaqItem = ({ question, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="faq-item">
            <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
                <span>{question}</span>
                <FiChevronDown className={`faq-icon ${isOpen ? 'open' : ''}`} />
            </button>
            <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
                <div className="faq-answer-content">{children}</div>
            </div>
        </div>
    );
};

const HomePage = () => {
    const [brands, setBrands] = useState([]);
    const [logoUrl, setLogoUrl] = useState(''); // Estado para la URL del logo
    const storePosition = { lat: 19.4336, lng: -98.9655 }; // Coordenadas de la tienda

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener logos de marcas
                const { data: brandsData, error: brandsError } = await supabase.from('brands').select('name, logo_url').not('logo_url', 'is', null).order('name');
                if (brandsError) throw brandsError;
                setBrands(brandsData);

                // Obtener URL del logo principal
                const { data: logoData, error: logoError } = await supabase
                    .from('site_config')
                    .select('value')
                    .eq('key', 'main_logo_url')
                    .single();
                if (logoError) throw logoError;
                setLogoUrl(logoData.value);

            } catch (error) {
                toast.error("No se pudieron cargar los datos de la página.");
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="home-page">
            <section className="hero-section">
                <div className="hero-content">
                    {logoUrl ? 
                        <img src={logoUrl} alt="ZapaEleg Logo" className="hero-logo-image" /> :
                        <h1 className="hero-logo-text">ZapaEleg</h1>
                    }
                    <p className="hero-tagline">Calidad, Confort y Durabilidad a tus Pies.</p>
                    <Link to="/catalogo/dama" className="hero-cta-button">Descubre la Colección</Link>
                </div>
            </section>

            <FadeInSection>
                <div className="brands-section">
                    <div className="brands-carousel">
                        {brands.map((brand) => (
                            <div key={brand.name} className="brand-item"><img src={brand.logo_url} alt={brand.name} /></div>
                        ))}
                    </div>
                </div>
            </FadeInSection>

            <FadeInSection>
                <div className="about-section">
                    <div className="about-content">
                        <div className="about-text">
                            <h2>Nuestra Historia</h2>
                            <p>Desde 1970 en el corazón de Chimalhuacán, ZapaEleg es más que una zapatería: es la herencia de una familia dedicada a ofrecer no solo calzado, sino soluciones. Creemos en la calidad que perdura y en la atención que recuerda tu nombre. Bienvenido a casa.</p>
                        </div>
                        <div className="about-image"></div>
                    </div>
                </div>
            </FadeInSection>

            <FadeInSection>
                <div className="location-section">
                    <div className="location-map">
                        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                            <Map center={storePosition} zoom={17} mapId="zapaeleg-map-id">
                                <Marker position={storePosition} />
                            </Map>
                        </APIProvider>
                    </div>
                    <div className="location-info">
                        <h3>Encuéntranos</h3>
                        <p><FiMapPin /> Av. del Peñón Manzana 003, Xochiaca, 56340 Chimalhuacán, Méx.</p>
                        <p><strong>Horarios:</strong> Lunes a Sábado de 10:00 a 20:00 hrs</p>
                        <p><FiPhone /> 55-1234-5678</p>
                        <div className="social-links">
                            <a href="https://www.facebook.com/share/PWQgWyapxcK7hrSf/?mibextid=LQQJ4d" target="_blank" rel="noopener noreferrer" title="Facebook"><FiFacebook/></a>
                            <a href="https://www.instagram.com/laeleganciazapteria?igsh=MXd3a25lb3N0bzdqdA==" target="_blank" rel="noopener noreferrer" title="Instagram"><FiInstagram/></a>
                            <a href="https://www.tiktok.com/@laeleganciazapateria?_t=8okCYeZExzK&_r=1=" target="_blank" rel="noopener noreferrer" title="TikTok"><FaTiktok/></a>
                        </div>
                    </div>
                </div>
            </FadeInSection>

            <FadeInSection>
                <div className="faq-section">
                    <h2>Preguntas Frecuentes</h2>
                    <div className="faq-accordion">
                        <FaqItem question="¿Cómo puedo saber mi talla correcta?">
                            <p>Para encontrar tu talla perfecta, coloca una hoja de papel en el suelo, pisa sobre ella y marca el contorno de tu pie. Luego, mide la distancia en centímetros desde el talón hasta la punta del dedo más largo. ¡Esa medida es tu talla!</p>
                        </FaqItem>
                        <FaqItem question="¿Qué métodos de pago aceptan?">
                            <p>Aceptamos pagos seguros a través de transferencia bancaria (SPEI) y pagos en efectivo al recoger en tienda. Al finalizar tu pedido online, te proporcionaremos los datos necesarios.</p>
                        </FaqItem>
                        <FaqItem question="¿Cuáles son los costos y tiempos de envío?">
                            <p>Ofrecemos una tarifa fija para envíos locales en la zona. También puedes elegir recoger tu pedido en nuestra tienda física sin costo. El tiempo de entrega local es de 1 a 2 días hábiles.</p>
                        </FaqItem>
                    </div>
                </div>
            </FadeInSection>
        </div>
    );
};

export default HomePage;
