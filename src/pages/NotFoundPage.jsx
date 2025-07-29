import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';

const NotFoundPage = () => {
    const pageStyle = {
        textAlign: 'center',
        padding: '50px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
    };

    const linkStyle = {
        padding: '10px 20px',
        backgroundColor: 'var(--primary-accent)',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '6px',
        fontWeight: '600'
    };

    return (
        <div style={pageStyle}>
            <FiAlertTriangle size={48} color="#E67E22" />
            <h1>Error 404</h1>
            <p style={{ color: 'var(--text-secondary)' }}>
                La página que buscas no existe o ha sido movida.
            </p>
            <Link to="/" style={linkStyle}>
                Volver a la Página de Inicio
            </Link>
        </div>
    );
};

export default NotFoundPage;
