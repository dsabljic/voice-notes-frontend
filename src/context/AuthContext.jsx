import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { getProfile } from "../api/auth";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userData = await getProfile();
      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        subscription: userData.subscription,
      });
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (token, userData) => {
    localStorage.setItem("token", token);
    await fetchUserProfile(); // Fetch complete profile after login
    navigate("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/auth");
  };

  const value = {
    user,
    login,
    logout,
    loading,
    refreshProfile: fetchUserProfile,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      <Outlet />
    </AuthContext.Provider>
  );
}
