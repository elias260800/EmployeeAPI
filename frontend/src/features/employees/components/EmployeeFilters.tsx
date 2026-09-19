import React, { useEffect, useState } from "react";
import { employeeApi } from "../api/employeeApi";
import type {
  Department,
  Position,
  EmployeeFilterParams,
} from "../types/employee.types";

interface EmployeeFiltersProps {
  onFilterChange: (filters: EmployeeFilterParams) => void;
  disabled?: boolean;
}

export const EmployeeFilters: React.FC<EmployeeFiltersProps> = ({
  onFilterChange,
  disabled,
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedDeptId, setSelectedDeptId] = useState<string>("");
  const [selectedDeptName, setSelectedDeptName] = useState<string>("");
  const [selectedPosName, setSelectedPosName] = useState<string>("");
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
        return [];
      } finally {
        setIsLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleDepartmentChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const deptId = e.target.value;
    setSelectedDeptId(deptId);
    setSelectedPosName("");

    if (!deptId) {
      setSelectedDeptName("");
      setPositions([]);
      onFilterChange({});
      return;
    }

    const dept = departments.find((d) => d.id === deptId);
    const deptName = dept ? dept.name : "";
    setSelectedDeptName(deptName);

    onFilterChange({ departmentName: deptName });

    setIsLoadingPositions(true);
    try {
      const posData = await employeeApi.getPositionsByDepartment(deptId);
      setPositions(posData);
    } catch {
      setPositions([]);
    } finally {
      setIsLoadingPositions(false);
    }
  };

  const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const posName = e.target.value;
    setSelectedPosName(posName);

    onFilterChange({
      departmentName: selectedDeptName || undefined,
      positionName: posName || undefined,
    });
  };

  const handleReset = () => {
    setSelectedDeptId("");
    setSelectedDeptName("");
    setSelectedPosName("");
    setPositions([]);
    onFilterChange({});
  };

  const hasActiveFilters = Boolean(selectedDeptId || selectedPosName);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        alignItems: "flex-end",
        padding: "12px",
        background: "var(--code-bg)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        marginBottom: "16px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <label style={{ fontSize: "12px", color: "var(--text)" }}>
          Departamento:
        </label>
        <select
          value={selectedDeptId}
          onChange={handleDepartmentChange}
          disabled={disabled || isLoadingDepartments}
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
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <label style={{ fontSize: "12px", color: "var(--text)" }}>Cargo:</label>
        <select
          value={selectedPosName}
          onChange={handlePositionChange}
          disabled={disabled || !selectedDeptId || isLoadingPositions}
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
            {isLoadingPositions
              ? "Cargando cargos..."
              : !selectedDeptId
                ? "Selecciona un departamento"
                : "Todos los cargos"}
          </option>
          {positions.map((pos) => (
            <option key={pos.id} value={pos.name}>
              {pos.name}
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
  );
};
