"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (requireAdmin && user.role !== "admin") {
      router.replace("/user/dashboard");
      return;
    }
  }, [user, loading, requireAdmin, router]);

  if (loading || !user) {
    return <p style={{ padding: 24 }}>Checking authentication...</p>;
  }

  if (requireAdmin && user.role !== "admin") {
    return <p style={{ padding: 24 }}>Redirecting...</p>;
  }

  return children;
}
