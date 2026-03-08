import { ShoppingBag, ChevronRight, Star, TrendingUp } from "lucide-react";

export default function Home() {
    return (
        <div className="storefront-home fade-in">
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">Discover the Future of Shopping</h1>
                    <p className="hero-subtitle">Premium curations for your modern lifestyle. Start exploring today.</p>
                    <button className="btn btn-primary btn-large">
                        Shop Now <ChevronRight size={20} />
                    </button>
                </div>
            </section>

            <section className="featured-section">
                <div className="section-header">
                    <h2><TrendingUp className="icon-inline" /> Trending Products</h2>
                </div>
                <div className="product-grid">
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="product-card">
                            <div className="product-image-placeholder">
                                <ShoppingBag size={48} className="placeholder-icon" />
                            </div>
                            <div className="product-info">
                                <div className="product-title">Premium Minimalist Item {item}</div>
                                <div className="product-price">$129.00</div>
                                <div className="product-rating">
                                    <Star size={16} fill="var(--color-accent)" color="var(--color-accent)" /> 4.9 (120 reviews)
                                </div>
                            </div>
                            <button className="btn btn-secondary w-full">Add to Cart</button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
