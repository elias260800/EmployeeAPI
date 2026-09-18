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
