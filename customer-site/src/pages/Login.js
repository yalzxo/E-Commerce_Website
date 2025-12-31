import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Single seller password - you can change this to whatever you want
  const SELLER_PASSWORD = 'myshop123'; // Change this to your preferred password

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!password) {
      setError('Please enter the password');
      setIsLoading(false);
      return;
    }

    try {
      if (password === SELLER_PASSWORD) {
        // Seller authenticated successfully
        const sellerData = {
          id: 1,
          name: 'Store Owner',
          email: 'owner@myshop.com',
          type: 'seller'
        };
        
        localStorage.setItem('seller', JSON.stringify(sellerData));
        
        if (onLogin) {
          onLogin(sellerData);
        }
        
        navigate('/');
      } else {
        setError('Invalid password. Please try again.');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo">
              <i className="fas fa-store"></i>
              My Store Dashboard
            </div>
            <h2>Store Access</h2>
            <p>Enter your store password to continue</p>
          </div>

          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="password">Store Password</label>
              <div className="input-wrapper">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter store password"
                  required
                  autoFocus
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="login-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Accessing Store...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  Enter Dashboard
                </>
              )}
            </button>
          </form>

          <div className="login-help">
            <p>
              <i className="fas fa-info-circle"></i>
              This is your personal store dashboard. Keep your password secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;