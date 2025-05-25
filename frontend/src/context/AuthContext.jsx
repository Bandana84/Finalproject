// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing auth state on initial load
    const storedRole = localStorage.getItem("role");
    const accessToken = localStorage.getItem("accessToken");
    
    if (storedRole && accessToken) {
      setRole(storedRole);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userRole) => {
    setRole(userRole);
    setIsAuthenticated(true);
    localStorage.setItem("role", userRole);
  };

  const logout = () => {
    setRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem("role");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("rememberMe");
  };

  return (
    <AuthContext.Provider value={{ role, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);