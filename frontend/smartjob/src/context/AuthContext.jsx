import { createContext, useContext, useEffect, useState } from "react";
import {
  login as loginAPI,
  getProfile,
} from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user when app starts
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const token = localStorage.getItem("access");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await getProfile();
      setUser(res.data);
    } catch (error) {
      console.error(error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (username, password) => {
    try {
      const res = await loginAPI({
        username,
        password,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      const profile = await getProfile();
      setUser(profile.data);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data || "Login Failed",
      };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);