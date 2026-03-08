import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, AlertCircle } from "lucide-react";
import { loginUser } from "../../api/auth";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const data = await loginUser(email, password);
            localStorage.setItem("admin_token", data.access_token);
            navigate("/admin");
        } catch (err) {
            setError(err.message || "Admin login failed");
        } finally {
            setLoading(false);
        }
    };

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
                {error && (
                    <div className="alert alert-error" style={{ color: "#ef4444", marginBottom: "1.5rem", fontSize: "0.9rem", textAlign: "center" }}>
                        <AlertCircle size={16} className="icon-inline" /> {error}
                    </div>
                )}
                <form className="admin-login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Admin Email</label>
                        <input type="email" placeholder="admin@luxe.store" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Passcode</label>
                        <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                        {loading ? "Verifying..." : "Sign In"}
                    </button>
                </form>
                <div className="admin-login-footer">
                    <Link to="/">← Return to Storefront</Link>
                </div>
            </div>
        </div>
    );
}
