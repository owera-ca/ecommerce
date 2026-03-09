import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Plus, Trash2, Tag, ChevronDown } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const API = "http://localhost:8000/api/v1";

const AVAILABLE_TAGS = [
    { tag: "{{user_name}}", label: "User Name" },
    { tag: "{{user_email}}", label: "User Email" },
    { tag: "{{order_id}}", label: "Order ID" },
    { tag: "{{order_total}}", label: "Order Total" },
    { tag: "{{store_name}}", label: "Store Name" },
    { tag: "{{reset_link}}", label: "Password Reset Link" },
    { tag: "{{activation_link}}", label: "Account Activation Link" },
    { tag: "{{site_url}}", label: "Site URL" },
];

const COMMON_LOCALES = [
    { code: "en", label: "English (en)" },
    { code: "fr", label: "French (fr)" },
    { code: "es", label: "Spanish (es)" },
    { code: "de", label: "German (de)" },
    { code: "pt", label: "Portuguese (pt)" },
    { code: "it", label: "Italian (it)" },
    { code: "zh", label: "Chinese (zh)" },
    { code: "ja", label: "Japanese (ja)" },
    { code: "ar", label: "Arabic (ar)" },
];

const QUILL_MODULES = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["link"],
        ["clean"],
    ],
};

const QUILL_FORMATS = [
    "header", "bold", "italic", "underline", "strike",
    "color", "background", "list", "bullet", "align", "link",
];

