"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Building2, Users, CheckCircle2, XCircle, Clock, Search,
  Filter, Eye, Check, X, FileText, Mail, Phone, ExternalLink,
  LogOut, Lock, RefreshCw, AlertCircle, Calendar, MapPin,
  TrendingUp, Landmark, Copy, ChevronRight, UserCheck, AlertTriangle, Loader2
} from "lucide-react";
import Link from "next/link";

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface ApplicationListItem {
  id: string;
  company_name: string;
  website: string;
  company_email: string;
  company_phone: string;
  year_established: number;
  head_office_city: string;
  state: string;
  country: string;
  pincode: string | null;
  company_type: string;
  employee_range: string;
  turnover_range: string | null;
  gstin: string | null;
  pan: string | null;
  registration_number: string | null;
  linkedin_url: string | null;
  status: "PENDING_REVIEW" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
  rejection_reason: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  ip_address: string | null;
  doc_count: number;
  submitted_doc_count: string | number;
  onboarding_status?: string | null;
}

interface ContactItem {
  id: string;
  application_id: string;
  contact_type: string;
  full_name: string;
  designation: string;
  contact_email: string;
  contact_phone: string;
  is_primary: boolean | number;
}

interface DocumentItem {
  id: string;
  application_id: string;
  document_type: string;
  file_name: string;
  storage_key: string;
  mime_type: string;
  file_size_bytes: number;
  uploaded_at: string;
  verification_status: "NOT_SUBMITTED" | "SUBMITTED" | "UNDER_REVIEW" | "VERIFIED" | "REJECTED";
  verified_at: string | null;
  rejection_reason: string | null;
}

interface BankingItem {
  id: string;
  beneficiary_name: string;
  account_number: string;
  ifsc_code: string;
  bank_name: string;
  branch_name: string | null;
  account_type: string;
  upi_id: string | null;
  is_verified: boolean | number;
}

interface OnboardingItem {
  onboarding_status: string;
  onboarding_token?: string;
  agreement_version?: string;
  agreement_accepted?: boolean;
  agreement_accepted_at?: string;
  agreement_ip?: string;
  agreement_signature?: string;
  created_at?: string;
  completed_at?: string;
}

interface PartnerItem {
  id: string;
  partner_code: string | null;
  partner_tier: string;
  commission_rate_pct: number;
  partner_status: string;
  activated_at: string | null;
}

interface ActivityItem {
  id: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  created_at: string;
  user_name: string | null;
  user_role: string | null;
  company_name: string | null;
}

interface DetailedApplication {
  application: ApplicationListItem;
  contacts: ContactItem[];
  documents: DocumentItem[];
  banking: BankingItem | null;
  onboarding: OnboardingItem | null;
  partner: PartnerItem | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(isoString?: string | null) {
  if (!isoString) return "—";
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function AdminDashboardPage() {
  // Auth state
  const [token, setToken] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Dashboard state
  const [applications, setApplications] = useState<ApplicationListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<DetailedApplication | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  // Action states
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Restore token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("aashray_admin_token");
    const savedUser = localStorage.getItem("aashray_admin_user");
    if (savedToken) {
      setToken(savedToken);
      if (savedUser) {
        try { setAdminUser(JSON.parse(savedUser)); } catch { /* ignore */ }
      }
    }
  }, []);

  // Header logout button fires this event; sync local state when token is removed
  useEffect(() => {
    const onAuthChange = () => {
      if (!localStorage.getItem("aashray_admin_token")) {
        setToken(null);
        setAdminUser(null);
        setApplications([]);
        setSelectedAppId(null);
        setDetailData(null);
      }
    };
    window.addEventListener("aashray-admin-auth", onAuthChange);
    return () => window.removeEventListener("aashray-admin-auth", onAuthChange);
  }, []);

