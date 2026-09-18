import React, { useState } from "react";
import { authApi } from "../api/authApi";
import { TOKEN_STORAGE_KEY } from "../../../api/client";
import type { LoginRequest, LoginResponse } from "../types/auth.types";
import { AxiosError } from "axios";
import { ActiveSessionCard } from "../components/ActiveSessionCard";
import { LoginForm } from "../components/LoginForm";

interface LoginPageProps {
  onSuccess?: (session: LoginResponse) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [session, setSession] = useState<LoginResponse | null>(() => {
    try {
      const stored = sessionStorage.getItem(TOKEN_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const handleLogin = async (credentials: LoginRequest) => {
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const data = await authApi.login(credentials);
      sessionStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(data));
      setSession(data);
      onSuccess?.(data);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string } | string>;
      if (axiosError.response?.status === 401) {
        setErrorMsg("Usuario o contraseña incorrectos");
      } else if (axiosError.code === "ERR_NETWORK") {
        setErrorMsg("No se pudo conectar con el servidor");
      } else {
        setErrorMsg("Error al iniciar sesión");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    setSession(null);
  };

  return (
    <div
      style={{
        maxWidth: "320px",
        width: "100%",
        margin: "0 auto",
        textAlign: "left",
      }}
    >
      {session ? (
        <ActiveSessionCard session={session} onLogout={handleLogout} />
      ) : (
        <LoginForm
          onSubmit={handleLogin}
          isSubmitting={isSubmitting}
          errorMsg={errorMsg}
        />
      )}
    </div>
  );
};
