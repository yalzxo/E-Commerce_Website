import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import ErrorBoundary from './components/ErrorBoundary';
import { getProducts } from './services/api';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  // Load user data and wishlist from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedWishlist = localStorage.getItem('wishlist');
    
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      
      // Load user-specific wishlist
      if (savedWishlist) {
        const allWishlists = JSON.parse(savedWishlist);
        const userWishlist = allWishlists[userData.id] || [];
        setWishlist(userWishlist);
      }
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setError('');
        const productsData = await getProducts();
        console.log('Products loaded:', productsData);
        setProducts(productsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please check if the backend server is running.');
        setLoading(false);
      }
    };

    fetchProducts();
    const interval = setInterval(fetchProducts, 10000);
    return () => clearInterval(interval);
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      const savedWishlist = localStorage.getItem('wishlist');
      const allWishlists = savedWishlist ? JSON.parse(savedWishlist) : {};
      
      allWishlists[user.id] = wishlist;
      localStorage.setItem('wishlist', JSON.stringify(allWishlists));
    }
  }, [wishlist, user]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Load user's wishlist
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      const allWishlists = JSON.parse(savedWishlist);
      const userWishlist = allWishlists[userData.id] || [];
      setWishlist(userWishlist);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    setWishlist([]);
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    // Don't remove wishlist from localStorage - keep it for next login
  };

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);
      if (existingItem) {
        return prevCart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const toggleWishlist = (product) => {
    setWishlist(prevWishlist => {
      const isInWishlist = prevWishlist.some(item => item._id === product._id);
      if (isInWishlist) {
        return prevWishlist.filter(item => item._id !== product._id);
      } else {
        return [...prevWishlist, product];
      }
    });
  };

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  if (loading) {
    return (
      <div className="loading">
        <i className="fas fa-spinner fa-spin"></i>
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading">
        <i className="fas fa-exclamation-triangle" style={{ color: 'var(--primary)', fontSize: '3rem', marginBottom: '1rem' }}></i>
        <h3>Unable to Load Products</h3>
        <p>{error}</p>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
          Make sure the backend server is running on http://localhost:5000
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-primary"
          style={{ marginTop: '1rem' }}
        >
          <i className="fas fa-redo"></i>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="customer-app">
          {user && (
            <Header 
              cartCount={cart.reduce((total, item) => total + item.quantity, 0)} 
              user={user}
              onLogout={handleLogout}
            />
          )}
          
          <main className="customer-main">
            <Routes>
              <Route path="/login" element={
                user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
              } />
              <Route path="/register" element={
                user ? <Navigate to="/" /> : <Register onLogin={handleLogin} />
              } />
              <Route path="/" element={
                <ProtectedRoute>
                  <Home 
                    products={products} 
                    addToCart={addToCart}
                    toggleWishlist={toggleWishlist}
                    wishlist={wishlist}
                  />
                </ProtectedRoute>
              } />
              <Route path="/products" element={
                <ProtectedRoute>
                  <Products 
                    products={products} 
                    addToCart={addToCart}
                    toggleWishlist={toggleWishlist}
                    wishlist={wishlist}
                  />
                </ProtectedRoute>
              } />
              <Route path="/cart" element={
                <ProtectedRoute>
                  <Cart 
                    cart={cart}
                    updateQuantity={updateQuantity}
                    removeFromCart={removeFromCart}
                  />
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Checkout 
                    cart={cart}
                    setCart={setCart}
                  />
                </ProtectedRoute>
              } />
              <Route path="/wishlist" element={
                <ProtectedRoute>
                  <Products 
                    products={wishlist} 
                    addToCart={addToCart}
                    toggleWishlist={toggleWishlist}
                    wishlist={wishlist}
                    isWishlist={true}
                  />
                </ProtectedRoute>
              } />
            </Routes>
          </main>

          {user && (
            <footer className="customer-footer">
              <div className="footer-content">
                <div className="footer-section">
                  <h3>ShopEasy</h3>
                  <p>Your one-stop shop for all your needs. Quality products, fast delivery, excellent service.</p>
                </div>
                <div className="footer-section">
                  <h3>Quick Links</h3>
                  <a href="/">Home</a><br />
                  <a href="/products">Products</a><br />
                  <a href="/cart">Shopping Cart</a>
                </div>
                <div className="footer-section">
                  <h3>Contact</h3>
                  <p>Email: support@shopeasy.com</p>
                  <p>Phone: (555) 123-4567</p>
                </div>
              </div>
              <div className="footer-bottom">
                <p>&copy; 2023 ShopEasy. All rights reserved.</p>
              </div>
            </footer>
          )}
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;