import { createContext, useContext, useState, ReactNode } from "react";
import { User } from "../types/UserType";

interface AuthContextType {
  authToken: string | null;
  user: User | null;
  updateUser: (user: User) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  authToken: null,
  updateUser: () => {},
  user: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem("authToken");
  });
  const [user, setUser] = useState<User | null>(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });

  function login(user: User, token: string) {
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(user));
    setAuthToken(token);
    setUser(user);
  }

  function updateUser(user: User) {
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  }

  function logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setAuthToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, updateUser, authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
