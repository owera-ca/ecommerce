import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { Edit, Trash2, Search, Plus } from "lucide-react";

export default function Users() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchUsers = async (page, size, search = "") => {
        setLoading(true);
        try {
            const skip = (page - 1) * size;
            // Assuming your backend supports basic search or we just fetch paginated
            // A production app would pass search to API, here we just fetch paginated
            const res = await fetch(`http://localhost:8000/api/v1/users/?skip=${skip}&limit=${size}`);
            const data = await res.json();

            // Client-side filtering if search is used, since API might not have ?search parameter yet.
            let items = data.items || [];
            if (search) {
                const lowerSearch = search.toLowerCase();
                items = items.filter(u =>
                    u.email.toLowerCase().includes(lowerSearch) ||
                    (u.first_name && u.first_name.toLowerCase().includes(lowerSearch)) ||
                    (u.last_name && u.last_name.toLowerCase().includes(lowerSearch))
                );
            }

            setUsers(items);
            setTotalRows(search ? items.length : (data.total || 0));
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(currentPage, perPage, searchTerm);
    }, [currentPage, perPage, searchTerm]);

    const handlePageChange = page => {
        setCurrentPage(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
        setCurrentPage(page);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            const res = await fetch(`http://localhost:8000/api/v1/users/${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                fetchUsers(currentPage, perPage, searchTerm);
            } else {
                alert("Failed to delete user.");
            }
        } catch (error) {
            console.error("Failed to delete user", error);
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
            name: "Name",
            selector: row => `${row.first_name || ""} ${row.last_name || ""}`.trim() || "-",
            sortable: true,
        },
        {
            name: "Email",
            selector: row => row.email,
            sortable: true,
        },
        {
            name: "Status",
            selector: row => row.is_active ? "Active" : "Inactive",
            sortable: true,
            cell: row => (
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${row.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                    {row.is_active ? "Active" : "Inactive"}
                </span>
            )
        },
        {
            name: "Actions",
            right: true,
            cell: row => (
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate(`/admin/users/${row.id}`)}
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
            ),
        }
    ];

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
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", margin: 0 }}>Users</h2>
                    <p style={{ color: "#6b7280", fontSize: "0.875rem", marginTop: "0.25rem" }}>A list of all users including their name, email, and role.</p>
                </div>
                <button
                    onClick={() => navigate("/admin/users/add")}
                    style={{
                        display: "flex", alignItems: "center", gap: "0.5rem", backgroundColor: "#000", color: "#fff",
                        padding: "0.625rem 1.25rem", borderRadius: "0.75rem", fontWeight: "500", cursor: "pointer", border: "none"
                    }}
                >
                    <Plus size={18} />
                    Add User
                </button>
            </div>

            <div style={{ backgroundColor: "#fff", borderRadius: "1rem", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", border: "1px solid #f3f4f6", overflow: "hidden" }}>
                <div style={{ padding: "1rem", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f9fafb" }}>
                    <div style={{ position: "relative", width: "16rem" }}>
                        <Search style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} size={18} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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
                        data={users}
                        progressPending={loading}
                        pagination
                        paginationServer
                        paginationTotalRows={totalRows}
                        onChangeRowsPerPage={handlePerRowsChange}
                        onChangePage={handlePageChange}
                        customStyles={customStyles}
                        highlightOnHover
                        pointerOnHover={false}
                        noDataComponent={<div className="p-8 text-gray-500">No users found</div>}
                    />
                </div>
            </div>
        </div>
    );
}
