import React from 'react';
import './SkeletonProductCard.css';

const SkeletonProductCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-image"></div>
      <div className="skeleton-card-info">
        <div className="skeleton skeleton-text skeleton-brand"></div>
        <div className="skeleton skeleton-text skeleton-model"></div>
        <div className="skeleton skeleton-text skeleton-price"></div>
      </div>
    </div>
  );
};

export default SkeletonProductCard;
