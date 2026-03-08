import { Lock } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminLogin() {
    return (
        <div className="admin-login-container fade-in">
            <div className="admin-login-card">
                <div className="admin-login-header">
                    <div className="icon-wrapper">
                        <Lock size={32} />
                    </div>
                    <h2>Admin Access</h2>
                    <p>Login to manage the platform</p>
                </div>
                <form className="admin-login-form">
                    <div className="form-group">
                        <label>Admin ID</label>
                        <input type="text" placeholder="admin@luxe.store" />
                    </div>
                    <div className="form-group">
                        <label>Passcode</label>
                        <input type="password" placeholder="••••••••" />
                    </div>
                    <button className="btn btn-primary w-full">Sign In</button>
                </form>
                <div className="admin-login-footer">
                    <Link to="/">← Return to Storefront</Link>
                </div>
            </div>
        </div>
    );
}
