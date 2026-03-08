import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";

export default function Register() {
    return (
        <div className="auth-container fade-in">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Create an Account</h2>
                    <p>Join us for a premium shopping experience.</p>
                </div>
                <form className="auth-form">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" placeholder="John Doe" />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" placeholder="you@example.com" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" placeholder="••••••••" />
                    </div>
                    <button className="btn btn-primary w-full">
                        <UserPlus size={18} className="icon-inline" /> Register
                    </button>
                </form>
                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Sign in</Link></p>
                </div>
            </div>
        </div>
    );
}
