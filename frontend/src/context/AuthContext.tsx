import { createContext, useContext, useEffect, useState } from "react";
import type { AuthUser, Role } from "../types";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  role: Role | null;
  login: (token: string, role: Role, username: string) => void;
  logout: () => void;
  loading: boolean;
}

const API = import.meta.env.VITE_BACKEND_API_URL;

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );
  const [role, setRole] = useState<Role | null>(
    () => localStorage.getItem("role") as Role | null
  );
  const [user, setUser] = useState<AuthUser | null>(() => {
    const userJson = localStorage.getItem("user");
    return userJson ? JSON.parse(userJson) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 401) logout();
          setLoading(false);
          return;
        }

        const data = await res.json();
        if (data?.id && (!user || user.id !== data.id)) {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        }
      } catch (error) {
        console.error("Auto-login failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = (t: string, r: Role, u: string) => {
    const newUser: AuthUser = {
      role: r,
      username: u,
      id: 0,
      token: t,
    };
    setToken(t);
    setRole(r);
    setUser(newUser);
    localStorage.setItem("token", t);
    localStorage.setItem("role", r);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, token, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
