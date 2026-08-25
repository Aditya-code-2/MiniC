import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchCart, fetchWishlistCount, fetchWishlistItems } from '../api';
import { AuthContext } from './AuthContext';

const CartWishlistContext = createContext();

export const CartWishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistItems, setWishlistItems] = useState([]);

  const updateCartCount = async () => {
    if (user && user.userId) {
      try {
        const { data } = await fetchCart(user.userId);
        setCartCount(data.items ? data.items.length : 0);
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    }
  };

  const updateWishlistCount = async () => {
    if (user && user.userId) {
      try {
        const [countRes, itemsRes] = await Promise.all([
          fetchWishlistCount(user.userId),
          fetchWishlistItems(user.userId)
        ]);
        setWishlistCount(countRes.data);
        setWishlistItems(itemsRes.data.map(item => item.id));
      } catch (error) {
        console.error("Error fetching wishlist details:", error);
      }
    } else {
      setWishlistCount(0);
      setWishlistItems([]);
    }
  };

  useEffect(() => {
    updateCartCount();
    updateWishlistCount();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <CartWishlistContext.Provider
      value={{
        cartCount,
        wishlistCount,
        wishlistItems,
        updateCartCount,
        updateWishlistCount,
      }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
};

export const useCartWishlist = () => {
  return useContext(CartWishlistContext);
};
