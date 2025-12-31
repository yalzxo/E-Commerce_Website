import React from 'react';
import { updateOrderStatus } from '../services/api';

const Orders = ({ orders, setOrders }) => {
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? updatedOrder : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div className="seller-orders">
      <h2>Order Management</h2>
      
      {orders.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-shopping-bag"></i>
          <h3>No orders yet</h3>
          <p>Orders will appear here when customers make purchases.</p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>#{order._id.slice(-6)}</td>
                <td>
                  <div>
                    <strong>{order.customerName}</strong>
                    <br />
                    <small>{order.customerEmail}</small>
                  </div>
                </td>
                <td>
                  {order.items.map(item => (
                    <div key={item.productId}>
                      {item.quantity}x {item.name}
                    </div>
                  ))}
                </td>
                <td>${order.total.toFixed(2)}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge status-${order.status}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    className="status-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;