import React, { useState, useEffect, useCallback } from "react";
import { Search, Filter, Eye, X } from "lucide-react";
import DataTable from "react-data-table-component";
import UserSelectModal from "../../components/UserSelectModal";

const API = "http://localhost:8000/api/v1";

const STATUS_OPTIONS = [
    { value: "", label: "All Statuses" },
    { value: "pending", label: "Pending" },
    { value: "sent", label: "Sent" },
    { value: "failed", label: "Failed" },
];

const STATUS_STYLES = {
    sent: "bg-emerald-100 text-emerald-800",
    pending: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
};

export default function SentEmails() {
    const [emails, setEmails] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    // Filters
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [templateFilter, setTemplateFilter] = useState("");
    const [templates, setTemplates] = useState([]);
    const [showUserModal, setShowUserModal] = useState(false);

    // Detail modal
    const [selectedEmail, setSelectedEmail] = useState(null);

    // Fetch template list for filter dropdown
    useEffect(() => {
        fetch(`${API}/emails/templates/?limit=200`)
            .then(r => r.json())
            .then(d => setTemplates(d.items || []))
            .catch(() => { });
    }, []);

    const buildParams = useCallback(() => {
        const skip = (page - 1) * perPage;
        const p = new URLSearchParams({ skip, limit: perPage });
        if (searchText) p.append("search", searchText);
        if (statusFilter) p.append("status", statusFilter);
        if (dateFrom) p.append("date_from", dateFrom);
        if (dateTo) p.append("date_to", dateTo + "T23:59:59");
        if (selectedUser) p.append("user_id", selectedUser.id);
        if (templateFilter) p.append("template_id", templateFilter);
        return p;
    }, [page, perPage, searchText, statusFilter, dateFrom, dateTo, selectedUser, templateFilter]);

    const fetchEmails = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API}/emails/?${buildParams()}`);
            const data = await res.json();
            setEmails(data.items || []);
            setTotalRows(data.total || 0);
        } catch (err) {
            console.error("Failed to fetch emails", err);
        } finally {
            setLoading(false);
        }
    }, [buildParams]);

    useEffect(() => { fetchEmails(); }, [fetchEmails]);

    const clearFilters = () => {
        setSearchText("");
        setStatusFilter("");
        setDateFrom("");
        setDateTo("");
        setSelectedUser(null);
        setTemplateFilter("");
        setPage(1);
    };

    const hasActiveFilters = searchText || statusFilter || dateFrom || dateTo || selectedUser || templateFilter;

    const columns = [
        {
            name: "ID",
            selector: row => row.id,
            sortable: true,
            width: "70px",
        },
        {
            name: "Recipient",
            selector: row => row.to_email,
            sortable: true,
            cell: row => (
                <div>
                    <div className="font-medium text-gray-800 text-sm">{row.to_email}</div>
                    {row.user_email && row.user_email !== row.to_email && (
                        <div className="text-xs text-gray-500">User: {row.user_email}</div>
                    )}
                </div>
            ),
        },
        {
            name: "Subject",
            selector: row => row.subject,
            sortable: true,
            cell: row => (
                <div className="text-sm text-gray-700 truncate max-w-xs" title={row.subject}>
                    {row.subject}
                </div>
            ),
        },
        {
            name: "Template",
            selector: row => row.template_name,
            sortable: true,
            width: "160px",
            cell: row => (
                <div className="text-xs text-gray-600">
                    {row.template_name
                        ? <code className="bg-gray-100 px-1.5 py-0.5 rounded">{row.template_name}</code>
                        : <span className="text-gray-400">—</span>
                    }
                </div>
            ),
        },
        {
            name: "Status",
            selector: row => row.status,
            sortable: true,
            width: "110px",
            cell: row => (
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[row.status] || "bg-gray-100 text-gray-800"}`}>
                    {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                </span>
            ),
        },
        {
            name: "Date",
            selector: row => row.created_at,
            sortable: true,
            width: "150px",
            cell: row => (
                <div className="text-xs text-gray-500">
                    {row.created_at ? new Date(row.created_at).toLocaleString() : "—"}
                </div>
            ),
        },
        {
            name: "",
            right: true,
            width: "60px",
            cell: row => (
                <button
                    onClick={() => setSelectedEmail(row)}
                    className="text-gray-400 hover:text-black transition-colors p-1.5 rounded-md hover:bg-gray-100 cursor-pointer outline-none"
                    title="View"
                >
                    <Eye size={16} />
                </button>
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
        <div style={{ padding: "2rem" }}>
            <div style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", margin: 0 }}>Sent Emails</h2>
                <p style={{ color: "#6b7280", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                    View and filter all outgoing email records
                </p>
            </div>

            {/* Filter bar */}
            <div style={{ backgroundColor: "#fff", borderRadius: "1rem", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)", border: "1px solid #f3f4f6", marginBottom: "1.5rem", padding: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                    <Filter size={15} style={{ color: "#6b7280" }} />
                    <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Filters</span>
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", color: "#6b7280", cursor: "pointer", background: "none", border: "none", padding: "0" }}
                        >
                            <X size={13} /> Clear all
                        </button>
                    )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
                    {/* Search */}
                    <div style={{ position: "relative" }}>
                        <Search style={{ position: "absolute", left: "0.625rem", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} size={15} />
                        <input
                            type="text"
                            placeholder="Search email or subject..."
                            value={searchText}
                            onChange={e => { setSearchText(e.target.value); setPage(1); }}
                            style={{ width: "100%", paddingLeft: "2rem", paddingRight: "0.75rem", paddingTop: "0.5rem", paddingBottom: "0.5rem", border: "1px solid #e5e7eb", borderRadius: "0.625rem", fontSize: "0.8rem", outline: "none", boxSizing: "border-box" }}
                        />
                    </div>

                    {/* Status */}
                    <select
                        value={statusFilter}
                        onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                        style={{ padding: "0.5rem 0.75rem", border: "1px solid #e5e7eb", borderRadius: "0.625rem", fontSize: "0.8rem", outline: "none", backgroundColor: "#fff", cursor: "pointer" }}
                    >
                        {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>

                    {/* Template */}
                    <select
                        value={templateFilter}
                        onChange={e => { setTemplateFilter(e.target.value); setPage(1); }}
                        style={{ padding: "0.5rem 0.75rem", border: "1px solid #e5e7eb", borderRadius: "0.625rem", fontSize: "0.8rem", outline: "none", backgroundColor: "#fff", cursor: "pointer" }}
                    >
                        <option value="">All Templates</option>
                        {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>

                    {/* User */}
                    <button
                        type="button"
                        onClick={() => setShowUserModal(true)}
                        style={{ padding: "0.5rem 0.75rem", border: "1px solid #e5e7eb", borderRadius: "0.625rem", fontSize: "0.8rem", outline: "none", backgroundColor: selectedUser ? "#f0fdf4" : "#fff", cursor: "pointer", textAlign: "left", color: selectedUser ? "#166534" : "#6b7280", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                    >
                        <span>{selectedUser ? `${selectedUser.first_name || ""} ${selectedUser.last_name || ""} (${selectedUser.email})`.trim() : "Filter by User..."}</span>
                        {selectedUser && (
                            <X size={13} onClick={e => { e.stopPropagation(); setSelectedUser(null); setPage(1); }} style={{ color: "#9ca3af", cursor: "pointer" }} />
                        )}
                    </button>

                    {/* Date from */}
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={e => { setDateFrom(e.target.value); setPage(1); }}
                        style={{ padding: "0.5rem 0.75rem", border: "1px solid #e5e7eb", borderRadius: "0.625rem", fontSize: "0.8rem", outline: "none", backgroundColor: "#fff", cursor: "pointer" }}
                        title="From date"
                    />

                    {/* Date to */}
                    <input
                        type="date"
                        value={dateTo}
                        onChange={e => { setDateTo(e.target.value); setPage(1); }}
                        style={{ padding: "0.5rem 0.75rem", border: "1px solid #e5e7eb", borderRadius: "0.625rem", fontSize: "0.8rem", outline: "none", backgroundColor: "#fff", cursor: "pointer" }}
                        title="To date"
                    />
                </div>
            </div>

            {/* Table */}
            <div style={{ backgroundColor: "#fff", borderRadius: "1rem", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)", border: "1px solid #f3f4f6", overflow: "hidden" }}>
                <div className="react-data-table-wrapper">
                    <DataTable
                        columns={columns}
                        data={emails}
                        progressPending={loading}
                        pagination
                        paginationServer
                        paginationTotalRows={totalRows}
                        onChangePage={p => setPage(p)}
                        onChangeRowsPerPage={(np, p) => { setPerPage(np); setPage(p); }}
                        customStyles={customStyles}
                        highlightOnHover
                        pointerOnHover={false}
                        noDataComponent={
                            <div style={{ padding: "3rem", textAlign: "center", color: "#6b7280" }}>
                                <div className="font-medium">No emails found</div>
                                <div className="text-sm mt-1">{hasActiveFilters ? "Try adjusting your filters" : "No emails have been sent yet"}</div>
                            </div>
                        }
                    />
                </div>
            </div>

            {/* User select modal */}
            {showUserModal && (
                <UserSelectModal
                    onSelect={user => { setSelectedUser(user); setShowUserModal(false); setPage(1); }}
                    onClose={() => setShowUserModal(false)}
                />
            )}

            {/* Email detail modal */}
            {selectedEmail && (
                <div
                    style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
                    onClick={() => setSelectedEmail(null)}
                >
                    <div
                        style={{ backgroundColor: "#fff", borderRadius: "1rem", maxWidth: "700px", width: "100%", maxHeight: "85vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal header */}
                        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div>
                                <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "#111827", margin: 0 }}>Email Detail</h3>
                                <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: "0.25rem 0 0" }}>#{selectedEmail.id}</p>
                            </div>
                            <button onClick={() => setSelectedEmail(null)} style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem", color: "#6b7280" }}>
                                <X size={18} />
                            </button>
                        </div>

                        {/* Meta */}
                        <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #f3f4f6", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                            {[
                                ["To", selectedEmail.to_email],
                                ["Status", <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[selectedEmail.status] || ""}`}>{selectedEmail.status}</span>],
                                ["Template", selectedEmail.template_name ? <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">{selectedEmail.template_name}</code> : "—"],
                                ["Sent", selectedEmail.sent_at ? new Date(selectedEmail.sent_at).toLocaleString() : selectedEmail.created_at ? new Date(selectedEmail.created_at).toLocaleString() : "—"],
                            ].map(([label, val]) => (
                                <div key={label}>
                                    <div style={{ fontSize: "0.7rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>{label}</div>
                                    <div style={{ fontSize: "0.875rem", color: "#111827" }}>{val}</div>
                                </div>
                            ))}
                        </div>

                        {/* Subject */}
                        <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #f3f4f6" }}>
                            <div style={{ fontSize: "0.7rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>Subject</div>
                            <div style={{ fontSize: "0.9rem", fontWeight: "500", color: "#111827" }}>{selectedEmail.subject}</div>
                        </div>

                        {/* Body */}
                        <div style={{ padding: "1rem 1.5rem" }}>
                            <div style={{ fontSize: "0.7rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>Body</div>
                            <div
                                style={{ border: "1px solid #f3f4f6", borderRadius: "0.5rem", padding: "1rem", fontSize: "0.875rem", lineHeight: "1.6", color: "#374151", backgroundColor: "#fafafa" }}
                                dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
