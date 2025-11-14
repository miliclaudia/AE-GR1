import React, { useEffect, useState } from 'react';
import { getCart, updateCartItem, removeFromCart } from '../api/cart.routes';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';

const CartPage = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCart = async () => {
        try {
            const response = await getCart();
            if (response.success) {
                setCart(response.data);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('Failed to fetch cart.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleQuantityChange = async (itemId, quantity, stock) => {
        if (quantity < 1) return;
        if (quantity > stock) {
            toast.error(`Only ${stock} items available.`);
            return;
        }
        try {
            const response = await updateCartItem(itemId, quantity);
            if (response.success) {
                fetchCart(); // Refetch cart to show updated data
            } else {
                toast.error(response.message || 'Failed to update quantity');
            }
        } catch (error) {
            console.error('Failed to update quantity:', error);
            toast.error(error.response?.data?.message || 'Failed to update quantity');
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            await removeFromCart(itemId);
            fetchCart(); // Refetch cart
        } catch (error) {
            console.error('Failed to remove item:', error);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="container mx-auto p-4 text-center">
                <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
                <Link to="/products" className="text-indigo-600 hover:text-indigo-800">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    const totalPrice = cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
            <div className="bg-white shadow rounded-lg p-6">
                {cart.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between py-4 border-b">
                        <div className="flex items-center space-x-4">
                            <img src={item.product.image || 'https://via.placeholder.com/150'} alt={item.product.name} className="w-20 h-20 object-cover rounded" />
                            <div>
                                <p className="font-semibold">{item.product.name}</p>
                                <p className="text-gray-500">${item.product.price.toFixed(2)}</p>
                                <p className="text-sm text-gray-500">{item.product.stock} in stock</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <button onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.product.stock)} className="px-2 py-1 border rounded">-</button>
                                <span>{item.quantity}</span>
                                <button 
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.product.stock)} 
                                    className="px-2 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={item.quantity >= item.product.stock}
                                >
                                    +
                                </button>
                            </div>
                            <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                            <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700">Remove</button>
                        </div>
                    </div>
                ))}
                <div className="flex justify-end items-center mt-6">
                    <p className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</p>
                    <button className="ml-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
