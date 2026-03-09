import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Languages, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";

const API = "http://localhost:8000/api/v1";

export default function EmailTemplates() {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [searchText, setSearchText] = useState("");

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const skip = (page - 1) * perPage;
            const params = new URLSearchParams({ skip, limit: perPage });
            if (searchText) params.append("search", searchText);
            const res = await fetch(`${API}/emails/templates/?${params}`);
            const data = await res.json();
            setTemplates(data.items || []);
            setTotalRows(data.total || 0);
        } catch (err) {
            console.error("Failed to fetch email templates", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, [page, perPage]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            fetchTemplates();
        }, 400);
        return () => clearTimeout(timer);
    }, [searchText]);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this email template? This cannot be undone.")) return;
        try {
            const res = await fetch(`${API}/emails/templates/${id}`, { method: "DELETE" });
            if (res.ok) fetchTemplates();
            else alert("Failed to delete template.");
        } catch (err) {
            console.error("Failed to delete template", err);
        }
    };

    const columns = [
        {
            name: "ID",
            selector: row => row.id,
            sortable: true,
            width: "70px",
        },
        {
            name: "Name (Key)",
            selector: row => row.name,
            sortable: true,
            cell: row => (
                <div>
                    <div className="font-medium text-gray-800">{row.name}</div>
                    {row.description && (
                        <div className="text-xs text-gray-500 truncate max-w-xs">{row.description}</div>
                    )}
                </div>
            ),
        },
        {
            name: "Translations",
            selector: row => row.translation_count,
            sortable: true,
            width: "140px",
            cell: row => (
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Languages size={14} />
                    <span>{row.translation_count} locale{row.translation_count !== 1 ? "s" : ""}</span>
                </div>
            ),
        },
        {
            name: "Status",
            selector: row => row.is_active,
            sortable: true,
            width: "110px",
            cell: row => (
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${row.is_active ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                    {row.is_active ? "Active" : "Inactive"}
                </span>
            ),
        },
        {
            name: "Updated",
            selector: row => row.updated_at,
            sortable: true,
            width: "160px",
            cell: row => (
                <div className="text-xs text-gray-500">
                    {row.updated_at ? new Date(row.updated_at).toLocaleDateString() : "—"}
                </div>
            ),
        },
        {
            name: "Actions",
            right: true,
            cell: row => (
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate(`/admin/email-templates/${row.id}`)}
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
        },
    ];

    const customStyles = {
        headRow: { style: { backgroundColor: "#f9fafb", borderBottomColor: "#f3f4f6" } },
        headCells: {
            style: {
                fontSize: "0.75rem", fontWeight: "600", color: "#6b7280",
                textTransform: "uppercase", letterSpacing: "0.05em",
            },
        },
        rows: { style: { transition: "all 0.2s", "&:hover": { backgroundColor: "#f9fafb" } } },
    };

    return (
        <div style={{ padding: "2rem", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <div>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", margin: 0 }}>Email Templates</h2>
                    <p style={{ color: "#6b7280", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                        Manage reusable email templates with multi-language support
                    </p>
                </div>
                <button
                    onClick={() => navigate("/admin/email-templates/add")}
                    style={{
                        display: "flex", alignItems: "center", gap: "0.5rem",
                        backgroundColor: "#000", color: "#fff",
                        padding: "0.625rem 1.25rem", borderRadius: "0.75rem",
                        fontWeight: "500", cursor: "pointer", border: "none",
                    }}
                >
                    <Plus size={18} />
                    Add Template
                </button>
            </div>

            <div style={{ backgroundColor: "#fff", borderRadius: "1rem", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)", border: "1px solid #f3f4f6", overflow: "hidden" }}>
                <div style={{ padding: "1rem", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f9fafb" }}>
                    <div style={{ position: "relative", width: "16rem" }}>
                        <Search style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} size={18} />
                        <input
                            type="text"
                            placeholder="Search templates..."
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            style={{
                                width: "100%", paddingLeft: "2.5rem", paddingRight: "1rem",
                                paddingTop: "0.625rem", paddingBottom: "0.625rem",
                                backgroundColor: "#fff", border: "1px solid #e5e7eb",
                                borderRadius: "0.75rem", fontSize: "0.875rem", outline: "none", boxSizing: "border-box",
                            }}
                        />
                    </div>
                </div>

                <div className="react-data-table-wrapper">
                    <DataTable
                        columns={columns}
                        data={templates}
                        progressPending={loading}
                        pagination
                        paginationServer
                        paginationTotalRows={totalRows}
                        onChangePage={p => setPage(p)}
                        onChangeRowsPerPage={(newPerPage, p) => { setPerPage(newPerPage); setPage(p); }}
                        customStyles={customStyles}
                        highlightOnHover
                        pointerOnHover={false}
                        noDataComponent={
                            <div style={{ padding: "3rem", textAlign: "center", color: "#6b7280" }}>
                                <Mail size={40} style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
                                <div className="font-medium">No email templates found</div>
                                <div className="text-sm mt-1">Create your first template to get started</div>
                            </div>
                        }
                    />
                </div>
            </div>
        </div>
    );
}
