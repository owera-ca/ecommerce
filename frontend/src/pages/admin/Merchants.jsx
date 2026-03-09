import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";

export default function Merchants() {
    const navigate = useNavigate();
    const [merchants, setMerchants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [searchText, setSearchText] = useState("");

    const fetchMerchants = async () => {
        try {
            setLoading(true);
            // In a real app with server-side filtering we'd pass search text and pagination, 
            // but for now we fetch a batch and rely on client or basic pagination
            const skip = (page - 1) * perPage;
            const res = await fetch(`http://127.0.0.1:8000/api/v1/merchants/?skip=${skip}&limit=${perPage}`);
            const data = await res.json();
            setMerchants(data);
        } catch (error) {
            console.error("Failed to fetch merchants", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMerchants();
    }, [page, perPage]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this merchant?")) return;

        try {
            const res = await fetch(`http://127.0.0.1:8000/api/v1/merchants/${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                fetchMerchants();
            } else {
                alert("Failed to delete merchant");
            }
        } catch (error) {
            console.error("Failed to delete merchant", error);
        }
    };

    const columns = [
        {
            name: "ID",
            selector: row => row.id,
            sortable: true,
            width: "80px",
        },
        {
            name: "Company Name",
            selector: row => row.company_name,
            sortable: true,
            cell: row => (
                <div>
                    <div className="font-medium text-gray-800">{row.company_name}</div>
                    <div className="text-xs text-gray-500">User ID: {row.user_id}</div>
                </div>
            )
        },
        {
            name: "Contact",
            selector: row => row.email,
            cell: row => (
                <div>
                    <div className="text-sm text-gray-700">{row.email || 'N/A'}</div>
                    <div className="text-xs text-gray-500">{row.phone || 'N/A'}</div>
                </div>
            )
        },
        {
            name: "Status",
            selector: row => row.is_active,
            sortable: true,
            cell: row => (
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${row.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                    {row.is_active ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            name: "Actions",
            right: true,
            cell: row => (
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate(`/admin/merchants/${row.id}`)}
                        className="text-gray-500 hover:text-black transition-colors p-1.5 rounded-md hover:bg-gray-100 cursor-pointer outline-none"
                        title="Edit"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="text-gray-500 hover:text-red-600 transition-colors p-1.5 rounded-md hover:bg-red-50 cursor-pointer outline-none"
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    // Filter data for search
    const filteredItems = merchants.filter(
        item => item.company_name && item.company_name.toLowerCase().includes(searchText.toLowerCase())
    );

    const customStyles = {
        headRow: {
            style: {
                backgroundColor: '#f9fafb',
                borderBottomColor: '#f3f4f6',
            },
        },
        headCells: {
            style: {
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
            },
        },
        rows: {
            style: {
                transition: 'all 0.2s',
                '&:hover': {
                    backgroundColor: '#f9fafb',
                },
            },
        },
    };

    return (
        <div className="p-8 relative">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Merchants</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage all merchants registered on the platform</p>
                </div>
                <button
                    onClick={() => navigate("/admin/merchants/add")}
                    className="flex items-center gap-2 bg-black hover:bg-gray-900 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm cursor-pointer"
                >
                    <Plus size={18} />
                    Add Merchant
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search merchants..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                        />
                    </div>
                </div>

                <div className="react-data-table-wrapper">
                    <DataTable
                        columns={columns}
                        data={filteredItems}
                        progressPending={loading}
                        pagination
                        paginationServer
                        paginationTotalRows={100} // Setup proper total API count when available
                        onChangePage={(p) => setPage(p)}
                        onChangeRowsPerPage={(newPerPage, p) => {
                            setPerPage(newPerPage);
                            setPage(p);
                        }}
                        customStyles={customStyles}
                        highlightOnHover
                        pointerOnHover={false}
                        noDataComponent={<div className="p-8 text-gray-500">No merchants found</div>}
                    />
                </div>
            </div>
        </div>
    );
}
