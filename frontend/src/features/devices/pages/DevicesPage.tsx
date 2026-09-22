import React, { useEffect, useState, useCallback, useMemo } from "react";
import { deviceApi } from "../api/deviceApi";
import type {
  CreateDeviceRequest,
  Device,
  DeviceFilterParams,
} from "../types/device.types";
import { DeviceTable } from "../components/DeviceTable";
import { DeviceFilters } from "../components/DeviceFilters";
import { CreateDeviceModal } from "../components/CreateDeviceModal";

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

  // Limpiar mensaje de feedback después de unos segundos
  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(timer);
  }, [feedback]);

  // Lista de ubicaciones únicas para el selector del filtro
  const availableLocations = useMemo(() => {
    const locSet = new Set<string>();
    devices.forEach((d) => {
      if (d.location) locSet.add(d.location);
    });
    return Array.from(locSet).sort();
  }, [devices]);

  // Filtrado local en cliente (estrategia 4.a)
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

  const handleSeedDemo = async () => {
    setIsSeeding(true);
    try {
      const created = await deviceApi.seedDemoDevices();
      await fetchDevices();
      setFeedback({
        type: "success",
        text: `Se importaron ${created.length} terminales de demostración exitosamente.`,
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
          <h2 style={{ margin: "0 0 4px 0" }}>Dispositivos / Terminales</h2>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={fetchDevices}
            disabled={isLoading}
            style={{
              padding: "6px 12px",
              fontSize: "13px",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            ↻ Actualizar
          </button>
        </div>
      </div>

      {feedback && (
        <div
          style={{
            padding: "10px 14px",
            marginBottom: "16px",
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: 500,
            background:
              feedback.type === "success"
                ? "var(--success-bg)"
                : "var(--error-bg)",
            color:
              feedback.type === "success"
                ? "var(--success-text)"
                : "var(--error-text)",
            border: `1px solid ${
              feedback.type === "success"
                ? "var(--success-border)"
                : "var(--error-border)"
            }`,
          }}
        >
          {feedback.text}
        </div>
      )}

      {devices.length > 0 && (
        <DeviceFilters
          filters={filters}
          onFilterChange={setFilters}
          onReset={() => setFilters({})}
          onOpenCreate={() => setIsCreateModalOpen(true)}
          availableLocations={availableLocations}
          disabled={isLoading}
        />
      )}

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

      <CreateDeviceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateDevice}
      />
    </div>
  );
};
