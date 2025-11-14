import { axiosAuth } from "../axios/axiosAuth";

export const getCart = async () => {
  try {
    const response = await axiosAuth.get('/cart');
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    return error.response?.data;
  }
};

export const addToCart = async (productId, quantity) => {
  try {
    const response = await axiosAuth.post('/cart/items', { productId, quantity });
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    return error.response?.data;
  }
};

export const updateCartItem = async (itemId, quantity) => {
  try {
    const response = await axiosAuth.put(`/cart/items/${itemId}`, { quantity });
    return response.data;
  } catch (error) {
    console.error("Error updating cart item:", error);
    return error.response?.data;
  }
};

export const removeFromCart = async (itemId) => {
  try {
    const response = await axiosAuth.delete(`/cart/items/${itemId}`);
    return response.data;
  } catch (error) {
    console.error("Error removing from cart:", error);
    return error.response?.data;
  }
};
