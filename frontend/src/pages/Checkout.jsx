import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API, { fetchCart } from "../api";
import { AuthContext } from "../context/AuthContext";

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = React.useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "COD",
  });

  // Fetch Cart Details for Order Summary
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        if (!user) return;
        const res = await fetchCart(user.userId);
        const items = res.data.items || res.data || [];
        setCartItems(Array.isArray(items) ? items : []);
      } catch (err) {
        console.error("Cart fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.userId) {
      fetchCartData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.product?.price || item.price || 0) * (item.quantity || 1),
    0
  );
  const shippingFee = subtotal > 0 ? (subtotal > 499 ? 0 : 49) : 0;
  const grandTotal = subtotal + shippingFee;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setSubmitting(true);
    try {
      const orderPayload = {
        userId: user.userId,
        shippingAddress: `${formData.address}, ${formData.city} - ${formData.pincode}`,
        phone: formData.phone,
        customerName: formData.fullName,
        paymentMethod: formData.paymentMethod,
        totalAmount: grandTotal,
        items: cartItems,
      };

      await API.post("/orders", orderPayload);
      
      // Navigate to My Orders page upon success
      navigate("/orders");
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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
        
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 border-b border-rose-100 pb-4 mb-6">
          🚚 Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Delivery Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              
              {/* Shipping Details Box */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm space-y-4">
                <h2 className="font-extrabold text-sm sm:text-base text-gray-800 flex items-center gap-2">
                  📍 Delivery Address
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-rose-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-rose-400 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                    Street Address / House No.
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    placeholder="Flat / Building / House No. / Landmark"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-rose-400 transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="City Name"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-rose-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      placeholder="6-digit Pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-rose-400 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm space-y-3">
                <h2 className="font-extrabold text-sm sm:text-base text-gray-800 flex items-center gap-2">
                  💳 Payment Method
                </h2>

                <div className="space-y-2">
                  <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                    formData.paymentMethod === "COD" 
                      ? "bg-rose-50/50 border-rose-300" 
                      : "border-gray-200 bg-gray-50/50"
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={formData.paymentMethod === "COD"}
                      onChange={handleChange}
                      className="accent-rose-500"
                    />
                    <div>
                      <p className="font-bold text-xs text-gray-800">💵 Cash on Delivery (COD)</p>
                      <p className="text-[10px] text-gray-400">Pay when your order arrives at your door.</p>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                    formData.paymentMethod === "UPI" 
                      ? "bg-rose-50/50 border-rose-300" 
                      : "border-gray-200 bg-gray-50/50"
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      checked={formData.paymentMethod === "UPI"}
                      onChange={handleChange}
                      className="accent-rose-500"
                    />
                    <div>
                      <p className="font-bold text-xs text-gray-800">📲 UPI / Online Payment</p>
                      <p className="text-[10px] text-gray-400">Google Pay, PhonePe, Paytm, or BHIM.</p>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || cartItems.length === 0}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-black text-xs sm:text-sm py-3.5 rounded-2xl shadow-lg shadow-rose-200 transition active:scale-95 disabled:opacity-50"
              >
                {submitting ? "Placing Order..." : `Confirm & Place Order (₹${grandTotal})`}
              </button>

            </form>
          </div>

          {/* Right Column: Order Mini Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm space-y-4 sticky top-20">
              <h2 className="font-extrabold text-sm text-gray-800 border-b border-gray-100 pb-2">
                Order Summary ({cartItems.length})
              </h2>

              <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                {cartItems.map((item) => {
                  const product = item.product || item;
                  return (
                    <div key={item.id} className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-700 line-clamp-1 flex-1 pr-2">
                        {product.name || product.productName || "Product"} <span className="text-gray-400">x{item.quantity}</span>
                      </span>
                      <span className="font-extrabold text-gray-900">
                        ₹{(product.price || 0) * (item.quantity || 1)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-1 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-800">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Delivery</span>
                  <span className="font-bold text-gray-800">
                    {shippingFee === 0 ? <span className="text-green-600">FREE</span> : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-rose-500">₹{grandTotal}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Checkout;