import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import { Toaster } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Outlet />
      <Toaster position="top-center" />
    </div>
  );
}
