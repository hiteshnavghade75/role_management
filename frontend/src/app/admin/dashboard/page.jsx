"use client";

import { useEffect, useRef, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboardPage() {
    const { apiBase, token, logout } = useAuth();
    const errorRef = useRef(null);

    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [error, setError] = useState("");

    const [newEmail, setNewEmail] = useState("");
    const [newName, setNewName] = useState("");
    const [newRole, setNewRole] = useState("user");
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        if (error && errorRef.current) {
            errorRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [error]);

    const isValidEmail = (email) => {
        const trimmed = email.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(trimmed);
    };

    const fetchUsers = async () => {
        if (!apiBase || !token) return;

        setLoadingUsers(true);
        setError("");

        try {
            const res = await fetch(`${apiBase}/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to load users");
            }

            setUsers(data.users || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingUsers(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiBase, token]);

    const handleAddUser = async () => {
        setError("");

        if (!newName.trim() || !newEmail.trim()) {
            setError("Name and email are required.");
            return;
        }

        if (!isValidEmail(newEmail)) {
            setError("Please enter a valid email address.");
            return;
        }

        try {
            const res = await fetch(`${apiBase}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    email: newEmail,
                    name: newName,
                    role: newRole,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to add user");
            }

            setNewEmail("");
            setNewName("");
            setNewRole("user");
            setShowAddForm(false);
            fetchUsers();
        } catch (err) {
            setError(err.message || "Something went wrong while adding user");
        }
    };

    const handleToggleStatus = async (userId, currentStatus, userRole) => {
        setError("");

        if (userRole === "admin") {
            setError("Cannot change status of admin users.");
            return;
        }

        try {
            const res = await fetch(`${apiBase}/users/${userId}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    status: currentStatus === "active" ? "inactive" : "active",
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to update status");
            }

            fetchUsers();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <ProtectedRoute requireAdmin={true}>
            <>
                <link
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
                    rel="stylesheet"
                />

                <style>{`
          body {
            background: #0f0f23;
            min-height: 100vh;
            position: relative;
            overflow-x: hidden;
            color: #fff;
          }
          body::before {
            content: '';
            position: fixed;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle at 30% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 70% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%);
            animation: drift 20s ease-in-out infinite;
            pointer-events: none;
          }
          @keyframes drift {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(-30px, 30px) rotate(5deg); }
          }
          .glass-card {
            background: rgba(255, 255, 255, 0.02);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          }
          .nav-header {
            background: rgba(255, 255, 255, 0.02);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }
          .logo-box {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .form-control, .form-select {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #fff;
          }
          .form-control:focus, .form-select:focus {
            background: rgba(255, 255, 255, 0.08);
            border-color: #6366f1;
            color: #fff;
            box-shadow: 0 0 0 0.25rem rgba(99, 102, 241, 0.1);
          }
          .form-control::placeholder {
            color: rgba(255, 255, 255, 0.3);
          }
          .form-select option {
            background: #1a1a2e;
            color: #fff;
          }
          .btn-light {
            background: #fff;
            color: #0f0f23;
            border: none;
          }
          .btn-light:hover {
            background: #fff;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
          }
          .btn-outline-light {
            color: rgba(255, 255, 255, 0.7);
            border-color: rgba(255, 255, 255, 0.2);
          }
          .btn-outline-light:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.3);
            color: #fff;
          }
          .table {
            color: rgba(255, 255, 255, 0.9);
          }
          .table thead th {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.7);
            text-transform: uppercase;
            font-size: 12px;
            letter-spacing: 0.5px;
            font-weight: 600;
            padding: 16px;
          }
          .table tbody td {
            border-color: rgba(255, 255, 255, 0.05);
            padding: 16px;
            vertical-align: middle;
          }
          .table tbody tr {
            transition: background 0.2s;
          }
          .table tbody tr:hover {
            background: rgba(255, 255, 255, 0.02);
          }
          .badge {
            padding: 6px 12px;
            font-weight: 500;
            font-size: 12px;
          }
          .badge.bg-success {
            background: rgba(34, 197, 94, 0.15) !important;
            color: #86efac;
            border: 1px solid rgba(34, 197, 94, 0.3);
          }
          .badge.bg-secondary {
            background: rgba(156, 163, 175, 0.15) !important;
            color: #d1d5db;
            border: 1px solid rgba(156, 163, 175, 0.3);
          }
          .badge.bg-primary {
            background: rgba(99, 102, 241, 0.15) !important;
            color: #a5b4fc;
            border: 1px solid rgba(99, 102, 241, 0.3);
          }
          .badge.bg-warning {
            background: rgba(251, 146, 60, 0.15) !important;
            color: #fdba74;
            border: 1px solid rgba(251, 146, 60, 0.3);
          }
          .btn-sm {
            font-size: 13px;
            padding: 6px 16px;
          }
          .alert {
            background: rgba(239, 68, 68, 0.1);
            border-color: rgba(239, 68, 68, 0.2);
            color: #fca5a5;
          }
          .text-white-50 {
            color: rgba(255, 255, 255, 0.5) !important;
          }
          .text-white-70 {
            color: rgba(255, 255, 255, 0.7) !important;
          }
          .stat-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .stat-number {
            font-size: 32px;
            font-weight: 600;
            background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        `}</style>

                <div style={{ position: "relative", zIndex: 1 }}>
                    <nav className="nav-header py-3 mb-4">
                        <div className="container-fluid px-4">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="logo-box rounded-3">🔐</div>
                                    <div>
                                        <h5 className="mb-0 fw-semibold">Admin Panel</h5>
                                        <small className="text-white-50">User Management</small>
                                    </div>
                                </div>
                                <button
                                    className="btn btn-outline-light btn-sm rounded-3"
                                    onClick={logout}
                                >
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </nav>

                    <div className="container-fluid px-4">
                        <div className="row g-3 mb-4">
                            <div className="col-md-4">
                                <div className="stat-card rounded-3 p-4">
                                    <div
                                        className="text-white-70 small text-uppercase mb-2"
                                        style={{ letterSpacing: "0.5px" }}
                                    >
                                        Total Users
                                    </div>
                                    <div className="stat-number">{users.length}</div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="stat-card rounded-3 p-4">
                                    <div
                                        className="text-white-70 small text-uppercase mb-2"
                                        style={{ letterSpacing: "0.5px" }}
                                    >
                                        Active Users
                                    </div>
                                    <div className="stat-number">
                                        {users.filter((u) => u.status === "active").length}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="stat-card rounded-3 p-4">
                                    <div
                                        className="text-white-70 small text-uppercase mb-2"
                                        style={{ letterSpacing: "0.5px" }}
                                    >
                                        Admins
                                    </div>
                                    <div className="stat-number">
                                        {users.filter((u) => u.role === "admin").length}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12">
                                <div className="glass-card rounded-4 p-4 mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <div>
                                            <h4 className="mb-1 fw-semibold">Users</h4>
                                            <p className="text-white-50 mb-0 small">
                                                Manage user accounts and permissions
                                            </p>
                                        </div>
                                        <button
                                            className="btn btn-light rounded-3 fw-semibold"
                                            onClick={() => setShowAddForm(!showAddForm)}
                                        >
                                            {showAddForm ? "✕ Cancel" : "+ Add User"}
                                        </button>
                                    </div>

                                    {showAddForm && (
                                        <div className="glass-card rounded-3 p-4 mb-4">
                                            <h6 className="mb-3 fw-semibold">Create New User</h6>
                                            <div className="row g-3">
                                                <div className="col-md-4">
                                                    <input
                                                        type="email"
                                                        className="form-control rounded-3"
                                                        placeholder="Email address"
                                                        value={newEmail}
                                                        onChange={(e) => {
                                                            setNewEmail(e.target.value);
                                                            if (error) setError("");
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <input
                                                        type="text"
                                                        className="form-control rounded-3"
                                                        placeholder="Full name"
                                                        value={newName}
                                                        onChange={(e) => {
                                                            const cleaned = e.target.value.replace(/[0-9]/g, "");
                                                            setNewName(cleaned);
                                                            if (error) setError("");
                                                        }}

                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <select
                                                        className="form-select rounded-3"
                                                        value={newRole}
                                                        onChange={(e) => setNewRole(e.target.value)}
                                                    >
                                                        <option value="user">User</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-2">
                                                    <button
                                                        className="btn btn-light w-100 rounded-3 fw-semibold"
                                                        onClick={handleAddUser}
                                                    >
                                                        Create
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {error && (
                                        <div ref={errorRef} className="alert rounded-3 mb-4 d-flex justify-content-between align-items-center" role="alert">
                                            <span>{error}</span>

                                            <button
                                                type="button"
                                                onClick={() => setError("")}
                                                style={{
                                                    background: "transparent",
                                                    border: "none",
                                                    color: "#fca5a5",
                                                    fontSize: "18px",
                                                    cursor: "pointer",
                                                    lineHeight: "1",
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}

                                    {loadingUsers ? (
                                        <div className="text-center py-5">
                                            <div className="spinner-border text-light" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            <p className="text-white-50 mt-3 mb-0">
                                                Loading users...
                                            </p>
                                        </div>
                                    ) : (

                                        <>
                                            {/* Header Row - Hidden on mobile */}
                                            <div className="user-list-header d-none d-md-block mb-2">
                                                <div className="row align-items-center g-3 px-3">
                                                    <div className="col-md-1">
                                                        <small className="text-white-50 text-uppercase fw-semibold" style={{ fontSize: '11px', letterSpacing: '0.8px' }}>Sr. No</small>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <small className="text-white-50 text-uppercase fw-semibold" style={{ fontSize: '11px', letterSpacing: '0.8px' }}>User Details</small>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <small className="text-white-50 text-uppercase fw-semibold" style={{ fontSize: '11px', letterSpacing: '0.8px' }}>Role</small>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <small className="text-white-50 text-uppercase fw-semibold" style={{ fontSize: '11px', letterSpacing: '0.8px' }}>Status</small>
                                                    </div>
                                                    <div className="col-md-3 text-end">
                                                        <small className="text-white-50 text-uppercase fw-semibold" style={{ fontSize: '11px', letterSpacing: '0.8px' }}>Actions</small>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="user-list">
                                                {users.map((u, index) => (
                                                    <div key={u._id || u.id} className="user-row glass-card rounded-3 mb-3 p-3">
                                                        <div className="row align-items-center g-3">
                                                            <div className="col-auto col-md-1 d-none d-md-block">
                                                                <div className="serial-number">
                                                                    {String(index + 1).padStart(2, '0')}
                                                                </div>
                                                            </div>

                                                            <div className="col-12 col-md-4">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="flex-grow-1">
                                                                        <div className="user-name">{u.name}</div>
                                                                        <div className="user-email">{u.email}</div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="col-6 col-md-2">
                                                                <div className="d-block d-md-none mb-1">
                                                                    <small className="text-white-50 text-uppercase" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>Role</small>
                                                                </div>
                                                                <span className={`badge ${u.role === 'admin' ? 'bg-primary' : 'bg-secondary'} rounded-pill`}>
                                                                    {u.role === 'admin' ? '👑 Admin' : '👤 User'}
                                                                </span>
                                                            </div>

                                                            <div className="col-6 col-md-2">
                                                                <div className="d-block d-md-none mb-1">
                                                                    <small className="text-white-50 text-uppercase" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>Status</small>
                                                                </div>
                                                                <span className={`badge ${u.status === 'active' ? 'bg-success' : 'bg-warning'} rounded-pill`}>
                                                                    {u.status === 'active' ? '● Active' : '● Inactive'}
                                                                </span>
                                                            </div>

                                                            <div className="col-12 col-md-3">
                                                                <div className="d-grid d-md-flex justify-content-md-end">
                                                                    <button
                                                                        className="btn btn-outline-light btn-sm rounded-3"
                                                                        onClick={() => handleToggleStatus(u._id || u.id, u.status, u.role)}
                                                                    >
                                                                        {u.status === "active" ? "Deactivate" : "Activate"}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </ProtectedRoute>
    );
}