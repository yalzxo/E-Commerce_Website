import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ cartCount, user, onLogout }) => {
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    onLogout();
    setShowUserMenu(false);
  };

  return (
    <header className="customer-header">
      <div className="header-content">
        <Link to="/" className="logo">
          <i className="fas fa-shopping-bag"></i>
          ShopEasy
        </Link>
        
        <nav className="nav-main">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/products" 
            className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}
          >
            Products
          </Link>
          <Link 
            to="/wishlist" 
            className={`nav-link ${location.pathname === '/wishlist' ? 'active' : ''}`}
          >
            Wishlist
          </Link>
          
          <Link to="/cart" className="cart-link">
            <i className="fas fa-shopping-cart"></i>
            Cart
            <span className="cart-count">{cartCount}</span>
          </Link>
          
          <div className="user-menu">
            <button 
              className="user-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <i className="fas fa-user-circle"></i>
              <span>{user?.name}</span>
              <i className={`fas fa-chevron-${showUserMenu ? 'up' : 'down'}`}></i>
            </button>
            
            {showUserMenu && (
              <div className="user-dropdown">
                <div className="user-info">
                  <strong>{user?.name}</strong>
                  <span>{user?.email}</span>
                </div>
                <Link 
                  to="/profile" 
                  className="dropdown-item"
                  onClick={() => setShowUserMenu(false)}
                >
                  <i className="fas fa-user"></i>
                  My Profile
                </Link>
                <Link 
                  to="/orders" 
                  className="dropdown-item"
                  onClick={() => setShowUserMenu(false)}
                >
                  <i className="fas fa-shopping-bag"></i>
                  My Orders
                </Link>
                <button 
                  className="dropdown-item logout-btn"
                  onClick={handleLogout}
                >
                  <i className="fas fa-sign-out-alt"></i>
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;