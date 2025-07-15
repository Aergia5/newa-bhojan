import React from 'react';
import { X, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Order } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

const OrdersModal: React.FC<OrdersModalProps> = ({ isOpen, onClose, orders }) => {
  const { user } = useAuth();

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-500" size={16} />;
      case 'confirmed':
        return <CheckCircle className="text-blue-500" size={16} />;
      case 'preparing':
        return <Package className="text-orange-500" size={16} />;
      case 'delivered':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'cancelled':
        return <XCircle className="text-red-500" size={16} />;
      default:
        return <Clock className="text-gray-500" size={16} />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const userOrders = user?.role === 'admin' 
    ? orders 
    : orders.filter(order => order.userId === user?.id);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {user?.role === 'admin' ? 'All Orders' : 'My Orders'}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Orders List */}
          <div className="flex-1 overflow-y-auto p-6">
            {userOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Package size={48} className="mb-4" />
                <p>No orders found</p>
              </div>
            ) : (
              <div className="space-y-6">
                {userOrders.map(order => (
                  <div key={order.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    {/* Order Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">Order #{order.id}</h3>
                        <p className="text-sm text-gray-600">{order.createdAt}</p>
                        {user?.role === 'admin' && (
                          <p className="text-sm text-gray-600">Customer: {order.customerInfo.name}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2 mb-4">
                      {order.items.map(item => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-semibold text-gray-900">Rs{item.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>

                    {/* Order Total */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-300">
                      <span className="font-semibold text-gray-900">Total:</span>
                      <span className="font-bold text-red-600 text-lg">Rs{order.total}</span>
                    </div>

                    {/* Customer Info (Admin View) */}
                    {user?.role === 'admin' && (
                      <div className="mt-4 pt-4 border-t border-gray-300">
                        <h4 className="font-medium text-gray-900 mb-2">Customer Information:</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Email: {order.customerInfo.email}</p>
                          <p>Phone: {order.customerInfo.phone}</p>
                          <p>Address: {order.customerInfo.address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersModal;