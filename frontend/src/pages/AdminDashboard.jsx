import React, { useState, useEffect, useContext } from 'react';
import { fetchFinanceDashboard, fetchAllOrders, updateOrderStatus, fetchCategories, createCategory, deleteCategory, registerEmployee, fetchProducts, createProduct, updateProduct, deleteProduct, fetchAllUsers } from '../api';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [financeStats, setFinanceStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [loading, setLoading] = useState(true);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  const [productFormData, setProductFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    imageUrl: '',
    categoryId: '',
  });

  // Employee creation state
  const [employeeData, setEmployeeData] = useState({ name: '', email: '', password: '', role: 'ROLE_ADMIN' });

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const res = await fetchFinanceDashboard();
        setFinanceStats(res.data);
      } else if (activeTab === 'products') {
        const res = await fetchProducts();
        setProducts(res.data);
      } else if (activeTab === 'orders') {
        const res = await fetchAllOrders();
        setOrders(res.data);
      } else if (activeTab === 'categories') {
        const res = await fetchCategories();
        setCategories(res.data);
      } else if (activeTab === 'users') {
        const res = await fetchAllUsers();
        setUsersList(res.data);
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (productFormData.price <= 0) return alert('Price must be greater than 0');
    if (productFormData.stockQuantity < 0) return alert('Stock cannot be negative');

    try {
      if (editingProductId) {
        await updateProduct(editingProductId, { ...productFormData, sellerId: user.userId });
        alert('Product Updated Successfully!');
        setEditingProductId(null);
      } else {
        await createProduct({ ...productFormData, sellerId: user.userId });
        alert('Product Added Successfully!');
      }
      setProductFormData({ name: '', description: '', price: '', stockQuantity: '', imageUrl: '', categoryId: '' });
      if (activeTab === 'products') loadData();
    } catch (err) {
      alert(`Failed to ${editingProductId ? 'update' : 'add'} product`);
    }
  };

  const handleEditClick = (product) => {
    setEditingProductId(product.id);
    setProductFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stockQuantity: product.stockQuantity,
      imageUrl: product.imageUrl || '',
      categoryId: product.categoryId || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      alert('Product deleted successfully');
      loadData();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const handleUpdateOrderStatus = async (orderId, currentStatus) => {
    const newStatus = prompt(`Enter new status (PROCESSING, SHIPPED, DELIVERED, CANCELLED):`, currentStatus);
    if (!newStatus || newStatus === currentStatus) return;

    setIsProcessing(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      alert('Order status updated!');
      loadData();
    } catch (error) {
      alert('Failed to update order status.');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toString().includes(orderSearchQuery) ||
      order.userId.toString().includes(orderSearchQuery) ||
      order.status.toLowerCase().includes(orderSearchQuery.toLowerCase())
  );

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName) return;
    setIsProcessing(true);
    try {
      await createCategory({ name: newCategoryName, description: newCategoryDesc });
      setNewCategoryName('');
      setNewCategoryDesc('');
      loadData();
    } catch (err) {
      alert('Failed to create category');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete category?')) return;
    setIsProcessing(true);
    try {
      await deleteCategory(id);
      loadData();
    } catch (err) {
      alert('Failed to delete category');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    if (!employeeData.name || !employeeData.email || !employeeData.password) return;
    setIsProcessing(true);
    try {
      await registerEmployee(employeeData);
      alert('Employee created successfully! They can now log in using these credentials.');
      setEmployeeData({ name: '', email: '', password: '', role: 'ROLE_ADMIN' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create employee');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8 border-b pb-4 overflow-x-auto">
        <button
          className={`px-6 py-2 rounded-full font-medium transition whitespace-nowrap ${
            activeTab === 'dashboard' ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('dashboard')}
        >
          Overview
        </button>
        <button
          className={`px-6 py-2 rounded-full font-medium transition whitespace-nowrap ${
            activeTab === 'orders' ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('orders')}
        >
          Manage Orders
        </button>
        <button
          className={`px-6 py-2 rounded-full font-medium transition whitespace-nowrap ${
            activeTab === 'products' ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('products')}
        >
          Manage Products
        </button>
        <button
          className={`px-6 py-2 rounded-full font-medium transition whitespace-nowrap ${
            activeTab === 'categories' ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('categories')}
        >
          Categories
        </button>
        <button
          className={`px-6 py-2 rounded-full font-medium transition whitespace-nowrap ${
            activeTab === 'employees' ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('employees')}
        >
          Manage Employees
        </button>
        <button
          className={`px-6 py-2 rounded-full font-medium transition whitespace-nowrap ${
            activeTab === 'users' ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('users')}
        >
          Manage Users
        </button>
      </div>

      {loading && activeTab !== 'employees' ? (
        <div className="text-center py-10 text-gray-500">Loading data...</div>
      ) : (
        <div>
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && financeStats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm font-medium mb-2">Total Platform Revenue</h3>
                <p className="text-3xl font-bold text-gray-800">₹{financeStats.totalRevenue || 0}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm font-medium mb-2">Total Platform Profit (Commission)</h3>
                <p className="text-3xl font-bold text-green-600">₹{financeStats.totalProfit || 0}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm font-medium mb-2">Total Payouts Done</h3>
                <p className="text-3xl font-bold text-blue-600">₹{financeStats.totalPayouts || 0}</p>
              </div>
            </div>
          )}

          {/* Manage Products Tab */}
          {activeTab === 'products' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 self-start">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {editingProductId ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  {editingProductId && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setEditingProductId(null);
                        setProductFormData({ name: '', description: '', price: '', stockQuantity: '', imageUrl: '', categoryId: '' });
                      }}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
                <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
                  <input className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-rose-400" placeholder="Product Name" value={productFormData.name} onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })} required />
                  <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-rose-400 min-h-[100px]" placeholder="Description" value={productFormData.description} onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })} />
                  <input className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-rose-400" type="number" placeholder="Price" value={productFormData.price} onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })} required />
                  <input className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-rose-400" type="number" placeholder="Stock Quantity" value={productFormData.stockQuantity} onChange={(e) => setProductFormData({ ...productFormData, stockQuantity: e.target.value })} required />
                  <input className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-rose-400" placeholder="Image URL" value={productFormData.imageUrl} onChange={(e) => setProductFormData({ ...productFormData, imageUrl: e.target.value })} />
                  <input className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-rose-400" type="number" placeholder="Category ID" value={productFormData.categoryId} onChange={(e) => setProductFormData({ ...productFormData, categoryId: e.target.value })} required />
                  <button type="submit" className="w-full bg-rose-500 text-white font-bold py-3 rounded-lg hover:bg-rose-600 transition">
                    {editingProductId ? 'Update Product' : 'Publish Product'}
                  </button>
                </form>
              </div>
              <div className="lg:col-span-2">
                <h3 className="text-xl font-bold text-gray-800 mb-4">All Products</h3>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="py-3 px-4 text-sm font-medium text-gray-600">Product</th>
                        <th className="py-3 px-4 text-sm font-medium text-gray-600">Price</th>
                        <th className="py-3 px-4 text-sm font-medium text-gray-600">Stock</th>
                        <th className="py-3 px-4 text-sm font-medium text-gray-600">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="py-3 px-4 flex items-center gap-3">
                            <img src={p.imageUrl || '/placeholder.jpg'} alt={p.name} className="w-10 h-10 object-cover rounded" />
                            <span className="font-medium">{p.name}</span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-gray-800">₹{p.price}</td>
                          <td className="py-3 px-4">{p.stockQuantity}</td>
                          <td className="py-3 px-4">
                            <button onClick={() => handleEditClick(p)} className="text-sm text-blue-500 hover:underline mr-4">Edit</button>
                            <button onClick={() => handleDeleteProduct(p.id)} className="text-sm text-red-500 hover:underline">Delete</button>
                          </td>
                        </tr>
                      ))}
                      {products.length === 0 && (
                        <tr><td colSpan="4" className="py-6 text-center text-gray-500">No products available.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Employees Tab */}
          {activeTab === 'employees' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
              <h3 className="font-bold text-gray-800 mb-6 text-lg">Create New Employee</h3>
              <form onSubmit={handleCreateEmployee} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={employeeData.name}
                    onChange={(e) => setEmployeeData({ ...employeeData, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-xl outline-none focus:border-rose-400"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address (ID)</label>
                  <input
                    type="email"
                    required
                    value={employeeData.email}
                    onChange={(e) => setEmployeeData({ ...employeeData, email: e.target.value })}
                    className="w-full px-4 py-2 border rounded-xl outline-none focus:border-rose-400"
                    placeholder="e.g. employee@minic.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="text"
                    required
                    value={employeeData.password}
                    onChange={(e) => setEmployeeData({ ...employeeData, password: e.target.value })}
                    className="w-full px-4 py-2 border rounded-xl outline-none focus:border-rose-400"
                    placeholder="Min 6 characters"
                    minLength="6"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={employeeData.role}
                    onChange={(e) => setEmployeeData({ ...employeeData, role: e.target.value })}
                    className="w-full px-4 py-2 border rounded-xl outline-none focus:border-rose-400 bg-white"
                  >
                    <option value="ROLE_ADMIN">Admin</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-900 transition disabled:opacity-50 mt-4"
                >
                  {isProcessing ? 'Creating...' : 'Create Employee Account'}
                </button>
              </form>
            </div>
          )}

          {/* Manage Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-bold text-gray-800">All Registered Users</h3>
                <span className="bg-rose-100 text-rose-600 font-bold px-3 py-1 rounded-full text-sm">
                  Total: {usersList.length}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="py-3 px-4 text-sm font-medium text-gray-600">ID</th>
                      <th className="py-3 px-4 text-sm font-medium text-gray-600">Name</th>
                      <th className="py-3 px-4 text-sm font-medium text-gray-600">Email</th>
                      <th className="py-3 px-4 text-sm font-medium text-gray-600">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((usr) => (
                      <tr key={usr.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">#{usr.id}</td>
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img 
                            src={usr.profilePic || 'https://via.placeholder.com/40'} 
                            alt={usr.firstName} 
                            className="w-8 h-8 rounded-full bg-gray-200 object-cover" 
                          />
                          <span className="font-semibold text-gray-800">{usr.firstName} {usr.lastName}</span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{usr.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full font-bold ${usr.role === 'ROLE_ADMIN' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'}`}>
                            {usr.role === 'ROLE_ADMIN' ? 'Admin' : 'Customer'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {usersList.length === 0 && (
                      <tr>
                        <td colSpan="4" className="py-6 text-center text-gray-500">No users found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-bold text-gray-800">All Orders</h3>
                <input
                  type="text"
                  placeholder="Search by Order ID, User ID or Status..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="px-4 py-2 border rounded-full outline-none focus:border-rose-400 text-sm w-full max-w-sm"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                    <th className="py-3 px-4 text-sm font-medium text-gray-600">Order ID</th>
                    <th className="py-3 px-4 text-sm font-medium text-gray-600">Customer ID</th>
                    <th className="py-3 px-4 text-sm font-medium text-gray-600">Total Amount</th>
                    <th className="py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                    <th className="py-3 px-4 text-sm font-medium text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">#{order.id}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{order.userId}</td>
                      <td className="py-3 px-4 font-semibold text-rose-500">₹{order.totalAmount}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, order.status)}
                          disabled={isProcessing}
                          className="text-sm text-blue-600 hover:underline disabled:opacity-50"
                        >
                          {isProcessing ? 'Updating...' : 'Update Status'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-6 text-center text-gray-500">No orders found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <h3 className="font-bold text-gray-800 mb-4">Add Category</h3>
                  <form onSubmit={handleCreateCategory} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        required
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={newCategoryDesc}
                        onChange={(e) => setNewCategoryDesc(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                        rows="3"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 font-bold transition disabled:opacity-50"
                    >
                      {isProcessing ? 'Adding...' : 'Add Category'}
                    </button>
                  </form>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="py-3 px-4 text-sm font-medium text-gray-600">ID</th>
                        <th className="py-3 px-4 text-sm font-medium text-gray-600">Name</th>
                        <th className="py-3 px-4 text-sm font-medium text-gray-600">Description</th>
                        <th className="py-3 px-4 text-sm font-medium text-gray-600">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((cat) => (
                        <tr key={cat.id} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">#{cat.id}</td>
                          <td className="py-3 px-4 font-bold text-gray-800">{cat.name}</td>
                          <td className="py-3 px-4 text-sm text-gray-500 line-clamp-1">{cat.description}</td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleDeleteCategory(cat.id)}
                              disabled={isProcessing}
                              className="text-red-500 text-sm font-bold hover:underline"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      {categories.length === 0 && (
                        <tr>
                          <td colSpan="4" className="py-6 text-center text-gray-500">No categories found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
