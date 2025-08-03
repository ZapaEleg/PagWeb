import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiSearch, FiUser, FiX, FiMenu } from 'react-icons/fi';
import './MainHeader.css';

const MainHeader = ({ logoUrl }) => {
    const { totalItems } = useCart();
    const [isSearchOpen, setSearchOpen] = useState(false);
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Detectar scroll para cambiar el fondo del header
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItemVariants = {
        hidden: { y: -20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <>
            <header className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
                <Link to="/" className="header-logo" aria-label="Volver al inicio">
                    {logoUrl && <img src={logoUrl} alt="Logo Zapatería La Elegancia" />}
                </Link>

                {/* Navegación para Desktop */}
                <nav className="header-nav-desktop">
                    <NavLink to="/catalogo/dama">Dama</NavLink>
                    <NavLink to="/catalogo/caballero">Caballero</NavLink>
                    <NavLink to="/catalogo/niña">Niña</NavLink>
                    <NavLink to="/catalogo/niño">Niño</NavLink>
                    <NavLink to="/ortopedia">Ortopedia</NavLink>
                    <NavLink to="/ofertas" className="ofertas-link">Ofertas</NavLink>
                </nav>

                {/* Acciones del Header */}
                <div className="header-actions">
                    <button onClick={() => setSearchOpen(true)} className="action-icon" aria-label="Buscar"><FiSearch /></button>
                    <Link to="/login" className="action-icon" aria-label="Iniciar Sesión"><FiUser /></Link>
                    <NavLink to="/carrito" className="header-cart" aria-label="Ver carrito de compras">
                        <FiShoppingCart />
                        <AnimatePresence>
                            {totalItems > 0 && (
                                <motion.span 
                                    className="cart-count"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                >
                                    {totalItems}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </NavLink>
                    <button onClick={() => setMenuOpen(true)} className="action-icon menu-toggle" aria-label="Abrir menú"><FiMenu /></button>
                </div>
            </header>

            {/* Navegación para Móvil (Overlay) */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className="mobile-menu-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className="mobile-menu-content"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        >
                            <button onClick={() => setMenuOpen(false)} className="close-menu-btn"><FiX /></button>
                            <nav className="header-nav-mobile">
                                <motion.div variants={navItemVariants}><NavLink to="/catalogo/dama" onClick={() => setMenuOpen(false)}>Dama</NavLink></motion.div>
                                <motion.div variants={navItemVariants}><NavLink to="/catalogo/caballero" onClick={() => setMenuOpen(false)}>Caballero</NavLink></motion.div>
                                <motion.div variants={navItemVariants}><NavLink to="/catalogo/niña" onClick={() => setMenuOpen(false)}>Niña</NavLink></motion.div>
                                <motion.div variants={navItemVariants}><NavLink to="/catalogo/niño" onClick={() => setMenuOpen(false)}>Niño</NavLink></motion.div>
                                <motion.div variants={navItemVariants}><NavLink to="/ortopedia" onClick={() => setMenuOpen(false)}>Ortopedia</NavLink></motion.div>
                                <motion.div variants={navItemVariants}><NavLink to="/ofertas" className="ofertas-link" onClick={() => setMenuOpen(false)}>Ofertas</NavLink></motion.div>
                                <motion.div variants={navItemVariants}><NavLink to="/nosotros" onClick={() => setMenuOpen(false)}>Nuestra Historia</NavLink></motion.div>
                            </nav>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal de Búsqueda */}
            <AnimatePresence>
                {isSearchOpen && (
                     <motion.div 
                        className="search-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSearchOpen(false)}
                    >
                        <motion.div 
                            className="search-modal"
                            initial={{ y: -100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -100, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <input type="text" placeholder="Busca por modelo, marca o estilo..." autoFocus />
                            <div className="search-suggestions">
                                <span>Sugerencias:</span>
                                <button>Zapatos de Piel</button>
                                <button>Botas</button>
                                <button>Tenis Casuales</button>
                            </div>
                        </motion.div>
                        <button onClick={() => setSearchOpen(false)} className="close-search-btn"><FiX/></button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default MainHeader;
