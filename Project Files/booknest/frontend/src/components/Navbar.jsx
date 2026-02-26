import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Book, Shield, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-morphism border-b border-border/50">
            <div className="container h-20 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold font-display tracking-tight flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-tr from-primary to-secondary rounded-none flex items-center justify-center text-white">B</div>
                    BookNest
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1"><Home size={16} /> Home</Link>
                    <Link to="/shop" className="hover:text-primary transition-colors flex items-center gap-1"><Book size={16} /> Shop</Link>

                    {user?.role === 'admin' && (
                        <Link to="/admin/dashboard" className="text-primary font-bold flex items-center gap-1"><Shield size={16} /> Admin</Link>
                    )}

                    {user?.role === 'seller' && (
                        <Link to="/seller/dashboard" className="text-primary font-bold flex items-center gap-1">Seller Hub</Link>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <Link to="/cart" className="p-2 hover:bg-white/5 rounded-none transition-all relative">
                        <ShoppingCart size={22} />
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-3 pl-4 border-l border-border">
                            <Link to="/profile" className="flex items-center gap-2 hover:text-primary transition-all">
                                <div className="w-8 h-8 rounded-none bg-primary/20 flex items-center justify-center text-primary">
                                    <User size={18} />
                                </div>
                                <span className="hidden lg:block font-semibold">{user.name}</span>
                            </Link>
                            <button onClick={handleLogout} className="p-2 text-text-muted hover:text-secondary rounded-none transition-all">
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn-primary flex items-center gap-2">
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
