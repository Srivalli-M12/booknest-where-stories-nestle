import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            redirectUser(user.role);
        }
    }, [user, navigate]);

    const redirectUser = (role) => {
        if (role === 'admin') navigate('/admin/dashboard');
        else if (role === 'seller') navigate('/seller/dashboard');
        else navigate('/');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const processedEmail = email.trim().toLowerCase();
        console.log('Attempting login for:', processedEmail);

        const result = await login(processedEmail, password);

        if (!result.success) {
            console.error('Login result failure:', result.message);
            setError(result.message);
            setLoading(false);
        }
    };

    return (
        <div className="container min-h-[70vh] flex items-center justify-center py-24">
            <div className="glass-morphism p-10 md:p-12 rounded-none w-full max-w-lg space-y-10 animate-fade">
                <div className="text-center">
                    <h2 className="text-3xl font-bold font-display">Welcome Back</h2>
                    <p className="text-text-muted mt-2">Enter your credentials to access your account</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-none text-sm text-center animate-shake">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className="text-sm font-medium px-1">Email Address</label>
                        <input
                            type="email"
                            required
                            className="bg-bg-dark border border-border rounded-none px-4 py-3 w-full outline-none focus:border-primary transition-all text-sm"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium px-1">Password</label>
                        <input
                            type="password"
                            required
                            className="bg-bg-dark border border-border rounded-none px-4 py-3 w-full outline-none focus:border-primary transition-all text-sm"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-3 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="text-center text-sm">
                    <span className="text-text-muted">Don't have an account? </span>
                    <Link to="/register" className="text-primary font-semibold hover:underline">Create one</Link>
                </div>
            </div>
        </div>
    );
}
