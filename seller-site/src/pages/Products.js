import React, { useState } from 'react';
import { addProduct, updateProduct, deleteProduct } from '../services/api';

const Products = ({ products, setProducts }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '',
    image: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError('');

    // Validate form data
    if (!formData.name || !formData.price || !formData.description || 
        !formData.category || !formData.stock || !formData.image) {
      setError('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      description: formData.description,
      category: formData.category,
      image: formData.image,
      sellerId: 'seller1'
    };

    try {
      let newProduct;
      if (editingProduct) {
        newProduct = await updateProduct(editingProduct._id, productData);
        setProducts(prev => prev.map(p => p._id === editingProduct._id ? newProduct : p));
      } else {
        newProduct = await addProduct(productData);
        setProducts(prev => [...prev, newProduct]);
      }
      
      setShowModal(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        description: '',
        category: '',
        stock: '',
        image: ''
      });
    } catch (error) {
      console.error('Error saving product:', error);
      setError('Failed to save product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      category: product.category,
      stock: product.stock.toString(),
      image: product.image
    });
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        setProducts(prev => prev.filter(p => p._id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      category: '',
      stock: '',
      image: ''
    });
    setEditingProduct(null);
    setError('');
  };

  return (
    <div className="seller-products">
      <div className="section-header">
        <h2>Product Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <i className="fas fa-plus"></i>
          Add New Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-box-open"></i>
          <h3>No products yet</h3>
          <p>Add your first product to get started!</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td>
                    <img src={product.image} alt={product.name} className="product-thumb" />
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: '600' }}>{product.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>
                        {product.description.substring(0, 50)}...
                      </div>
                    </div>
                  </td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${product.stock < 10 ? 'status-pending' : 'status-delivered'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td>{product.category}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="btn btn-sm"
                        onClick={() => handleEdit(product)}
                        style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(product._id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {error && (
              <div style={{
                background: 'var(--danger-light)',
                color: 'var(--danger)',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  disabled={isSubmitting}
                  placeholder="Enter product name"
                />
              </div>

              <div className="form-group">
                <label>Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                  disabled={isSubmitting}
                  placeholder="0.00"
                />
              </div>


              <div className="form-group">
                <label>Category *</label>
                <select
                  className="form-control"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Home & Garden">Home & Garden</option>
                  <option value="Sports">Sports</option>
                  <option value="Books">Books</option>
                  <option value="Beauty">Beauty</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  disabled={isSubmitting}
                  placeholder="Enter product description"
                />
              </div>

              <div className="form-group">
                <label>Image URL *</label>
                <input
                  type="url"
                  className="form-control"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  required
                  disabled={isSubmitting}
                  placeholder="https://example.com/image.jpg"
                />
                <small style={{ color: 'var(--gray)', marginTop: '0.5rem', display: 'block' }}>
                  Enter a valid image URL
                </small>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  disabled={isSubmitting}
                  style={{ background: 'var(--gray-light)' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i>
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;