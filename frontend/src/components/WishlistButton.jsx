import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { useCartWishlist } from "../context/CartWishlistContext";
import { addToWishlist, removeFromWishlist } from "../api";
import { AuthContext } from "../context/AuthContext";

const WishlistButton = ({ productId, absolute = true }) => {
  const { user } = React.useContext(AuthContext);
  const { wishlistItems, updateWishlistCount } = useCartWishlist();
  const [loading, setLoading] = useState(false);

  const inWishlist = wishlistItems.includes(productId);

  const handleToggle = async (e) => {
    e.preventDefault(); // Prevent link click if wrapped in Link
    e.stopPropagation();
    
    if (!user) {
      alert("Please login to add to wishlist");
      return;
    }
    
    setLoading(true);
    try {
      if (inWishlist) {
        await removeFromWishlist(user.userId, productId);
      } else {
        await addToWishlist(user.userId, productId);
      }
      updateWishlistCount();
    } catch (err) {
      console.error("Wishlist error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`${absolute ? "absolute top-2 right-2" : ""} w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-rose-500 hover:bg-rose-100 transition shadow-sm border border-rose-50 z-10`}
      title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <FontAwesomeIcon 
        icon={inWishlist ? faHeartSolid : faHeartRegular} 
        className={`text-sm ${loading ? "animate-pulse" : ""}`} 
      />
    </button>
  );
};

export default WishlistButton;
