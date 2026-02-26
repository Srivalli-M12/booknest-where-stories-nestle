import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';

const Home = () => {
    return (
        <div className="container min-h-[70vh] flex flex-col justify-center py-20">
            <section className="max-w-4xl animate-fade space-y-12">
                <div className="space-y-8">
                    <h1 className="text-6xl md:text-8xl leading-[1.1] font-display tracking-tight">
                        Discover Your Next <br />
                        <span className="bg-gradient-to-r from-primary via-secondary to-primary animate-gradient bg-clip-text text-transparent">
                            Great Adventure
                        </span>
                    </h1>
                    <p className="text-text-muted text-xl md:text-2xl max-w-2xl leading-relaxed font-light">
                        Explore thousands of books across all genres. From timeless classics to the latest bestsellers,
                        <span className="text-text-main font-medium"> BookNest</span> is where every story finds its rightful place.
                    </p>
                </div>

                <div className="flex flex-wrap gap-8 pt-4">
                    <Link to="/shop" className="btn-primary px-10 py-5 text-lg group">
                        Browse Collection
                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={22} />
                    </Link>
                    <Link to="/register" className="glass-morphism px-10 py-5 rounded-none border border-white/10 hover:bg-white/5 transition-all text-lg font-bold flex items-center gap-2">
                        <BookOpen size={22} className="text-primary" />
                        Join BookNest
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
