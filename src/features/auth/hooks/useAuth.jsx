import { createContext, useContext, useEffect, useState } from "react";
import API from "../../../lib/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const fetchUser = async () => {
  try {
    const token = localStorage.getItem("token");

    // 🚫 don't call backend if no token
    if (!token) {
      setLoading(false);
      return;
    }

    const res = await API.get("/auth/me");
    setUser(res.data.data);
  } catch {
    logout();
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);