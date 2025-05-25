import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import api from '../utils/axios';
import toast from 'react-hot-toast';

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { currency, user } = useAppContext();

  const fetchMyorders = async () => {
    try {
      const response = await api.get('/carts/my-orders/');
      setMyOrders(response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setMyOrders([]);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await api.post(`/carts/cancel-order/${orderId}/`);
      if (response.status === 200) {
        toast.success('Order cancelled successfully');
        fetchMyorders();
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
      toast.error(err.response?.data?.error || 'Failed to cancel order');
    }
  };

  useEffect(() => {
    fetchMyorders();
  }, []);

  const getImageUrl = (imgObj) => {
    if (!imgObj || !imgObj.image) return '/placeholder.png';
    if (imgObj.image.startsWith('http')) return imgObj.image;
    return `http://localhost:8000${imgObj.image.startsWith('/') ? '' : '/media/'}${imgObj.image}`;
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-2 text-sm text-gray-600">Track and manage your orders</p>
        </div>

        {myOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by placing your first order.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {myOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200"
              >
                {/* Order Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                      <p className="text-sm text-gray-500">
                        Placed on {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      {order.status === 'Pending' && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Shipping Information */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Shipping Information</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Address:</span>{' '}
                          {order.address ? (
                            `${order.address.street}, ${order.address.city}, ${order.address.province}, ${order.address.country}`
                          ) : (
                            'Address not available'
                          )}
                        </p>
                        {order.address?.phone && (
                          <p>
                            <span className="font-medium">Phone:</span> {order.address.phone}
                          </p>
                        )}
                        <p>
                          <span className="font-medium">Payment Method:</span> {order.payment_method}
                        </p>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Order Summary</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Total Items:</span> {order.items_count}
                        </p>
                        <p>
                          <span className="font-medium">Total Amount:</span>{' '}
                          <span className="text-lg font-semibold text-gray-900">
                            {currency}{order.total_amount}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4 bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Order Items</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {order.items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center space-x-4 p-3 bg-white rounded-lg border border-gray-200"
                      >
                        <img
                          src={item.product.images?.[0] ? getImageUrl(item.product.images[0]) : '/placeholder.png'}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          <p className="text-sm text-gray-500">
                            Price: {currency}{item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
