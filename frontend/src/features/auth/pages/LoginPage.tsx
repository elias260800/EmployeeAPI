import React, { useState } from "react";
import { authApi } from "../api/authApi";
import { TOKEN_STORAGE_KEY } from "../../../api/client";
import type { LoginResponse } from "../types/auth.types";
import { AxiosError } from "axios";

interface LoginPageProps {
  onSuccess?: (session: LoginResponse) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const data = await authApi.login({ username, password });
      sessionStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(data));
      setSession(data);
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string } | string>;
      if (axiosError.response?.status === 401) {
        setErrorMsg("Usuario o contraseña incorrectos.");
      } else if (axiosError.code === "ERR_NETWORK") {
        setErrorMsg("No se pudo conectar con el servidor.");
      } else {
        setErrorMsg("Error al iniciar sesión.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    setSession(null);
  };

  if (session) {
    return (
      <div
        style={{
          maxWidth: "320px",
          width: "100%",
          margin: "0 auto",
          textAlign: "left",
        }}
      >
        <div
          style={{
            padding: "14px",
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "8px",
            color: "#166534",
          }}
        >
          <p style={{ margin: "0 0 6px 0", fontWeight: "bold" }}>
            Sesión iniciada: {session.username}
          </p>
          <p
            style={{
              margin: "0 0 10px 0",
              fontSize: "11px",
              wordBreak: "break-all",
            }}
          >
            <strong>Token:</strong> {session.token.slice(0, 25)}...
          </p>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              padding: "6px 12px",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "320px",
        width: "100%",
        margin: "0 auto",
        textAlign: "left",
      }}
    >
      {errorMsg && (
        <div
          style={{
            marginBottom: "12px",
            color: "#b91c1c",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            padding: "8px",
            borderRadius: "6px",
            fontSize: "13px",
          }}
        >
          {errorMsg}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <div>
          <label
            style={{ display: "block", fontSize: "12px", marginBottom: "4px" }}
          >
            Usuario:
          </label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "6px 8px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label
            style={{ display: "block", fontSize: "12px", marginBottom: "4px" }}
          >
            Contraseña:
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "6px 8px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: "8px 16px",
            marginTop: "6px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          {isSubmitting ? "Iniciando sesión..." : "Entrar al sistema"}
        </button>
      </form>
    </div>
  );
};
