import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchWishlistItems, removeFromWishlist, addToCart } from "../api";
import { AuthContext } from "../context/AuthContext";
import { useCartWishlist } from "../context/CartWishlistContext";

const Wishlist = () => {
  const { user } = React.useContext(AuthContext);
  const { updateWishlistCount, updateCartCount } = useCartWishlist();
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // id of product being processed

  useEffect(() => {
    const getWishlist = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const { data } = await fetchWishlistItems(user.userId);
        setItems(data);
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
      } finally {
        setLoading(false);
      }
    };
    getWishlist();
  }, [user]);

  const handleRemove = async (productId) => {
    try {
      setActionLoading(productId);
      await removeFromWishlist(user.userId, productId);
      setItems((prev) => prev.filter((item) => item.id !== productId));
      updateWishlistCount();
    } catch (err) {
      console.error("Failed to remove item:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleMoveToCart = async (productId) => {
    try {
      setActionLoading(productId);
      await addToCart(user.userId, { productId, quantity: 1 });
      await removeFromWishlist(user.userId, productId);
      setItems((prev) => prev.filter((item) => item.id !== productId));
      updateCartCount();
      updateWishlistCount();
    } catch (err) {
      console.error("Failed to move to cart:", err);
    } finally {
      setActionLoading(null);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <p className="text-gray-500 mb-4">Please login to view your wishlist</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span>💖</span> My Wishlist
      </h1>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-100 animate-pulse h-64 rounded-2xl"></div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-2xl mx-auto mt-10">
          <span className="text-5xl block mb-4">🧸</span>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 text-sm mb-6">Save items you love here and buy them later.</p>
          <Link
            to="/shop"
            className="inline-block bg-rose-500 text-white font-bold px-6 py-2.5 rounded-full hover:bg-rose-600 transition"
          >
            Explore Toys
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-100 shadow-sm flex flex-col">
              <Link to={`/product/${item.slug}`} className="block relative bg-gray-50 rounded-xl overflow-hidden mb-3 aspect-square">
                <img
                  src={item.imageUrl || "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80"}
                  alt={item.name}
                  className="w-full h-full object-cover mix-blend-multiply hover:scale-105 transition duration-300"
                />
              </Link>
              <h3 className="font-bold text-gray-800 text-sm mb-1 truncate">{item.name}</h3>
              <p className="text-rose-500 font-extrabold text-sm mb-3">₹{item.price}</p>
              
              <div className="mt-auto flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => handleMoveToCart(item.id)}
                  disabled={actionLoading === item.id}
                  className="flex-1 bg-rose-500 text-white text-xs font-bold py-2 rounded-lg hover:bg-rose-600 transition disabled:opacity-50"
                >
                  {actionLoading === item.id ? "..." : "Add to Cart"}
                </button>
                <button
                  onClick={() => handleRemove(item.id)}
                  disabled={actionLoading === item.id}
                  className="bg-gray-100 text-gray-600 text-xs font-bold py-2 px-3 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
                  title="Remove"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
