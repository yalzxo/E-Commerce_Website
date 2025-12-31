import React, { useState } from 'react';

const Header = ({ seller, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    onLogout();
    setShowUserMenu(false);
  };

  return (
    <header className="seller-header">
      <div className="header-content">
        <h1 className="page-title">Dashboard</h1>
        <div className="header-actions">
          <div className="user-menu">
            <button 
              className="user-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <i className="fas fa-user-circle"></i>
              <span>{seller?.name}</span>
              <i className={`fas fa-chevron-${showUserMenu ? 'up' : 'down'}`}></i>
            </button>
            
            {showUserMenu && (
              <div className="user-dropdown">
                <div className="user-info">
                  <strong>{seller?.name}</strong>
                  <span>{seller?.email}</span>
                  <small>Seller Account</small>
                </div>
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
        </div>
      </div>
    </header>
  );
};

export default Header;