export default function EditEmailTemplate() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isAddMode = !id || id === "add";

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!isAddMode);
    const [activeTabIdx, setActiveTabIdx] = useState(0);
    const [showTagPanel, setShowTagPanel] = useState(false);
    const [showLocaleDropdown, setShowLocaleDropdown] = useState(false);
    const tagPanelRef = useRef(null);
    const localeDropdownRef = useRef(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        is_active: true,
    });

    const [translations, setTranslations] = useState([
        { id: null, locale: "en", subject: "", body: "" },
    ]);

    // Fetch existing template
    useEffect(() => {
        if (isAddMode) return;
        const fetchTemplate = async () => {
            try {
                const res = await fetch(`${API}/emails/templates/${id}`);
                if (!res.ok) {
                    alert("Template not found");
                    navigate("/admin/email-templates");
                    return;
                }
                const data = await res.json();
                setFormData({
                    name: data.name || "",
                    description: data.description || "",
                    is_active: data.is_active,
                });
                setTranslations(
                    data.translations && data.translations.length > 0
                        ? data.translations.map(t => ({
                            id: t.id,
                            locale: t.locale,
                            subject: t.subject,
                            body: t.body,
                        }))
                        : [{ id: null, locale: "en", subject: "", body: "" }]
                );
            } catch (err) {
                console.error("Failed to fetch template", err);
                alert("Network error.");
            } finally {
                setFetching(false);
            }
        };
        fetchTemplate();
    }, [id, isAddMode, navigate]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e) => {
            if (tagPanelRef.current && !tagPanelRef.current.contains(e.target)) {
                setShowTagPanel(false);
            }
            if (localeDropdownRef.current && !localeDropdownRef.current.contains(e.target)) {
                setShowLocaleDropdown(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleTranslationChange = (idx, field, value) => {
        setTranslations(prev =>
            prev.map((t, i) => i === idx ? { ...t, [field]: value } : t)
        );
    };

    const addTranslation = (localeCode) => {
        const exists = translations.some(t => t.locale === localeCode);
        if (exists) {
            const existingIdx = translations.findIndex(t => t.locale === localeCode);
            setActiveTabIdx(existingIdx);
            setShowLocaleDropdown(false);
            return;
        }
        setTranslations(prev => [
            ...prev,
            { id: null, locale: localeCode, subject: "", body: "" },
        ]);
        setActiveTabIdx(translations.length);
        setShowLocaleDropdown(false);
    };

    const addCustomLocale = () => {
        const code = window.prompt("Enter locale code (e.g. en, fr, pt-BR):");
        if (!code) return;
        addTranslation(code.trim().toLowerCase());
    };

    const removeTranslation = (idx) => {
        if (translations.length === 1) {
            alert("At least one translation is required.");
            return;
        }
        if (!window.confirm("Remove this translation?")) return;
        setTranslations(prev => prev.filter((_, i) => i !== idx));
        setActiveTabIdx(Math.max(0, activeTabIdx - (idx <= activeTabIdx ? 1 : 0)));
    };

    const insertTag = (tag) => {
        // Insert tag into the active translation's subject (simple append)
        const currentBody = translations[activeTabIdx]?.body || "";
        handleTranslationChange(activeTabIdx, "body", currentBody + tag);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                translations: translations.map(t => ({
                    id: t.id || undefined,
                    locale: t.locale,
                    subject: t.subject,
                    body: t.body,
                })),
            };

            const url = isAddMode
                ? `${API}/emails/templates/`
                : `${API}/emails/templates/${id}`;
            const method = isAddMode ? "POST" : "PUT";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                navigate("/admin/email-templates");
            } else {
                const err = await res.json();
                alert(`Error: ${err.detail || "Failed to save template"}`);
            }
        } catch (err) {
            console.error("Failed to save template", err);
            alert("Network error.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="p-8 text-center text-gray-500">Loading template...</div>;
    }

    const activeTranslation = translations[activeTabIdx] || translations[0];

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            {/* Page header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate("/admin/email-templates")}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                        {isAddMode ? "Add Email Template" : "Edit Email Template"}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {isAddMode
                            ? "Create a new reusable email template with translations."
                            : "Update this email template and its translations."}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="space-y-12">
                    {/* ── Template Info ─────────────────────────────────── */}
                    <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                        <div>
                            <h2 className="text-base/7 font-semibold text-gray-900">Template Info</h2>
                            <p className="mt-1 text-sm/6 text-gray-600">
                                The unique name (key) is used by the system to reference this template.
                            </p>
                        </div>

                        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                            <div className="sm:col-span-4">
                                <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
                                    Template Name (Key) <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="e.g. welcome_email, order_confirmation"
                                        className="block w-full rounded-none bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">Use snake_case. This key is used in code to look up the template.</p>
                            </div>

                            <div className="sm:col-span-6">
                                <label htmlFor="description" className="block text-sm/6 font-medium text-gray-900">Description</label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="description"
                                        id="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Brief description of when this template is sent"
                                        className="block w-full rounded-none bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-6">
                                <div className="flex gap-3">
                                    <div className="flex h-6 shrink-0 items-center">
                                        <div className="group grid size-4 grid-cols-1">
                                            <input
                                                type="checkbox"
                                                id="is_active"
                                                name="is_active"
                                                checked={formData.is_active}
                                                onChange={handleInputChange}
                                                className="col-start-1 row-start-1 appearance-none rounded-none border border-gray-300 bg-white checked:border-black checked:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                                            />
                                            <svg fill="none" viewBox="0 0 14 14" className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white">
                                                <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-has-[:checked]:opacity-100" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="text-sm/6">
                                        <label htmlFor="is_active" className="font-medium text-gray-900 cursor-pointer">Active</label>
                                        <p className="text-gray-500">Inactive templates will not be used by the system.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Translations ─────────────────────────────────── */}
                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-3">
                        <div>
                            <h2 className="text-base/7 font-semibold text-gray-900">Translations</h2>
                            <p className="mt-1 text-sm/6 text-gray-600">
                                Add a subject and HTML body for each language you need.
                            </p>

                            {/* Template Tags */}
                            <div className="mt-6 relative" ref={tagPanelRef}>
                                <button
                                    type="button"
                                    onClick={() => setShowTagPanel(v => !v)}
                                    className="flex items-center gap-2 text-xs font-medium text-gray-600 hover:text-black border border-gray-200 rounded-lg px-3 py-2 bg-white hover:bg-gray-50 transition-colors cursor-pointer w-full"
                                >
                                    <Tag size={13} />
                                    Template Tags
                                    <ChevronDown size={13} className={`ml-auto transition-transform ${showTagPanel ? "rotate-180" : ""}`} />
                                </button>
                                {showTagPanel && (
                                    <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-10">
                                        <p className="text-xs text-gray-500 mb-2">Click a tag to insert it into the body:</p>
                                        <div className="space-y-1">
                                            {AVAILABLE_TAGS.map(({ tag, label }) => (
                                                <button
                                                    key={tag}
                                                    type="button"
                                                    onClick={() => insertTag(tag)}
                                                    className="w-full text-left px-2 py-1.5 rounded-md hover:bg-gray-50 cursor-pointer group"
                                                >
                                                    <code className="text-xs text-indigo-600 group-hover:text-indigo-800">{tag}</code>
                                                    <span className="text-xs text-gray-500 ml-2">{label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            {/* Tab bar */}
                            <div className="flex items-center gap-0 border-b border-gray-200 mb-6 overflow-x-auto">
                                {translations.map((t, idx) => (
                                    <div key={idx} className="flex items-center group">
                                        <button
                                            type="button"
                                            onClick={() => setActiveTabIdx(idx)}
                                            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer -mb-px ${idx === activeTabIdx
                                                    ? "border-black text-black"
                                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                                }`}
                                        >
                                            {t.locale.toUpperCase()}
                                        </button>
                                        {translations.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeTranslation(idx)}
                                                className="opacity-0 group-hover:opacity-100 ml-1 p-0.5 text-gray-400 hover:text-red-500 transition-all rounded cursor-pointer"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        )}
                                    </div>
                                ))}

                                {/* Add locale button */}
                                <div className="relative ml-2" ref={localeDropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => setShowLocaleDropdown(v => !v)}
                                        className="flex items-center gap-1 px-3 py-2 text-xs text-gray-500 hover:text-black border border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors cursor-pointer whitespace-nowrap"
                                    >
                                        <Plus size={13} /> Add locale
                                    </button>
                                    {showLocaleDropdown && (
                                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 w-52 py-1">
                                            {COMMON_LOCALES.map(({ code, label }) => (
                                                <button
                                                    key={code}
                                                    type="button"
                                                    onClick={() => addTranslation(code)}
                                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer ${translations.some(t => t.locale === code) ? "text-gray-300 pointer-events-none" : "text-gray-700"}`}
                                                >
                                                    {label}
                                                    {translations.some(t => t.locale === code) && <span className="ml-2 text-xs text-gray-400">✓</span>}
                                                </button>
                                            ))}
                                            <div className="border-t border-gray-100 my-1" />
                                            <button
                                                type="button"
                                                onClick={addCustomLocale}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                                            >
                                                + Custom locale code...
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Active translation form */}
                            {activeTranslation && (
                                <div>
                                    <div className="mb-6">
                                        <label className="block text-sm/6 font-medium text-gray-900 mb-2">
                                            Subject <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={activeTranslation.subject}
                                            onChange={e => handleTranslationChange(activeTabIdx, "subject", e.target.value)}
                                            placeholder="Email subject line (supports template tags)"
                                            className="block w-full rounded-none bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm/6 font-medium text-gray-900 mb-2">
                                            Body <span className="text-red-500">*</span>
                                        </label>
                                        <div style={{ border: "1px solid #d1d5db" }}>
                                            <ReactQuill
                                                key={activeTabIdx}
                                                value={activeTranslation.body}
                                                onChange={value => handleTranslationChange(activeTabIdx, "body", value)}
                                                modules={QUILL_MODULES}
                                                formats={QUILL_FORMATS}
                                                style={{ minHeight: "320px" }}
                                                theme="snow"
                                            />
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500">HTML email body. Use Template Tags to insert dynamic values.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="mt-8 flex items-center justify-end gap-x-6 border-t border-gray-900/10 pt-8">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/email-templates")}
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
                        {loading ? "Saving..." : isAddMode ? "Create Template" : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}
