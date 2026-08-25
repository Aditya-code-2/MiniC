import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faSpinner,
  faHeart,
  faShoppingCart,
  faUser,
  faSignOutAlt,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import API from "../api";
import AuthModal from "./AuthModal"; // 👈 Auth Modal Import kiya
import { useCartWishlist } from "../context/CartWishlistContext";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 🟢 State to control Auth Modal Pop-up
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authRole, setAuthRole] = useState("user");

  const navigate = useNavigate();

  // 🟢 Direct LocalStorage Auth Check
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    navigate("/");
    window.location.reload();
  };

  const { cartCount, wishlistCount } = useCartWishlist();

  // Live Search API Call
  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const response = await API.get("/products/search", {
          params: { q: search },
        });
        setResults(response.data);
      } catch (error) {
        console.error("Live search error:", error);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search)}`);
      setResults([]);
      setMobileMenuOpen(false);
    }
  };

  const handleAuthSuccess = (userData) => {
    if (userData && userData.role === "ROLE_ADMIN") {
      window.location.href = "/admin/dashboard";
    } else if (userData && userData.role === "ROLE_SELLER") {
      window.location.href = "/seller/dashboard";
    } else {
      window.location.reload(); // Refresh to reflect logged-in status
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-rose-500 text-white text-center py-2 text-xs md:text-sm font-medium px-4">
        🎁 Free Shipping on Orders Above ₹999
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-16 md:h-20 flex items-center justify-between gap-2 md:gap-6">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <img
                src="/minic-logo-teddy-circle.svg"
                alt="Miniature Toys"
                className="w-10 h-10 md:w-14 md:h-14 object-contain"
              />
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-rose-500">MiniC</h1>
                <p className="hidden md:block text-xs text-gray-500">Making Childhood More Magical.</p>
              </div>
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden md:block flex-1 max-w-xl relative">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search Toys, Gifts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-11 rounded-full border border-gray-300 bg-gray-50 px-5 pr-12 outline-none focus:border-rose-400 focus:bg-white transition text-sm"
                />

                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition flex items-center justify-center text-sm"
                >
                  {loading ? (
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  ) : (
                    <FontAwesomeIcon icon={faSearch} />
                  )}
                </button>
              </form>

              {/* Live Search Dropdown */}
              {search.trim() !== "" && (
                <div className="absolute left-0 right-0 top-14 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 max-h-80 overflow-y-auto">
                  {loading && (
                    <div className="p-4 text-center text-sm text-gray-400">Searching...</div>
                  )}

                  {!loading && results.length > 0 && (
                    results.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.slug || product.id}`}
                        onClick={() => {
                          setSearch("");
                          setResults([]);
                        }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-rose-50 transition border-b last:border-b-0"
                      >
                        <img
                          src={product.imageUrl || "/placeholder.jpg"}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-lg border border-gray-100"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 text-sm">{product.name}</h4>
                          <p className="text-xs text-rose-500 font-semibold">₹{product.price}</p>
                        </div>
                      </Link>
                    ))
                  )}

                  {!loading && results.length === 0 && (
                    <div className="p-4 text-center text-sm text-gray-500">
                      No products found matching "<strong>{search}</strong>"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 md:gap-4">
              {isLoggedIn ? (
                <>
                  <Link to="/wishlist" className="relative text-gray-700 hover:text-rose-500 p-2" title="Wishlist">
                    <FontAwesomeIcon icon={faHeart} className="text-lg md:text-xl" />
                    {wishlistCount > 0 && (
                      <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>

                  <Link to="/cart" className="relative text-gray-700 hover:text-rose-500 p-2" title="Cart">
                    <FontAwesomeIcon icon={faShoppingCart} className="text-lg md:text-xl" />
                    {cartCount > 0 && (
                      <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>

                  <Link to="/profile" className="hidden sm:block text-gray-700 hover:text-rose-500 p-2" title="Profile">
                    <FontAwesomeIcon icon={faUser} className="text-lg md:text-xl" />
                  </Link>

                  <button onClick={handleLogout} className="hidden sm:block text-gray-500 hover:text-rose-500 p-2" title="Logout">
                    <FontAwesomeIcon icon={faSignOutAlt} className="text-lg md:text-xl" />
                  </button>
                </>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={() => { setAuthRole("user"); setIsAuthModalOpen(true); }}
                    className="px-5 py-2 text-xs md:text-sm rounded-full bg-rose-500 text-white hover:bg-rose-600 transition font-bold shadow-md shadow-rose-200"
                  >
                    Login / Register
                  </button>
                </div>
              )}

              {/* Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-rose-500 focus:outline-none text-xl"
              >
                <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} />
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="block md:hidden pb-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search Toys, Gifts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 rounded-full border border-gray-300 bg-gray-50 px-4 pr-10 outline-none text-sm"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-rose-500 p-1 text-sm">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 px-6 py-4 flex flex-col gap-4 shadow-lg">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 font-medium hover:text-rose-500">Home</Link>
            <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 font-medium hover:text-rose-500">Shop</Link>
            <Link to="/categories" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 font-medium hover:text-rose-500">Categories</Link>
            <Link to="/new-arrivals" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 font-medium hover:text-rose-500">New Arrivals</Link>
            <Link to="/hidden-gems" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 font-medium hover:text-rose-500">Hidden Gems</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 font-medium hover:text-rose-500">About Us</Link>

            <hr className="my-1 border-gray-200" />

            {!isLoggedIn ? (
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => {
                    setAuthRole("user");
                    setMobileMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full text-center py-2.5 rounded-full bg-rose-500 text-white font-bold text-sm shadow-md"
                >
                  Login / Register
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pt-2">
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 font-medium flex items-center gap-2">
                  <FontAwesomeIcon icon={faUser} /> Profile
                </Link>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-rose-500 font-medium flex items-center gap-2">
                  <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Desktop Links Bar */}
      <div className="hidden md:block bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-12 flex items-center gap-8 text-gray-700 text-sm font-medium">
            <Link to="/" className="hover:text-rose-500 transition">Home</Link>
            <Link to="/shop" className="hover:text-rose-500 transition">Shop</Link>
            <Link to="/categories" className="hover:text-rose-500 transition">Categories</Link>
            <Link to="/new-arrivals" className="hover:text-rose-500 transition">New Arrivals</Link>
            <Link to="/hidden-gems" className="hover:text-rose-500 transition">Hidden Gems</Link>
            <div className="relative group inline-block">
              <Link to="/about" className="hover:text-rose-500 transition">About Us</Link>
              {/* Hidden Admin Login/Panel Trigger */}
              <button
                onClick={() => { setAuthRole("admin"); setIsAuthModalOpen(true); }}
                className="absolute top-full left-0 w-full h-4 opacity-0 cursor-default z-50"
                title="Admin Access"
              ></button>
            </div>
          </div>
        </div>
      </div>

      {/* 🟢 Login / Register Pop-up Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        defaultRole={authRole}
      />
    </>
  );
};

export default Navbar;