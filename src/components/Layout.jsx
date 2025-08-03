import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import MainHeader from './MainHeader';
import MainFooter from './MainFooter'; // Nuevo componente Footer
import Chatbot from './Chatbot';
import { FaWhatsapp } from 'react-icons/fa';

const pageVariants = {
    initial: {
        opacity: 0,
        y: 20
    },
    in: {
        opacity: 1,
        y: 0
    },
    out: {
        opacity: 0,
        y: -20
    }
};

const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
};

const Layout = () => {
    const [logoUrl, setLogoUrl] = useState('');
    const { pathname } = useLocation();

    // Sube al inicio de la página en cada cambio de ruta
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        const fetchConfig = async () => {
            // Se asume que tienes una tabla `site_config` con `key` y `value`
            const { data } = await supabase
                .from('site_config')
                .select('value')
                .eq('key', 'main_logo_url')
                .single();
            
            if (data) {
                setLogoUrl(data.value);
            } else {
                // Fallback por si no se encuentra el logo en la BD
                setLogoUrl('/logo-elegancia.svg'); // Debes crear este logo en /public
            }
        };
        fetchConfig();
    }, []);

    return (
        <div className="app-container">
            <MainHeader logoUrl={logoUrl} />
            
            <main>
                {/* El componente Outlet renderiza la página actual que coincide con la ruta */}
                <motion.div
                    key={pathname}
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                >
                    <Outlet />
                </motion.div>
            </main>

            <MainFooter />

            {/* Botones Flotantes de Acción */}
            <a 
              href="https://wa.me/525636933820?text=Hola!%20Me%20gustaría%20pedir%20informes." // Reemplazar con tu número y mensaje
              target="_blank" 
              rel="noopener noreferrer" 
              className="floating-btn whatsapp-btn"
              aria-label="Contactar por WhatsApp"
            >
              <FaWhatsapp/>
            </a>
            <div className="chatbot-btn-container">
                <Chatbot />
            </div>
        </div>
    );
};

export default Layout;
