import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Star, Search, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Shop() {
    const [books, setBooks] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [wishlisting, setWishlisting] = useState(null);
    const { addToCart } = useCart();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBooks();
        fetchWishlist();
    }, []);

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

    const fetchBooks = async () => {
        try {
            const { data } = await axios.get('/api/books');
            setBooks(data.data);
        } catch (error) {
            console.error('Error fetching books', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredBooks = books.filter(b =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.authors.some(a => a.toLowerCase().includes(searchTerm.toLowerCase())) ||
        b.genres.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="container py-10 pb-32">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-24 gap-12">
                <div className="space-y-4">
                    <h1 className="text-6xl font-bold font-display tracking-tight leading-tight">Explore Our <br /> Collection</h1>
                    <p className="text-text-muted text-xl max-w-lg leading-relaxed font-light">Find your next favorite story among our carefully curated titles</p>
                </div>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                    <input
                        type="text"
                        placeholder="Search title, author, or genre..."
                        className="bg-bg-dark border border-border rounded-none pl-24 pr-6 py-4 w-full outline-none focus:border-primary transition-all shadow-xl text-lg"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-96 glass-morphism animate-pulse rounded-none" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                    {filteredBooks.map((book) => (
                        <div key={book._id} className="glass-morphism rounded-none overflow-hidden group hover:border-primary/50 transition-all duration-500 flex flex-col h-full hover:-translate-y-2 shadow-2xl">
                            <Link to={`/book/${book._id}`} className="block h-80 overflow-hidden relative">
                                <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute top-4 right-4 bg-bg-dark/90 backdrop-blur-xl px-2 py-1 rounded-none text-xs font-bold flex items-center gap-1.5 border border-white/10">
                                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                    {book.ratings.toFixed(1)}
                                </div>
                            </Link>
                            <div className="p-8 space-y-6 flex-grow flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-2xl leading-tight group-hover:text-primary transition-colors mb-2">{book.title}</h3>
                                    <p className="text-text-muted text-lg font-light italic">by {book.authors.join(', ')}</p>
                                </div>
                                <div className="flex justify-between items-center pt-4">
                                    <span className="text-3xl font-bold font-display">${book.price}</span>
                                    <div className="flex gap-2">
                                        {(!user || user.role === 'user') && (
                                            <>
                                                <button
                                                    onClick={async (e) => {
                                                        e.preventDefault();
                                                        if (!user) return alert('Please login to use wishlist 📚');
                                                        if (wishlisting === book._id) return;
                                                        setWishlisting(book._id);
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
                                                            setWishlisting(null);
                                                        }
                                                    }}
                                                    className={`p-4 rounded-none transition-all border ${wishlisting === book._id ? 'opacity-50 cursor-not-allowed' : ''} ${wishlist.includes(book._id) ? 'bg-primary/20 text-primary border-primary/50' : 'bg-white/5 text-text-muted hover:text-primary border-white/10'}`}
                                                >
                                                    <Heart size={22} fill={wishlist.includes(book._id) ? "currentColor" : "none"} className={wishlisting === book._id ? "animate-pulse" : ""} />
                                                </button>
                                                <button
                                                    onClick={() => addToCart(book)}
                                                    className="p-4 bg-primary text-white rounded-none hover:scale-110 active:scale-95 transition-all shadow-lg hover:shadow-primary/40"
                                                >
                                                    <ShoppingCart size={22} />
                                                </button>
                                            </>
                                        )}
                                        {user && user.role !== 'user' && (
                                            <span className="text-xs text-text-muted italic border border-border px-3 py-2">Customer Feature Only</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {!loading && filteredBooks.length === 0 && (
                <div className="text-center py-20 text-text-muted text-xl italic">
                    No books found matching your search.
                </div>
            )}
        </div>
    );
}
