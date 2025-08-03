import React from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '../components/AnimatedSection';
import { FiAward, FiHeart, FiUsers } from 'react-icons/fi';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <header className="about-hero">
        <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            Nuestra Historia, Tu Confianza
        </motion.h1>
        <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-subtitle"
        >
            Más de medio siglo vistiendo los pasos de nuestra comunidad.
        </motion.p>
      </header>

      <AnimatedSection className="timeline-section">
        <h2 className="section-title">Un Legado Familiar</h2>
        <div className="timeline">
            <div className="timeline-item">
                <div className="timeline-year">1970</div>
                <div className="timeline-content">
                    <h3>El Comienzo</h3>
                    <p>Don Manuel, fundador, abre una pequeña tienda en el corazón de Chimalhuacán con un sueño: ofrecer calzado resistente y de calidad que aguantara el ritmo de la vida diaria.</p>
                </div>
            </div>
            <div className="timeline-item">
                <div className="timeline-year">1995</div>
                <div className="timeline-content">
                    <h3>Segunda Generación</h3>
                    <p>La familia crece y con ella el negocio. Se introducen nuevas marcas y se amplía la oferta para incluir calzado de moda y ortopédico, respondiendo a las necesidades de nuestros clientes.</p>
                </div>
            </div>
            <div className="timeline-item">
                <div className="timeline-year">2024</div>
                <div className="timeline-content">
                    <h3>El Salto Digital</h3>
                    <p>Abrazamos el futuro lanzando nuestra tienda en línea, llevando la misma confianza y trato personalizado del mostrador a la pantalla de tus dispositivos, para estar más cerca de ti que nunca.</p>
                </div>
            </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="values-section">
        <h2 className="section-title">Nuestros Pilares</h2>
        <div className="values-grid">
            <div className="value-card">
                <FiAward size={40} className="value-icon"/>
                <h3>Calidad Garantizada</h3>
                <p>Seleccionamos cada par por su durabilidad, materiales y confección. Si no lo usaríamos nosotros, no lo vendemos.</p>
            </div>
            <div className="value-card">
                <FiHeart size={40} className="value-icon"/>
                <h3>Pasión por el Servicio</h3>
                <p>Para nosotros, no eres un cliente, eres un vecino. Tu satisfacción y comodidad son nuestra mayor recompensa.</p>
            </div>
            <div className="value-card">
                <FiUsers size={40} className="value-icon"/>
                <h3>Compromiso Local</h3>
                <p>Somos de Chimalhuacán y para Chimalhuacán. Apoyar a nuestra comunidad es parte fundamental de quiénes somos.</p>
            </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default AboutPage;
