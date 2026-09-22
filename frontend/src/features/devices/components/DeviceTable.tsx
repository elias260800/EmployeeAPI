import React from "react";
import type { Device } from "../types/device.types";
import { useClientPagination } from "../../employees/hooks/useClientPagination";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  Typography,
  Button,
  Alert,
  AlertTitle,
  CircularProgress,
  Chip,
  Card,
  CardContent,
} from "@mui/material";

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

  if (isLoading) {
    return (
      <Paper elevation={1} sx={{ p: 4, textAlign: "center", my: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <CircularProgress size={36} color="primary" />

          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Cargando dispositivos...
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Consultando...
          </Typography>
        </Box>
      </Paper>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        sx={{ my: 2 }}
        action={
          onRetry && (
            <Button
              color="error"
              size="small"
              variant="outlined"
              onClick={onRetry}
            >
              Reintentar conexión
            </Button>
          )
        }
      >
        <AlertTitle>Error al cargar dispositivos</AlertTitle>
        {error}
      </Alert>
    );
  }

  if (devices.length === 0) {
    return (
      <Card
        variant="outlined"
        sx={{
          my: 2,
          textAlign: "center",
          p: 3,
          borderStyle: "dashed",
          bgcolor: "action.hover",
        }}
      >
        <CardContent sx={{ pb: 1 }}>
          <Typography variant="h3" sx={{ mb: 1 }}>
            📟
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            No hay dispositivos registrados en la base de datos
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 540, mx: "auto", mb: 3 }}
          >
            La colección inicia vacía. Es necesario registrar dispositivos
            manualmente o poblarla con datos de prueba.
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            {onOpenCreate && (
              <Button
                variant="contained"
                color="primary"
                onClick={onOpenCreate}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                + Registrar dispositivo
              </Button>
            )}
            {onSeedDemo && (
              <Button
                variant="outlined"
                color="inherit"
                disabled={isSeeding}
                onClick={onSeedDemo}
                sx={{ textTransform: "none" }}
              >
                {isSeeding ? "Poblando..." : "⚡ Cargar dispositivos demo"}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Paper elevation={1} sx={{ width: "100%", overflow: "hidden", mt: 2 }}>
      <TableContainer sx={{ maxHeight: 540 }}>
        <Table stickyHeader aria-label="tabla de dispositivos MUI" size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>
                Nombre del Dispositivo
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Ubicación</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>
                Zona Horaria (IANA)
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedItems.map((device) => (
              <TableRow hover key={device.id}>
                <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                  {device.name}
                </TableCell>
                <TableCell>{device.location}</TableCell>
                <TableCell>
                  <Chip
                    label={device.timezone}
                    size="small"
                    variant="outlined"
                    sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}
                  />
                </TableCell>
                <TableCell align="right">
                  {onDelete && (
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => onDelete(device.id, device.name)}
                      sx={{
                        textTransform: "none",
                        py: 0.25,
                        px: 1,
                        fontSize: "0.75rem",
                      }}
                    >
                      Eliminar
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
