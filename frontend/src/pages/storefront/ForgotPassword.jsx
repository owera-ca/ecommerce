import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, AlertCircle, CheckCircle } from "lucide-react";
import { requestPasswordReset } from "../../api/auth";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState({ type: "", message: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: "", message: "" });
        setLoading(true);
        try {
            await requestPasswordReset(email);
            setStatus({
                type: "success",
                message: `If an account exists for ${email}, a reset link has been sent.`
            });
            setEmail("");
        } catch (err) {
            setStatus({
                type: "error",
                message: err.message || "Failed to process request"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container fade-in">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Reset Password</h2>
                    <p>Enter your email to receive recovery instructions.</p>
                </div>

                {status.message && (
                    <div className={`alert ${status.type === 'error' ? 'alert-error' : 'alert-success'}`} style={{ color: status.type === 'error' ? 'red' : 'green', marginBottom: "1.5rem", fontSize: "0.9rem", textAlign: "center" }}>
                        {status.type === 'error' ? <AlertCircle size={16} className="icon-inline" /> : <CheckCircle size={16} className="icon-inline" />} {status.message}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                        <Mail size={18} className="icon-inline" /> {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>
                <div className="auth-footer">
                    <p>Remember your password? <Link to="/login">Sign in</Link></p>
                </div>
            </div>
        </div>
    );
}
