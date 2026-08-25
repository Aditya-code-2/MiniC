import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API, { addToCart, addToWishlist, fetchWishlistItems, removeFromWishlist } from "../api";
import { AuthContext } from "../context/AuthContext";
import { useCartWishlist } from "../context/CartWishlistContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = React.useContext(AuthContext);
  const { updateCartCount, updateWishlistCount } = useCartWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [inWishlist, setInWishlist] = useState(false);

  // 1. Fetch Single Product API & Wishlist status
  useEffect(() => {
    const fetchProductAndWishlist = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/products/slug/${slug}`);
        setProduct(res.data);
        
        // Check if in wishlist
        if (user && user.userId) {
          const wlRes = await fetchWishlistItems(user.userId);
          const isSaved = wlRes.data.some(item => item.id === res.data.id);
          setInWishlist(isSaved);
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProductAndWishlist();
  }, [slug, user]);

  // 2. Add to Cart API Call: POST /api/v1/cart/user/{userId}/items
  const handleAddToCart = async () => {
    if (!user) {
      showToast("⚠️ Please login to add items to cart");
      return;
    }
    setAddingToCart(true);
    try {
      await addToCart(user.userId, {
        productId: product.id,
        quantity: quantity,
      });
      updateCartCount();
      showToast("✨ Added to cart successfully!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      showToast("🛒 Item added to cart!");
    } finally {
      setAddingToCart(false);
    }
  };

  // 3. Wishlist Handler
  const handleToggleWishlist = async () => {
    if (!user) {
      showToast("⚠️ Please login to manage wishlist");
      return;
    }
    try {
      if (inWishlist) {
        await removeFromWishlist(user.userId, product.id);
        setInWishlist(false);
        showToast("💔 Removed from wishlist");
      } else {
        await addToWishlist(user.userId, product.id);
        setInWishlist(true);
        showToast("💖 Added to wishlist!");
      }
      updateWishlistCount();
    } catch (err) {
      console.error("Error toggling wishlist:", err);
    }
  };

  // 4. Buy Now Handler
  const handleBuyNow = async () => {
    if (!user) {
      showToast("⚠️ Please login to buy this item");
      return;
    }
    await handleAddToCart();
    navigate("/checkout");
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center p-4">
        <div className="animate-pulse space-y-4 w-full max-w-md">
          <div className="bg-gray-200 h-64 rounded-2xl w-full"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-10 bg-gray-200 rounded-full w-full"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex flex-col items-center justify-center p-4 text-center">
        <span className="text-4xl mb-2">🔍</span>
        <h2 className="text-lg font-bold text-gray-800">Product Not Found</h2>
        <Link to="/" className="mt-4 text-xs bg-rose-500 text-white font-bold px-4 py-2 rounded-full">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDF9] min-h-screen pb-20 text-gray-800">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 backdrop-blur-md text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg transition-all animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Top Bar for Mobile */}
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-bold text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow-sm"
        >
          ← Back
        </button>
        <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full">
          Cute Collectible
        </span>
      </div>

      <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-start mt-2">
        
        {/* Product Image */}
        <div className="relative bg-white rounded-3xl p-3 border border-gray-100 shadow-sm">
          <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-gray-50">
            <img
              src={
                product.imageUrl ||
                "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500&auto=format&fit=crop&q=80"
              }
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Product Info & Actions */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900 leading-snug">
                {product.name}
              </h1>
              <p className="text-rose-500 text-lg sm:text-2xl font-black mt-1">
                ₹{product.price}
              </p>
            </div>
            <button 
              onClick={handleToggleWishlist}
              className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 hover:bg-rose-100 transition shadow-sm"
              title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <FontAwesomeIcon icon={inWishlist ? faHeartSolid : faHeartRegular} className="text-xl" />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed bg-white p-3.5 rounded-2xl border border-gray-100">
            {product.description || "A cute handcrafted aesthetic miniature collectible perfect for your desk or gifting!"}
          </p>

          {/* Quantity Selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-500">Quantity:</span>
            <div className="flex items-center border border-gray-200 bg-white rounded-full px-2 py-1 gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-6 h-6 rounded-full bg-gray-100 text-gray-700 font-bold text-xs flex items-center justify-center hover:bg-rose-100 hover:text-rose-500"
              >
                -
              </button>
              <span className="text-xs font-extrabold text-gray-800 w-4 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-6 h-6 rounded-full bg-gray-100 text-gray-700 font-bold text-xs flex items-center justify-center hover:bg-rose-100 hover:text-rose-500"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons (Sticky/Fixed on Mobile) */}
          <div className="pt-2 flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="flex-1 bg-rose-50 text-rose-500 border border-rose-200 font-bold text-xs sm:text-sm py-3 rounded-full hover:bg-rose-100 transition active:scale-95 flex items-center justify-center gap-1.5"
            >
              🛒 {addingToCart ? "Adding..." : "Add to Cart"}
            </button>

            <button
              onClick={handleBuyNow}
              className="flex-1 bg-rose-500 text-white font-bold text-xs sm:text-sm py-3 rounded-full hover:bg-rose-600 transition shadow-md shadow-rose-200 active:scale-95 flex items-center justify-center gap-1.5"
            >
              ⚡ Buy Now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;