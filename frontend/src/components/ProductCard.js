import React from 'react';

const ProductCard = ({ product, addToCart, toggleWishlist, isInWishlist }) => {
  return (
    <div className="product-card">
      <div style={{ overflow: 'hidden' }}>
        <img src={product.image} alt={product.name} className="product-image" />
      </div>
      
      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <h3 className="product-title">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        
        <div className="product-footer">
          <div className="product-price">${product.price.toFixed(2)}</div>
          <div className="product-actions">
            <button 
              className={`action-btn like-btn ${isInWishlist ? 'liked' : ''}`}
              onClick={() => toggleWishlist(product)}
              aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <i className="fas fa-heart"></i>
            </button>
            <button 
              className="action-btn"
              onClick={() => addToCart(product)}
              aria-label="Add to cart"
            >
              <i className="fas fa-shopping-cart"></i>
            </button>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--gray-light)',
          fontSize: '0.8rem',
          color: 'var(--gray)'
        }}>
          <span>
            <i className="fas fa-tag"></i> {product.category}
          </span>
          <span>
            <i className="fas fa-shipping-fast"></i> Free shipping
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;