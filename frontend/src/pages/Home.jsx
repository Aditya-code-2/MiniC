import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API, { addToCart } from "../api";
import WishlistButton from "../components/WishlistButton";
import { AuthContext } from "../context/AuthContext";
import { useCartWishlist } from "../context/CartWishlistContext";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const { user } = React.useContext(AuthContext);
  const { updateCartCount } = useCartWishlist();
  const [addingId, setAddingId] = useState(null);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.all([
          API.get("/categories"),
          API.get("/products"),
        ]);
        setCategories(catRes.data || []);
        setProducts(prodRes.data || []);
      } catch (err) {
        console.error("Error fetching home data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleCategorySelect = async (categoryId) => {
    setSelectedCategory(categoryId);
    setIsCategoryModalOpen(false); // Modal close fast
    setProductsLoading(true);

    try {
      if (categoryId === "all") {
        const res = await API.get("/products");
        setProducts(res.data || []);
      } else {
        try {
          const res = await API.get(`/products/category/${categoryId}`);
          setProducts(res.data || []);
        } catch {
          const res = await API.get(`/products?categoryId=${categoryId}`);
          setProducts(res.data || []);
        }
      }
    } catch (err) {
      console.error("Error fetching filtered products:", err);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      alert("Please login to add to cart");
      return;
    }
    setAddingId(product.id);
    try {
      await addToCart(user.userId, {
        productId: product.id,
        quantity: 1,
      });
      updateCartCount();
      setTimeout(() => setAddingId(null), 800);
    } catch (err) {
      console.error("Cart error:", err);
      setTimeout(() => setAddingId(null), 800);
    }
  };

  const getSelectedCategoryName = () => {
    if (selectedCategory === "all") return "All Miniatures";
    const found = categories.find((c) => String(c.id) === String(selectedCategory));
    return found ? found.name : "Products";
  };

  return (
    <div className="bg-[#FFFDF9] min-h-screen text-gray-800 font-sans relative">
      
      {/* 1. ULTRA COMPACT MOBILE HERO SECTION (Heavy Images Hidden on Mobile) */}
      <section className="relative overflow-hidden bg-gradient-to-r from-rose-100 via-pink-50 to-amber-50 py-4 sm:py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left Content Column */}
          <div className="space-y-2 text-left w-full md:w-3/5 z-10">
            <span className="inline-flex items-center gap-1 bg-white/90 text-rose-600 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full shadow-sm border border-rose-100">
              ✨ Cute Collectibles Store
            </span>

            <h1 className="text-xl sm:text-3xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
              Bring Tiny{" "}
              <span className="text-rose-500 underline decoration-pink-300 decoration-wavy">
                Joy
              </span>{" "}
              To Everyday Life ✨
            </h1>

            <p className="text-gray-600 text-xs sm:text-base max-w-md leading-relaxed font-medium line-clamp-2">
              Aesthetic miniature figures, pocket charms & desk accessories crafted with love! 🌸
            </p>

            {/* Micro Feature Badges */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[10px] font-bold text-gray-600">
              <span className="bg-white/80 px-2 py-0.5 rounded-md border border-pink-100">
                🎁 Gift Packaging
              </span>
              <span className="bg-white/80 px-2 py-0.5 rounded-md border border-pink-100">
                🚚 Fast Delivery
              </span>
            </div>
          </div>

          {/* Right Desktop Image (HIDDEN ON MOBILE: hidden md:flex) */}
          <div className="hidden md:flex relative justify-center w-2/5">
            <div className="w-64 h-64 rounded-3xl bg-gradient-to-tr from-pink-300 to-rose-400 p-2 shadow-lg rotate-1">
              <img
                src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=600&auto=format&fit=crop&q=80"
                alt="Cute Miniatures"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 2. MAIN CONTENT AREA: FILTER BAR & PRODUCTS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-4">
        
        {/* Category Trigger Bar */}
        <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">
              Filter
            </span>
            <p className="text-xs sm:text-sm font-extrabold text-gray-800">
              {getSelectedCategoryName()}
            </p>
          </div>

          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="bg-rose-50 border border-rose-200 text-rose-500 hover:bg-rose-500 hover:text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 active:scale-95"
          >
            <span>🧸</span> Categories <span className="text-[10px]">▼</span>
          </button>
        </div>

        {/* Product Grid */}
        {loading || productsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-3 border border-gray-100 animate-pulse space-y-2">
                <div className="bg-gray-200 h-32 sm:h-48 rounded-xl w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-5 bg-gray-200 rounded-full w-full"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-2.5 sm:p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="relative overflow-hidden rounded-xl bg-gray-50 h-32 sm:h-48 mb-2">
                  <img
                    src={
                      p.imageUrl ||
                      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500&auto=format&fit=crop&q=80"
                    }
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <WishlistButton productId={p.id} />
                </div>

                <div className="space-y-0.5">
                  <Link
                    to={`/product/${p.slug || p.id}`}
                    className="font-bold text-gray-800 text-xs sm:text-base line-clamp-1 hover:text-rose-500 transition"
                  >
                    {p.name}
                  </Link>
                  <p className="text-[10px] sm:text-xs text-gray-400 line-clamp-1">
                    {p.description || "Cute miniature item"}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                  <span className="text-xs sm:text-base font-extrabold text-rose-500">
                    ₹{p.price}
                  </span>

                  <button
                    onClick={() => handleAddToCart(p)}
                    className={`font-bold text-[10px] sm:text-xs px-2.5 py-1.5 rounded-full transition-all flex items-center gap-1 ${
                      addingId === p.id
                        ? "bg-green-500 text-white"
                        : "bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white"
                    }`}
                  >
                    {addingId === p.id ? "✓" : "🛒 +Add"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-12 px-4 text-center my-4">
            <div className="text-4xl mb-2">🧸</div>
            <h3 className="text-sm font-bold text-gray-700">No items available</h3>
            <p className="text-xs text-gray-400 mt-1">
              Select another category from the list above!
            </p>
          </div>
        )}
      </main>

      {/* 3. FLIPKART STYLE CATEGORY BOX (MODAL) */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
          
          <div 
            className="absolute inset-0" 
            onClick={() => setIsCategoryModalOpen(false)}
          ></div>

          <div className="relative bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl z-10 space-y-4">
            
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-base font-extrabold text-gray-800 flex items-center gap-2">
                🌸 Select Category
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="w-7 h-7 bg-gray-100 text-gray-500 rounded-full font-bold text-sm flex items-center justify-center hover:bg-rose-100 hover:text-rose-500"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 max-h-72 overflow-y-auto py-1">
              <button
                onClick={() => handleCategorySelect("all")}
                className={`p-3 rounded-2xl text-left font-bold text-xs transition-all border flex items-center gap-2 ${
                  selectedCategory === "all"
                    ? "bg-rose-500 text-white border-rose-500 shadow-md"
                    : "bg-gray-50 text-gray-700 border-gray-100 hover:border-rose-200"
                }`}
              >
                <span className="text-sm">✨</span> All Miniatures
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`p-3 rounded-2xl text-left font-bold text-xs transition-all border flex items-center gap-2 ${
                    String(selectedCategory) === String(cat.id)
                      ? "bg-rose-500 text-white border-rose-500 shadow-md"
                      : "bg-gray-50 text-gray-700 border-gray-100 hover:border-rose-200"
                  }`}
                >
                  <span className="text-sm">🧸</span> {cat.name}
                </button>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Home;