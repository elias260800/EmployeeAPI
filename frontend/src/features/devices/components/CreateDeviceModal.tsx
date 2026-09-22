import React, { useState } from "react";
import type { CreateDeviceRequest } from "../types/device.types";

interface CreateDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDeviceRequest) => Promise<void>;
}

export const CreateDeviceModal: React.FC<CreateDeviceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [timezone, setTimezone] = useState("America/Santiago");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !location.trim() || !timezone.trim()) {
      setErrorMsg("Todos los campos son obligatorios.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await onSubmit({
        name: name.trim(),
        location: location.trim(),
        timezone: timezone.trim(),
      });
      setName("");
      setLocation("");
      setTimezone("America/Santiago");
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al registrar el dispositivo";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "16px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          backgroundColor: "var(--code-bg)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "24px",
          boxShadow: "var(--shadow)",
          textAlign: "left",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
            borderBottom: "1px solid var(--border)",
            paddingBottom: "10px",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "18px",
              color: "var(--text-h)",
              fontWeight: 600,
            }}
          >
            Registrar Dispositivo / Terminal
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Cerrar modal"
            style={{
              background: "transparent",
              border: "none",
              fontSize: "18px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              color: "var(--text)",
              padding: "4px 8px",
            }}
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: "10px 12px",
              backgroundColor: "var(--error-bg)",
              border: "1px solid var(--error-border)",
              borderRadius: "6px",
              color: "var(--error-text)",
              marginBottom: "16px",
              fontSize: "13px",
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                marginBottom: "4px",
                color: "var(--text)",
                fontWeight: 500,
              }}
            >
              Nombre del Dispositivo / Terminal *
            </label>
            <input
              type="text"
              required
              minLength={2}
              maxLength={100}
              placeholder="Ej: Terminal Reloj Biométrico Principal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "8px 10px",
                fontSize: "13px",
                borderRadius: "4px",
                border: "1px solid var(--border)",
                background: "var(--bg)",
                color: "var(--text-h)",
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
                color: "var(--text)",
                fontWeight: 500,
              }}
            >
              Ubicación *
            </label>
            <input
              type="text"
              required
              maxLength={150}
              placeholder="Ej: Santiago Centro, Piso 1"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "8px 10px",
                fontSize: "13px",
                borderRadius: "4px",
                border: "1px solid var(--border)",
                background: "var(--bg)",
                color: "var(--text-h)",
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
                color: "var(--text)",
                fontWeight: 500,
              }}
            >
              Zona Horaria IANA *
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "8px 10px",
                fontSize: "13px",
                borderRadius: "4px",
                border: "1px solid var(--border)",
                background: "var(--bg)",
                color: "var(--text-h)",
                boxSizing: "border-box",
              }}
            >
              <option value="America/Santiago">America/Santiago (Chile)</option>
              <option value="America/Argentina/Buenos_Aires">America/Argentina/Buenos_Aires</option>
              <option value="America/Lima">America/Lima (Perú)</option>
              <option value="America/Bogota">America/Bogota (Colombia)</option>
              <option value="America/Mexico_City">America/Mexico_City (México)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
              marginTop: "8px",
              paddingTop: "12px",
              borderTop: "1px solid var(--border)",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: "8px 14px",
                borderRadius: "4px",
                background: "var(--bg)",
                border: "1px solid var(--border)",
                color: "var(--text-h)",
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "8px 16px",
                borderRadius: "4px",
                background: "var(--accent)",
                border: "none",
                color: "#fff",
                fontWeight: 600,
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              {isSubmitting ? "Guardando..." : "Guardar Dispositivo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
