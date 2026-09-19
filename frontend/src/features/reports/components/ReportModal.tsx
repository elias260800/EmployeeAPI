import React from "react";
import { ReportUIStatus, type ReportJob } from "../types/report.types";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: ReportUIStatus;
  report: ReportJob | null;
  errorMsg: string | null;
  attempts: number;
  onRetry: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  status,
  report,
  errorMsg,
  attempts,
  onRetry,
}) => {
  if (!isOpen) return null;

  const isProcessing =
    status === ReportUIStatus.Generating || status === ReportUIStatus.Polling;

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
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          backgroundColor: "var(--code-bg)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "24px",
          boxShadow: "var(--shadow)",
          textAlign: "left",
          position: "relative",
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
            Reporte Ejecutivo
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            style={{
              background: "transparent",
              border: "none",
              fontSize: "18px",
              cursor: "pointer",
              color: "var(--text)",
              padding: "4px 8px",
            }}
          >
            ✕
          </button>
        </div>

        {isProcessing && (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                margin: "0 auto 16px",
                border: "3px solid var(--border)",
                borderTopColor: "var(--accent)",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <style>
              {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
            </style>
            <p
              style={{
                fontWeight: 600,
                color: "var(--text-h)",
                marginBottom: "6px",
              }}
            >
              {status === ReportUIStatus.Generating
                ? "Iniciando generación del reporte..."
                : "Procesando datos en el servidor..."}
            </p>
            <p style={{ fontSize: "13px", color: "var(--text)", margin: 0 }}>
              Intento {attempts} • Consultando cada 2s
            </p>
          </div>
        )}

        {status === ReportUIStatus.Completed && report && (
          <div>
            <div
              style={{
                padding: "10px 14px",
                backgroundColor: "var(--success-bg)",
                border: "1px solid var(--success-border)",
                borderRadius: "6px",
                color: "var(--success-text)",
                marginBottom: "16px",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              ✓ Reporte generado exitosamente
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "var(--text-h)",
                  }}
                >
                  {report.result?.totalEmployees ?? 0}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text)" }}>
                  Total Empleados
                </div>
              </div>

              <div
                style={{
                  padding: "12px",
                  backgroundColor: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "var(--text-h)",
                  }}
                >
                  {report.result?.departments ?? 0}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text)" }}>
                  Departamentos
                </div>
              </div>
            </div>

            {report.completedAt && (
              <p
                style={{
                  fontSize: "11px",
                  color: "var(--text)",
                  margin: "0 0 16px 0",
                  textAlign: "center",
                }}
              >
                Completado a las:{" "}
                {new Date(report.completedAt).toLocaleTimeString()}
              </p>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "var(--bg)",
                  border: "1px solid var(--border)",
                  color: "var(--text-h)",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {(status === ReportUIStatus.Error ||
          status === ReportUIStatus.Timeout) && (
          <div>
            <div
              style={{
                padding: "12px",
                backgroundColor: "var(--error-bg)",
                border: "1px solid var(--error-border)",
                borderRadius: "6px",
                color: "var(--error-text)",
                marginBottom: "16px",
                fontSize: "13px",
              }}
            >
              <p style={{ margin: "0 0 4px 0", fontWeight: 600 }}>
                {status === ReportUIStatus.Timeout
                  ? "Tiempo de espera agotado"
                  : "Ocurrió un error"}
              </p>
              <p style={{ margin: 0 }}>
                {errorMsg || "No se pudo obtener el reporte."}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "var(--bg)",
                  border: "1px solid var(--border)",
                  color: "var(--text-h)",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={onRetry}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "var(--code-bg)",
                  border: "1px solid var(--accent)",
                  color: "var(--text-h)",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Reintentar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
