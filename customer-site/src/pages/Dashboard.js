import React from 'react';

const Dashboard = ({ products, orders }) => {
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const completedOrders = orders.filter(order => order.status === 'delivered').length;
  const totalCustomers = new Set(orders.map(order => order.customerEmail)).size;

  const recentOrders = orders.slice(-5).reverse();
  const lowStockProducts = products.filter(p => p.stock < 10);

  return (
    <div className="dashboard">
      <div className="section-header">
        <div>
          <h1 className="section-title">Dashboard Overview</h1>
          <p style={{ color: 'var(--gray)', marginTop: '0.5rem' }}>
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = '/products'}
          >
            <i className="fas fa-plus"></i>
            Add Product
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-value">${totalRevenue.toFixed(2)}</div>
              <div className="stat-label">Total Revenue</div>
            </div>
            <div className="stat-icon primary">
              <i className="fas fa-dollar-sign"></i>
            </div>
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--success)' }}>
            <i className="fas fa-arrow-up"></i> 12% from last month
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-header">
            <div>
              <div className="stat-value">{pendingOrders}</div>
              <div className="stat-label">Pending Orders</div>
            </div>
            <div className="stat-icon warning">
              <i className="fas fa-clock"></i>
            </div>
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--warning)' }}>
            Needs attention
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-header">
            <div>
              <div className="stat-value">{products.length}</div>
              <div className="stat-label">Total Products</div>
            </div>
            <div className="stat-icon success">
              <i className="fas fa-box"></i>
            </div>
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--success)' }}>
            <i className="fas fa-arrow-up"></i> 5 new this month
          </div>
        </div>

        <div className="stat-card danger">
          <div className="stat-header">
            <div>
              <div className="stat-value">{totalCustomers}</div>
              <div className="stat-label">Total Customers</div>
            </div>
            <div className="stat-icon danger">
              <i className="fas fa-users"></i>
            </div>
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--success)' }}>
            <i className="fas fa-arrow-up"></i> 8% growth
          </div>
        </div>
      </div>

      {/* Charts and Tables Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '2rem' }}>
        {/* Recent Orders */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Recent Orders</h3>
            <a href="/orders" style={{ color: 'var(--primary)', textDecoration: 'none' }}>View All</a>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order._id}>
                    <td>#{order._id.slice(-6)}</td>
                    <td>
                      <div>
                        <div style={{ fontWeight: '600' }}>{order.customerName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>{order.customerEmail}</div>
                      </div>
                    </td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>
                      <span className={`status-badge status-${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Low Stock Alert</h3>
          {lowStockProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray)' }}>
              <i className="fas fa-check-circle" style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--success)' }}></i>
              <p>All products have sufficient stock</p>
            </div>
          ) : (
            <div>
              {lowStockProducts.map(product => (
                <div key={product._id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  padding: '1rem 0',
                  borderBottom: '1px solid rgba(0,0,0,0.05)'
                }}>
                  <img src={product.image} alt={product.name} className="product-thumb" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600' }}>{product.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>Stock: {product.stock}</div>
                  </div>
                  <span className={`status-badge ${product.stock < 5 ? 'status-cancelled' : 'status-pending'}`}>
                    {product.stock < 5 ? 'Very Low' : 'Low'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;