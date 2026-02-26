import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-bg-card border-t border-border py-12 mt-20">
            <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-xl font-bold mb-4 text-primary font-display">BookNest</h3>
                    <p className="text-text-muted text-sm leading-relaxed">
                        Bringing the world's stories to your doorstep. Your ultimate digital bookstore experience where every story find its place.
                    </p>
                </div>
                <div>
                    <h4 className="font-semibold mb-4 text-xs uppercase tracking-widest text-text-muted">Quick Links</h4>
                    <ul className="text-text-muted text-sm space-y-2">
                        <li><Link to="/shop" className="hover:text-primary transition-colors">Browse Books</Link></li>
                        <li><Link to="/orders" className="hover:text-primary transition-colors">My Orders</Link></li>
                        <li><Link to="/profile" className="hover:text-primary transition-colors">Profile Settings</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-4 text-xs uppercase tracking-widest text-text-muted">Support</h4>
                    <ul className="text-text-muted text-sm space-y-2">
                        <li><button className="hover:text-primary transition-colors text-left">FAQs</button></li>
                        <li><button className="hover:text-primary transition-colors text-left">Shipping Info</button></li>
                        <li><button className="hover:text-primary transition-colors text-left">Returns Policy</button></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-4 text-xs uppercase tracking-widest text-text-muted">Newsletter</h4>
                    <p className="text-text-muted text-sm mb-4">Subscribe for latest book releases and offers.</p>
                    <div className="flex gap-2">
                        <input type="email" placeholder="Email" className="bg-bg-dark border border-border rounded-none px-3 py-2 text-sm w-full outline-none focus:border-primary" />
                        <button className="btn-primary text-xs whitespace-nowrap shadow-lg shadow-primary/20">Join</button>
                    </div>
                </div>
            </div>
            <div className="container mt-12 pt-8 border-t border-border/50 text-center text-text-muted text-xs">
                &copy; {new Date().getFullYear()} BookNest. All rights reserved. Crafted with passion for readers.
            </div>
        </footer>
    );
};

export default Footer;
