import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1) => {
        if (!user) {
            alert('Please login to add items to your cart 📚');
            return;
        }

        if (user.role !== 'user') {
            alert('Only customers can add items to the cart. 📚');
            return;
        }

        setCartItems(prev => {
            const exist = prev.find(item => item._id === product._id);
            if (exist) {
                return prev.map(item =>
                    item._id === product._id ? { ...item, qty: item.qty + quantity } : item
                );
            }
            return [...prev, { ...product, qty: quantity }];
        });
        alert('Book added to collection! 📚');
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item._id !== id));
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cart');
    };

    const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
};
