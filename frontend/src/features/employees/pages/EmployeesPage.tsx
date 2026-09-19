import React, { useEffect, useState, useCallback } from "react";
import { employeeApi } from "../api/employeeApi";
import type { Employee, EmployeeFilterParams } from "../types/employee.types";
import { EmployeeTable } from "../components/EmployeeTable";
import { EmployeeFilters } from "../components/EmployeeFilters";

interface EmployeesPageProps {
  onLogout?: () => void;
}

export const EmployeesPage: React.FC<EmployeesPageProps> = ({ onLogout }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EmployeeFilterParams>({});

  const fetchEmployees = useCallback(
    async (filterParams: EmployeeFilterParams) => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await employeeApi.getEmployees(filterParams);
        setEmployees(data);
      } catch {
        setError("No se pudieron cargar los empleados");
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEmployees(filters);
  }, [fetchEmployees, filters]);

  const handleFilterChange = (newFilters: EmployeeFilterParams) => {
    setFilters(newFilters);
  };

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

      <EmployeeFilters
        onFilterChange={handleFilterChange}
        disabled={isLoading}
      />

      <EmployeeTable
        employees={employees}
        isLoading={isLoading}
        error={error}
        onRetry={() => fetchEmployees(filters)}
      />
    </div>
  );
};
