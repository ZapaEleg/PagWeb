import React from 'react';
import './PageLoader.css';

const PageLoader = () => {
  return (
    <div className="page-loader-overlay">
      <div className="loader-spinner"></div>
    </div>
  );
};

export default PageLoader;
