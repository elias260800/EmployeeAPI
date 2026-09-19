import React from "react";
import type { LoginResponse } from "../types/auth.types";

interface ActiveSessionCardProps {
  session: LoginResponse;
  onLogout: () => void;
}

export const ActiveSessionCard: React.FC<ActiveSessionCardProps> = ({
  session,
  onLogout,
}) => {
  return (
    <div
      style={{
        padding: "14px",
        background: "var(--success-bg)",
        border: "1px solid var(--success-border)",
        borderRadius: "8px",
        color: "var(--success-text)",
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
        onClick={onLogout}
        style={{
          padding: "6px 12px",
          cursor: "pointer",
          borderRadius: "4px",
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
};
