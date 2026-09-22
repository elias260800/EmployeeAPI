import React, { useEffect, useState, useCallback, useMemo } from "react";
import { employeeApi } from "../api/employeeApi";
import type {
  Employee,
  EmployeeFilterMode,
  EmployeeFilterParams,
} from "../types/employee.types";
import { EmployeeTable } from "../components/EmployeeTable";
import { EmployeeFilters } from "../components/EmployeeFilters";
import { useReportPolling } from "../../reports/hooks/useReportPolling";
import { ReportModal } from "../../reports/components/ReportModal";

interface EmployeesPageProps {
  onLogout?: () => void;
  onOpenReport?: () => void;
}

const DEFAULT_FILTER_MODE: EmployeeFilterMode =
  (import.meta.env.VITE_EMPLOYEE_FILTER_MODE as EmployeeFilterMode) || "local";

export const EmployeesPage: React.FC<EmployeesPageProps> = ({ onLogout }) => {
  const [filterMode, setFilterMode] =
    useState<EmployeeFilterMode>(DEFAULT_FILTER_MODE);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [serverEmployees, setServerEmployees] = useState<Employee[]>([]);
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

  // Carga inicial completa sin parámetros de paginación
  const fetchAllEmployees = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await employeeApi.getEmployees();
      setAllEmployees(data);
    } catch {
      setError("No se pudieron cargar los empleados desde el servidor.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carga con filtros enviados directamente al endpoint del servidor
  const fetchServerEmployees = useCallback(
    async (params: EmployeeFilterParams) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await employeeApi.getEmployees({
          departmentName: params.departmentName,
          positionName: params.positionName,
        });
        setServerEmployees(data);
      } catch {
        setError("Error al consultar empleados con filtros en el servidor.");
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (filterMode === "local") {
      if (allEmployees.length === 0) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchAllEmployees();
      }
    } else {
      fetchServerEmployees(filters);
    }
  }, [
    filterMode,
    filters,
    fetchAllEmployees,
    fetchServerEmployees,
    allEmployees.length,
  ]);

  const handleFilterModeChange = (newMode: EmployeeFilterMode) => {
    setFilterMode(newMode);
    setFilters({});
    if (newMode === "local" && allEmployees.length === 0) {
      fetchAllEmployees();
    }
  };

  // Departamentos y cargos extraídos del dataset completo (local)
  const datasetDepartments = useMemo(() => {
    const set = new Set<string>();
    allEmployees.forEach((emp) => {
      if (emp.department) set.add(emp.department);
    });
    return Array.from(set).sort();
  }, [allEmployees]);

  const datasetPositions = useMemo(() => {
    const set = new Set<string>();
    allEmployees.forEach((emp) => {
      if (emp.position) set.add(emp.position);
    });
    return Array.from(set).sort();
  }, [allEmployees]);

  // En modo local: filtrado en memoria sobre allEmployees
  // En modo server: datos devueltos por el endpoint serverEmployees
  const displayedEmployees = useMemo(() => {
    if (filterMode === "server") {
      return serverEmployees;
    }

    return allEmployees.filter((emp) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchesName = emp.name.toLowerCase().includes(q);
        const matchesEmail = emp.email.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail) return false;
      }

      if (filters.departmentName && emp.department !== filters.departmentName) {
        return false;
      }

      if (filters.positionName && emp.position !== filters.positionName) {
        return false;
      }

      return true;
    });
  }, [filterMode, serverEmployees, allEmployees, filters]);

  const handleRetry = () => {
    if (filterMode === "local") {
      fetchAllEmployees();
    } else {
      fetchServerEmployees(filters);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "920px",
        margin: "0 auto",
        padding: "16px",
        textAlign: "left",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "16px",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2 style={{ margin: "0 0 4px 0" }}>Directorio de Colaboradores</h2>
          <p style={{ margin: 0, fontSize: "13px", color: "var(--text)" }}>
            Listado completo sin paginar en backend
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={handleOpenReport}
            style={{
              padding: "6px 14px",
              cursor: "pointer",
              borderRadius: "4px",
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              fontWeight: 600,
            }}
          >
            📊 Generar reporte
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
        filters={filters}
        onFilterChange={setFilters}
        filterMode={filterMode}
        onFilterModeChange={handleFilterModeChange}
        datasetDepartments={datasetDepartments}
        datasetPositions={datasetPositions}
        disabled={isLoading}
      />

      <EmployeeTable
        employees={displayedEmployees}
        isLoading={isLoading}
        error={error}
        onRetry={handleRetry}
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
