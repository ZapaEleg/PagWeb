import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiLock, FiLogIn } from 'react-icons/fi';
import './LoginPage.css';

const LoginPage = () => {
    return (
        <div className="login-page-container">
            <motion.div 
                className="login-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <div className="login-header">
                    <Link to="/" className="login-logo">
                        {/* Idealmente, aquí iría una versión simplificada o monocromática del logo */}
                        <img src="/favicon.svg" alt="Logo La Elegancia" />
                    </Link>
                    <h2>Bienvenido de Nuevo</h2>
                    <p>Inicia sesión para una experiencia de compra más rápida.</p>
                </div>
                
                <form className="login-form">
                    <div className="input-group">
                        <FiUser />
                        <input type="email" placeholder="Correo Electrónico" required />
                    </div>
                    <div className="input-group">
                        <FiLock />
                        <input type="password" placeholder="Contraseña" required />
                    </div>
                    <div className="login-options">
                        <label>
                            <input type="checkbox" />
                            Recuérdame
                        </label>
                        <a href="#">¿Olvidaste tu contraseña?</a>
                    </div>
                    <button type="submit" className="btn btn-primary login-button">
                        <FiLogIn />
                        Iniciar Sesión
                    </button>
                </form>

                <div className="login-footer">
                    <p>¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link></p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
