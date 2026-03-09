import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Package, Settings, LogOut, Hexagon, Store, MapPin, Globe, Map, ShoppingCart } from "lucide-react";

export default function AdminLayout() {
    const location = useLocation();

    const navItems = [
        { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
        { name: "Users", path: "/admin/users", icon: Users },
        { name: "Merchants", path: "/admin/merchants", icon: Store },
        { name: "Addresses", path: "/admin/addresses", icon: MapPin },
        { name: "Countries", path: "/admin/countries", icon: Globe },
        { name: "Provinces", path: "/admin/provinces", icon: Map },
        { name: "Inventory", path: "/admin/inventory", icon: Package },
        { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
        { name: "Settings", path: "/admin/settings", icon: Settings },
    ];

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <Hexagon className="logo-icon" size={28} />
                    <h2>AdminZone</h2>
                </div>
                <nav className="admin-nav">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`admin-nav-item ${isActive ? "active" : ""}`}
                            >
                                <Icon size={20} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="admin-sidebar-footer">
                    <Link to="/" className="admin-nav-item logout">
                        <LogOut size={20} />
                        <span>Storefront</span>
                    </Link>
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-header">
                    <div className="admin-header-title">
                        <h1>
                            {location.pathname.startsWith('/admin/merchants') ? 'Merchants' :
                                location.pathname.startsWith('/admin/users') ? 'Users' :
                                    location.pathname.startsWith('/admin/addresses') ? 'Addresses' :
                                        location.pathname.startsWith('/admin/countries') ? 'Countries' :
                                            location.pathname.startsWith('/admin/provinces') ? 'Provinces' :
                                                location.pathname.startsWith('/admin/inventory') ? 'Inventory' :
                                                    location.pathname.startsWith('/admin/orders') ? 'Orders' :
                                                        location.pathname.startsWith('/admin/settings') ? 'Settings' :
                                                            'Dashboard'}
                        </h1>
                    </div>
                    <div className="admin-header-actions">
                        <div className="admin-user-profile">
                            <span className="user-avatar">A</span>
                            <span className="user-name">Admin</span>
                        </div>
                    </div>
                </header>
                <div className="admin-content-area">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
