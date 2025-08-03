import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram } from 'react-icons/fi';
import { FaTiktok, FaWhatsapp } from 'react-icons/fa';
import './MainFooter.css';

const MainFooter = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="main-footer">
            <div className="footer-content">
                <div className="footer-column about">
                    <h4 className="footer-logo">La Elegancia</h4>
                    <p>Desde 1970, ofreciendo calidad y estilo en cada paso. Somos una tradición familiar dedicada al bienestar y la confianza de nuestros clientes en Chimalhuacán.</p>
                </div>
                <div className="footer-column links">
                    <h4>Navegación</h4>
                    <ul>
                        <li><Link to="/nosotros">Nuestra Historia</Link></li>
                        <li><Link to="/catalogo/dama">Dama</Link></li>
                        <li><Link to="/catalogo/caballero">Caballero</Link></li>
                        <li><Link to="/ofertas">Ofertas</Link></li>
                        <li><Link to="/#location">Nuestra Tienda</Link></li>
                    </ul>
                </div>
                <div className="footer-column contact">
                    <h4>Contacto</h4>
                    <p>Av. Felipe Berriozabal Mza. 6 Lt. 10, Ebanistas, 56363 Chimalhuacán, Méx.</p>
                    <p>Email: <a href="mailto:contacto@zapateria-elegancia.com">contacto@zapateria-elegancia.com</a></p>
                    <p>WhatsApp: <a href="https://wa.me/525512345678" target="_blank" rel="noopener noreferrer">+52 55 1234 5678</a></p>
                </div>
                <div className="footer-column social">
                    <h4>Síguenos</h4>
                    <div className="social-icons">
                        <a href="#" aria-label="Facebook"><FiFacebook /></a>
                        <a href="#" aria-label="Instagram"><FiInstagram /></a>
                        <a href="#" aria-label="TikTok"><FaTiktok /></a>
                        <a href="https://wa.me/525512345678" aria-label="WhatsApp"><FaWhatsapp /></a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {currentYear} Zapatería La Elegancia. Todos los derechos reservados.</p>
                <div className="footer-bottom-links">
                    <Link to="/privacidad">Política de Privacidad</Link>
                    <Link to="/terminos">Términos de Servicio</Link>
                </div>
            </div>
        </footer>
    );
};

export default MainFooter;
