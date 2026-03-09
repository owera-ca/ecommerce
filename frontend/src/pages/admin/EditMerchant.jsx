import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

export default function EditMerchant() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        company_name: "",
        user_id: "",
        email: "",
        phone: "",
        tax_id: "",
        website: "",
        is_active: true
    });

    useEffect(() => {
        const fetchMerchant = async () => {
            try {
                // We don't have a single GET endpoint, so we'll fetch list and find it or just assume we have a GET endpoint
                // Actually, let's just make a PUT request or build a quick GET endpoint. Wait, let's fetch the list for now or directly use the id if there's a GET {id}. 
                // Currently only GET /merchants/ exists, let's use that to find it, or we could add a GET by ID endpoint.
                // Assuming we might need to fetch all and filter since we didn't explicitly add GET /{id} yet:
                const res = await fetch(`http://localhost:8000/api/v1/merchants/?limit=1000`);
                const data = await res.json();
                const merchant = data.items ? data.items.find(m => m.id === parseInt(id, 10)) : data.find(m => m.id === parseInt(id, 10));

                if (merchant) {
                    setFormData({
                        company_name: merchant.company_name || "",
                        user_id: merchant.user_id || "",
                        email: merchant.email || "",
                        phone: merchant.phone || "",
                        tax_id: merchant.tax_id || "",
                        website: merchant.website || "",
                        is_active: merchant.is_active
                    });
                } else {
                    alert("Merchant not found");
                    navigate("/admin/merchants");
                }
            } catch (error) {
                console.error("Failed to fetch merchant details", error);
                alert("Network error occurred.");
            } finally {
                setFetching(false);
            }
        };

        if (id) {
            fetchMerchant();
        }
    }, [id, navigate]);

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

            const res = await fetch(`http://localhost:8000/api/v1/merchants/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                navigate("/admin/merchants");
            } else {
                const error = await res.json();
                alert(`Error: ${error.detail || "Failed to update merchant"}`);
            }
        } catch (error) {
            console.error("Failed to save merchant", error);
            alert("Network error occurred.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="p-8 text-center text-gray-500">Loading merchant details...</div>;
    }

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate("/admin/merchants")}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Edit Merchant</h2>
                    <p className="text-gray-500 text-sm mt-1">Update merchant profile information.</p>
                </div>
            </div>

            <div className="mt-8">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-12">
                        {/* Core Identity Section */}
                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                            <div>
                                <h2 className="text-base/7 font-semibold text-gray-900">Core Identity</h2>
                                <p className="mt-1 text-sm/6 text-gray-600">Basic information about the business entity.</p>
                            </div>

                            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                                <div className="sm:col-span-4">
                                    <label htmlFor="company_name" className="block text-sm/6 font-medium text-gray-900">Company Name <span className="text-red-500">*</span></label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="company_name"
                                            id="company_name"
                                            value={formData.company_name}
                                            onChange={handleInputChange}
                                            required
                                            className="block w-full rounded-none bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-4">
                                    <label htmlFor="user_id" className="block text-sm/6 font-medium text-gray-900">User ID <span className="text-red-500">*</span></label>
                                    <div className="mt-2">
                                        <input
                                            type="number"
                                            name="user_id"
                                            id="user_id"
                                            value={formData.user_id}
                                            onChange={handleInputChange}
                                            required
                                            readOnly
                                            className="block w-full rounded-none bg-gray-50 px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 cursor-not-allowed opacity-80 sm:text-sm/6"
                                        />
                                    </div>
                                    <p className="mt-2 text-sm/6 text-gray-600">Merchant user owner cannot be changed after creation.</p>
                                </div>

                                <div className="sm:col-span-4">
                                    <label htmlFor="tax_id" className="block text-sm/6 font-medium text-gray-900">Tax ID</label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="tax_id"
                                            id="tax_id"
                                            value={formData.tax_id}
                                            onChange={handleInputChange}
                                            className="block w-full rounded-none bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Details Section */}
                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                            <div>
                                <h2 className="text-base/7 font-semibold text-gray-900">Contact Details</h2>
                                <p className="mt-1 text-sm/6 text-gray-600">How customers and the platform can reach them.</p>
                            </div>

                            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                                <div className="sm:col-span-4">
                                    <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Business Email</label>
                                    <div className="mt-2">
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="block w-full rounded-none bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-4">
                                    <label htmlFor="phone" className="block text-sm/6 font-medium text-gray-900">Phone Number</label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="phone"
                                            id="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="block w-full rounded-none bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-4">
                                    <label htmlFor="website" className="block text-sm/6 font-medium text-gray-900">Website</label>
                                    <div className="mt-2">
                                        <input
                                            type="url"
                                            name="website"
                                            id="website"
                                            value={formData.website}
                                            onChange={handleInputChange}
                                            className="block w-full rounded-none bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status Section */}
                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                            <div>
                                <h2 className="text-base/7 font-semibold text-gray-900">Account Status</h2>
                                <p className="mt-1 text-sm/6 text-gray-600">Manage account access and visibility.</p>
                            </div>

                            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                                <div className="sm:col-span-6">
                                    <div className="space-y-6">
                                        <div className="flex gap-3">
                                            <div className="flex h-6 shrink-0 items-center">
                                                <div className="group grid size-4 grid-cols-1">
                                                    <input
                                                        type="checkbox"
                                                        id="is_active"
                                                        name="is_active"
                                                        checked={formData.is_active}
                                                        onChange={handleInputChange}
                                                        className="col-start-1 row-start-1 appearance-none rounded-none border border-gray-300 bg-white checked:border-black checked:bg-black indeterminate:border-black indeterminate:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100"
                                                    />
                                                    <svg fill="none" viewBox="0 0 14 14" className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25">
                                                        <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-has-[:checked]:opacity-100" />
                                                        <path d="M3 7H11" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-has-[:indeterminate]:opacity-100" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="text-sm/6">
                                                <label htmlFor="is_active" className="font-medium text-gray-900">Active Merchant Account</label>
                                                <p className="text-gray-500">If unchecked, the merchant and their storefronts will be disabled.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/merchants")}
                            className="text-sm/6 font-semibold text-gray-900 hover:text-gray-700 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 rounded-none bg-black px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <Save size={16} />
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
