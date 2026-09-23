import React from "react";
import type { Device } from "../types/device.types";
import { useClientPagination } from "../../employees/hooks/useClientPagination";
import { DeviceTableContent } from "./DeviceTableContent";
import { DeviceStateFeedback } from "./DeviceStateFeedback";
import { Paper, TablePagination } from "@mui/material";

interface DeviceTableProps {
  devices: Device[];
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
  onOpenCreate?: () => void;
  onSeedDemo?: () => void;
  onDelete?: (id: string, name: string) => void;
  isSeeding?: boolean;
}

export const DeviceTable: React.FC<DeviceTableProps> = ({
  devices,
  isLoading,
  error,
  onRetry,
  onOpenCreate,
  onSeedDemo,
  onDelete,
  isSeeding = false,
}) => {
  const {
    paginatedItems,
    currentPage,
    pageSize,
    totalItems,
    setPage,
    setPageSize,
  } = useClientPagination(devices);

  if (isLoading || error || devices.length === 0) {
    return (
      <DeviceStateFeedback
        isLoading={isLoading}
        error={error}
        isEmpty={devices.length === 0}
        onRetry={onRetry}
        onOpenCreate={onOpenCreate}
        onSeedDemo={onSeedDemo}
        isSeeding={isSeeding}
      />
    );
  }

  return (
    <Paper elevation={1} sx={{ width: "100%", overflow: "hidden", mt: 2 }}>
      <DeviceTableContent
        devices={paginatedItems}
        onDelete={onDelete}
        maxHeight={540}
        ariaLabel="tabla de dispositivos"
      />

      <TablePagination
        rowsPerPageOptions={[10, 20, 50, 100]}
        component="div"
        count={totalItems}
        rowsPerPage={pageSize}
        page={currentPage - 1}
        onPageChange={(_, newPage) => setPage(newPage + 1)}
        onRowsPerPageChange={(event) =>
          setPageSize(parseInt(event.target.value, 10))
        }
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) =>
          `Mostrando ${from} - ${to} de ${count !== -1 ? count : `más de ${to}`} dispositivos`
        }
      />
    </Paper>
  );
};
