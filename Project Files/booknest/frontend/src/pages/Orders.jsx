import { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Calendar, DollarSign, ChevronRight } from 'lucide-react';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get('/api/orders/myorders', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="container py-20 text-center animate-pulse text-text-muted">Loading your orders...</div>;

    return (
        <div className="container py-10 pb-32">
            <h1 className="text-6xl font-bold font-display mb-20 tracking-tight">My Order History</h1>

            {orders.length > 0 ? (
                <div className="space-y-8">
                    {orders.map(order => (
                        <div key={order._id} className="glass-morphism rounded-none overflow-hidden animate-fade border-border/40 hover:border-primary/30 transition-all">
                            <div className="bg-bg-dark/50 p-6 border-b border-border flex flex-wrap justify-between items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-primary/10 rounded-none text-primary">
                                        <Package size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-text-muted uppercase tracking-widest font-bold">Order ID</p>
                                        <p className="font-mono text-sm">{order._id}</p>
                                    </div>
                                </div>
                                <div className="flex gap-8">
                                    <div>
                                        <p className="text-xs text-text-muted uppercase tracking-widest font-bold">Date</p>
                                        <p className="text-sm flex items-center gap-1"><Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-text-muted uppercase tracking-widest font-bold">Total</p>
                                        <p className="text-sm font-bold text-primary flex items-center gap-1"><DollarSign size={14} /> {order.totalPrice.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-text-muted uppercase tracking-widest font-bold">Status</p>
                                        <span className={`text-[10px] px-2 py-1 rounded-none font-bold uppercase ${order.status === 'Delivered' ? 'bg-green-400/10 text-green-400' : 'bg-yellow-400/10 text-yellow-400'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-b border-border/20 bg-white/1">
                                <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-3">Shipping Information</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="font-bold">{order.shippingAddress?.address}</p>
                                        <p className="text-text-muted">{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                                        <p className="text-text-muted">{order.shippingAddress?.country}</p>
                                    </div>
                                    <div className="md:text-right">
                                        <p className="text-text-muted">{order.shippingAddress?.email}</p>
                                        <p className="text-text-muted">{order.shippingAddress?.phone}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                {order.orderItems.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 group">
                                        <img src={item.image} alt="" className="w-12 h-16 object-cover rounded-none shadow-md group-hover:scale-105 transition-transform" />
                                        <div className="flex-grow">
                                            <p className="font-bold text-sm">{item.title}</p>
                                            <p className="text-xs text-text-muted">Quantity: {item.quantity} × ${item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 glass-morphism rounded-none border-dashed border-2 border-border/30">
                    <Package size={64} className="mx-auto text-text-muted mb-4 opacity-30" />
                    <h2 className="text-2xl font-bold">No orders found</h2>
                    <p className="text-text-muted mt-2">You haven't placed any orders yet.</p>
                    <Link to="/shop" className="btn-primary inline-flex items-center gap-2 mt-8 py-3">
                        Start Shopping
                        <ChevronRight size={18} />
                    </Link>
                </div>
            )}
        </div>
    );
}
