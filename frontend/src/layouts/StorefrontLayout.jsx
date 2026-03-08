import { Outlet, Link } from "react-router-dom";
import { ShoppingBag, Search, User, Menu } from "lucide-react";
import Header from "../components/Header/Header";

export default function StorefrontLayout() {
    return (
        <div className="storefront-layout">
            <Header />

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
