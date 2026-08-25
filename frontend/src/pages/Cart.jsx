import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  // Fetch Cart Items
  const fetchCart = async () => {
    // We assume userId is 1 for now if no auth context is set up in Cart.jsx, or get it from localStorage
    const userId = localStorage.getItem("userId") || 1;
    try {
      setLoading(true);
      const res = await API.get(`/cart/user/${userId}`);
      // Handle both array response or object with items key
      const items = res.data.items || res.data || [];
      setCartItems(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Update Quantity (Increment / Decrement)
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdatingId(itemId);
    const userId = localStorage.getItem("userId") || 1;
    try {
      await API.put(`/cart/user/${userId}/items/${itemId}?quantity=${newQuantity}`);
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      console.error("Error updating quantity:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Remove Item from Cart
  const handleRemoveItem = async (itemId) => {
    setUpdatingId(itemId);
    const userId = localStorage.getItem("userId") || 1;
    try {
      await API.delete(`/cart/user/${userId}/items/${itemId}`);
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error("Error deleting item:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.product?.price || item.price || 0) * (item.quantity || 1),
    0
  );
  const shippingFee = subtotal > 0 ? (subtotal > 499 ? 0 : 49) : 0;
  const grandTotal = subtotal + shippingFee;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center">
        <div className="animate-spin text-3xl">🧸</div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDF9] min-h-screen font-sans pb-12">
      <div className="max-w-4xl mx-auto px-4 py-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-rose-100 pb-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            🛒 Shopping Cart
            <span className="text-xs bg-rose-100 text-rose-500 font-bold px-2.5 py-0.5 rounded-full">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </span>
          </h1>
          <Link
            to="/"
            className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1"
          >
            ← Continue Shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 text-center shadow-sm space-y-4">
            <div className="text-5xl">🛍️</div>
            <h2 className="text-lg font-extrabold text-gray-800">Your Cart is Empty!</h2>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Looks like you haven't added any cute miniatures to your cart yet.
            </p>
            <Link
              to="/"
              className="inline-block bg-rose-500 text-white font-bold text-xs px-6 py-2.5 rounded-full shadow-md shadow-rose-200 hover:bg-rose-600 transition"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          /* Cart Grid */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-2 space-y-3">
              {cartItems.map((item) => {
                const product = item.product || item;
                const price = product.price || item.price || 0;
                
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-sm flex items-center gap-3.5 transition hover:border-pink-200"
                  >
                    {/* Item Image */}
                    <img
                      src={
                        product.imageUrl ||
                        "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500&auto=format&fit=crop&q=80"
                      }
                      alt={product.name || "Miniature Item"}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl bg-gray-50 shrink-0"
                    />

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 text-xs sm:text-sm line-clamp-1">
                        {product.name || product.productName || "Cute Miniature"}
                      </h3>
                      <p className="text-rose-500 font-extrabold text-xs sm:text-sm mt-0.5">
                        ₹{price}
                      </p>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-gray-200 rounded-full bg-gray-50 overflow-hidden">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, (item.quantity || 1) - 1)
                            }
                            disabled={updatingId === item.id || (item.quantity || 1) <= 1}
                            className="px-2.5 py-0.5 text-xs font-bold text-gray-600 hover:bg-gray-200 disabled:opacity-40"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-black text-gray-800">
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, (item.quantity || 1) + 1)
                            }
                            disabled={updatingId === item.id}
                            className="px-2.5 py-0.5 text-xs font-bold text-gray-600 hover:bg-gray-200"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={updatingId === item.id}
                          className="text-[10px] font-bold text-gray-400 hover:text-red-500 ml-2 transition"
                        >
                          🗑️ Remove
                        </button>
                      </div>
                    </div>

                    {/* Total Price for Item */}
                    <div className="text-right shrink-0">
                      <span className="font-extrabold text-gray-900 text-xs sm:text-sm">
                        ₹{price * (item.quantity || 1)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Order Summary / Bill */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm space-y-4 sticky top-20">
                <h2 className="font-extrabold text-sm text-gray-800 border-b border-gray-100 pb-2">
                  Order Summary
                </h2>

                <div className="space-y-2 text-xs font-medium text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-800">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Fee</span>
                    <span className="font-bold text-gray-800">
                      {shippingFee === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₹${shippingFee}`
                      )}
                    </span>
                  </div>
                  {shippingFee > 0 && (
                    <p className="text-[10px] text-amber-600 bg-amber-50 p-1.5 rounded-lg border border-amber-100">
                      💡 Add ₹{500 - subtotal} more for Free Delivery!
                    </p>
                  )}
                  <div className="border-t border-gray-100 pt-2.5 flex justify-between text-sm font-black text-gray-900">
                    <span>Grand Total</span>
                    <span className="text-rose-500">₹{grandTotal}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs py-3 rounded-xl transition shadow-md shadow-rose-200 active:scale-95 flex items-center justify-center gap-2"
                >
                  Proceed to Checkout ➔
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Cart;