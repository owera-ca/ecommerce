import { Outlet, Link } from "react-router-dom";
import { ShoppingBag, Search, User, Menu } from "lucide-react";

export default function StorefrontLayout() {
    return (
        <div className="storefront-layout">
            <header className="storefront-header">
                <div className="storefront-header-content container">
                    <Link to="/" className="storefront-logo">
                        <ShoppingBag className="logo-icon" size={24} />
                        <span>LuxeStore</span>
                    </Link>

                    <nav className="storefront-nav">
                        <Link to="/" className="nav-link">Shop</Link>
                        <Link to="/" className="nav-link">Collections</Link>
                        <Link to="/" className="nav-link">About</Link>
                    </nav>

                    <div className="storefront-actions">
                        <button className="icon-btn" aria-label="Search"><Search size={20} /></button>
                        <Link to="/login" className="btn btn-outline btn-small"><User size={16} className="icon-inline" /> Login</Link>
                        <button className="icon-btn mobile-menu" aria-label="Menu"><Menu size={24} /></button>
                    </div>
                </div>
            </header>

            <main className="storefront-main flex-grow container">
                <Outlet />
            </main>

            <footer className="storefront-footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <ShoppingBag size={24} />
                            <span>LuxeStore</span>
                        </div>
                        <p className="footer-text">&copy; {new Date().getFullYear()} LuxeStore. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
