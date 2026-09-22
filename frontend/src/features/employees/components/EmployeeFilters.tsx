import React, { useEffect, useState } from "react";
import { employeeApi } from "../api/employeeApi";
import type {
  Department,
  Position,
  EmployeeFilterMode,
  EmployeeFilterParams,
} from "../types/employee.types";

interface EmployeeFiltersProps {
  filters: EmployeeFilterParams;
  onFilterChange: (filters: EmployeeFilterParams) => void;
  filterMode: EmployeeFilterMode;
  onFilterModeChange: (mode: EmployeeFilterMode) => void;
  datasetDepartments?: string[];
  datasetPositions?: string[];
  disabled?: boolean;
}

export const EmployeeFilters: React.FC<EmployeeFiltersProps> = ({
  filters,
  onFilterChange,
  filterMode,
  onFilterModeChange,
  datasetDepartments = [],
  datasetPositions = [],
  disabled = false,
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedDeptId, setSelectedDeptId] = useState<string>("");
  const [isLoadingDepartments, setIsLoadingDepartments] =
    useState<boolean>(false);
  const [isLoadingPositions, setIsLoadingPositions] = useState<boolean>(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoadingDepartments(true);
      try {
        const data = await employeeApi.getDepartments();
        setDepartments(data);
      } catch (error) {
        console.error("No se pudieron cargar los departamentos:", error);
      } finally {
        setIsLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleDepartmentChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const deptValue = e.target.value;

    if (!deptValue) {
      setSelectedDeptId("");
      setPositions([]);
      onFilterChange({
        ...filters,
        departmentName: undefined,
        positionName: undefined,
      });
      return;
    }

    if (filterMode === "server") {
      setSelectedDeptId(deptValue);
      const dept = departments.find((d) => d.id === deptValue);
      const deptName = dept ? dept.name : "";

      onFilterChange({
        ...filters,
        departmentName: deptName,
        positionName: undefined,
      });

      setIsLoadingPositions(true);
      try {
        const posData = await employeeApi.getPositionsByDepartment(deptValue);
        setPositions(posData);
      } catch {
        setPositions([]);
      } finally {
        setIsLoadingPositions(false);
      }
    } else {
      onFilterChange({
        ...filters,
        departmentName: deptValue,
        positionName: undefined,
      });
    }
  };

  const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const posName = e.target.value;
    onFilterChange({
      ...filters,
      positionName: posName || undefined,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    onFilterChange({
      ...filters,
      search: term || undefined,
    });
  };

  const handleReset = () => {
    setSelectedDeptId("");
    setPositions([]);
    onFilterChange({});
  };

  const hasActiveFilters = Boolean(
    filters.departmentName || filters.positionName || filters.search,
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "16px",
        background: "var(--code-bg)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        marginBottom: "16px",
        textAlign: "left",
      }}
    >
      {/* Selector interactivo de Modo de Filtrado */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
          borderBottom: "1px solid var(--border)",
          paddingBottom: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--text-h)",
            }}
          >
            Modo de filtrado:
          </span>
          <div
            style={{
              display: "inline-flex",
              borderRadius: "4px",
              border: "1px solid var(--border)",
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              onClick={() => onFilterModeChange("local")}
              style={{
                padding: "4px 10px",
                fontSize: "12px",
                border: "none",
                borderRadius: 0,
                background:
                  filterMode === "local" ? "var(--accent)" : "var(--bg)",
                color: filterMode === "local" ? "#fff" : "var(--text)",
                fontWeight: filterMode === "local" ? 600 : 400,
                cursor: "pointer",
              }}
            >
              ⚡ Local (Cliente / En memoria)
            </button>
            <button
              type="button"
              onClick={() => onFilterModeChange("server")}
              style={{
                padding: "4px 10px",
                fontSize: "12px",
                border: "none",
                borderRadius: 0,
                background:
                  filterMode === "server" ? "var(--accent)" : "var(--bg)",
                color: filterMode === "server" ? "#fff" : "var(--text)",
                fontWeight: filterMode === "server" ? 600 : 400,
                cursor: "pointer",
              }}
            >
              🌐 Servidor (Endpoint API)
            </button>
          </div>
        </div>

        {/* Nota explicativa según el modo */}
        <span
          style={{
            fontSize: "11px",
            color: filterMode === "local" ? "var(--success-text)" : "#d97706",
            background:
              filterMode === "local"
                ? "var(--success-bg)"
                : "rgba(245, 158, 11, 0.1)",
            padding: "3px 8px",
            borderRadius: "4px",
            border: `1px solid ${
              filterMode === "local"
                ? "var(--success-border)"
                : "rgba(245, 158, 11, 0.3)"
            }`,
          }}
        >
          {filterMode === "local"
            ? "Activo sobre todos los registros masivos descargados"
            : "Solo encuentra empleados con departamento en BD"}
        </span>
      </div>

      {/* Inputs y Selectores de Filtro */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignItems: "flex-end",
        }}
      >
        {/* Búsqueda rápida por texto (local) */}
        {filterMode === "local" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "12px", color: "var(--text)" }}>
              Buscar empleado:
            </label>
            <input
              type="text"
              placeholder="Por nombre o email..."
              value={filters.search || ""}
              onChange={handleSearchChange}
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
            />
          </div>
        )}

        {/* Selector de Departamento */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "12px", color: "var(--text)" }}>
            Departamento:
          </label>
          <select
            value={
              filterMode === "server"
                ? selectedDeptId
                : filters.departmentName || ""
            }
            onChange={handleDepartmentChange}
            disabled={
              disabled || (filterMode === "server" && isLoadingDepartments)
            }
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
            <option value="">Todos los departamentos</option>
            {filterMode === "server"
              ? departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))
              : // En modo local se muestran todos los departamentos presentes en el dataset
                Array.from(
                  new Set([
                    ...datasetDepartments,
                    ...departments.map((d) => d.name),
                  ]),
                )
                  .filter(Boolean)
                  .sort()
                  .map((deptName) => (
                    <option key={deptName} value={deptName}>
                      {deptName}
                    </option>
                  ))}
          </select>
        </div>

        {/* Selector de Cargo / Posición */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "12px", color: "var(--text)" }}>
            Cargo:
          </label>
          <select
            value={filters.positionName || ""}
            onChange={handlePositionChange}
            disabled={
              disabled ||
              (filterMode === "server" &&
                (!selectedDeptId || isLoadingPositions))
            }
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
            <option value="">
              {filterMode === "server" && isLoadingPositions
                ? "Cargando cargos..."
                : filterMode === "server" && !selectedDeptId
                  ? "Selecciona un departamento"
                  : "Todos los cargos"}
            </option>
            {filterMode === "server"
              ? positions.map((pos) => (
                  <option key={pos.id} value={pos.name}>
                    {pos.name}
                  </option>
                ))
              : // En modo local se muestran los cargos en el dataset
                Array.from(
                  new Set([
                    ...datasetPositions,
                    ...positions.map((p) => p.name),
                  ]),
                )
                  .filter(Boolean)
                  .sort()
                  .map((posName) => (
                    <option key={posName} value={posName}>
                      {posName}
                    </option>
                  ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
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
    </div>
  );
};
