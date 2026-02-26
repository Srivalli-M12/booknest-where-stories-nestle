import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',
        businessName: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') navigate('/admin/dashboard');
            else if (user.role === 'seller') navigate('/seller/dashboard');
            else navigate('/');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const processedData = {
            ...formData,
            email: formData.email.trim().toLowerCase()
        };

        const result = await register(processedData);

        if (!result.success) {
            setError(result.message);
            setLoading(false);
        }
    };

    return (
        <div className="container min-h-[70vh] flex items-center justify-center py-24">
            <div className="glass-morphism p-10 md:p-12 rounded-none w-full max-w-lg space-y-8 animate-fade">
                <div className="text-center">
                    <h2 className="text-3xl font-bold font-display">Create Account</h2>
                    <p className="text-text-muted mt-2">Join the BookNest community today</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-none text-sm text-center">
                        {error}
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className="text-sm font-medium px-1">Full Name</label>
                        <input
                            type="text"
                            required
                            className="bg-bg-dark border border-border rounded-none px-4 py-3 w-full outline-none focus:border-primary transition-all text-sm"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium px-1">Email Address</label>
                        <input
                            type="email"
                            required
                            className="bg-bg-dark border border-border rounded-none px-4 py-3 w-full outline-none focus:border-primary transition-all text-sm"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium px-1">Password</label>
                        <input
                            type="password"
                            required
                            className="bg-bg-dark border border-border rounded-none px-4 py-3 w-full outline-none focus:border-primary transition-all text-sm"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium px-1">Account Type</label>
                        <select
                            className="bg-bg-dark border border-border rounded-none px-4 py-3 w-full outline-none focus:border-primary transition-all text-sm appearance-none"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="user">Reader</option>
                            <option value="seller">Seller</option>
                        </select>
                    </div>

                    {formData.role === 'seller' && (
                        <div className="space-y-2 animate-fade">
                            <label className="text-sm font-medium px-1">Business Name</label>
                            <input
                                type="text"
                                required
                                className="bg-bg-dark border border-border rounded-none px-4 py-3 w-full outline-none focus:border-primary transition-all text-sm"
                                placeholder="Your Bookstore Name"
                                value={formData.businessName}
                                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-3 mt-4 disabled:opacity-50"
                    >
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <div className="text-center text-sm">
                    <span className="text-text-muted">Already have an account? </span>
                    <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
                </div>
            </div>
        </div>
    );
}
