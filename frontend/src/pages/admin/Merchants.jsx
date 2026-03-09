import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";

export default function Merchants() {
    const navigate = useNavigate();
    const [merchants, setMerchants] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
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
            const res = await fetch(`http://localhost:8000/api/v1/merchants/?skip=${skip}&limit=${perPage}`);
            const data = await res.json();
            setMerchants(data.items || []);
            setTotalRows(data.total || 0);
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
            const res = await fetch(`http://localhost:8000/api/v1/merchants/${id}`, {
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
        <div style={{ padding: "2rem", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <div>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", margin: 0 }}>Merchants</h2>
                    <p style={{ color: "#6b7280", fontSize: "0.875rem", marginTop: "0.25rem" }}>Manage all merchants registered on the platform</p>
                </div>
                <button
                    onClick={() => navigate("/admin/merchants/add")}
                    style={{
                        display: "flex", alignItems: "center", gap: "0.5rem", backgroundColor: "#000", color: "#fff",
                        padding: "0.625rem 1.25rem", borderRadius: "0.75rem", fontWeight: "500", cursor: "pointer", border: "none"
                    }}
                >
                    <Plus size={18} />
                    Add Merchant
                </button>
            </div>

            <div style={{ backgroundColor: "#fff", borderRadius: "1rem", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", border: "1px solid #f3f4f6", overflow: "hidden" }}>
                <div style={{ padding: "1rem", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f9fafb" }}>
                    <div style={{ position: "relative", width: "16rem" }}>
                        <Search style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} size={18} />
                        <input
                            type="text"
                            placeholder="Search merchants..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{
                                width: "100%", paddingLeft: "2.5rem", paddingRight: "1rem", paddingTop: "0.625rem", paddingBottom: "0.625rem",
                                backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "0.75rem", fontSize: "0.875rem", outline: "none", boxSizing: "border-box"
                            }}
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
                        paginationTotalRows={totalRows}
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
