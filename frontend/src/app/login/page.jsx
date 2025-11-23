"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const router = useRouter();
  const { apiBase, loginWithOtpResponse } = useAuth();

  const validateEmail = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) return "Please enter a valid email address";
    return "";
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
  };

  const handleSendOtp = async () => {
    const errorMsg = validateEmail(email);
    if (errorMsg) {
      setEmailError(errorMsg);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${apiBase}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setMessage("OTP sent to your email (or check server console).");
      setStep("otp");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${apiBase}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to verify OTP");
      }

      loginWithOtpResponse(data);

      if (data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/user/dashboard");
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isSendDisabled = loading;

  return (
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

        .logo-box {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .text-white-50 {
          color: rgba(255, 255, 255, 0.5) !important;
        }

        .text-white-70 {
          color: rgba(255, 255, 255, 0.7) !important;
        }

        .form-control {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .form-control:focus {
          background: rgba(255, 255, 255, 0.08);
          border-color: #6366f1;
          color: #fff;
          box-shadow: 0 0 0 0.25rem rgba(99, 102, 241, 0.1);
        }

        .form-control::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        .btn-light {
          background: #fff;
          color: #0f0f23;
          border: none;
        }

        .btn-light:hover:not(:disabled) {
          background: #fff;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
        }

        .btn-light:active:not(:disabled) {
          transform: translateY(0);
        }

        .btn-link {
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
        }

        .btn-link:hover {
          color: #fff;
          transform: translateX(-2px);
        }

        .email-badge {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
          font-family: ui-monospace, monospace;
          font-size: 14px;
        }

        .otp-input {
          text-align: center;
          font-size: 24px;
          letter-spacing: 12px;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
        }

        .alert-success {
          background: rgba(34, 197, 94, 0.1);
          border-color: rgba(34, 197, 94, 0.2);
          color: #86efac;
        }

        .alert-danger {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.2);
          color: #fca5a5;
        }

        .spinner-border-sm {
          width: 14px;
          height: 14px;
          border-width: 2px;
        }

        .dot {
          display: inline-block;
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
        }
      `}</style>

      <div className="container py-5">
        <div className="row justify-content-center" style={{ marginTop: "60px" }}>
          <div className="col-12 col-sm-10 col-md-8 col-lg-5">
            <div className="card glass-card rounded-4 border-0 overflow-hidden">
              <div className="card-body p-4 p-sm-5">
                <div className="logo-box rounded-3 mb-4">
                  {step === "email" ? "✉️" : "🔐"}
                </div>

                <h2
                  className="text-white fw-semibold mb-2"
                  style={{ letterSpacing: "-0.5px" }}
                >
                  {step === "email" ? "Sign in" : "Check your email"}
                </h2>

                <p className="text-white-50 mb-4">
                  {step === "email"
                    ? "We'll send you a code to sign in without a password"
                    : "We sent a 6-digit code. It expires in 10 minutes"}
                </p>

                {step === "email" ? (
                  <>
                    <div className="mb-3">
                      <label
                        className="form-label text-white-70 text-uppercase fw-medium small"
                        style={{ letterSpacing: "0.5px" }}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        className={`form-control form-control-lg rounded-3 ${
                          emailError ? "is-invalid" : ""
                        }`}
                        placeholder="sam@company.com"
                        value={email}
                        onChange={handleEmailChange}
                        onKeyDown={(e) =>
                          e.key === "Enter" && !isSendDisabled && handleSendOtp()
                        }
                      />
                      {emailError && (
                        <div className="invalid-feedback d-block">
                          {emailError}
                        </div>
                      )}
                    </div>

                    <button
                      className="btn btn-light btn-lg w-100 rounded-3 fw-semibold"
                      disabled={isSendDisabled}
                      onClick={handleSendOtp}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Sending code...
                        </>
                      ) : (
                        "Continue with email"
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-link p-0 mb-4 text-start fw-medium"
                      onClick={() => {
                        setStep("email");
                        setOtp("");
                        setMessage("");
                      }}
                    >
                      ← Back
                    </button>

                    <div className="d-inline-flex align-items-center gap-2 email-badge rounded-2 px-3 py-2 mb-4">
                      <span className="dot"></span>
                      {email}
                    </div>

                    <div className="mb-4">
                      <label
                        className="form-label text-white-70 text-uppercase fw-medium small"
                        style={{ letterSpacing: "0.5px" }}
                      >
                        Verification code
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg rounded-3 otp-input"
                        placeholder="000000"
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, ""))
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          otp.length === 6 &&
                          handleVerifyOtp()
                        }
                        maxLength={6}
                      />
                    </div>

                    <button
                      className="btn btn-light btn-lg w-100 rounded-3 fw-semibold"
                      disabled={loading || otp.length !== 6}
                      onClick={handleVerifyOtp}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Verifying...
                        </>
                      ) : (
                        "Verify and continue"
                      )}
                    </button>
                  </>
                )}

                {message && (
                  <div
                    className={`alert ${
                      message.includes("sent")
                        ? "alert-success"
                        : "alert-danger"
                    } rounded-3 mt-3 mb-0`}
                    role="alert"
                  >
                    {message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
