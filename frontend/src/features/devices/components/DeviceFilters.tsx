import React from "react";
import type { DeviceFilterParams } from "../types/device.types";

interface DeviceFiltersProps {
  filters: DeviceFilterParams;
  onFilterChange: (filters: DeviceFilterParams) => void;
  onReset: () => void;
  onOpenCreate: () => void;
  availableLocations: string[];
  disabled?: boolean;
}

export const DeviceFilters: React.FC<DeviceFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  onOpenCreate,
  availableLocations,
  disabled = false,
}) => {
  const hasActiveFilters = Boolean(filters.search || filters.location);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        alignItems: "flex-end",
        justifyContent: "space-between",
        padding: "12px",
        background: "var(--code-bg)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        marginBottom: "16px",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "flex-end" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "12px", color: "var(--text)" }}>
            Buscar dispositivo:
          </label>
          <input
            type="text"
            placeholder="Filtrar por nombre o ubicación..."
            value={filters.search || ""}
            onChange={(e) =>
              onFilterChange({ ...filters, search: e.target.value })
            }
            disabled={disabled}
            style={{
              padding: "6px 10px",
              fontSize: "13px",
              borderRadius: "4px",
              border: "1px solid var(--border)",
              background: "var(--bg)",
              color: "var(--text-h)",
              minWidth: "220px",
            }}
          />
        </div>

        {availableLocations.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "12px", color: "var(--text)" }}>
              Ubicación:
            </label>
            <select
              value={filters.location || ""}
              onChange={(e) =>
                onFilterChange({ ...filters, location: e.target.value })
              }
              disabled={disabled}
              style={{
                padding: "6px 10px",
                fontSize: "13px",
                borderRadius: "4px",
                border: "1px solid var(--border)",
                background: "var(--bg)",
                color: "var(--text-h)",
                minWidth: "180px",
              }}
            >
              <option value="">Todas las ubicaciones</option>
              {availableLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        )}

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            disabled={disabled}
            style={{
              padding: "6px 12px",
              fontSize: "13px",
              borderRadius: "4px",
              border: "1px solid var(--border)",
              background: "var(--bg)",
              color: "var(--text-h)",
              cursor: "pointer",
            }}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={onOpenCreate}
        disabled={disabled}
        style={{
          padding: "6px 14px",
          fontSize: "13px",
          fontWeight: 600,
          borderRadius: "4px",
          border: "none",
          background: "var(--accent)",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        + Nuevo Dispositivo
      </button>
    </div>
  );
};
