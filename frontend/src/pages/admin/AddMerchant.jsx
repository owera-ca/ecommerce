import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

export default function AddMerchant() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        company_name: "",
        user_id: "",
        email: "",
        phone: "",
        tax_id: "",
        website: "",
        is_active: true
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { ...formData };
            payload.user_id = parseInt(payload.user_id, 10);

            // Convert empty strings to null for optional fields
            if (payload.email === "") payload.email = null;
            if (payload.phone === "") payload.phone = null;
            if (payload.tax_id === "") payload.tax_id = null;
            if (payload.website === "") payload.website = null;

            const res = await fetch("http://127.0.0.1:8000/api/v1/merchants/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                navigate("/admin/merchants");
            } else {
                const error = await res.json();
                alert(`Error: ${error.detail || "Failed to create merchant"}`);
            }
        } catch (error) {
            console.error("Failed to save merchant", error);
            alert("Network error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate("/admin/merchants")}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Add New Merchant</h2>
                    <p className="text-gray-500 text-sm mt-1">Create a new merchant profile linked to a system user.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <form onSubmit={handleSubmit}>
                    <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Column 1 */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Core Identity</h3>
                                <p className="text-sm text-gray-500 mb-4">Basic information about the business entity.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="company_name"
                                    value={formData.company_name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black focus:bg-white transition-all"
                                    placeholder="Enter registered company name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">User ID <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    name="user_id"
                                    value={formData.user_id}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black focus:bg-white transition-all"
                                    placeholder="e.g. 1"
                                />
                                <p className="text-xs text-gray-500 mt-2">The system user ID who owns this merchant account.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tax ID</label>
                                <input
                                    type="text"
                                    name="tax_id"
                                    value={formData.tax_id}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black focus:bg-white transition-all"
                                    placeholder="Optional business tax identifier"
                                />
                            </div>
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Contact Details</h3>
                                <p className="text-sm text-gray-500 mb-4">How customers and the platform can reach them.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Business Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black focus:bg-white transition-all"
                                    placeholder="contact@company.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black focus:bg-white transition-all"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Website</label>
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black focus:bg-white transition-all"
                                    placeholder="https://company.com"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="px-6 md:px-8 py-5 border-t border-gray-100 bg-gray-50">
                        <div className="flex items-start">
                            <div className="flex h-6 items-center">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    name="is_active"
                                    checked={formData.is_active}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                                />
                            </div>
                            <div className="ml-3">
                                <label htmlFor="is_active" className="text-sm font-medium text-gray-900 cursor-pointer">
                                    Active Merchant Account
                                </label>
                                <p className="text-sm text-gray-500">If unchecked, the merchant and their storefronts will be disabled.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 px-6 md:px-8 py-5 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/merchants")}
                            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-black rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                        >
                            <Save size={18} />
                            {loading ? "Saving..." : "Create Merchant"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
