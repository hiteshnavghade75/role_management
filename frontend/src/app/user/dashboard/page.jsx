"use client";

import { useAuth } from "@/app/context/AuthContext";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function UserDashboardPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>

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

                .text-white-50 {
                    color: rgba(255, 255, 255, 0.5) !important;
                }

                .text-white-70 {
                    color: rgba(255, 255, 255, 0.7) !important;
                }

                .welcome-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .user-avatar-large {
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 32px;
                    color: #fff;
                    flex-shrink: 0;
                }

                .info-label {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    font-weight: 600;
                    margin-bottom: 8px;
                }

                .info-value {
                    color: #fff;
                    font-size: 18px;
                    font-weight: 500;
                }

                .badge {
                    padding: 8px 16px;
                    font-weight: 500;
                    font-size: 13px;
                }

                .badge.bg-success {
                    background: rgba(34, 197, 94, 0.15) !important;
                    color: #86efac;
                    border: 1px solid rgba(34, 197, 94, 0.3);
                }

                .feature-card {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                .feature-card:hover {
                    background: rgba(255, 255, 255, 0.04);
                    border-color: rgba(255, 255, 255, 0.15);
                    transform: translateY(-4px);
                    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
                }

                .feature-icon {
                    width: 48px;
                    height: 48px;
                    background: rgba(99, 102, 241, 0.15);
                    border: 1px solid rgba(99, 102, 241, 0.3);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    margin-bottom: 16px;
                }

                @media (max-width: 767px) {
                    .user-avatar-large {
                        width: 64px;
                        height: 64px;
                        font-size: 24px;
                        border-radius: 16px;
                    }

                    .info-value {
                        font-size: 16px;
                    }
                }
            `}</style>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <nav className="nav-header py-3 mb-4">
            <div className="container-fluid px-4">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                  <div className="logo-box rounded-3">
                    👤
                  </div>
                  <div>
                    <h5 className="mb-0 fw-semibold">User Dashboard</h5>
                    <small className="text-white-50">Welcome back</small>
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
            <div className="row mb-4">
              <div className="col-12">
                <div className="welcome-card rounded-4 p-4 p-md-5">
                  <div className="row align-items-center g-4">
                    <div className="col-auto">
                      <div className="user-avatar-large">
                        {user?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                    </div>
                    <div className="col">
                      <h2 className="mb-2 fw-semibold">Welcome back, {user?.name.split(' ')[0]}! 👋</h2>
                      <p className="text-white-50 mb-0">
                        Here's what's happening with your account today
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <div className="glass-card rounded-4 p-4">
                  <div className="info-label">Email Address</div>
                  <div className="info-value" style={{ fontFamily: 'ui-monospace, monospace' }}>
                    {user?.email}
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="glass-card rounded-4 p-4">
                  <div className="info-label">Role</div>
                  <div className="info-value">
                    Standard User
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="glass-card rounded-4 p-4">
                  <div className="info-label">Account Status</div>
                  <div>
                    <span className="badge bg-success rounded-pill">
                      ● {user?.status.charAt(0).toUpperCase() + user?.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-12">
                <h5 className="mb-3 fw-semibold">Quick Actions</h5>
              </div>
              <div className="col-md-4 mb-3">
                <div className="feature-card rounded-4 p-4">
                  <div className="feature-icon">
                    📊
                  </div>
                  <h6 className="fw-semibold mb-2">View Reports</h6>
                  <p className="text-white-50 mb-0 small">
                    Access your analytics and reports
                  </p>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="feature-card rounded-4 p-4">
                  <div className="feature-icon">
                    ⚙️
                  </div>
                  <h6 className="fw-semibold mb-2">Settings</h6>
                  <p className="text-white-50 mb-0 small">
                    Manage your account preferences
                  </p>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="feature-card rounded-4 p-4">
                  <div className="feature-icon">
                    💬
                  </div>
                  <h6 className="fw-semibold mb-2">Support</h6>
                  <p className="text-white-50 mb-0 small">
                    Get help from our support team
                  </p>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <div className="glass-card rounded-4 p-4">
                  <h5 className="mb-4 fw-semibold">Recent Activity</h5>
                  <div className="text-center py-5">
                    <div className="text-white-50">
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                      <p className="mb-0">No recent activity to show</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </ProtectedRoute>

  );
}