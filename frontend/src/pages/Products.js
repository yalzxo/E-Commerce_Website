import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Products = ({ products, addToCart, toggleWishlist, wishlist, isWishlist }) => {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');

  // Handle category filter from navigation
  useEffect(() => {
    if (location.state?.selectedCategory) {
      setSelectedCategory(location.state.selectedCategory);
    }
  }, [location.state]);

  // ... rest of the component remains the same
  // [Keep all the existing code from the first Products.js update]
  // Get unique categories
  const categories = useMemo(() => {
    const allCategories = ['All', ...new Set(products.map(product => product.category))];
    return allCategories.sort();
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // Sort products
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [products, selectedCategory, sortBy, searchTerm]);

  if (isWishlist) {
    return (
      <div className="products-page">
        <div className="products-section">
          <h2 className="section-title">Your Wishlist</h2>
          {wishlist.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-heart"></i>
              <h3>Your wishlist is empty</h3>
              <p>Start adding products you love!</p>
            </div>
          ) : (
            <div className="products-grid">
              {wishlist.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  addToCart={addToCart}
                  toggleWishlist={toggleWishlist}
                  isInWishlist={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-section">
        <h2 className="section-title">All Products</h2>
        
        {/* Filters and Search */}
        <div className="products-filters">
          <div className="filter-group">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="filter-group">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {/* Category Filter */}
        <div className="category-filters">
          <div className="category-tabs">
            {categories.map(category => (
              <button
                key={category}
                className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
                {category !== 'All' && (
                  <span className="category-count">
                    ({products.filter(p => p.category === category).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="results-info">
          <p>
            Showing {filteredProducts.length} of {products.length} products
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-search"></i>
            <h3>No products found</h3>
            <p>Try adjusting your filters or search term</p>
            <button 
              onClick={() => {
                setSelectedCategory('All');
                setSearchTerm('');
              }}
              className="btn btn-primary"
            >
              Show All Products
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => (
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
      </div>
    </div>
  );
};

export default Products;