  // Fetch applications
  const fetchApplications = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      let url = `/api/admin/partner-applications?limit=100`;
      if (statusFilter !== "ALL") {
        url += `&status=${statusFilter}`;
      }
      if (search.trim()) {
        url += `&search=${encodeURIComponent(search.trim())}`;
      }
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        handleLogout();
        showToast("Session expired. Please log in again.", "error");
        return;
      }
      const json = await res.json();
      setApplications(json.data || []);
    } catch {
      showToast("Failed to load partner applications.", "error");
    } finally {
      setLoading(false);
    }
  }, [token, statusFilter, search]);

  useEffect(() => {
    if (token) {
      fetchApplications();
    }
  }, [token, fetchApplications]);

  // Fetch recent activity feed
  const fetchActivity = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/activity?limit=15`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const json = await res.json();
      setActivity(json.data || []);
    } catch {
      /* non-critical */
    }
  }, [token]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity, applications]);

  // Fetch single application detail
  const fetchDetail = async (id: string) => {
    if (!token) return;
    setDetailLoading(true);
    setSelectedAppId(id);
    try {
      const res = await fetch(`/api/admin/partner-applications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch detail");
      const data = await res.json();
      setDetailData(data);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error fetching details", "error");
    } finally {
      setDetailLoading(false);
    }
  };

  // Login handler
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      setToken(data.token);
      setAdminUser(data.user);
      localStorage.setItem("aashray_admin_token", data.token);
      localStorage.setItem("aashray_admin_user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("aashray-admin-auth"));
      showToast(`Welcome back, ${data.user.name}!`);
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setAdminUser(null);
    localStorage.removeItem("aashray_admin_token");
    localStorage.removeItem("aashray_admin_user");
    window.dispatchEvent(new Event("aashray-admin-auth"));
    setApplications([]);
    setSelectedAppId(null);
    setDetailData(null);
  };

  // Admin Actions: Approve
  const handleApprove = async (id: string) => {
    if (!token) return;
    if (!confirm("Are you sure you want to approve this partner application? An onboarding invitation will be generated.")) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/partner-applications/${id}/approve`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Approval failed");
      showToast("Application approved! Onboarding link generated.");
      await fetchApplications();
      if (selectedAppId === id) await fetchDetail(id);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Approval failed", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Admin Actions: Reject
  const handleRejectConfirm = async () => {
    if (!token || !selectedAppId) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/partner-applications/${selectedAppId}/reject`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: rejectionReason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Rejection failed");
      showToast("Application rejected.");
      setRejectionModalOpen(false);
      setRejectionReason("");
      await fetchApplications();
      await fetchDetail(selectedAppId);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Rejection failed", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Admin Actions: Activate Partner
  const handleActivate = async (id: string) => {
    if (!token) return;
    if (!confirm("Activate this partner? This grants active status and establishes official partnership.")) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/partner-applications/${id}/activate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Activation failed");
      showToast("Partner activated successfully!");
      await fetchApplications();
      if (selectedAppId === id) await fetchDetail(id);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Activation failed", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Admin Actions: Verify Document
  const handleVerifyDocument = async (docId: string, status: "VERIFIED" | "REJECTED") => {
    if (!token || !selectedAppId) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/documents/${docId}/verify`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Document status update failed");
      showToast(`Document marked as ${status}`);
      await fetchDetail(selectedAppId);
      await fetchApplications();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to verify document", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Metrics
  const totalCount = applications.length;
  const pendingCount = applications.filter((a) => a.status === "PENDING_REVIEW").length;
  const approvedCount = applications.filter((a) => a.status === "APPROVED").length;
  const rejectedCount = applications.filter((a) => a.status === "REJECTED").length;

  // ─── Render: Login View ─────────────────────────────────────────────────────
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex flex-col justify-center items-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8"
        >
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary dark:text-white flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-primary dark:text-sky-400" />
            </div>
            <h1 className="text-2xl font-bold font-sans text-neutral-text dark:text-white">
              Aashray Admin Portal
            </h1>
            <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">
              Sign in to review and manage NiyamSaathi partner applications
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-neutral-text dark:text-gray-300 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  placeholder="admin@aashrayinfotech.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-neutral-text dark:text-white text-base focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-text dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-neutral-text dark:text-white text-base focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 px-4 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {loginLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Signing In…
                </>
              ) : (
                <>Sign In to Dashboard</>
              )}
            </button>
          </form>

        </motion.div>
      </div>
    );
  }

  // ─── Render: Main Dashboard ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-neutral-text dark:text-gray-100 pb-16">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 text-sm font-medium ${
              toastMessage.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
                : "bg-red-50 dark:bg-red-950/80 border-red-300 dark:border-red-800 text-red-800 dark:text-red-200"
            }`}
          >
            {toastMessage.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 space-y-6">
        {/* KPI Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-text-secondary dark:text-gray-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Applications</span>
              <Building2 className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold font-sans text-neutral-text dark:text-white">{totalCount}</p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Pending Review</span>
              <Clock className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold font-sans text-amber-600 dark:text-amber-400">{pendingCount}</p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-900/50 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Approved</span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold font-sans text-blue-600 dark:text-blue-400">{approvedCount}</p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-red-200 dark:border-red-900/50 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-red-600 dark:text-red-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Rejected</span>
              <XCircle className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold font-sans text-red-600 dark:text-red-400">{rejectedCount}</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: "ALL", label: "All" },
              { id: "PENDING_REVIEW", label: "Pending Review" },
              { id: "APPROVED", label: "Approved" },
              { id: "REJECTED", label: "Rejected" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  statusFilter === tab.id
                    ? "bg-primary text-white shadow-xs"
                    : "text-text-secondary dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search + Refresh */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="text"
                placeholder="Search company, city, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs text-neutral-text dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            <button
              onClick={fetchApplications}
              disabled={loading}
              title="Refresh"
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-text-secondary dark:text-gray-300 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 text-text-secondary dark:text-gray-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Company</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Type & Size</th>
                  <th className="py-3.5 px-4">Tax / Legal IDs</th>
                  <th className="py-3.5 px-4">Submitted</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-text-secondary dark:text-gray-400">
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-primary" /> Loading partner applications…
                        </div>
                      ) : (
                        "No partner applications found."
                      )}
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-gray-50/60 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-neutral-text dark:text-white text-sm">
                          {app.company_name}
                        </div>
                        <div className="flex items-center gap-2 text-text-secondary dark:text-gray-400 mt-0.5">
                          <span className="truncate max-w-[180px]">{app.company_email}</span>
                          {app.website && (
                            <a
                              href={app.website}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary hover:text-primary-dark"
                              title="Visit website"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-neutral-text dark:text-gray-300">
                        <div>{app.head_office_city}, {app.state}</div>
                        <div className="text-[11px] text-text-secondary dark:text-gray-400">{app.country} {app.pincode && `• ${app.pincode}`}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 dark:bg-gray-800 text-neutral-text dark:text-gray-300 mb-1">
                          {app.company_type}
                        </span>
                        <div className="text-[11px] text-text-secondary dark:text-gray-400">
                          {app.employee_range} employees {app.turnover_range && `• ${app.turnover_range}`}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-text-secondary dark:text-gray-400 space-y-0.5">
                        {app.gstin && <div>GST: {app.gstin}</div>}
                        {app.pan && <div>PAN: {app.pan}</div>}
                        {app.registration_number && <div>CIN: {app.registration_number}</div>}
                      </td>

                      <td className="py-3.5 px-4 text-text-secondary dark:text-gray-400">
                        {formatDate(app.submitted_at)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            app.status === "APPROVED"
                              ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                              : app.status === "REJECTED"
                              ? "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                              : "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                          }`}
                        >
                          {app.status === "APPROVED" && <CheckCircle2 className="w-3 h-3" />}
                          {app.status === "REJECTED" && <XCircle className="w-3 h-3" />}
                          {app.status === "PENDING_REVIEW" && <Clock className="w-3 h-3" />}
                          {app.status.replace("_", " ")}
                          {app.status === "APPROVED" && app.onboarding_status ? ` · ${app.onboarding_status.replace(/_/g, " ")}` : ""}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => fetchDetail(app.id)}
                            className="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-primary font-medium text-xs flex items-center gap-1 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" /> Review
                          </button>

                          {app.status === "PENDING_REVIEW" && (
                            <>
                              <button
                                onClick={() => handleApprove(app.id)}
                                title="Approve application"
                                className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedAppId(app.id);
                                  setRejectionModalOpen(true);
                                }}
                                title="Reject application"
                                className="p-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xs">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-text dark:text-white">Recent Activity</h2>
            <button onClick={fetchActivity} title="Refresh activity" className="text-text-secondary hover:text-primary">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {activity.length === 0 ? (
              <li className="py-6 text-center text-xs text-text-secondary dark:text-gray-400">No recent activity.</li>
            ) : (
              activity.map((item) => (
                <li key={item.id} className="px-4 py-3 flex items-start justify-between gap-4 text-xs">
                  <div>
                    <span className="font-semibold text-neutral-text dark:text-white">
                      {item.action.replace(/_/g, " ")}
                    </span>
                    {item.company_name && (
                      <span className="text-text-secondary dark:text-gray-400"> — {item.company_name}</span>
                    )}
                    <div className="text-[11px] text-text-secondary dark:text-gray-400 mt-0.5">
                      by {item.user_name || "System"}
                    </div>
                  </div>
                  <span className="text-[11px] text-text-secondary dark:text-gray-400 whitespace-nowrap">
                    {formatDate(item.created_at)}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </main>

      {/* ─── Detail & Review Modal ────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedAppId && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex justify-end">
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl bg-white dark:bg-gray-900 h-full min-h-screen shadow-2xl border-l border-gray-200 dark:border-gray-800 flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
                <div>
                  <h2 className="text-lg font-bold font-sans text-neutral-text dark:text-white">
                    {detailData?.application.company_name || "Application Details"}
                  </h2>
                  <p className="text-xs text-text-secondary dark:text-gray-400">
                    Application ID: {selectedAppId}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedAppId(null);
                    setDetailData(null);
                  }}
                  className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-text-secondary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
                {detailLoading ? (
                  <div className="h-64 flex items-center justify-center gap-2 text-text-secondary">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" /> Loading application details…
                  </div>
                ) : detailData ? (
                  <>
                    {/* Status & Review Summary */}
                    <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-semibold text-text-secondary dark:text-gray-400 uppercase">
                          Current Review Status
                        </span>
                        <div className="text-sm font-bold text-neutral-text dark:text-white mt-0.5">
                          {detailData.application.status.replace("_", " ")}
                        </div>
                        {detailData.application.reviewed_at && (
                          <p className="text-[11px] text-text-secondary dark:text-gray-400">
                            Reviewed on {formatDate(detailData.application.reviewed_at)}
                          </p>
                        )}
                        {detailData.application.rejection_reason && (
                          <p className="text-[11px] text-red-600 dark:text-red-400 mt-1">
                            Reason: {detailData.application.rejection_reason}
                          </p>
                        )}
                      </div>

                      {/* Onboarding Token badge if approved */}
                      {detailData.onboarding?.onboarding_token && (
                        <div className="text-right">
                          <span className="text-[11px] font-semibold text-text-secondary dark:text-gray-400 uppercase">
                            Onboarding Link
                          </span>
                          <div className="mt-1">
                            <button
                              onClick={() => {
                                const link = `${window.location.origin}/onboarding/${detailData.onboarding?.onboarding_token}`;
                                navigator.clipboard.writeText(link);
                                showToast("Onboarding link copied to clipboard!");
                              }}
                              className="px-2.5 py-1 rounded bg-primary/10 text-primary dark:text-sky-400 font-semibold hover:bg-primary/20 flex items-center gap-1 text-[11px]"
                            >
                              <Copy className="w-3 h-3" /> Copy Invite Link
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Section 1: Company Profile */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary dark:text-gray-400 mb-3 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-primary" /> Company Profile & Basics
                      </h3>
                      <div className="grid grid-cols-2 gap-3 bg-white dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                        <div>
                          <span className="text-text-secondary dark:text-gray-400">Official Website</span>
                          <p className="font-semibold text-neutral-text dark:text-white truncate">
                            <a href={detailData.application.website} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                              {detailData.application.website}
                            </a>
                          </p>
                        </div>
                        <div>
                          <span className="text-text-secondary dark:text-gray-400">Company Email</span>
                          <p className="font-semibold text-neutral-text dark:text-white truncate">
                            {detailData.application.company_email}
                          </p>
                        </div>
                        <div>
                          <span className="text-text-secondary dark:text-gray-400">Company Phone</span>
                          <p className="font-semibold text-neutral-text dark:text-white">
                            {detailData.application.company_phone}
                          </p>
                        </div>
                        <div>
                          <span className="text-text-secondary dark:text-gray-400">Year Established</span>
                          <p className="font-semibold text-neutral-text dark:text-white">
                            {detailData.application.year_established}
                          </p>
                        </div>
                        <div>
                          <span className="text-text-secondary dark:text-gray-400">Head Office City</span>
                          <p className="font-semibold text-neutral-text dark:text-white">
                            {detailData.application.head_office_city}, {detailData.application.state}
                          </p>
                        </div>
                        <div>
                          <span className="text-text-secondary dark:text-gray-400">Postal Code / Country</span>
                          <p className="font-semibold text-neutral-text dark:text-white">
                            {detailData.application.pincode || "—"}, {detailData.application.country}
                          </p>
                        </div>
                        <div>
                          <span className="text-text-secondary dark:text-gray-400">Company Structure</span>
                          <p className="font-semibold text-neutral-text dark:text-white">
                            {detailData.application.company_type}
                          </p>
                        </div>
                        <div>
                          <span className="text-text-secondary dark:text-gray-400">Employees & Turnover</span>
                          <p className="font-semibold text-neutral-text dark:text-white">
                            {detailData.application.employee_range} employees ({detailData.application.turnover_range || "Turnover undisclosed"})
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Legal & Tax Identifiers */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary dark:text-gray-400 mb-3 flex items-center gap-1.5">
                        <Landmark className="w-4 h-4 text-primary" /> Legal & Regulatory Identifiers
                      </h3>
                      <div className="grid grid-cols-2 gap-3 bg-white dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                        <div>
                          <span className="text-text-secondary dark:text-gray-400">GSTIN</span>
                          <p className="font-mono font-semibold text-neutral-text dark:text-white">
                            {detailData.application.gstin || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <span className="text-text-secondary dark:text-gray-400">Company PAN</span>
                          <p className="font-mono font-semibold text-neutral-text dark:text-white">
                            {detailData.application.pan || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <span className="text-text-secondary dark:text-gray-400">MCA CIN / Registration #</span>
                          <p className="font-mono font-semibold text-neutral-text dark:text-white">
                            {detailData.application.registration_number || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <span className="text-text-secondary dark:text-gray-400">LinkedIn Profile</span>
                          <p className="font-semibold text-neutral-text dark:text-white truncate">
                            {detailData.application.linkedin_url ? (
                              <a href={detailData.application.linkedin_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                                View LinkedIn
                              </a>
                            ) : (
                              "Not provided"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Primary Contact Person */}
                    {detailData.contacts && detailData.contacts.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary dark:text-gray-400 mb-3 flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-primary" /> Key Contact Representatives
                        </h3>
                        <div className="space-y-2">
                          {detailData.contacts.map((c) => (
                            <div key={c.id} className="p-3 rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/40 flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-neutral-text dark:text-white flex items-center gap-2">
                                  {c.full_name}
                                  {c.is_primary ? (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary font-bold">PRIMARY</span>
                                  ) : null}
                                </div>
                                <div className="text-text-secondary dark:text-gray-400 text-[11px] mt-0.5">
                                  {c.designation} • {c.contact_email} • {c.contact_phone}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section 4: Uploaded Verification Documents */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary dark:text-gray-400 mb-3 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-primary" /> Verification Documents ({detailData.documents.length})
                      </h3>
                      {detailData.documents.length === 0 ? (
                        <p className="p-4 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-center text-text-secondary">
                          No documents uploaded yet.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {detailData.documents.map((doc) => (
                            <div
                              key={doc.id}
                              className="p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/40 flex items-center justify-between"
                            >
                              <div>
                                <div className="font-semibold text-neutral-text dark:text-white text-xs">
                                  {doc.document_type.replace("_", " ")}
                                </div>
                                <div className="text-[11px] text-text-secondary dark:text-gray-400">
                                  {doc.file_name} • {formatBytes(doc.file_size_bytes)} • {formatDate(doc.uploaded_at)}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    doc.verification_status === "VERIFIED"
                                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                                      : doc.verification_status === "REJECTED"
                                      ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                                      : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                                  }`}
                                >
                                  {doc.verification_status}
                                </span>

                                {doc.verification_status !== "VERIFIED" && (
                                  <button
                                    onClick={() => handleVerifyDocument(doc.id, "VERIFIED")}
                                    className="p-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50"
                                    title="Mark Verified"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Section 5: Onboarding & Partner Account Status */}
                    {detailData.partner && (
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary dark:text-gray-400 mb-3 flex items-center gap-1.5">
                          <UserCheck className="w-4 h-4 text-emerald-500" /> Active Partner Account
                        </h3>
                        <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20 grid grid-cols-2 gap-3">
                          <div>
                            <span className="text-text-secondary dark:text-gray-400">Partner Code</span>
                            <p className="font-mono font-bold text-emerald-800 dark:text-emerald-300">
                              {detailData.partner.partner_code || "Generated"}
                            </p>
                          </div>
                          <div>
                            <span className="text-text-secondary dark:text-gray-400">Partner Tier</span>
                            <p className="font-bold text-emerald-800 dark:text-emerald-300">
                              {detailData.partner.partner_tier} ({detailData.partner.commission_rate_pct}% Rev Share)
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : null}
              </div>

              {/* Drawer Footer Actions */}
              {detailData && (
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {detailData.application.status === "PENDING_REVIEW" && (
                      <>
                        <button
                          disabled={actionLoading}
                          onClick={() => handleApprove(detailData.application.id)}
                          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
                        >
                          <Check className="w-4 h-4" /> Approve Partner
                        </button>

                        <button
                          disabled={actionLoading}
                          onClick={() => setRejectionModalOpen(true)}
                          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
                        >
                          <X className="w-4 h-4" /> Reject
                        </button>
                      </>
                    )}

                    {detailData.application.status === "APPROVED" && !detailData.partner && (
                      <button
                        disabled={actionLoading}
                        onClick={() => handleActivate(detailData.application.id)}
                        className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
                      >
                        <UserCheck className="w-4 h-4" /> Activate as Full Partner
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedAppId(null);
                      setDetailData(null);
                    }}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-secondary text-xs font-semibold"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Rejection Reason Modal ───────────────────────────────────────────── */}
      <AnimatePresence>
        {rejectionModalOpen && (
          <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 space-y-4"
            >
              <div className="flex items-center gap-3 text-red-600">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-lg font-bold font-sans text-neutral-text dark:text-white">
                  Reject Application
                </h3>
              </div>

              <p className="text-xs text-text-secondary dark:text-gray-400">
                Provide a reason for rejection. This reason will be logged and included in the notification email sent to the applicant.
              </p>

              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Missing valid GST registration or entity does not meet minimum eligibility criteria."
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs text-neutral-text dark:text-white outline-none focus:ring-2 focus:ring-red-400"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setRejectionModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-semibold text-text-secondary"
                >
                  Cancel
                </button>
                <button
                  disabled={actionLoading}
                  onClick={handleRejectConfirm}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  Confirm Rejection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
