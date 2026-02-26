import { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, ShoppingCart, Trash2, ArrowLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Wishlist() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
            return;
        }
        if (user && user.role !== 'user') {
            navigate('/profile');
            return;
        }
        fetchWishlist();
    }, [user, authLoading, navigate]);

    const fetchWishlist = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const { data } = await axios.get('/api/users/wishlist', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setWishlist(data.data);
            }
        } catch (error) {
            console.error('Error fetching wishlist', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`/api/users/wishlist/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWishlist(prev => prev.filter(item => item._id !== id));
        } catch (error) {
            console.error('Error removing from wishlist', error);
        }
    };

    if (loading) return <div className="container py-20 text-center animate-pulse text-text-muted text-xl">Loading your wishlist...</div>;

    return (
        <div className="container py-10 pb-32">
            <Link to="/shop" className="flex items-center gap-2 text-text-muted hover:text-primary mb-12 transition-colors text-lg">
                <ArrowLeft size={20} />
                Back to Shop
            </Link>

            <h1 className="text-6xl font-bold font-display mb-20 tracking-tight flex items-center gap-6">
                <Heart className="text-primary fill-primary" size={56} />
                My Wishlist
            </h1>

            {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                    {wishlist.map(book => (
                        <div key={book._id} className="glass-morphism rounded-none overflow-hidden group hover:border-primary/50 transition-all duration-500 flex flex-col h-full hover:-translate-y-2 shadow-2xl relative">
                            <button
                                onClick={() => handleRemove(book._id)}
                                className="absolute top-4 right-4 z-10 p-3 bg-bg-dark/90 backdrop-blur-xl rounded-none text-secondary hover:text-white transition-all border border-white/5"
                            >
                                <Trash2 size={20} />
                            </button>

                            <Link to={`/book/${book._id}`} className="block h-80 overflow-hidden">
                                <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            </Link>

                            <div className="p-8 space-y-6 flex-grow flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-2xl leading-tight group-hover:text-primary transition-colors mb-2">{book.title}</h3>
                                    <p className="text-text-muted text-lg font-light italic">by {book.authors.join(', ')}</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-3xl font-bold font-display">${book.price}</span>
                                        <button
                                            onClick={() => addToCart(book)}
                                            className="btn-primary py-3 px-6 rounded-none flex items-center gap-2"
                                        >
                                            <ShoppingCart size={18} />
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-32 glass-morphism rounded-none border-dashed border-2 border-border/30 bg-white/2">
                    <Heart size={80} className="mx-auto text-text-muted mb-6 opacity-30" />
                    <h2 className="text-3xl font-bold mb-4">Your wishlist is empty</h2>
                    <p className="text-text-muted text-lg max-w-sm mx-auto">Found something you love? Heart it to save it for later!</p>
                    <Link to="/shop" className="btn-primary inline-flex items-center gap-3 mt-12 px-12 py-5 text-xl">
                        Explore Books
                        <ChevronRight size={24} />
                    </Link>
                </div>
            )}
        </div>
    );
}
