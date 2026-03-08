import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Search as SearchIcon, ShoppingCart, Menu } from 'lucide-react';
import { getCurrentUser } from '../../api/auth';
import './Header.css';

const Header = ({ user: initialUser }) => {
    const [user, setUser] = useState(initialUser || null);
    const [searchCategory, setSearchCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async (forceFetch = false) => {
            const token = localStorage.getItem("token");
            if (!token) {
                setUser(null);
                localStorage.removeItem("user");
                return;
            }

            // check cache first for instant load
            if (!forceFetch) {
                const cachedUser = localStorage.getItem("user");
                if (cachedUser) {
                    try {
                        setUser(JSON.parse(cachedUser));
                    } catch (e) {
                        console.error("Failed to parse cached user");
                    }
                }
            }

            try {
                const userData = await getCurrentUser(token);
                setUser(userData);
                localStorage.setItem("user", JSON.stringify(userData));
            } catch (err) {
                console.error("Failed to fetch current user", err);
                if (err.message.includes("401") || err.message.toLowerCase().includes("unauthorized") || err.message.includes("fetch user")) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    setUser(null);
                }
            }
        };

        fetchUser();

        const handleAuthChange = () => {
            fetchUser(true);
        };

        const handleStorageChange = (e) => {
            if (e.key === "token" || e.key === "user") {
                fetchUser();
            }
        };

        window.addEventListener("authChange", handleAuthChange);
        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("authChange", handleAuthChange);
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        window.dispatchEvent(new Event("authChange"));
        navigate("/login");
    };

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Searching for", searchQuery, "in", searchCategory);
        // Integrate with actual search later
    };

    return (
        <header className="storefront-header-wrapper">
            {/* Main Top Nav */}
            <div className="amazon-header">
                {/* Logo */}
                <Link to="/" className="nav-logo">
                    <span>Luxe<span className="accent">Store</span></span>
                </Link>

                {/* Location Dropdown */}
                <div className="nav-item nav-location">
                    <MapPin size={18} className="icon" />
                    <div>
                        <div className="line-1">Deliver to</div>
                        <div className="line-2">Canada</div>
                    </div>
                </div>

                {/* Search Bar */}
                <form className="nav-search" onSubmit={handleSearch}>
                    <select
                        className="nav-search-select"
                        value={searchCategory}
                        onChange={(e) => setSearchCategory(e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Home">Home</option>
                        <option value="Toys">Toys</option>
                    </select>
                    <input
                        type="text"
                        className="nav-search-input"
                        placeholder="Search LuxeStore"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="nav-search-btn" aria-label="Search">
                        <SearchIcon size={20} />
                    </button>
                </form>

                {/* Right Nav Tools */}
                <div className="nav-tools">

                    {/* Language Selector */}
                    <div className="nav-item nav-dropdown-trigger">
                        <div className="nav-language">
                            <span role="img" aria-label="US Flag">🇺🇸</span> EN <span style={{ fontSize: '10px' }}>▼</span>
                        </div>
                        {/* Hover Dropdown */}
                        <div className="nav-dropdown-content nav-language-dropdown">
                            <div className="dropdown-section">
                                <div style={{ fontWeight: 700, marginBottom: '8px' }}>Change language</div>
                                <label className="dropdown-line">
                                    <input type="radio" name="lang" className="dropdown-radio" defaultChecked /> English - EN
                                </label>
                                <label className="dropdown-line">
                                    <input type="radio" name="lang" className="dropdown-radio" /> español - ES
                                </label>
                                <label className="dropdown-line">
                                    <input type="radio" name="lang" className="dropdown-radio" /> Français - FR
                                </label>
                            </div>
                            <div className="dropdown-section">
                                <div style={{ fontWeight: 700, marginBottom: '8px' }}>Change currency</div>
                                <label className="dropdown-line">
                                    <input type="radio" name="currency" className="dropdown-radio" /> CA$ - CAD - Canadian Dollar
                                </label>
                                <label className="dropdown-line">
                                    <input type="radio" name="currency" className="dropdown-radio" defaultChecked /> $ - USD - US Dollar
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Account & Lists */}
                    <div className="nav-item nav-dropdown-trigger">
                        <Link to={user ? "/account" : "/login"} className="nav-item-content">
                            <div className="line-1">Hello, {user ? user.first_name || user.email.split('@')[0] : "sign in"}</div>
                            <div className="line-2">Account & Lists <span style={{ fontSize: '10px', marginLeft: '4px' }}>▼</span></div>
                        </Link>

                        {/* Hover Dropdown */}
                        <div className="nav-dropdown-content nav-account-dropdown">
                            {user ? (
                                // Logged In Dropdown
                                <>
                                    <div className="account-dropdown-top account-dropdown-profile">
                                        <div className="profile-selector">
                                            <span>Who's shopping? Select a profile.</span>
                                            <Link to="/profiles/manage">Manage Profiles <span className="arrow-right">›</span></Link>
                                        </div>
                                    </div>

                                    <div className="account-dropdown-bottom">
                                        <div className="account-lists-section">
                                            <h3>Your Lists</h3>
                                            <Link to="/account/lists/shopping">Shopping List</Link>
                                            <Link to="/account/lists/watch">Watch</Link>
                                            <div className="divider" style={{ margin: '10px 0', borderBottom: '1px solid #eee' }}></div>
                                            <Link to="/account/lists/create">Create a Wish List</Link>
                                            <Link to="/account/lists/any-website">Wish from Any Website</Link>
                                            <Link to="/account/lists/books">Your Saved Books</Link>
                                            <Link to="/account/lists/gift">Find a Gift</Link>
                                            <Link to="/account/lists/baby">Baby Registry</Link>
                                            <Link to="/account/lists/wedding">Wedding Registry</Link>
                                            <Link to="/account/lists/style">Discover Your Style</Link>
                                            <Link to="/account/lists/showroom">Explore Showroom</Link>
                                        </div>

                                        <div className="account-links-section">
                                            <h3>Your Account</h3>
                                            <Link to="/account/switch">Switch Accounts</Link>
                                            <a href="#" onClick={handleLogout}>Sign Out</a>
                                            <div className="divider" style={{ margin: '10px 0', borderBottom: '1px solid #eee' }}></div>
                                            <Link to="/account">Your Account</Link>
                                            <Link to="/orders">Your Orders</Link>
                                            <Link to="/account/keep-shopping">Keep shopping for</Link>
                                            <Link to="/account/recommendations">Your Recommendations</Link>
                                            <Link to="/returns">Returns</Link>
                                            <Link to="/account/recalls">Recalls and Product Safety Alerts</Link>
                                            <Link to="/account/subscribe">Your Subscribe & Save Items</Link>
                                            <Link to="/account/prime">Your Prime Membership</Link>
                                            <Link to="/account/memberships">Memberships & Subscriptions</Link>
                                            <Link to="/account/credit-card">Your Amazon Credit Card</Link>
                                            <Link to="/account/content">Content Library</Link>
                                            <Link to="/account/devices">Devices</Link>
                                            <Link to="/account/music">Your Music Library</Link>
                                            <Link to="/account/video">Your Prime Video</Link>
                                            <Link to="/account/photos">Your Amazon Photos</Link>
                                            <Link to="/account/apps">Your Apps & Devices</Link>
                                            <Link to="/account/business">Create your free business account</Link>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                // Logged Out Dropdown
                                <>
                                    <div className="account-dropdown-top">
                                        <Link to="/login" className="btn btn-primary w-full" style={{ backgroundColor: '#ffd814', color: '#111' }}>Sign in</Link>
                                        <div className="new-customer-text">
                                            New customer? <Link to="/register">Start here.</Link>
                                        </div>
                                    </div>

                                    <div className="account-dropdown-bottom">
                                        <div className="account-lists-section">
                                            <h3>Your Lists</h3>
                                            <Link to="/account/lists/create">Create a List</Link>
                                            <Link to="/account/lists/find">Find a List or Registry</Link>
                                        </div>

                                        <div className="account-links-section">
                                            <h3>Your Account</h3>
                                            <Link to="/account">Account</Link>
                                            <Link to="/orders">Orders</Link>
                                            <Link to="/account/recommendations">Recommendations</Link>
                                            <Link to="/account/history">Browsing History</Link>
                                            <Link to="/account/preferences">Your Shopping preferences</Link>
                                            <Link to="/account/watchlist">Watchlist</Link>
                                            <Link to="/account/video">Video Purchases & Rentals</Link>
                                            <Link to="/account/kindle">Kindle Unlimited</Link>
                                            <Link to="/account/devices">Content & Devices</Link>
                                            <Link to="/account/subscribe">Subscribe & Save Items</Link>
                                            <Link to="/account/memberships">Memberships & Subscriptions</Link>
                                            <Link to="/account/music">Music Library</Link>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Returns & Orders */}
                    <Link to="/orders" className="nav-item">
                        <div className="line-1">Returns</div>
                        <div className="line-2">& Orders</div>
                    </Link>

                    {/* Cart */}
                    <Link to="/cart" className="nav-item nav-cart">
                        <div className="nav-cart-icon-wrapper">
                            <span className="nav-cart-count">0</span>
                            <ShoppingCart size={32} />
                        </div>
                        <span className="nav-cart-text">Cart</span>
                    </Link>

                </div>
            </div>

            {/* Bottom Nav Bar */}
            <div className="amazon-nav-bottom">
                <div className="nav-bottom-item">
                    <Menu size={20} /> All
                </div>
                <div className="nav-bottom-item">Today's Deals</div>
                <div className="nav-bottom-item">Customer Service</div>
                <div className="nav-bottom-item">Registry</div>
                <div className="nav-bottom-item">Gift Cards</div>
                <div className="nav-bottom-item">Sell</div>
            </div>
        </header>
    );
};

export default Header;
