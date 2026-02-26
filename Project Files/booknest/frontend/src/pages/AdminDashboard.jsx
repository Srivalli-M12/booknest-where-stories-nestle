import { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Users, BookOpen, AlertCircle, CheckCircle, XCircle, Trash2, Search, ShoppingCart } from 'lucide-react';

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [books, setBooks] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [bookSearchTerm, setBookSearchTerm] = useState('');

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [usersRes, booksRes, ordersRes] = await Promise.all([
                axios.get('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/admin/books', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/orders', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setUsers(usersRes.data.data || usersRes.data); // Handle different response formats if any
            setBooks(booksRes.data.data || booksRes.data);
            setOrders(ordersRes.data.data || ordersRes.data);
        } catch (error) {
            console.error('Error fetching admin data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/admin/sellers/${id}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAdminData();
        } catch (error) {
            alert('Approval failed');
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAdminData();
        } catch (error) {
            alert('Deletion failed');
        }
    };

    const handleDeleteBook = async (id) => {
        if (!window.confirm('Are you sure you want to permanently remove this book from the site?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/books/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAdminData();
        } catch (error) {
            alert('Book removal failed');
        }
    };

    const handleDeliver = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/orders/${id}/deliver`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAdminData();
        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            alert('Delivery update failed: ' + msg);
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        u.businessName?.toLowerCase().includes(userSearchTerm.toLowerCase())
    );

    const filteredBooks = books.filter(b =>
        b.title.toLowerCase().includes(bookSearchTerm.toLowerCase()) ||
        b.authors.some(a => a.toLowerCase().includes(bookSearchTerm.toLowerCase())) ||
        b.seller?.name.toLowerCase().includes(bookSearchTerm.toLowerCase())
    );

    return (
        <div className="container py-10 pb-32">
            <h1 className="text-6xl font-bold font-display mb-20 flex items-center gap-6 tracking-tight">
                <Shield className="text-primary" size={56} />
                Admin Console
            </h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {[
                    { label: 'Total Users', value: users.length, icon: Users, color: 'text-blue-400' },
                    { label: 'Sellers', value: users.filter(u => u.role === 'seller').length, icon: BookOpen, color: 'text-green-400' },
                    { label: 'Pending Approvals', value: users.filter(u => u.role === 'seller' && !u.isApproved).length, icon: AlertCircle, color: 'text-yellow-400' },
                    { label: 'Total Books', value: books.length, icon: Shield, color: 'text-pink-400' },
                ].map((stat, i) => (
                    <div key={i} className="glass-morphism p-6 rounded-none text-center">
                        <stat.icon size={24} className={`mx-auto mb-3 ${stat.color}`} />
                        <h3 className="text-2xl font-bold">{stat.value}</h3>
                        <p className="text-text-muted text-xs uppercase tracking-wider">{stat.label}</p>
                    </div>
                ))}
                <div className="glass-morphism p-6 rounded-none text-center">
                    <Shield size={24} className="mx-auto mb-3 text-orange-400" />
                    <h3 className="text-2xl font-bold">{orders.length}</h3>
                    <p className="text-text-muted text-xs uppercase tracking-wider">Total Orders</p>
                </div>
            </div>

            {/* Management Section */}
            <div className="space-y-12">
                {/* Pending Sellers */}
                <section>
                    <h2 className="text-2xl font-bold font-display mb-6 flex items-center gap-2">
                        <AlertCircle className="text-yellow-400" size={24} />
                        Seller Approvals
                    </h2>
                    <div className="glass-morphism rounded-none overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-bg-dark/50 text-text-muted text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Business Name</th>
                                        <th className="px-6 py-4 font-semibold">Owner</th>
                                        <th className="px-6 py-4 font-semibold">Email</th>
                                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {users.filter(u => u.role === 'seller' && !u.isApproved).map((seller) => (
                                        <tr key={seller._id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-bold text-primary">{seller.businessName}</td>
                                            <td className="px-6 py-4 text-sm">{seller.name}</td>
                                            <td className="px-6 py-4 text-sm text-text-muted">{seller.email}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleApprove(seller._id)} className="p-2 text-green-400 hover:bg-green-400/10 rounded-none transition-all">
                                                        <CheckCircle size={20} />
                                                    </button>
                                                    <button className="p-2 text-secondary hover:bg-secondary/10 rounded-none transition-all">
                                                        <XCircle size={20} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.filter(u => u.role === 'seller' && !u.isApproved).length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="p-8 text-center text-text-muted italic">No pending seller registrations.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* User Moderation */}
                <section>
                    <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-6">
                        <h2 className="text-2xl font-bold font-display flex items-center gap-2">
                            <Users size={24} className="text-primary" />
                            User Moderation
                        </h2>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="bg-bg-dark border border-border rounded-none pl-16 pr-4 py-2 w-full text-sm outline-none focus:border-primary"
                                value={userSearchTerm}
                                onChange={e => setUserSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="glass-morphism rounded-none overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-bg-dark/50 text-text-muted text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">User</th>
                                        <th className="px-6 py-4 font-semibold">Role</th>
                                        <th className="px-6 py-4 font-semibold">Registration Date</th>
                                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {filteredUsers.map((u) => (
                                        <tr key={u._id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold">{u.name}</div>
                                                <div className="text-xs text-text-muted">{u.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[10px] px-2 py-1 rounded-none font-bold uppercase ${u.role === 'admin' ? 'bg-primary/10 text-primary' : u.role === 'seller' ? 'bg-green-400/10 text-green-400' : 'bg-white/5 text-text-muted'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-text-muted">
                                                {new Date(u.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => handleDeleteUser(u._id)} className="p-2 text-text-muted hover:text-secondary hover:bg-secondary/10 rounded-none transition-all">
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Site-wide Inventory */}
                <section>
                    <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-6">
                        <h2 className="text-2xl font-bold font-display flex items-center gap-2">
                            <BookOpen size={24} className="text-pink-400" />
                            Site Inventory Management
                        </h2>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                            <input
                                type="text"
                                placeholder="Search books..."
                                className="bg-bg-dark border border-border rounded-none pl-16 pr-4 py-2 w-full text-sm outline-none focus:border-primary"
                                value={bookSearchTerm}
                                onChange={e => setBookSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="glass-morphism rounded-none overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-bg-dark/50 text-text-muted text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Book</th>
                                        <th className="px-6 py-4 font-semibold">Seller</th>
                                        <th className="px-6 py-4 font-semibold text-center">Stock</th>
                                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {filteredBooks.map((b) => (
                                        <tr key={b._id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <img src={b.imageUrl} alt="" className="w-8 h-12 object-cover rounded shadow-lg" />
                                                    <div>
                                                        <div className="text-sm font-bold truncate max-w-[200px]">{b.title}</div>
                                                        <div className="text-xs text-text-muted">${b.price}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-semibold text-primary">{b.seller?.name}</div>
                                                <div className="text-[10px] text-text-muted">{b.seller?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`text-[10px] px-2 py-0.5 rounded-none font-bold ${b.stock > 0 ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
                                                    {b.stock}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => handleDeleteBook(b._id)} className="p-2 text-text-muted hover:text-secondary hover:bg-secondary/10 rounded-none transition-all">
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredBooks.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="p-8 text-center text-text-muted italic">No books found matching search.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Customer Orders */}
                <section>
                    <h2 className="text-2xl font-bold font-display mb-6 flex items-center gap-2">
                        <ShoppingCart size={24} className="text-primary" />
                        Customer Orders
                    </h2>
                    <div className="glass-morphism rounded-none overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-bg-dark/50 text-text-muted text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Order ID</th>
                                        <th className="px-6 py-4 font-semibold">Customer</th>
                                        <th className="px-6 py-4 font-semibold">Total</th>
                                        <th className="px-6 py-4 font-semibold">Status</th>
                                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {orders.map((order) => (
                                        <tr key={order._id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs">{order._id}</td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold">{order.user?.name}</div>
                                                <div className="text-[10px] text-text-muted">{new Date(order.createdAt).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold">${order.totalPrice.toFixed(2)}</td>
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
                                            <td colSpan="5" className="p-8 text-center text-text-muted italic">No orders found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
