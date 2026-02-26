import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Book, DollarSign, Users, Edit, Trash2, X, Package, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SellerDashboard() {
    const { user } = useAuth();
    const [books, setBooks] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        stock: '',
        authors: '',
        genres: '',
        imageUrl: ''
    });

    useEffect(() => {
        fetchSellerBooks();
        fetchSellerOrders();
    }, []);

    const fetchSellerOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('/api/orders/seller', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(data.data || data);
        } catch (error) {
            console.error('Error fetching seller orders', error);
        }
    };

    const fetchSellerBooks = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('/api/books', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Filter books by current seller
            setBooks(data.data.filter(b => b.seller._id === user.id));
        } catch (error) {
            console.error('Error fetching books', error);
        }
    };

    const handleCreateBook = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const bookData = {
                ...formData,
                authors: formData.authors.split(',').map(a => a.trim()),
                genres: formData.genres.split(',').map(g => g.trim())
            };
            await axios.post('/api/books', bookData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsModalOpen(false);
            setFormData({ title: '', description: '', price: '', stock: '', authors: '', genres: '', imageUrl: '' });
            fetchSellerBooks();
        } catch (error) {
            alert('Error creating book: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this listing?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/books/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchSellerBooks();
        } catch (error) {
            alert('Error deleting book');
        }
    };

    const handleDeliver = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/orders/${id}/deliver`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchSellerOrders();
        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            alert('Error updating delivery status: ' + msg);
        }
    };

    return (
        <div className="container py-10 pb-32">
            <div className="flex justify-between items-center mb-20 gap-8">
                <div>
                    <h1 className="text-6xl font-bold font-display tracking-tight">Seller Dashboard</h1>
                    <p className="text-text-muted text-xl mt-4 font-light italic">{user?.businessName || 'Your Bookstore'}</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add New Book
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {[
                    { label: 'Active Listings', value: books.length, icon: Book, color: 'text-blue-400' },
                    { label: 'Total Stock', value: books.reduce((acc, b) => acc + b.stock, 0), icon: Package, color: 'text-green-400' },
                    { label: 'Sales Orders', value: orders.length, icon: DollarSign, color: 'text-pink-400' },
                ].map((stat, i) => (
                    <div key={i} className="glass-morphism p-8 rounded-none flex items-center gap-6">
                        <div className={`p-4 rounded-none bg-bg-dark border border-border ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-text-muted text-sm">{stat.label}</p>
                            <h3 className="text-3xl font-bold">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Inventory Table */}
            <div className="glass-morphism rounded-none overflow-hidden animate-fade">
                <div className="p-6 border-b border-border">
                    <h3 className="text-xl font-bold">Inventory Management</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-bg-dark/50 text-text-muted text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Book Info</th>
                                <th className="px-6 py-4 font-semibold">Stock</th>
                                <th className="px-6 py-4 font-semibold">Price</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {books.map((book) => (
                                <tr key={book._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <img src={book.imageUrl} alt="" className="w-10 h-14 object-cover rounded-none" />
                                            <div>
                                                <p className="font-bold text-sm">{book.title}</p>
                                                <p className="text-xs text-text-muted">{book.authors.join(', ')}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">{book.stock}</td>
                                    <td className="px-6 py-4 text-sm font-bold">${book.price}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] px-2 py-1 rounded-none font-bold uppercase ${book.stock > 0 ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
                                            {book.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 hover:text-primary transition-colors"><Edit size={18} /></button>
                                            <button onClick={() => handleDelete(book._id)} className="p-2 hover:text-secondary transition-colors"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {books.length === 0 && (
                        <div className="p-12 text-center text-text-muted italic">
                            No books listed yet.
                        </div>
                    )}
                </div>
            </div>

            {/* Create Book Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-bg-dark/80 backdrop-blur-sm">
                    <div className="glass-morphism w-full max-w-2xl p-8 rounded-none relative animate-fade shadow-2xl">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-6 right-6 text-text-muted hover:text-white"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-bold font-display mb-8">List New Book</h2>

                        <form onSubmit={handleCreateBook} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 col-span-2">
                                <label className="text-sm font-medium">Book Title</label>
                                <input required className="bg-bg-dark border border-border rounded-none px-4 py-3 w-full outline-none focus:border-primary text-sm" placeholder="The Art of Coding" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Authors <span className="text-[10px] text-text-muted">(comma separated)</span></label>
                                <input required className="bg-bg-dark border border-border rounded-none px-4 py-3 w-full outline-none focus:border-primary text-sm transition-all" placeholder="John Doe, Jane Smith" value={formData.authors} onChange={e => setFormData({ ...formData, authors: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Genres <span className="text-[10px] text-text-muted">(comma separated)</span></label>
                                <input required className="bg-bg-dark border border-border rounded-none px-4 py-3 w-full outline-none focus:border-primary text-sm transition-all" placeholder="Fiction, Classic, Sci-Fi" value={formData.genres} onChange={e => setFormData({ ...formData, genres: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Price ($)</label>
                                <input type="number" step="0.01" required className="bg-bg-dark border border-border rounded-none px-4 py-3 w-full outline-none focus:border-primary text-sm" placeholder="29.99" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Initial Stock</label>
                                <input type="number" required className="bg-bg-dark border border-border rounded-none px-4 py-3 w-full outline-none focus:border-primary text-sm" placeholder="10" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <label className="text-sm font-medium">Description</label>
                                <textarea required rows="3" className="bg-bg-dark border border-border rounded-none px-4 py-3 w-full outline-none focus:border-primary text-sm resize-none" placeholder="Enter book description..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <label className="text-sm font-medium">Image URL</label>
                                <input className="bg-bg-dark border border-border rounded-none px-4 py-3 w-full outline-none focus:border-primary text-sm" placeholder="https://unsplash.com/..." value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
                            </div>

                            <div className="col-span-2 pt-4">
                                <button type="submit" className="btn-primary w-full py-4 rounded-none font-bold flex items-center justify-center gap-2">
                                    <Save size={20} />
                                    Publish Listing
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Sales Orders */}
            <div className="mt-12 glass-morphism rounded-none overflow-hidden animate-fade">
                <div className="p-6 border-b border-border flex items-center gap-2">
                    <DollarSign className="text-secondary" size={24} />
                    <h3 className="text-xl font-bold">Sales Orders</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-bg-dark/50 text-text-muted text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Order ID</th>
                                <th className="px-6 py-4 font-semibold">Customer</th>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-text-muted">{order._id}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold">{order.user?.name}</div>
                                        <div className="text-[10px] text-text-muted">{order.user?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] px-2 py-1 rounded-none font-bold uppercase ${order.isDelivered ? 'bg-green-400/10 text-green-400' : 'bg-yellow-400/10 text-yellow-400'}`}>
                                            {order.isDelivered ? 'Delivered' : 'Processing'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {!order.isDelivered && (
                                            <button onClick={() => handleDeliver(order._id)} className="text-xs font-bold uppercase tracking-widest text-primary hover:underline transition-all">
                                                Mark Delivered
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-text-muted italic">No sales orders found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
