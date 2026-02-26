import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Star, ArrowLeft, Plus, Minus, MessageSquare, Send, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function BookDetails() {
    const { id } = useParams();
    const { user } = useAuth();
    const [book, setBook] = useState(null);
    const [wishlist, setWishlist] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [wishlisting, setWishlisting] = useState(false);
    const { addToCart } = useCart();

    useEffect(() => {
        fetchBookDetails();
        fetchWishlist();
    }, [id]);

    const fetchWishlist = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const { data } = await axios.get('/api/users/wishlist', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setWishlist(data.data.map(b => b._id));
            }
        } catch (error) {
            console.error('Error fetching wishlist', error);
        }
    };

    const fetchBookDetails = async () => {
        try {
            const [bookRes, reviewsRes] = await Promise.all([
                axios.get(`/api/books/${id}`),
                axios.get(`/api/reviews/book/${id}`)
            ]);
            setBook(bookRes.data.data);
            setReviews(reviewsRes.data.data);
        } catch (error) {
            console.error('Error fetching book details', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/reviews', {
                bookId: id,
                rating,
                comment
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComment('');
            setRating(5);
            fetchBookDetails();
            alert('Review submitted!');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to submit review');
        }
    };

    if (loading) return <div className="container py-20 text-center animate-pulse text-text-muted">Loading masterpiece...</div>;
    if (!book) return <div className="container py-20 text-center text-secondary">Book not found.</div>;

    return (
        <div className="container py-10 pb-32">
            <Link to="/shop" className="flex items-center gap-2 text-text-muted hover:text-primary mb-12 transition-colors text-lg">
                <ArrowLeft size={20} />
                Back to Collection
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-24 animate-fade mb-32">
                <div className="glass-morphism rounded-none overflow-hidden p-8 bg-white/5 border-white/10 group shadow-3xl">
                    <img src={book.imageUrl} alt={book.title} className="w-full h-[750px] object-cover rounded-none shadow-2xl group-hover:scale-102 transition-transform duration-700" />
                </div>
                <div className="space-y-12 py-6">
                    <div className="space-y-8">
                        <div className="flex flex-wrap gap-3">
                            {book.genres.map(g => <span key={g} className="bg-primary/15 text-primary px-6 py-2 rounded-none text-xs font-bold uppercase tracking-[0.2em] border border-primary/20">{g}</span>)}
                        </div>
                        <h1 className="text-7xl font-bold font-display leading-[1.05] tracking-tight">{book.title}</h1>
                        <p className="text-4xl text-text-muted font-display italic font-light">by {book.authors.join(', ')}</p>
                        <div className="flex items-center gap-6 py-4">
                            <div className="flex items-center gap-2.5 bg-yellow-400/10 text-yellow-400 px-6 py-3 rounded-none border border-yellow-400/20 shadow-xl shadow-yellow-400/5">
                                <Star size={28} fill="currentColor" />
                                <span className="text-3xl font-bold">{book.ratings.toFixed(1)}</span>
                            </div>
                            <span className="text-text-muted text-lg font-medium">({reviews.length} Verified Reviews)</span>
                        </div>
                    </div>

                    <p className="text-text-muted text-2xl leading-relaxed font-light">{book.description}</p>

                    <div className="pt-12 border-t border-border/40 space-y-12">
                        <div className="flex items-center gap-12">
                            <span className="text-sm font-bold uppercase tracking-widest text-text-muted">Set Quantity</span>
                            <div className="flex items-center gap-8 bg-bg-dark/80 backdrop-blur-xl rounded-none p-3 border border-border/50 shadow-inner">
                                <button
                                    onClick={() => setQty(q => Math.max(1, q - 1))}
                                    className="p-4 hover:bg-white/10 rounded-none transition-all hover:text-primary"
                                ><Minus size={24} /></button>
                                <span className="w-12 text-center text-2xl font-bold font-display">{qty}</span>
                                <button
                                    onClick={() => setQty(q => Math.min(book.stock, q + 1))}
                                    className="p-4 hover:bg-white/10 rounded-none transition-all hover:text-primary"
                                ><Plus size={24} /></button>
                            </div>
                            <span className="text-sm font-bold text-green-400 uppercase tracking-widest">{book.stock} in stock</span>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-8">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">Total Price</span>
                                <span className="text-6xl font-bold font-display text-primary">${(book.price * qty).toFixed(2)}</span>
                            </div>
                            <div className="flex gap-4">
                                {(!user || user.role === 'user') && (
                                    <>
                                        <button
                                            onClick={async () => {
                                                if (!user) return alert('Please login to use wishlist 📚');
                                                if (wishlisting) return;
                                                setWishlisting(true);
                                                try {
                                                    const token = localStorage.getItem('token');
                                                    const { data } = await axios.post(`/api/users/wishlist/${book._id}`, {}, {
                                                        headers: { Authorization: `Bearer ${token}` }
                                                    });
                                                    if (data.isWishlisted) {
                                                        setWishlist([...wishlist, book._id]);
                                                    } else {
                                                        setWishlist(wishlist.filter(id => id !== book._id));
                                                    }
                                                    alert(data.message);
                                                } catch (err) {
                                                    console.error(err);
                                                } finally {
                                                    setWishlisting(false);
                                                }
                                            }}
                                            className={`p-7 rounded-none transition-all border ${wishlisting ? 'opacity-50 cursor-not-allowed' : ''} ${wishlist.includes(book._id) ? 'bg-primary/20 text-primary border-primary/50' : 'bg-white/5 text-text-muted hover:text-primary border-white/10'}`}
                                        >
                                            <Heart size={28} fill={wishlist.includes(book._id) ? "currentColor" : "none"} className={wishlisting ? "animate-pulse" : ""} />
                                        </button>
                                        <button
                                            onClick={() => addToCart(book, qty)}
                                            disabled={book.stock === 0}
                                            className="btn-primary flex items-center gap-4 px-16 py-7 rounded-none shadow-2xl shadow-primary/30 font-bold text-xl disabled:opacity-30"
                                        >
                                            <ShoppingCart size={28} />
                                            {book.stock === 0 ? 'Sold Out' : 'Add to Collection'}
                                        </button>
                                    </>
                                )}
                                {user && user.role !== 'user' && (
                                    <div className="bg-bg-dark border border-border px-8 py-4 text-text-muted italic text-lg shadow-xl animate-fade">
                                        Note: This feature is reserved for customer accounts.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="max-w-5xl mx-auto space-y-24">
                <div className="flex items-center justify-between border-b border-border/40 pb-12">
                    <h2 className="text-5xl font-bold font-display flex items-center gap-6">
                        <MessageSquare className="text-primary" size={48} />
                        Reader Feedback
                    </h2>
                </div>

                {/* Add Review */}
                {user ? (
                    <div className="glass-morphism p-12 md:p-16 rounded-none border-primary/20 bg-primary/2">
                        <h3 className="text-3xl font-bold mb-12">Share your thoughts</h3>
                        <form onSubmit={handleReviewSubmit} className="space-y-10">
                            <div className="flex items-center gap-8 mb-4">
                                <span className="text-sm font-bold text-text-muted uppercase tracking-widest">Rate this book:</span>
                                <div className="flex gap-3">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className="transition-all hover:scale-125 focus:outline-none"
                                        >
                                            <Star size={40} fill={star <= rating ? "#fbbf24" : "transparent"} className={star <= rating ? "text-yellow-400" : "text-text-muted/20"} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="relative">
                                <textarea
                                    className="w-full bg-bg-dark/80 border border-border/50 rounded-none p-10 outline-none focus:border-primary transition-all min-h-[200px] text-xl resize-none font-light"
                                    placeholder="Write your review here..."
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                    required
                                />
                                <button type="submit" className="absolute bottom-6 right-6 p-6 bg-primary text-white rounded-none shadow-2xl hover:scale-110 active:scale-95 transition-all">
                                    <Send size={32} />
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="text-center p-20 glass-morphism rounded-none">
                        <p className="text-2xl font-bold">Sign in to share your review</p>
                        <Link to="/login" className="btn-primary inline-block mt-8 px-12 py-5 text-xl">Login Now</Link>
                    </div>
                )}

                {/* Review List */}
                <div className="space-y-12 pb-32">
                    {reviews.length > 0 ? (
                        reviews.map((rev, i) => (
                            <div key={i} className="glass-morphism p-10 rounded-none border-white/5 hover:border-primary/20 transition-all animate-fade shadow-xl">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 bg-white/5 rounded-none flex items-center justify-center text-primary font-bold text-2xl border border-border/50">
                                            {rev.user?.name?.[0] || 'U'}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-bold text-xl">{rev.user?.name}</p>
                                            <div className="flex gap-1.5">
                                                {[...Array(5)].map((_, idx) => (
                                                    <Star key={idx} size={18} fill={idx < rev.rating ? "#fbbf24" : "transparent"} className={idx < rev.rating ? "text-yellow-400" : "text-text-muted/15"} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-text-muted font-bold uppercase tracking-[0.2em]">{new Date(rev.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-text-muted leading-relaxed text-2xl pl-20 font-light italic">"{rev.comment}"</p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 text-text-muted italic text-xl font-light">
                            No reviews yet. Be the first to share your experience!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
