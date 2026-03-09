import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

export default function EditAddress() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isAddMode = !id || id === 'add';

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!isAddMode);
    const [formData, setFormData] = useState({
        user_id: "",
        first_name: "",
        last_name: "",
        company: "",
        address_line_1: "",
        address_line_2: "",
        city: "",
        postal_code: "",
        phone: "",
        province_state_id: "",
        country_id: "",
        is_active: true
    });

    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/v1/addresses/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        user_id: data.user_id || "",
                        first_name: data.first_name || "",
                        last_name: data.last_name || "",
                        company: data.company || "",
                        address_line_1: data.address_line_1 || "",
                        address_line_2: data.address_line_2 || "",
                        city: data.city || "",
                        postal_code: data.postal_code || "",
                        phone: data.phone || "",
                        province_state_id: data.province_state_id || "",
                        country_id: data.country_id || "",
                        is_active: data.is_active
                    });
                } else {
                    alert("Address not found");
                    navigate("/admin/addresses");
                }
            } catch (error) {
                console.error("Failed to fetch address details", error);
                alert("Network error occurred.");
            } finally {
                setFetching(false);
            }
        };

        if (!isAddMode) {
            fetchAddress();
        }
    }, [id, isAddMode, navigate]);

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

            // Int parsing for relations
            payload.user_id = parseInt(payload.user_id, 10);
            payload.country_id = parseInt(payload.country_id, 10);
            payload.province_state_id = parseInt(payload.province_state_id, 10);

            // Null checking for optionals
            if (payload.company === "") payload.company = null;
            if (payload.address_line_2 === "") payload.address_line_2 = null;
            if (payload.phone === "") payload.phone = null;

            const url = isAddMode
                ? `http://localhost:8000/api/v1/addresses/`
                : `http://localhost:8000/api/v1/addresses/${id}`;
            const method = isAddMode ? "POST" : "PUT";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                navigate("/admin/addresses");
            } else {
                const error = await res.json();
                alert(`Error: ${error.detail || "Failed to save address"}`);
            }
        } catch (error) {
            console.error("Failed to save address", error);
            alert("Network error occurred.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="p-8 text-center text-gray-500">Loading address details...</div>;
    }

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate("/admin/addresses")}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                        {isAddMode ? "Add New Address" : "Edit Address"}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {isAddMode ? "Create a new physical location." : "Update shipping or billing information."}
                    </p>
                </div>
            </div>

            <div className="mt-8">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-12">
                        {/* Recipient Section */}
                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                            <div>
                                <h2 className="text-base/7 font-semibold text-gray-900">Recipient</h2>
                                <p className="mt-1 text-sm/6 text-gray-600">The person or business receiving mail at this location.</p>
                            </div>

                            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                                <div className="sm:col-span-3">
                                    <label htmlFor="first_name" className="block text-sm/6 font-medium text-gray-900">First Name <span className="text-red-500">*</span></label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="first_name"
                                            id="first_name"
                                            value={formData.first_name}
                                            onChange={handleInputChange}
                                            required
                                            className="block w-full rounded-none bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="last_name" className="block text-sm/6 font-medium text-gray-900">Last Name <span className="text-red-500">*</span></label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="last_name"
                                            id="last_name"
                                            value={formData.last_name}
                                            onChange={handleInputChange}
                                            required
                                            className="block w-full rounded-none bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-6">
                                    <label htmlFor="company" className="block text-sm/6 font-medium text-gray-900">Company</label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="company"
                                            id="company"
                                            value={formData.company}
                                            onChange={handleInputChange}
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
                                            className="block w-full rounded-none bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Location Section */}
                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                            <div>
                                <h2 className="text-base/7 font-semibold text-gray-900">Location Settings</h2>
                                <p className="mt-1 text-sm/6 text-gray-600">Physical address lines and codes.</p>
                            </div>

                            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                                <div className="col-span-full">
                                    <label htmlFor="address_line_1" className="block text-sm/6 font-medium text-gray-900">Street address <span className="text-red-500">*</span></label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="address_line_1"
                                            id="address_line_1"
                                            value={formData.address_line_1}
                                            onChange={handleInputChange}
                                            required
                                            className="block w-full rounded-none bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                                        />
                                    </div>
                                </div>

                                <div className="col-span-full">
                                    <label htmlFor="address_line_2" className="block text-sm/6 font-medium text-gray-900">Apartment, suite, etc.</label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="address_line_2"
                                            id="address_line_2"
                                            value={formData.address_line_2}
                                            onChange={handleInputChange}
                                            className="block w-full rounded-none bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2 sm:col-start-1">
                                    <label htmlFor="city" className="block text-sm/6 font-medium text-gray-900">City <span className="text-red-500">*</span></label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="city"
                                            id="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            required
                                            className="block w-full rounded-none bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="province_state_id" className="block text-sm/6 font-medium text-gray-900">State / Province ID <span className="text-red-500">*</span></label>
                                    <div className="mt-2">
                                        <input
                                            type="number"
                                            name="province_state_id"
                                            id="province_state_id"
                                            value={formData.province_state_id}
                                            onChange={handleInputChange}
                                            required
                                            className="block w-full rounded-none bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="postal_code" className="block text-sm/6 font-medium text-gray-900">ZIP / Postal code <span className="text-red-500">*</span></label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="postal_code"
                                            id="postal_code"
                                            value={formData.postal_code}
                                            onChange={handleInputChange}
                                            required
                                            className="block w-full rounded-none bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="country_id" className="block text-sm/6 font-medium text-gray-900">Country ID <span className="text-red-500">*</span></label>
                                    <div className="mt-2">
                                        <input
                                            type="number"
                                            name="country_id"
                                            id="country_id"
                                            value={formData.country_id}
                                            onChange={handleInputChange}
                                            required
                                            className="block w-full rounded-none bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="phone" className="block text-sm/6 font-medium text-gray-900">Phone</label>
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
                            </div>
                        </div>

                        {/* Status Section */}
                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 pb-12 md:grid-cols-3">
                            <div>
                                <h2 className="text-base/7 font-semibold text-gray-900">Account Status</h2>
                                <p className="mt-1 text-sm/6 text-gray-600">Address visibility and usage.</p>
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
                                                <label htmlFor="is_active" className="font-medium text-gray-900 cursor-pointer">Active Address</label>
                                                <p className="text-gray-500">If unchecked, the address will not be selectable or visible internally.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-4 border-t border-gray-900/10 pt-6">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/addresses")}
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
                            {loading ? "Saving..." : (isAddMode ? "Create Address" : "Save Changes")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
