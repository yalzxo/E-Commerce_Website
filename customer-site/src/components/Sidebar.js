import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: 'fas fa-chart-pie', label: 'Dashboard' },
    { path: '/products', icon: 'fas fa-box', label: 'Products' },
    { path: '/orders', icon: 'fas fa-shopping-bag', label: 'Orders' },
  ];

  return (
    <aside className="seller-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <i className="fas fa-store"></i>
          <span>ShopEasy Seller</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;