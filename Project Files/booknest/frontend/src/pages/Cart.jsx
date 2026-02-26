import { useState } from 'react';
import { ShoppingBasket, ArrowLeft, Trash2, CreditCard, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';

export default function Cart() {
    const { cartItems, removeFromCart, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [shippingDetails, setShippingDetails] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: '',
        email: '',
        phone: ''
    });

    const handleInputChange = (e) => {
        setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) return;

        // Simple validation
        const { address, city, postalCode, country, email, phone } = shippingDetails;
        if (!address || !city || !postalCode || !country || !email || !phone) {
            alert('Please fill in all shipping details');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const orderData = {
                orderItems: cartItems.map(item => ({
                    title: item.title,
                    quantity: item.qty,
                    image: item.imageUrl,
                    price: item.price,
                    book: item._id
                })),
                shippingAddress: shippingDetails,
                paymentMethod: 'Credit Card',
                totalPrice: cartTotal
            };

            await axios.post('/api/orders', orderData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            clearCart();
            alert('Order placed successfully!');
            navigate('/orders');
        } catch (error) {
            alert('Checkout failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-10 pb-32">
            <Link to="/shop" className="flex items-center gap-2 text-text-muted hover:text-primary mb-12 transition-colors text-lg">
                <ArrowLeft size={20} />
                Back to Collection
            </Link>

            <h1 className="text-6xl font-bold font-display mb-20 tracking-tight">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                <div className="lg:col-span-2 space-y-10">
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <div key={item._id} className="glass-morphism p-8 rounded-none flex flex-col sm:flex-row items-center gap-10 animate-fade shadow-xl border-white/5">
                                <img src={item.imageUrl} alt={item.title} className="w-32 h-44 object-cover rounded-none shadow-2xl" />
                                <div className="flex-grow text-center sm:text-left space-y-4">
                                    <h3 className="text-2xl font-bold tracking-tight">{item.title}</h3>
                                    <p className="text-text-muted text-lg font-light">Unit Price: <span className="text-text-main font-semibold">${item.price}</span></p>
                                    <div className="flex items-center justify-between mt-6">
                                        <div className="flex items-center gap-4 bg-bg-dark border border-border px-4 py-2 rounded-none">
                                            <span className="text-sm text-text-muted font-bold uppercase tracking-tighter">Qty:</span>
                                            <span className="font-bold text-xl">{item.qty}</span>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <span className="text-3xl font-bold text-primary">${(item.price * item.qty).toFixed(2)}</span>
                                            <button
                                                onClick={() => removeFromCart(item._id)}
                                                className="text-text-muted hover:text-secondary hover:scale-125 transition-all p-2"
                                            >
                                                <Trash2 size={24} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-32 glass-morphism rounded-none border-dashed border-2 border-border/30 bg-white/2">
                            <ShoppingBasket size={80} className="mx-auto text-text-muted mb-6 opacity-30" />
                            <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
                            <p className="text-text-muted text-lg max-w-sm mx-auto">Discover thousands of stories and add them to your collection.</p>
                            <Link to="/shop" className="btn-primary inline-flex items-center gap-3 mt-12 px-12 py-5 text-xl">
                                Start Shopping
                                <ChevronRight size={24} />
                            </Link>
                        </div>
                    )}

                    {cartItems.length > 0 && (
                        <div className="glass-morphism p-8 rounded-none mt-12 space-y-8 animate-fade shadow-xl border-white/5">
                            <h3 className="text-2xl font-bold border-b border-border/40 pb-4">Shipping Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Email Address</label>
                                    <input type="email" name="email" value={shippingDetails.email} onChange={handleInputChange} className="w-full bg-bg-dark border border-border rounded-none px-4 py-3 outline-none focus:border-primary transition-all text-sm" placeholder="customer@example.com" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Mobile Number</label>
                                    <input type="tel" name="phone" value={shippingDetails.phone} onChange={handleInputChange} className="w-full bg-bg-dark border border-border rounded-none px-4 py-3 outline-none focus:border-primary transition-all text-sm" placeholder="+1 (555) 000-0000" required />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Street Address</label>
                                    <input type="text" name="address" value={shippingDetails.address} onChange={handleInputChange} className="w-full bg-bg-dark border border-border rounded-none px-4 py-3 outline-none focus:border-primary transition-all text-sm" placeholder="123 Bibliophile Way" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">City</label>
                                    <input type="text" name="city" value={shippingDetails.city} onChange={handleInputChange} className="w-full bg-bg-dark border border-border rounded-none px-4 py-3 outline-none focus:border-primary transition-all text-sm" placeholder="New York" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Pincode / Postal Code</label>
                                    <input type="text" name="postalCode" value={shippingDetails.postalCode} onChange={handleInputChange} className="w-full bg-bg-dark border border-border rounded-none px-4 py-3 outline-none focus:border-primary transition-all text-sm" placeholder="10001" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Country</label>
                                    <input type="text" name="country" value={shippingDetails.country} onChange={handleInputChange} className="w-full bg-bg-dark border border-border rounded-none px-4 py-3 outline-none focus:border-primary transition-all text-sm" placeholder="USA" required />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-10">
                    <div className="glass-morphism p-10 rounded-none space-y-10 shadow-3xl sticky top-32 border-primary/20 bg-primary/2">
                        <h3 className="text-3xl font-bold flex items-center gap-3 border-b border-border/40 pb-6">
                            <CreditCard className="text-primary" size={28} />
                            Summary
                        </h3>
                        <div className="space-y-6 text-lg font-light">
                            <div className="flex justify-between">
                                <span className="text-text-muted">Subtotal</span>
                                <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-muted">Taxes</span>
                                <span className="font-semibold text-text-muted">$0.00</span>
                            </div>
                            <div className="flex justify-between items-center bg-green-400/10 px-4 py-2 rounded-none border border-green-400/20">
                                <span className="text-green-400 font-bold uppercase text-xs tracking-widest">Shipping</span>
                                <span className="text-green-400 font-bold">COMPLIMENTARY</span>
                            </div>
                            <div className="border-t border-border/40 pt-8 flex justify-between text-4xl font-bold mt-4">
                                <span>Total</span>
                                <span className="text-primary">${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={cartItems.length === 0 || loading}
                            className="btn-primary w-full py-6 mt-6 flex items-center justify-center gap-3 text-2xl shadow-primary/30 disabled:opacity-30 disabled:grayscale"
                        >
                            {loading ? 'Processing...' : 'Place Order'}
                            {!loading && <ChevronRight size={28} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
