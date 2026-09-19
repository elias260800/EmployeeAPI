import React from "react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  startItem: number;
  endItem: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  disabled?: boolean;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  startItem,
  endItem,
  onPageChange,
  onPageSizeChange,
  disabled,
}) => {
  if (totalItems === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        marginTop: "16px",
        paddingTop: "12px",
        borderTop: "1px solid var(--border)",
        fontSize: "13px",
        color: "var(--text)",
      }}
    >
      <div>
        Mostrando <strong style={{ color: "var(--text-h)" }}>{startItem}</strong> -{" "}
        <strong style={{ color: "var(--text-h)" }}>{endItem}</strong> de{" "}
        <strong style={{ color: "var(--text-h)" }}>{totalItems}</strong> empleados
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <label htmlFor="page-size-select" style={{ color: "var(--text)" }}>
            Filas por página:
          </label>
          <select
            id="page-size-select"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            disabled={disabled}
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid var(--border)",
              background: "var(--code-bg)",
              color: "var(--text-h)",
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={disabled || currentPage <= 1}
            style={{
              padding: "4px 10px",
              borderRadius: "4px",
              border: "1px solid var(--border)",
              background: "var(--code-bg)",
              color: "var(--text-h)",
              cursor: currentPage <= 1 ? "not-allowed" : "pointer",
              opacity: currentPage <= 1 ? 0.4 : 1,
            }}
          >
            Anterior
          </button>
          <span style={{ color: "var(--text)" }}>
            Página <strong style={{ color: "var(--text-h)" }}>{currentPage}</strong> de{" "}
            <strong style={{ color: "var(--text-h)" }}>{totalPages}</strong>
          </span>
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={disabled || currentPage >= totalPages}
            style={{
              padding: "4px 10px",
              borderRadius: "4px",
              border: "1px solid var(--border)",
              background: "var(--code-bg)",
              color: "var(--text-h)",
              cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
              opacity: currentPage >= totalPages ? 0.4 : 1,
            }}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};
