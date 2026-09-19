import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { authApi } from "../api/authApi";
import type {
  AuthContextType,
  LoginRequest,
  UserSession,
} from "../types/auth.types";
import { TOKEN_STORAGE_KEY } from "../../../api/client";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isTokenExpired = (expiresAtUtc?: string): boolean => {
    if (!expiresAtUtc) return false;
    const expiresDate = new Date(expiresAtUtc);
    return isNaN(expiresDate.getTime()) || expiresDate.getTime() <= Date.now();
  };

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    setSession(null);
  }, []);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(TOKEN_STORAGE_KEY);
      if (stored) {
        const parsedSession: UserSession = JSON.parse(stored);
        const expDate = parsedSession?.expiresAtUtc;
        if (parsedSession?.token && !isTokenExpired(expDate)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setSession(parsedSession);
        } else {
          logout();
        }
      }
    } catch {
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    const handleUnauthorized = () => {
      setSession(null);
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    const data = await authApi.login(credentials);
    const newSession: UserSession = {
      username: data.username,
      token: data.token,
      expiresAtUtc: data.expiresAtUtc,
    };

    sessionStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(newSession));
    setSession(newSession);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthenticated: !!session,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth outside of AuthProvider");
  }
  return context;
};
