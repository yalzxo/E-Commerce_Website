import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Home = ({ products, addToCart, toggleWishlist, wishlist }) => {
  const navigate = useNavigate();
  const featuredProducts = products.slice(0, 8);
  const categories = [...new Set(products.map(p => p.category))].slice(0, 6);

  const handleShopByCategory = (category) => {
    navigate('/products', { state: { selectedCategory: category } });
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Discover Amazing Products</h1>
          <p>Shop the latest trends with fast delivery and exceptional customer service. Your perfect purchase is just a click away.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/products" className="btn btn-primary">
              <i className="fas fa-shopping-bag"></i>
              Shop All Products
            </Link>
            {/* Special Offers button removed */}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="products-section">
        <h2 className="section-title">Shop by Category</h2>
        <div className="categories-grid">
          {categories.map(category => (
            <div 
              key={category} 
              className="category-card"
              onClick={() => handleShopByCategory(category)}
            >
              <div className="category-icon">
                {getCategoryIcon(category)}
              </div>
              <h3>{category}</h3>
              <p>{products.filter(p => p.category === category).length} products</p>
              <button className="category-btn">
                Browse {category}
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          ))}
        </div>

        {/* Featured Products */}
        <h2 className="section-title">Featured Products</h2>
        {featuredProducts.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-box-open"></i>
            <h3>No products available</h3>
            <p>Check back later for amazing products!</p>
          </div>
        ) : (
          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                addToCart={addToCart}
                toggleWishlist={toggleWishlist}
                isInWishlist={wishlist.some(item => item._id === product._id)}
              />
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="cta-section">
          <h2>Ready to Transform Your Shopping Experience?</h2>
          <p>Join thousands of satisfied customers who shop with confidence</p>
          <Link to="/products" className="btn btn-cta">
            <i className="fas fa-rocket"></i>
            Start Shopping Now
          </Link>
        </div>
      </section>
    </div>
  );
};

// Helper function to get category icons
const getCategoryIcon = (category) => {
  const icons = {
    'Electronics': 'fas fa-laptop',
    'Clothing': 'fas fa-tshirt',
    'Home & Garden': 'fas fa-home',
    'Sports': 'fas fa-basketball-ball',
    'Books': 'fas fa-book',
    'Beauty': 'fas fa-spa',
    'Default': 'fas fa-box'
  };

  const iconClass = icons[category] || icons['Default'];
  return <i className={iconClass}></i>;
};

export default Home;