import React, { useEffect, useState, useCallback, useMemo } from "react";
import { deviceApi } from "../api/deviceApi";
import type {
  CreateDeviceRequest,
  Device,
  DeviceFilterParams,
} from "../types/device.types";
import { DeviceTable } from "../components/DeviceTable";
import { DeviceInfiniteScroll } from "../components/DeviceInfiniteScroll";
import { DeviceFilters } from "../components/DeviceFilters";
import { CreateDeviceModal } from "../components/CreateDeviceModal";
import {
  Box,
  Typography,
  Button,
  Alert,
  Snackbar,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { Table, Infinity as InfinityIcon } from "lucide-react";

import { createTheme, ThemeProvider } from "@mui/material/styles";

const muiDarkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#c084fc",
    },
    background: {
      default: "#16171d",
      paper: "#1f2028",
    },
    text: {
      primary: "#f3f4f6",
      secondary: "#9ca3af",
    },
    divider: "#2e303a",
    action: {
      hover: "rgba(192, 132, 252, 0.08)",
    },
  },
  typography: {
    fontFamily: "inherit",
  },
});

export const DevicesPage: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DeviceFilterParams>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [viewFormat, setViewFormat] = useState<"table" | "infinite">("table");
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const fetchDevices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await deviceApi.getDevices();
      setDevices(data);
    } catch {
      setError("No se pudieron cargar los dispositivos desde el servidor.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDevices();
  }, [fetchDevices]);

  // Lista de ubicaciones para el selector del filtro
  const availableLocations = useMemo(() => {
    const locSet = new Set<string>();
    devices.forEach((d) => {
      if (d.location) locSet.add(d.location);
    });
    return Array.from(locSet).sort();
  }, [devices]);

  // Filtrado local en cliente (4.a)
  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesName = device.name.toLowerCase().includes(query);
        const matchesLocation = device.location.toLowerCase().includes(query);
        if (!matchesName && !matchesLocation) return false;
      }

      if (filters.location && device.location !== filters.location) {
        return false;
      }

      return true;
    });
  }, [devices, filters]);

  const handleCreateDevice = async (newDevice: CreateDeviceRequest) => {
    try {
      const created = await deviceApi.createDevice(newDevice);
      setDevices((prev) => [created, ...prev]);
      setFeedback({
        type: "success",
        text: `Dispositivo "${created.name}" registrado con éxito.`,
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Error al registrar el dispositivo.";
      throw new Error(msg, { cause: err });
    }
  };

  const handleDeleteDevice = async (id: string, name: string) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar el terminal "${name}"?`,
    );
    if (!confirmDelete) return;

    try {
      await deviceApi.deleteDevice(id);
      setDevices((prev) => prev.filter((d) => d.id !== id));
      setFeedback({
        type: "success",
        text: `Dispositivo "${name}" eliminado correctamente.`,
      });
    } catch {
      setFeedback({
        type: "error",
        text: `No se pudo eliminar el dispositivo "${name}".`,
      });
    }
  };

  const handleDeleteAllDevices = async () => {
    const count = devices.length;
    if (count === 0) return;

    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar TODOS los ${count} dispositivos? Esta acción no se puede deshacer.`,
    );
    if (!confirmDelete) return;

    setIsDeletingAll(true);
    try {
      const ids = devices.map((d) => d.id);
      await deviceApi.deleteAllDevices(ids);
      setDevices([]);
      setFeedback({
        type: "success",
        text: `Se eliminaron los ${count} dispositivos exitosamente.`,
      });
    } catch {
      setFeedback({
        type: "error",
        text: "Ocurrió un error al intentar eliminar todos los dispositivos.",
      });
      fetchDevices();
    } finally {
      setIsDeletingAll(false);
    }
  };

  const handleSeedDemo = async () => {
    setIsSeeding(true);
    try {
      const created = await deviceApi.seedDemoDevices(200);
      await fetchDevices();
      setFeedback({
        type: "success",
        text: `Se importaron ${created.length} datos de demostración exitosamente.`,
      });
    } catch {
      setFeedback({
        type: "error",
        text: "Hubo un problema al importar los dispositivos demo.",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <ThemeProvider theme={muiDarkTheme}>
      <Box
        sx={{
          width: "100%",
          maxWidth: 920,
          mx: "auto",
          p: 2,
          textAlign: "left",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 600, mb: 0.5 }}
            >
              Dispositivos / Terminales
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Gestión de Dispositivos / Terminales
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexWrap: "wrap",
            }}
          >
            <ToggleButtonGroup
              value={viewFormat}
              exclusive
              onChange={(_, nextFormat) => {
                if (nextFormat) setViewFormat(nextFormat);
              }}
              size="small"
              aria-label="Formato de visualización"
              sx={{
                bgcolor: "background.paper",
                border: 1,
                borderColor: "divider",
                "& .MuiToggleButton-root": {
                  textTransform: "none",
                  px: 1.5,
                  py: 0.5,
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: "text.secondary",
                  "&.Mui-selected": {
                    color: "primary.main",
                    bgcolor: "action.hover",
                    fontWeight: 600,
                  },
                },
              }}
            >
              <ToggleButton value="table" aria-label="Formato de tabla">
                <Table size={16} style={{ marginRight: 6 }} />
                Tabla
              </ToggleButton>
              <ToggleButton
                value="infinite"
                aria-label="Formato de scroll infinito"
              >
                <InfinityIcon size={16} style={{ marginRight: 6 }} />
                Scroll Infinito
              </ToggleButton>
            </ToggleButtonGroup>

            <Button
              variant="outlined"
              color="inherit"
              size="small"
              onClick={fetchDevices}
              disabled={isLoading || isDeletingAll}
              sx={{ textTransform: "none" }}
            >
              Actualizar
            </Button>
          </Box>
        </Box>

        {feedback && (
          <Alert
            severity={feedback.type}
            onClose={() => setFeedback(null)}
            sx={{ mb: 2 }}
          >
            {feedback.text}
          </Alert>
        )}

        {devices.length > 0 && (
          <DeviceFilters
            filters={filters}
            onFilterChange={setFilters}
            onReset={() => setFilters({})}
            onOpenCreate={() => setIsCreateModalOpen(true)}
            onDeleteAll={handleDeleteAllDevices}
            isDeletingAll={isDeletingAll}
            availableLocations={availableLocations}
            disabled={isLoading || isDeletingAll}
          />
        )}

        {viewFormat === "table" ? (
          <DeviceTable
            devices={filteredDevices}
            isLoading={isLoading}
            error={error}
            onRetry={fetchDevices}
            onOpenCreate={() => setIsCreateModalOpen(true)}
            onSeedDemo={handleSeedDemo}
            onDelete={handleDeleteDevice}
            isSeeding={isSeeding}
          />
        ) : (
          <DeviceInfiniteScroll
            devices={filteredDevices}
            isLoading={isLoading}
            error={error}
            onRetry={fetchDevices}
            onOpenCreate={() => setIsCreateModalOpen(true)}
            onSeedDemo={handleSeedDemo}
            onDelete={handleDeleteDevice}
            isSeeding={isSeeding}
          />
        )}

        <CreateDeviceModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateDevice}
        />

        <Snackbar
          open={Boolean(feedback)}
          autoHideDuration={4000}
          onClose={() => setFeedback(null)}
          message={feedback?.text}
        />
      </Box>
    </ThemeProvider>
  );
};
