import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { Edit, Trash2, Search, Plus } from "lucide-react";

export default function Provinces() {
    const navigate = useNavigate();
    const [provinces, setProvinces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchProvinces = async (page, size, search = "") => {
        setLoading(true);
        try {
            const skip = (page - 1) * size;
            const res = await fetch(`http://localhost:8000/api/v1/geographies/provinces?skip=${skip}&limit=${size}`);
            const data = await res.json();

            let items = data.items || [];
            if (search) {
                const lowerSearch = search.toLowerCase();
                items = items.filter(p =>
                    p.name.toLowerCase().includes(lowerSearch) ||
                    p.code.toLowerCase().includes(lowerSearch)
                );
            }

            setProvinces(items);
            setTotalRows(search ? items.length : (data.total || 0));
        } catch (error) {
            console.error("Failed to fetch provinces", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProvinces(currentPage, perPage, searchTerm);
    }, [currentPage, perPage, searchTerm]);

    const handlePageChange = page => {
        setCurrentPage(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
        setCurrentPage(page);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this province/state?")) return;

        try {
            const res = await fetch(`http://localhost:8000/api/v1/geographies/provinces/${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                fetchProvinces(currentPage, perPage, searchTerm);
            } else {
                alert("Failed to delete province.");
            }
        } catch (error) {
            console.error("Failed to delete province", error);
        }
    };

    const columns = [
        {
            name: "ID",
            selector: row => row.id,
            sortable: true,
            width: "80px"
        },
        {
            name: "Province / State Name",
            selector: row => row.name,
            sortable: true,
        },
        {
            name: "Code",
            selector: row => row.code,
            sortable: true,
        },
        {
            name: "Country ID",
            selector: row => row.country_id,
            sortable: true,
            cell: row => (
                <button
                    onClick={() => navigate(`/admin/countries/${row.country_id}`)}
                    className="text-indigo-600 hover:underline"
                >
                    {row.country_id}
                </button>
            )
        },
        {
            name: "Status",
            selector: row => row.is_active ? "Active" : "Inactive",
            sortable: true,
            cell: row => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {row.is_active ? "Active" : "Inactive"}
                </span>
            )
        },
        {
            name: "Actions",
            cell: row => (
                <div className="flex gap-2">
                    <button
                        onClick={() => navigate(`/admin/provinces/${row.id}`)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit Province"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete Province"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
            width: "120px"
        }
    ];

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Provinces & States</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all regional operating entities.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <button
                        onClick={() => navigate("/admin/provinces/add")}
                        className="flex items-center gap-2 rounded-none bg-black px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black cursor-pointer"
                    >
                        <Plus size={16} />
                        Add Province
                    </button>
                </div>
            </div>

            <div className="bg-white px-4 py-5 sm:px-6 rounded-none outline-1 -outline-offset-1 outline-gray-200 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:max-w-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="search"
                        placeholder="Search provinces..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-none leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white outline-1 -outline-offset-1 outline-gray-200 rounded-none shadow-sm overflow-hidden">
                <DataTable
                    columns={columns}
                    data={provinces}
                    progressPending={loading}
                    pagination
                    paginationServer
                    paginationTotalRows={totalRows}
                    onChangeRowsPerPage={handlePerRowsChange}
                    onChangePage={handlePageChange}
                    customStyles={{
                        headRow: {
                            style: {
                                backgroundColor: '#f9fafb',
                                borderBottomColor: '#e5e7eb',
                                fontWeight: 600,
                                color: '#374151'
                            }
                        },
                        cells: {
                            style: {
                                paddingTop: '12px',
                                paddingBottom: '12px',
                            }
                        }
                    }}
                />
            </div>
        </div>
    );
}
