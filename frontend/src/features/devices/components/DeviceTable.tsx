import React from "react";
import type { Device } from "../types/device.types";
import { useClientPagination } from "../../employees/hooks/useClientPagination";
import { PaginationControls } from "../../employees/components/PaginationControls";

interface DeviceTableProps {
  devices: Device[];
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
  onOpenCreate?: () => void;
  onSeedDemo?: () => void;
  onDelete?: (id: string, name: string) => void;
  isSeeding?: boolean;
}

export const DeviceTable: React.FC<DeviceTableProps> = ({
  devices,
  isLoading,
  error,
  onRetry,
  onOpenCreate,
  onSeedDemo,
  onDelete,
  isSeeding = false,
}) => {
  const {
    paginatedItems,
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    startItem,
    endItem,
    setPage,
    setPageSize,
  } = useClientPagination(devices);

  if (isLoading) {
    return (
      <div
        style={{
          padding: "36px 16px",
          textAlign: "center",
          color: "var(--text)",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            margin: "0 auto 12px",
            border: "3px solid var(--border)",
            borderTopColor: "var(--accent)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>
          {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
        </style>
        <p style={{ margin: 0, fontWeight: 500, color: "var(--text-h)" }}>
          Cargando dispositivos...
        </p>
        <p
          style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--text)" }}
        >
          Consultando...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "16px",
          color: "var(--error-text)",
          background: "var(--error-bg)",
          border: "1px solid var(--error-border)",
          borderRadius: "8px",
          textAlign: "center",
          margin: "16px 0",
        }}
      >
        <p style={{ margin: "0 0 8px 0", fontWeight: 600 }}>
          Error al cargar dispositivos
        </p>
        <p style={{ margin: "0 0 12px 0", fontSize: "13px" }}>{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            style={{
              padding: "6px 14px",
              cursor: "pointer",
              borderRadius: "4px",
              background: "var(--bg)",
              border: "1px solid var(--error-border)",
              color: "var(--error-text)",
              fontWeight: 500,
            }}
          >
            Reintentar conexión
          </button>
        )}
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <div
        style={{
          padding: "32px 20px",
          textAlign: "center",
          background: "var(--code-bg)",
          border: "1px dashed var(--border)",
          borderRadius: "8px",
          margin: "16px 0",
        }}
      >
        <div style={{ fontSize: "28px", marginBottom: "8px" }}>📟</div>
        <h4
          style={{
            margin: "0 0 8px 0",
            fontSize: "16px",
            color: "var(--text-h)",
            fontWeight: 600,
          }}
        >
          No hay dispositivos registrados en la base de datos
        </h4>
        <p
          style={{
            margin: "0 auto 16px auto",
            maxWidth: "520px",
            fontSize: "13px",
            color: "var(--text)",
            lineHeight: 1.5,
          }}
        >
          La colección inicia vacía. Es necesario registrar dispositivos
          manualmente o poblarla con datos de prueba.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          {onOpenCreate && (
            <button
              type="button"
              onClick={onOpenCreate}
              style={{
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
                background: "var(--accent)",
                color: "#fff",
                border: "none",
                fontWeight: 600,
              }}
            >
              + Registrar dispositivo
            </button>
          )}

          {onSeedDemo && (
            <button
              type="button"
              onClick={onSeedDemo}
              disabled={isSeeding}
              style={{
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: isSeeding ? "not-allowed" : "pointer",
                background: "var(--bg)",
                color: "var(--text-h)",
                border: "1px solid var(--border)",
                fontWeight: 500,
              }}
            >
              {isSeeding ? "Poblando..." : "⚡ Cargar dispositivos demo"}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", marginTop: "16px" }}>
      <div style={{ width: "100%", overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            fontSize: "14px",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid var(--border)" }}>
              <th style={{ padding: "10px" }}>Nombre del Dispositivo</th>
              <th style={{ padding: "10px" }}>Ubicación</th>
              <th style={{ padding: "10px" }}>Zona Horaria (IANA)</th>
              <th style={{ padding: "10px", textAlign: "right" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((device) => (
              <tr
                key={device.id}
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <td
                  style={{
                    padding: "10px",
                    fontWeight: 500,
                    color: "var(--text-h)",
                  }}
                >
                  {device.name}
                </td>
                <td style={{ padding: "10px" }}>{device.location}</td>
                <td style={{ padding: "10px" }}>
                  <code style={{ fontSize: "12px" }}>{device.timezone}</code>
                </td>
                <td style={{ padding: "10px", textAlign: "right" }}>
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(device.id, device.name)}
                      title="Eliminar dispositivo"
                      style={{
                        padding: "4px 8px",
                        fontSize: "12px",
                        cursor: "pointer",
                        borderRadius: "4px",
                        color: "var(--error-text)",
                        background: "var(--error-bg)",
                        border: "1px solid var(--error-border)",
                      }}
                    >
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalItems}
        startItem={startItem}
        endItem={endItem}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        itemLabel="dispositivos"
      />
    </div>
  );
};
