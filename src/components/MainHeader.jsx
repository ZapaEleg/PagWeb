import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiSearch, FiUser, FiX } from 'react-icons/fi';
import './MainHeader.css';

const MainHeader = ({ logoUrl }) => {
    const { totalItems } = useCart();
    const [isSearchOpen, setSearchOpen] = useState(false);

    const navVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.5 },
        },
    };

    const itemVariants = {
        hidden: { y: -30, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120 } },
    };

    return (
        <>
            <motion.header 
                className="main-header-final"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <NavLink to="/" className="header-logo-final">
                    <img src={logoUrl} alt="Zapatería La Elegancia" />
                </NavLink>
                <motion.nav className="header-nav-final" variants={navVariants} initial="hidden" animate="visible">
                    <motion.div variants={itemVariants}><NavLink to="/catalogo/dama">Dama</NavLink></motion.div>
                    <motion.div variants={itemVariants}><NavLink to="/catalogo/caballero">Caballero</NavLink></motion.div>
                    <motion.div variants={itemVariants}><NavLink to="/catalogo/niña">Niña</NavLink></motion.div>
                    <motion.div variants={itemVariants}><NavLink to="/catalogo/niño">Niño</NavLink></motion.div>
                    <motion.div variants={itemVariants}><NavLink to="/ortopedia">Ortopedia</NavLink></motion.div>
                    <motion.div variants={itemVariants}><NavLink to="/ofertas">Ofertas</NavLink></motion.div>
                </motion.nav>
                <div className="header-actions-final">
                    <button onClick={() => setSearchOpen(true)} className="action-icon"><FiSearch /></button>
                    <Link to="/login" className="action-icon"><FiUser /></Link>
                    <NavLink to="/carrito" className="header-cart-final">
                        <FiShoppingCart />
                        {totalItems > 0 && <span className="cart-count-final">{totalItems}</span>}
                    </NavLink>
                </div>
            </motion.header>

            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div 
                        className="search-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className="search-modal"
                            initial={{ y: -100 }}
                            animate={{ y: 0 }}
                            exit={{ y: -100 }}
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
