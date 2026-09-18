import React from "react";
import type { Employee } from "../types/employee.types";

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
  if (isLoading) {
    return (
      <div style={{ padding: "24px", textAlign: "center", color: "#64748b" }}>
        Cargando empleados...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "16px",
          color: "#b91c1c",
          background: "#fef2f2",
          border: "1px solid #fecaca",
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
      <div style={{ padding: "24px", textAlign: "center", color: "#64748b" }}>
        No se encontraron empleados.
      </div>
    );
  }

  return (
    <div style={{ width: "100%", overflowX: "auto", marginTop: "16px" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
          fontSize: "14px",
        }}
      >
        <thead>
          <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
            <th style={{ padding: "10px" }}>Nombre</th>
            <th style={{ padding: "10px" }}>Email</th>
            <th style={{ padding: "10px" }}>Departamento</th>
            <th style={{ padding: "10px" }}>Cargo</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr
              key={emp.id}
              style={{ borderBottom: "1px solid #f1f5f9" }}
            >
              <td style={{ padding: "10px" }}>{emp.name}</td>
              <td style={{ padding: "10px" }}>{emp.email}</td>
              <td style={{ padding: "10px" }}>{emp.department}</td>
              <td style={{ padding: "10px" }}>{emp.position}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
