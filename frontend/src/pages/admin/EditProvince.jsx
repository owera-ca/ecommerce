import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import CountrySelectModal from "../../components/CountrySelectModal";

export default function EditProvince() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isAddMode = !id || id === 'add';

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!isAddMode);
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        country_id: "",
        is_active: true
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [countryName, setCountryName] = useState("");

    useEffect(() => {
        const fetchProvince = async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/v1/geographies/provinces/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        name: data.name || "",
                        code: data.code || "",
                        country_id: data.country_id || "",
                        is_active: data.is_active
                    });

                    if (data.country_id) {
                        try {
                            const countryRes = await fetch(`http://localhost:8000/api/v1/geographies/countries/${data.country_id}`);
                            if (countryRes.ok) {
                                const countryData = await countryRes.json();
                                setCountryName(countryData.name);
                            }
                        } catch (e) {
                            console.error("Failed to fetch country name", e);
                        }
                    }
                } else {
                    alert("Province not found");
                    navigate("/admin/provinces");
                }
            } catch (error) {
                console.error("Failed to fetch province details", error);
                alert("Network error occurred.");
            } finally {
                setFetching(false);
            }
        };

        if (!isAddMode) {
            fetchProvince();
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
            payload.country_id = parseInt(payload.country_id, 10);

            const url = isAddMode
                ? `http://localhost:8000/api/v1/geographies/provinces`
                : `http://localhost:8000/api/v1/geographies/provinces/${id}`;
            const method = isAddMode ? "POST" : "PUT";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                navigate("/admin/provinces");
            } else {
                const error = await res.json();
                alert(`Error: ${error.detail || "Failed to save province"}`);
            }
        } catch (error) {
            console.error("Failed to save province", error);
            alert("Network error occurred.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="p-8 text-center text-gray-500">Loading province details...</div>;
    }

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate("/admin/provinces")}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                        {isAddMode ? "Add New Province / State" : "Edit Province / State"}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {isAddMode ? "Add a new regional operating entity." : "Update regional information."}
                    </p>
                </div>
            </div>

            <div className="mt-8">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-12">
                        {/* Core Status Section */}
                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                            <div>
                                <h2 className="text-base/7 font-semibold text-gray-900">Regional Details</h2>
                                <p className="mt-1 text-sm/6 text-gray-600">Standardized geographic entity information.</p>
                            </div>

                            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                                <div className="sm:col-span-4">
                                    <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">Province / State Name <span className="text-red-500">*</span></label>
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
                                    <label htmlFor="code" className="block text-sm/6 font-medium text-gray-900">Short Code <span className="text-red-500">*</span></label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="code"
                                            id="code"
                                            value={formData.code}
                                            onChange={handleInputChange}
                                            required
                                            maxLength={5}
                                            className="block w-full rounded-none bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6 uppercase"
                                        />
                                    </div>
                                    <p className="mt-2 text-sm/6 text-gray-600">e.g. CA, NY, ON</p>
                                </div>

                                <div className="sm:col-span-4">
                                    <label className="block text-sm/6 font-medium text-gray-900">Country <span className="text-red-500">*</span></label>
                                    <div className="mt-2 flex items-center gap-4">
                                        {formData.country_id ? (
                                            <Link
                                                to={`/admin/countries/${formData.country_id}`}
                                                className="text-base text-indigo-600 hover:text-indigo-900 font-medium"
                                            >
                                                {countryName || `Country ID: ${formData.country_id}`}
                                            </Link>
                                        ) : (
                                            <span className="text-base text-gray-500">Not selected</span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(true)}
                                            className="rounded bg-white px-2.5 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer"
                                        >
                                            Change
                                        </button>
                                    </div>
                                    <p className="mt-2 text-sm/6 text-gray-600">The parent country that this state or province belongs to.</p>
                                </div>
                            </div>
                        </div>

                        {/* Status Section */}
                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 pb-12 md:grid-cols-3">
                            <div>
                                <h2 className="text-base/7 font-semibold text-gray-900">Status</h2>
                                <p className="mt-1 text-sm/6 text-gray-600">Toggle whether this region can be selected.</p>
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
                                                <label htmlFor="is_active" className="font-medium text-gray-900 cursor-pointer">Active Region</label>
                                                <p className="text-gray-500">Enable or disable operations to this province/state.</p>
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
                            onClick={() => navigate("/admin/provinces")}
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
                            {loading ? "Saving..." : (isAddMode ? "Create Province" : "Save Changes")}
                        </button>
                    </div>
                </form>
            </div>

            <CountrySelectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={(country) => {
                    setFormData(prev => ({ ...prev, country_id: country.id }));
                    setCountryName(country.name);
                }}
            />
        </div>
    );
}
