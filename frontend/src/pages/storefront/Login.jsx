import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, AlertCircle } from "lucide-react";
import { loginUser } from "../../api/auth";

export default function Login() {
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
            localStorage.setItem("token", data.access_token);
            navigate("/");
        } catch (err) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container fade-in">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Welcome Back</h2>
                    <p>Login to view your orders and account features.</p>
                </div>
                {error && (
                    <div className="alert alert-error" style={{ color: "red", marginBottom: "1rem", fontSize: "0.9rem" }}>
                        <AlertCircle size={16} className="icon-inline" /> {error}
                    </div>
                )}
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                        <LogIn size={18} className="icon-inline" /> {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>
                <div className="auth-footer">
                    <p><Link to="/forgot-password" style={{ display: 'block', marginBottom: '0.5rem' }}>Forgot password?</Link></p>
                    <p>Don&apos;t have an account? <Link to="/register">Create one here</Link></p>
                </div>
            </div>
        </div>
    );
}
