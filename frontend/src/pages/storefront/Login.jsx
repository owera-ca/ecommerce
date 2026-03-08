import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";

export default function Login() {
    return (
        <div className="auth-container fade-in">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Welcome Back</h2>
                    <p>Login to view your orders and account features.</p>
                </div>
                <form className="auth-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" placeholder="you@example.com" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" placeholder="••••••••" />
                    </div>
                    <button className="btn btn-primary w-full">
                        <LogIn size={18} className="icon-inline" /> Sign In
                    </button>
                </form>
                <div className="auth-footer">
                    <p>Don&apos;t have an account? <Link to="/register">Create one here</Link></p>
                </div>
            </div>
        </div>
    );
}
