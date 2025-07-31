import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import MainHeader from './MainHeader';
import Chatbot from './Chatbot';
import { FaWhatsapp } from 'react-icons/fa';
import { AnimatePresence } from 'framer-motion';

const Layout = () => {
    const [logoUrl, setLogoUrl] = useState('');

    useEffect(() => {
        const fetchLogo = async () => {
            const { data } = await supabase
                .from('site_config')
                .select('value')
                .eq('key', 'main_logo_url')
                .single();
            if (data) {
                setLogoUrl(data.value);
            }
        };
        fetchLogo();
    }, []);

    return (
        <div className="app-container">
            <AnimatePresence>
                {logoUrl && <MainHeader logoUrl={logoUrl} />}
            </AnimatePresence>
            
            <main>
                <Outlet /> {/* Aquí se renderizará el contenido de cada página */}
            </main>

            <footer className="main-footer">
                <p>Gracias por visitar Zapatería La Elegancia.</p>
            </footer>

            <a href="https://wa.me/..." className="floating-btn whatsapp-btn"><FaWhatsapp/></a>
            <div className="floating-btn chatbot-btn-container">
                <Chatbot />
            </div>
        </div>
    );
};

export default Layout;
