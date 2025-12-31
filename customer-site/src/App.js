import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Login from './pages/Login';
import ErrorBoundary from './components/ErrorBoundary';
import { getProducts, getOrders } from './services/api';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seller, setSeller] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check if seller is logged in on app start
  useEffect(() => {
    const savedSeller = localStorage.getItem('seller');
    if (savedSeller) {
      setSeller(JSON.parse(savedSeller));
    }
    setCheckingAuth(false);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, ordersData] = await Promise.all([
          getProducts(),
          getOrders()
        ]);
        setProducts(productsData);
        setOrders(ordersData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    if (seller) {
      fetchData();
    }
  }, [seller]);

  const handleLogin = (sellerData) => {
    setSeller(sellerData);
    localStorage.setItem('seller', JSON.stringify(sellerData));
  };

  const handleLogout = () => {
    setSeller(null);
    setProducts([]);
    setOrders([]);
    localStorage.removeItem('seller');
  };

  // Show loading while checking authentication
  if (checkingAuth) {
    return (
      <div className="loading">
        <i className="fas fa-spinner fa-spin"></i>
        <span>Checking authentication...</span>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        {!seller ? (
          <Login onLogin={handleLogin} />
        ) : (
          <div className="seller-app">
            <Sidebar />
            <Header seller={seller} onLogout={handleLogout} />
            <main className="seller-main">
              {loading ? (
                <div className="loading">
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Loading Dashboard...</span>
                </div>
              ) : (
                <Routes>
                  <Route path="/" element={
                    <Dashboard 
                      products={products}
                      orders={orders}
                    />
                  } />
                  <Route path="/products" element={
                    <Products 
                      products={products}
                      setProducts={setProducts}
                    />
                  } />
                  <Route path="/orders" element={
                    <Orders 
                      orders={orders}
                      setOrders={setOrders}
                    />
                  } />
                  <Route path="/login" element={<Navigate to="/" />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              )}
            </main>
          </div>
        )}
      </Router>
    </ErrorBoundary>
  );
}

export default App;