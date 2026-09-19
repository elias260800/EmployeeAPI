import React, { useEffect, useState, useCallback } from "react";
import { employeeApi } from "../api/employeeApi";
import type { Employee, EmployeeFilterParams } from "../types/employee.types";
import { EmployeeTable } from "../components/EmployeeTable";
import { EmployeeFilters } from "../components/EmployeeFilters";
import { useReportPolling } from "../../reports/hooks/useReportPolling";
import { ReportModal } from "../../reports/components/ReportModal";

interface EmployeesPageProps {
  onLogout?: () => void;
}

export const EmployeesPage: React.FC<EmployeesPageProps> = ({ onLogout }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EmployeeFilterParams>({});

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const {
    status: reportStatus,
    report,
    errorMsg: reportError,
    attempts: reportAttempts,
    startGeneration,
    cancel: cancelReport,
  } = useReportPolling();

  const handleOpenReport = () => {
    setIsReportModalOpen(true);
    startGeneration();
  };

  const handleCloseReport = () => {
    setIsReportModalOpen(false);
    cancelReport();
  };

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
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={handleOpenReport}
            style={{
              padding: "6px 12px",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            Generar reporte
          </button>
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

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={handleCloseReport}
        status={reportStatus}
        report={report}
        errorMsg={reportError}
        attempts={reportAttempts}
        onRetry={startGeneration}
      />
    </div>
  );
};
