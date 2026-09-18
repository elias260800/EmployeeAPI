import React, { useState } from "react";
import type { LoginRequest } from "../types/auth.types";

interface LoginFormProps {
  onSubmit: (credentials: LoginRequest) => void;
  isSubmitting: boolean;
  errorMsg: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isSubmitting,
  errorMsg,
}) => {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ username, password });
  };

  return (
    <>
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
            style={{
              display: "block",
              fontSize: "12px",
              marginBottom: "4px",
            }}
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
            style={{
              display: "block",
              fontSize: "12px",
              marginBottom: "4px",
            }}
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
    </>
  );
};
