import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout: (paymentMethod: 'esewa' | 'khalti' | 'cash', address: string, phone: string) => void;
}

const Cart: React.FC<CartProps> = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout 
}) => {
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'esewa' | 'khalti' | 'cash'>('cash');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  // Add validation for address and phone before checkout
  const handleCheckoutWithValidation = () => {
    if (!address.trim() || !phone.trim()) {
      alert('Please enter your delivery address and phone number.');
      return;
    }
    handleCheckout();
  };

  // Pass address and phone to onCheckout
  const handleCheckout = () => {
    if (paymentMethod === 'esewa' || paymentMethod === 'khalti') {
      setShowPaymentModal(true);
    } else {
      onCheckout(paymentMethod, address, phone);
    }
  };
  const handlePaymentConfirm = () => {
    setShowPaymentModal(false);
    onCheckout(paymentMethod, address, phone);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Shopping Cart</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ShoppingBag size={48} className="mb-4" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                    <img 
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-red-600 font-semibold">Rs{item.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Plus size={16} />
                      </button>
                      <button 
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1 hover:bg-red-100 text-red-600 rounded ml-2"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 p-4 space-y-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span className="text-red-600">Rs{total}</span>
              </div>
              {/* Payment Method Selection */}
              <div className="mb-2">
                <label className="block text-gray-700 font-medium mb-1">Delivery Address:</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Enter your delivery address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                />
                <label className="block text-gray-700 font-medium mb-1">Phone Number:</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                />
                <label className="block text-gray-700 font-medium mb-1">Payment Method:</label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="payment" value="esewa" checked={paymentMethod === 'esewa'} onChange={() => setPaymentMethod('esewa')} />
                    <span>eSewa</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="payment" value="khalti" checked={paymentMethod === 'khalti'} onChange={() => setPaymentMethod('khalti')} />
                    <span>Khalti</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} />
                    <span>Cash</span>
                  </label>
                </div>
              </div>
              <button 
                onClick={() => handleCheckoutWithValidation()}
                disabled={!user}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {user ? 'Proceed to Checkout' : 'Sign In to Checkout'}
              </button>
              {!user && (
                <p className="text-sm text-gray-600 text-center">
                  Please sign in to place your order
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Payment Modal for eSewa/Khalti */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">{paymentMethod === 'esewa' ? 'eSewa' : 'Khalti'} Payment</h2>
            <p className="text-gray-600 mb-4">This is a demo. In a real app, you would be redirected to the {paymentMethod} payment gateway.</p>
            <button
              onClick={handlePaymentConfirm}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Simulate Payment Success
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;