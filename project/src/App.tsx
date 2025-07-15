import React, { useState, useMemo } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Categories from './components/Categories';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import AuthModal from './components/AuthModal';
import OrdersModal from './components/OrdersModal';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import { products } from './data/products';
import { mockOrders } from './data/orders';
import { Product, CartItem, Order } from './types';

function AppContent() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const { user } = useAuth();

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map(p => p.category)));
    return ['All', ...uniqueCategories];
  }, []);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') return products;
    return products.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  const featuredProducts = useMemo(() => {
    return products.filter(p => p.featured);
  }, []);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = (paymentMethod: 'esewa' | 'khalti' | 'cash', address: string, phone: string) => {
    const newOrder: Order = {
      id: orders.length + 1,
      userId: user?.id || 2,
      items: cartItems,
      total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'pending',
      createdAt: new Date().toLocaleString(),
      customerInfo: {
        name: user?.name || '',
        email: user?.email || '',
        phone,
        address
      },
      paymentMethod
    } as any;
    setOrders(prev => [newOrder, ...prev]);
    setCartItems([]);
    setIsCartOpen(false);
    alert('Order placed successfully!');
  };

  const handleUpdateOrderStatus = (orderId: number, status: Order['status']) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        cartItems={cartItems}
        onCartClick={() => setIsCartOpen(true)}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onOrdersClick={() => setIsOrdersModalOpen(true)}
        onAdminClick={() => setIsAdminDashboardOpen(true)}
        onSettingsClick={() => setIsSettingsModalOpen(true)}
      />
      <Hero 
        onOrderNow={() => setIsCartOpen(true)}
      />
      <ProductGrid 
        products={featuredProducts}
        onAddToCart={handleAddToCart}
        title="Featured Dishes"
      />
      <Categories
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
      <ProductGrid 
        products={filteredProducts}
        onAddToCart={handleAddToCart}
        title="Our Menu"
        id="menu"
      />
      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">About NewaBhojan</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              We are passionate about preserving and sharing the rich culinary heritage of Newari cuisine. 
              Our traditional recipes have been passed down through generations, ensuring authentic flavors 
              and cultural significance in every dish we serve.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍽️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Traditional Recipes</h3>
              <p className="text-gray-600">Authentic Newari dishes prepared with time-honored recipes and techniques.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fresh Ingredients</h3>
              <p className="text-gray-600">We use only the finest, locally-sourced ingredients for the best taste.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and reliable delivery to bring authentic flavors to your doorstep.</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      <OrdersModal
        isOpen={isOrdersModalOpen}
        onClose={() => setIsOrdersModalOpen(false)}
        orders={orders}
      />
      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        orders={orders}
        products={products}
        onUpdateOrderStatus={handleUpdateOrderStatus}
      />
      {/* Settings Modal */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
            <button
              onClick={() => setIsSettingsModalOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Settings</h2>
            <p className="text-gray-600">This is a placeholder for user settings. You can add profile editing, password change, etc. here.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;