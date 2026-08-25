import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layout Components
import Navbar from './components/Navbar'; // <-- Navbar Import

// Pages
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import OAuthSuccess from './pages/0AuthSuccess';
import AdminDashboard from './pages/AdminDashboard';
import Shop from './pages/Shop';
import Categories from './pages/Categories';
import ProductList from './pages/ProductList';
import About from './pages/About';
import Wishlist from './pages/Wishlist';

// Route Guard
import ProtectedRoute from './components/ProtectedRoute';

import Profile from './pages/Profile';
import { AuthProvider } from './context/AuthContext';
import { CartWishlistProvider } from './context/CartWishlistContext';

function App() {
  return (
    <AuthProvider>
      <CartWishlistProvider>
      <BrowserRouter>
        {/* Top Navigation Bar - Every page par dikhega */}
        <Navbar />

        {/* Main Content Container */}
      <main style={{ minHeight: '80vh' }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/new-arrivals" element={<ProductList title="New Arrivals" description="Check out the newest miniatures in our store!" apiEndpoint="/products" />} />
          <Route path="/hidden-gems" element={<ProductList title="Hidden Gems" description="Rare and unique miniatures you won't find anywhere else!" apiEndpoint="/products" />} />
          <Route path="/about" element={<About />} />

          {/* Customer Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ROLE_CUSTOMER', 'ROLE_ADMIN', 'ROLE_SELLER']} />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['ROLE_CUSTOMER', 'ROLE_ADMIN']} />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </main>
      </BrowserRouter>
      </CartWishlistProvider>
    </AuthProvider>
  );
}

export default App;