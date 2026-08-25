import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API, { addToCart } from "../api";
import WishlistButton from "../components/WishlistButton";
import { AuthContext } from "../context/AuthContext";
import { useCartWishlist } from "../context/CartWishlistContext";

const ProductList = ({ title, description, apiEndpoint }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = React.useContext(AuthContext);
  const { updateCartCount } = useCartWishlist();
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await API.get(apiEndpoint);
        setProducts(res.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [apiEndpoint]);

  const handleAddToCart = async (product) => {
    if (!user) {
      alert("Please login to add to cart");
      return;
    }
    setAddingId(product.id);
    try {
      await addToCart(user.userId, { productId: product.id, quantity: 1 });
      updateCartCount();
      setTimeout(() => setAddingId(null), 800);
    } catch (err) {
      console.error("Cart error:", err);
      setTimeout(() => setAddingId(null), 800);
    }
  };

  return (
    <div className="bg-[#FFFDF9] min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 mb-2">
            {title}
          </h1>
          {description && (
            <p className="text-gray-500 text-sm sm:text-base font-medium max-w-2xl">
              {description}
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-3 border border-gray-100 animate-pulse space-y-2">
                <div className="bg-gray-200 h-32 sm:h-48 rounded-xl w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-5 bg-gray-200 rounded-full w-full"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="relative overflow-hidden rounded-xl bg-gray-50 h-32 sm:h-48 mb-3">
                  <img
                    src={p.imageUrl || "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500&auto=format&fit=crop&q=80"}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <WishlistButton productId={p.id} />
                  {title === "New Arrivals" && (
                    <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-md">
                      NEW
                    </span>
                  )}
                  {title === "Best Sellers" && (
                    <span className="absolute top-2 left-2 bg-amber-400 text-gray-900 text-[10px] font-bold px-2 py-1 rounded-md">
                      🔥 HOT
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <Link to={`/product/${p.slug || p.id}`} className="font-bold text-gray-800 text-sm sm:text-base line-clamp-1 hover:text-rose-500 transition">
                    {p.name}
                  </Link>
                  <p className="text-[10px] sm:text-xs text-gray-400 line-clamp-2">
                    {p.description || "Cute miniature item"}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                  <span className="text-sm sm:text-lg font-extrabold text-rose-500">
                    ₹{p.price}
                  </span>
                  <button
                    onClick={() => handleAddToCart(p)}
                    className={`font-bold text-xs px-3 py-1.5 rounded-full transition-all flex items-center gap-1 ${
                      addingId === p.id ? "bg-green-500 text-white" : "bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white"
                    }`}
                  >
                    {addingId === p.id ? "✓ Added" : "🛒 Add"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-dashed border-gray-200 py-16 px-4 text-center">
            <h3 className="text-lg font-bold text-gray-700">No products available here yet.</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
