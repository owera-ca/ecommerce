import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Search, X } from "lucide-react";

export default function UserSelectModal({ isOpen, onClose, onSelect }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (isOpen) {
            fetchUsers(currentPage, perPage, searchTerm);
        }
    }, [isOpen, currentPage, perPage, searchTerm]);

    // Reset state when opened
    useEffect(() => {
        if (isOpen) {
            setCurrentPage(1);
            setSearchTerm("");
        }
    }, [isOpen]);

    const fetchUsers = async (page, size, search = "") => {
        setLoading(true);
        try {
            const skip = (page - 1) * size;
            const res = await fetch(`http://localhost:8000/api/v1/users/?skip=${skip}&limit=${size}`);
            const data = await res.json();

            let items = data.items || [];
            if (search) {
                const lowerSearch = search.toLowerCase();
                items = items.filter(u =>
                    (u.email && u.email.toLowerCase().includes(lowerSearch)) ||
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

    const handlePageChange = page => {
        setCurrentPage(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
        setCurrentPage(page);
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
            name: "Actions",
            cell: row => (
                <button
                    onClick={() => {
                        onSelect(row);
                        onClose();
                    }}
                    className="px-3 py-1 bg-black text-white text-xs font-semibold hover:bg-gray-800"
                >
                    Select
                </button>
            ),
            width: "100px"
        }
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white w-full max-w-3xl shadow-xl flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Select User</h2>
                    <button onClick={onClose} className="p-1 text-gray-500 hover:bg-gray-100 rounded">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                    <div className="relative w-full sm:max-w-xs">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="search"
                            placeholder="Search users..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-4">
                    <div className="border border-gray-200">
                        <DataTable
                            columns={columns}
                            data={users}
                            progressPending={loading}
                            pagination
                            paginationServer
                            paginationTotalRows={totalRows}
                            onChangeRowsPerPage={handlePerRowsChange}
                            onChangePage={handlePageChange}
                            paginationRowsPerPageOptions={[5, 10, 20]}
                            customStyles={{
                                headRow: {
                                    style: {
                                        backgroundColor: '#f9fafb',
                                        borderBottomColor: '#e5e7eb',
                                        fontWeight: 600,
                                        color: '#374151'
                                    }
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
