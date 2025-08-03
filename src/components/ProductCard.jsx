import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import './ProductCard.css';

const cardVariants = {
  rest: { scale: 1, boxShadow: "var(--shadow-sm)" },
  hover: { scale: 1.03, boxShadow: "var(--shadow-lg)", transition: { duration: 0.3 } }
};

const getBadgeInfo = (product) => {
  if (product.tags?.includes('oferta')) {
    return { text: 'Oferta', className: 'badge-offer' };
  }
  if (product.tags?.includes('nuevo')) {
    return { text: 'Nuevo', className: 'badge-new' };
  }
  if (product.tags?.includes('mas_vendido')) {
    return { text: 'Más Vendido', className: 'badge-popular' };
  }
  return null;
};

const ProductCard = ({ product }) => {
  if (!product || !product.id) {
    return null;
  }

  const { id, model, image_url, price, brandName } = product;
  const badge = getBadgeInfo(product);

  return (
    <motion.div variants={cardVariants} initial="rest" whileHover="hover">
      <Link to={`/producto/${id}`} className="product-card-link">
        <article className="product-card">
          {badge && <div className={`product-badge ${badge.className}`}>{badge.text}</div>}
          <div className="product-card-image-container">
            {image_url ? (
              <img 
                src={image_url} 
                alt={`Zapato ${brandName} ${model}`} 
                className="product-card-image"
                loading="lazy" // Carga diferida de imágenes
              />
            ) : (
              <div className="product-card-image-placeholder">
                <span>Sin Imagen</span>
              </div>
            )}
          </div>
          <div className="product-card-info">
            <span className="product-card-brand">{brandName || 'Marca'}</span>
            <h3 className="product-card-model">{model || 'Modelo no disponible'}</h3>
            <p className="product-card-price">
              {price ? `$${price.toFixed(2)}` : 'Consultar precio'}
            </p>
          </div>
        </article>
      </Link>
    </motion.div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    model: PropTypes.string,
    image_url: PropTypes.string,
    price: PropTypes.number,
    brandName: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default ProductCard;
