import React from "react";
import type { Employee } from "../types/employee.types";
import { useClientPagination } from "../hooks/useClientPagination";
import { PaginationControls } from "./PaginationControls";

interface EmployeeTableProps {
  employees: Employee[];
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  isLoading,
  error,
  onRetry,
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
  } = useClientPagination(employees);

  if (isLoading) {
    return (
      <div style={{ padding: "24px", textAlign: "center", color: "var(--text)" }}>
        Cargando empleados...
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
          margin: "12px 0",
        }}
      >
        <p style={{ margin: "0 0 8px 0" }}>{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            style={{
              padding: "6px 12px",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            Reintentar
          </button>
        )}
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div style={{ padding: "24px", textAlign: "center", color: "var(--text)" }}>
        No se encontraron empleados.
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
              <th style={{ padding: "10px" }}>Nombre</th>
              <th style={{ padding: "10px" }}>Email</th>
              <th style={{ padding: "10px" }}>Departamento</th>
              <th style={{ padding: "10px" }}>Cargo</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((emp) => (
              <tr key={emp.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "10px" }}>{emp.name}</td>
                <td style={{ padding: "10px" }}>{emp.email}</td>
                <td style={{ padding: "10px" }}>{emp.department}</td>
                <td style={{ padding: "10px" }}>{emp.position}</td>
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
      />
    </div>
  );
};
