import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Lock, AlertCircle, CheckCircle } from "lucide-react";

// Assuming we add a resetPassword API call
import { resetPassword } from "../../api/auth";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [status, setStatus] = useState({ type: "", message: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            setStatus({ type: "error", message: "Invalid or missing reset token." });
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setStatus({ type: "error", message: "Passwords do not match." });
            return;
        }

        setStatus({ type: "", message: "" });
        setLoading(true);

        try {
            await resetPassword(token, password);
            setStatus({
                type: "success",
                message: "Password updated successfully! Redirecting to login..."
            });
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setStatus({
                type: "error",
                message: err.message || "Failed to reset password."
            });
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="auth-container fade-in">
                <div className="auth-card" style={{ textAlign: "center" }}>
                    <AlertCircle size={48} color="red" style={{ margin: "0 auto 1rem" }} />
                    <h2>Invalid Request</h2>
                    <p>No reset token was found in the URL. Please request a new password reset link.</p>
                    <Link to="/forgot-password" className="btn btn-primary" style={{ marginTop: "2rem" }}>Go back</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container fade-in">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Create New Password</h2>
                    <p>Please enter your new password below.</p>
                </div>

                {status.message && (
                    <div className={`alert ${status.type === 'error' ? 'alert-error' : 'alert-success'}`} style={{ color: status.type === 'error' ? 'red' : 'green', marginBottom: "1.5rem", fontSize: "0.9rem", textAlign: "center" }}>
                        {status.type === 'error' ? <AlertCircle size={16} className="icon-inline" /> : <CheckCircle size={16} className="icon-inline" />} {status.message}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>New Password</label>
                        <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary w-full" disabled={loading || status.type === 'success'}>
                        <Lock size={18} className="icon-inline" /> {loading ? "Updating..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}
