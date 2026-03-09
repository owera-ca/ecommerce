import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

export default function EditCountry() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isAddMode = !id || id === 'add';

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!isAddMode);
    const [formData, setFormData] = useState({
        name: "",
        iso_code: "",
        is_active: true
    });

    useEffect(() => {
        const fetchCountry = async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/v1/geographies/countries/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        name: data.name || "",
                        iso_code: data.iso_code || "",
                        is_active: data.is_active
                    });
                } else {
                    alert("Country not found");
                    navigate("/admin/countries");
                }
            } catch (error) {
                console.error("Failed to fetch country details", error);
                alert("Network error occurred.");
            } finally {
                setFetching(false);
            }
        };

        if (!isAddMode) {
            fetchCountry();
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
            const url = isAddMode
                ? `http://localhost:8000/api/v1/geographies/countries`
                : `http://localhost:8000/api/v1/geographies/countries/${id}`;
            const method = isAddMode ? "POST" : "PUT";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                navigate("/admin/countries");
            } else {
                const error = await res.json();
                alert(`Error: ${error.detail || "Failed to save country"}`);
            }
        } catch (error) {
            console.error("Failed to save country", error);
            alert("Network error occurred.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="p-8 text-center text-gray-500">Loading country details...</div>;
    }

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate("/admin/countries")}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                        {isAddMode ? "Add New Country" : "Edit Country"}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {isAddMode ? "Add a new operating country to the system." : "Update country information."}
                    </p>
                </div>
            </div>

            <div className="mt-8">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-12">
                        {/* Core Status Section */}
                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                            <div>
                                <h2 className="text-base/7 font-semibold text-gray-900">Country Details</h2>
                                <p className="mt-1 text-sm/6 text-gray-600">Standardized ISO information.</p>
                            </div>

                            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                                <div className="sm:col-span-4">
                                    <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">Country Name <span className="text-red-500">*</span></label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="block w-full rounded-none bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="iso_code" className="block text-sm/6 font-medium text-gray-900">ISO Code (Alpha-2) <span className="text-red-500">*</span></label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="iso_code"
                                            id="iso_code"
                                            value={formData.iso_code}
                                            onChange={handleInputChange}
                                            required
                                            maxLength={2}
                                            className="block w-full rounded-none bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6  uppercase"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status Section */}
                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 pb-12 md:grid-cols-3">
                            <div>
                                <h2 className="text-base/7 font-semibold text-gray-900">Status</h2>
                                <p className="mt-1 text-sm/6 text-gray-600">Toggle whether this country can be selected system-wide.</p>
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
                                                <label htmlFor="is_active" className="font-medium text-gray-900 cursor-pointer">Active Country</label>
                                                <p className="text-gray-500">Enable or disable operations to this country.</p>
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
                            onClick={() => navigate("/admin/countries")}
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
                            {loading ? "Saving..." : (isAddMode ? "Create Country" : "Save Changes")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
