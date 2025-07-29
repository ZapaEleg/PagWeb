import React from 'react';
import { NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // <-- Importar el hook
import { FiShoppingCart } from 'react-icons/fi';
import './Header.css';

const Header = () => {
    const { totalItems } = useCart(); // <-- Obtener el total de artículos

    return (
        <header className="site-header">
            <div className="header-container">
                <NavLink to="/" className="logo">ZapaEleg</NavLink>
                <nav className="main-nav">
                    <NavLink to="/catalogo/dama">Dama</NavLink>
                    <NavLink to="/catalogo/caballero">Caballero</NavLink>
                    <NavLink to="/catalogo/niña">Niña</NavLink>
                    <NavLink to="/catalogo/niño">Niño</NavLink>
                    <NavLink to="/ortopedia">Ortopedia</NavLink>
                </nav>
                <div className="header-actions">
                    <NavLink to="/carrito" className="cart-icon">
                        <FiShoppingCart />
                        {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
                    </NavLink>
                </div>
            </div>
        </header>
    );
};

export default Header;
