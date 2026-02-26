import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Key, Bookmark, ShoppingBag, Settings, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
    const { user, updateProfile } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [businessName, setBusinessName] = useState(user?.businessName || '');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateProfile({ name, email, businessName });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-10 pb-32">
            <h1 className="text-6xl font-bold font-display mb-20 flex items-center gap-6 tracking-tight">
                <User className="text-primary" size={56} />
                My Profile
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Navigation Sidebar */}
                <div className="space-y-4">
                    <div className="glass-morphism p-6 rounded-none space-y-2">
                        <Link to="/profile" className="flex items-center justify-between p-3 bg-primary/10 text-primary rounded-none font-bold">
                            <span className="flex items-center gap-3"><Settings size={18} /> Account Settings</span>
                            <ChevronRight size={16} />
                        </Link>
                        {user?.role === 'user' && (
                            <>
                                <Link to="/orders" className="flex items-center justify-between p-3 hover:bg-white/5 rounded-none transition-all">
                                    <span className="flex items-center gap-3"><ShoppingBag size={18} /> Order History</span>
                                    <ChevronRight size={16} />
                                </Link>
                                <Link to="/wishlist" className="w-full flex items-center justify-between p-3 hover:bg-white/5 rounded-none transition-all text-left">
                                    <span className="flex items-center gap-3"><Bookmark size={18} /> My Wishlist</span>
                                    <ChevronRight size={16} />
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="glass-morphism p-6 rounded-none bg-secondary/5 border-secondary/20">
                        <h4 className="font-bold mb-2 flex items-center gap-2">
                            <Shield className="text-secondary" size={16} />
                            Security Status
                        </h4>
                        <p className="text-xs text-text-muted leading-relaxed">Your account is secured with 256-bit encryption. Always keep your password private.</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Info */}
                    <div className="glass-morphism p-8 rounded-none relative overflow-hidden">
                        <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                            <Settings className="text-primary" size={24} />
                            Personal Information
                        </h3>

                        {message.text && (
                            <div className={`mb-6 p-4 rounded-none text-sm font-medium animate-fade ${message.type === 'success' ? 'bg-green-400/10 text-green-400' : 'bg-secondary/10 text-secondary'}`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted px-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                        <input
                                            type="text"
                                            className="auth-input pl-16"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted px-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                        <input
                                            type="email"
                                            className="auth-input pl-16"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {user?.role === 'seller' && (
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted px-1">Business Name</label>
                                    <div className="relative">
                                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                        <input
                                            type="text"
                                            className="auth-input pl-16"
                                            value={businessName}
                                            onChange={(e) => setBusinessName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end pt-4">
                                <button type="submit" disabled={loading} className="btn-primary px-8 py-3 flex items-center gap-2">
                                    {loading ? 'Saving...' : 'Update Information'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Preferences Mock */}
                    <div className="glass-morphism p-8 rounded-none border-border/30">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-text-muted">
                            <Settings className="opacity-50" size={20} />
                            App Preferences
                        </h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Email Notifications', desc: 'Receive updates about your orders and recommendations' },
                                { label: 'Newsletter', desc: 'Stay updated with new arrivals and exclusive deals' },
                                { label: 'Two-Factor Authentication', desc: 'Add an extra layer of security to your account' }
                            ].map((pref, i) => (
                                <div key={i} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                                    <div>
                                        <p className="font-bold text-sm text-text-muted">{pref.label}</p>
                                        <p className="text-xs text-text-muted/60">{pref.desc}</p>
                                    </div>
                                    <div className="w-10 h-5 bg-border rounded-none relative cursor-not-allowed opacity-50">
                                        <div className="absolute left-1 top-1 w-3 h-3 bg-bg-dark rounded-none" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
