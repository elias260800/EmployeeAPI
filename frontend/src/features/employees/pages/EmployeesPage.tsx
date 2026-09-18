import React, { useEffect, useState, useCallback } from "react";
import { employeeApi } from "../api/employeeApi";
import type { Employee } from "../types/employee.types";
import { EmployeeTable } from "../components/EmployeeTable";

interface EmployeesPageProps {
  onLogout?: () => void;
}

export const EmployeesPage: React.FC<EmployeesPageProps> = ({ onLogout }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await employeeApi.getEmployees();
      setEmployees(data);
    } catch {
      setError("No se pudieron cargar los empleados");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEmployees();
  }, [fetchEmployees]);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h2 style={{ margin: 0 }}>Listado de Empleados</h2>
        {onLogout && (
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
        )}
      </div>

      <EmployeeTable
        employees={employees}
        isLoading={isLoading}
        error={error}
        onRetry={fetchEmployees}
      />
    </div>
  );
};
