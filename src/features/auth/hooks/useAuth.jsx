import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import API from "../../../lib/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  const fetchUser = useCallback(async () => {
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
}, [logout]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
