import React, { useState, useEffect } from 'react';
import { X, Package, Users, DollarSign, TrendingUp, Eye, Edit, Trash2 } from 'lucide-react';
import { Order, Product, User } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  products: Product[];
  onUpdateOrderStatus: (orderId: number, status: Order['status']) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  isOpen, 
  onClose, 
  orders, 
  products,
  onUpdateOrderStatus 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'users'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const { user } = useAuth();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: 'customer' });
  const [editLoading, setEditLoading] = useState(false);
  const [userSearch, setUserSearch] = useState('');

  const totalRevenue = orders
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + order.total, 0);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const totalProducts = products.length;

  useEffect(() => {
    if (activeTab === 'users' && user?.role === 'admin') {
      const fetchUsers = async () => {
        setUsersLoading(true);
        try {
          const token = localStorage.getItem('newabhojan_token');
          const res = await fetch('http://localhost:5000/api/auth/users', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (res.ok) setUsers(data);
        } catch (err) {
          // Optionally handle error
        }
        setUsersLoading(false);
      };
      fetchUsers();
    }
  }, [activeTab, user]);

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('newabhojan_token');
      const res = await fetch(`http://localhost:5000/api/auth/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setUsers(users.filter(u => (u.id || u._id) !== userId));
      } else {
        alert('Failed to delete user.');
      }
    } catch (err) {
      alert('Error deleting user.');
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || user.username || '',
      email: user.email,
      role: user.role || (user.isAdmin ? 'admin' : 'customer')
    });
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setEditForm({ name: '', email: '', role: 'customer' });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    if (!editingUser) return;
    setEditLoading(true);
    try {
      const token = localStorage.getItem('newabhojan_token');
      const res = await fetch(`http://localhost:5000/api/auth/users/${editingUser.id || editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        setUsers(users.map(u => (u.id || u._id) === (editingUser.id || editingUser._id) ? { ...u, ...editForm } : u));
        closeEditModal();
      } else {
        alert('Failed to update user.');
      }
    } catch (err) {
      alert('Error updating user.');
    }
    setEditLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'orders', label: 'Orders', icon: Package },
                { id: 'products', label: 'Products', icon: Eye },
                ...(user?.role === 'admin' ? [{ id: 'users', label: 'Users', icon: Users }] : [])
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 text-sm font-medium">Total Revenue</p>
                        <p className="text-2xl font-bold text-blue-900">Rs{totalRevenue}</p>
                      </div>
                      <DollarSign className="text-blue-600" size={24} />
                    </div>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 text-sm font-medium">Total Orders</p>
                        <p className="text-2xl font-bold text-green-900">{totalOrders}</p>
                      </div>
                      <Package className="text-green-600" size={24} />
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-600 text-sm font-medium">Pending Orders</p>
                        <p className="text-2xl font-bold text-yellow-900">{pendingOrders}</p>
                      </div>
                      <Package className="text-yellow-600" size={24} />
                    </div>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-600 text-sm font-medium">Total Products</p>
                        <p className="text-2xl font-bold text-purple-900">{totalProducts}</p>
                      </div>
                      <Eye className="text-purple-600" size={24} />
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white border border-gray-200 rounded-lg">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {orders.slice(0, 5).map(order => (
                          <tr key={order.id}>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">#{order.id}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{order.customerInfo.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">Rs{order.total}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'preparing' ? 'bg-orange-100 text-orange-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">{order.createdAt}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Manage Orders</h3>
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">Order #{order.id}</h4>
                          <p className="text-sm text-gray-600">Customer: {order.customerInfo.name}</p>
                          <p className="text-sm text-gray-600">Total: Rs{order.total}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <select
                            value={order.status}
                            onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparing">Preparing</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Items: {order.items.map(item => `${item.name} (${item.quantity})`).join(', ')}</p>
                        <p>Phone: {order.customerInfo.phone}</p>
                        <p>Address: {order.customerInfo.address}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Manage Products</h3>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors">
                    Add Product
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map(product => (
                    <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <img 
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900">{product.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                        <p className="text-lg font-bold text-red-600">Rs{product.price}</p>
                        <div className="flex items-center space-x-2 mt-3">
                          <button className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                            <Edit size={14} className="inline mr-1" />
                            Edit
                          </button>
                          <button className="flex-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors">
                            <Trash2 size={14} className="inline mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'users' && user?.role === 'admin' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">All Users</h3>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  className="mb-4 px-3 py-2 border border-gray-300 rounded-lg w-full max-w-xs"
                />
                {usersLoading ? (
                  <p>Loading users...</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {users.filter(u =>
                          (u.name || u.username || '').toLowerCase().includes(userSearch.toLowerCase()) ||
                          (u.email || '').toLowerCase().includes(userSearch.toLowerCase())
                        ).map(u => (
                          <tr key={u.id || u._id}>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{u.id || u._id}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{u.name || u.username}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{u.email}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {(u.role || u.isAdmin ? 'admin' : 'customer') !== 'admin' && (
                                <button
                                  className="text-blue-600 hover:underline mr-2"
                                  onClick={() => openEditModal(u)}
                                >
                                  Edit
                                </button>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {(u.role || u.isAdmin ? 'admin' : 'customer') !== 'admin' && (
                                <button
                                  className="text-red-600 hover:underline"
                                  onClick={() => handleDeleteUser(u.id || u._id)}
                                >
                                  Delete
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
            <button
              onClick={closeEditModal}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Edit User</h2>
            <form onSubmit={e => { e.preventDefault(); handleEditSave(); }} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Role</label>
                <select
                  name="role"
                  value={editForm.role}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  disabled={editingUser.isAdmin}
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={editLoading}
              >
                {editLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;