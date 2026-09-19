import axios from 'axios';

const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const API_BASE_URL = isLocalhost 
  ? (process.env.REACT_APP_API_BASE_URL || 'http://localhost:8086/api/v1')
  : 'https://minic.onrender.com/api/v1';

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Token to requests if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const registerUser = (userData) => API.post('/auth/register', userData);
export const loginUser = (credentials) => API.post('/auth/login', credentials);
export const sendOtp = (email, role) => API.post('/auth/send-otp', { email, role });
export const verifyOtp = (otpData) => API.post('/auth/verify-otp', otpData);
export const loginWithPassword = (email, password) => API.post('/auth/login', { email, password });
export const registerEmployee = (data) => API.post('/auth/register', data);
export const fetchAllUsers = () => API.get('/auth/users');

// Category APIs
export const fetchCategories = () => API.get('/categories');
export const createCategory = (data) => API.post('/categories', data);
export const updateCategory = (id, data) => API.put(`/categories/${id}`, data);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

// Product APIs
export const fetchProducts = () => API.get('/products');
export const fetchProductById = (id) => API.get(`/products/${id}`);
export const createProduct = (productData) => API.post('/products', productData);
export const updateProduct = (id, productData) => API.put(`/products/${id}`, productData);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const fetchSellerProducts = (sellerId) => API.get(`/products/seller/${sellerId}`);

// Cart APIs
export const fetchCart = (userId) => API.get(`/cart/user/${userId}`);
export const addToCart = (userId, itemData) => API.post(`/cart/user/${userId}/items`, itemData);
export const updateCartItem = (userId, cartItemId, quantity) =>
  API.put(`/cart/user/${userId}/items/${cartItemId}?quantity=${quantity}`);
export const removeCartItem = (userId, cartItemId) =>
  API.delete(`/cart/user/${userId}/items/${cartItemId}`);

// Wishlist APIs
export const fetchWishlistItems = (userId) => API.get(`/wishlist/items?userId=${userId}`);
export const fetchWishlistCount = (userId) => API.get(`/wishlist/count?userId=${userId}`);
export const addToWishlist = (userId, productId) => API.post(`/wishlist/add?userId=${userId}&productId=${productId}`);
export const removeFromWishlist = (userId, productId) => API.delete(`/wishlist/remove?userId=${userId}&productId=${productId}`);

// Order & Payment APIs
export const placeOrder = (orderData) => API.post('/orders', orderData);
export const fetchUserOrders = (userId) => API.get(`/orders/user/${userId}`);
export const fetchAllOrders = () => API.get('/orders');
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status?status=${status}`);
export const cancelOrder = (id) => API.put(`/orders/${id}/cancel`);
export const processPayment = (paymentData) => API.post('/payments/process', paymentData);

// Seller APIs
export const fetchSellerAnalytics = (sellerId) => API.get(`/analytics/seller/${sellerId}/summary`);
export const fetchSellerPayouts = (sellerId) => API.get(`/payouts/seller/${sellerId}`);

// Admin APIs
export const fetchFinanceDashboard = () => API.get('/finance/dashboard');
export const fetchPlatformRevenueLogs = () => API.get('/finance/revenue-logs');
export const fetchPendingPayouts = () => API.get('/payouts/pending');
export const processPayout = (payoutData) => API.post('/payouts/process', payoutData);

export default API;