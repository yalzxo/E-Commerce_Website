import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      // Check if user exists in localStorage (registered users)
      const savedUsers = localStorage.getItem('registeredUsers');
      const registeredUsers = savedUsers ? JSON.parse(savedUsers) : [];
      
      const user = registeredUsers.find(
        u => u.email === formData.email && u.password === formData.password
      );

      if (!user) {
        setError('No account found with these credentials. Please register first.');
        setIsLoading(false);
        return;
      }

      // User authenticated successfully
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        type: 'customer'
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      if (onLogin) {
        onLogin(userData);
      }
      
      navigate('/');
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <Link to="/" className="logo">
              <i className="fas fa-shopping-bag"></i>
              ShopEasy
            </Link>
            <h2>Welcome Back</h2>
            <p>Sign in to your account to continue shopping</p>
          </div>

          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Remember me
              </label>
              <a href="#forgot" className="forgot-link">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              className="login-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Signing In...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>Don't have an account? <Link to="/register" className="signup-link">Sign up here</Link></p>
          </div>

          <div className="demo-note">
            <p><strong>Note:</strong> You must register first before you can login.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;