import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './ProductCard.css';

/**
 * Componente reutilizable para mostrar un producto en una tarjeta.
 * Se utiliza en la página de inicio para las secciones de "Populares" y "Ofertas".
 * @param {object} product - El objeto del producto a mostrar.
 * @param {string} badgeText - Texto opcional para una insignia (ej. "Oferta").
 */
const ProductCard = ({ product, badgeText }) => {
  // Aseguramos que el producto y sus propiedades existan para evitar errores.
  if (!product || !product.id) {
    return null; // No renderizar nada si el producto es inválido.
  }

  const { id, model, image_url, price, brandName } = product;

  return (
    <Link to={`/producto/${id}`} className="product-card-link">
      <article className="product-card">
        {badgeText && <div className="product-badge">{badgeText}</div>}
        <div className="product-card-image-container">
          {image_url ? (
            <img src={image_url} alt={`Zapato ${brandName} ${model}`} className="product-card-image" />
          ) : (
            <div className="product-card-image-placeholder">
              <span>Sin Imagen</span>
            </div>
          )}
        </div>
        <div className="product-card-info">
          <span className="product-card-brand">{brandName || 'Marca'}</span>
          <h3 className="product-card-model">{model || 'Modelo no disponible'}</h3>
          <p className="product-card-price">${price ? price.toFixed(2) : '0.00'}</p>
        </div>
      </article>
    </Link>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    model: PropTypes.string,
    image_url: PropTypes.string,
    price: PropTypes.number,
    brandName: PropTypes.string,
  }).isRequired,
  badgeText: PropTypes.string,
};

export default ProductCard;
