import { apiClient } from "../../../api/client";
import type { CreateDeviceRequest, Device } from "../types/device.types";

const DEVICE_TYPES = [
  "Terminal Biométrico Facial",
  "Reloj Control Huella Digital",
  "Torniquete Acceso Peatonal",
  "Lector RFID y Credenciales",
  "Totem Autoasistencia",
  "Terminal Acceso Puerta Principal",
  "Reloj Marcador de Turnos",
  "Terminal Bodega y Despacho",
  "Control Biométrico Contratistas",
  "Cerradura Inteligente Oficina",
];

const LOCATIONS_AND_TZ = [
  { loc: "Santiago Centro, Piso 1", tz: "America/Santiago" },
  { loc: "Santiago Centro, Piso 5", tz: "America/Santiago" },
  { loc: "Las Condes, Edificio Titanium", tz: "America/Santiago" },
  { loc: "Providencia, Torre Costanera", tz: "America/Santiago" },
  { loc: "Pudahuel, Centro Logístico", tz: "America/Santiago" },
  { loc: "Quilicura, Parque Industrial", tz: "America/Santiago" },
  { loc: "San Bernardo, Planta Logística", tz: "America/Santiago" },
  { loc: "Maipú, Centro de Operaciones", tz: "America/Santiago" },
  { loc: "Huechuraba, Ciudad Empresarial", tz: "America/Santiago" },
  { loc: "Valparaíso, Casa Matriz Costa", tz: "America/Santiago" },
  { loc: "Viña del Mar, Sucursal Poniente", tz: "America/Santiago" },
  { loc: "San Antonio, Terminal Marítimo", tz: "America/Santiago" },
  { loc: "Rancagua, Centro Distribución", tz: "America/Santiago" },
  { loc: "Talca, Sucursal Centro", tz: "America/Santiago" },
  { loc: "Concepción, Edificio Corporativo", tz: "America/Santiago" },
  { loc: "Temuco, Galería Central", tz: "America/Santiago" },
  { loc: "Puerto Montt, Planta Marina", tz: "America/Santiago" },
  { loc: "Punta Arenas, Zona Austral", tz: "America/Punta_Arenas" },
  { loc: "Antofagasta, Sector Industrial", tz: "America/Santiago" },
  { loc: "Calama, Campamento Minero", tz: "America/Santiago" },
  { loc: "Iquique, Zona Franca ZOFRI", tz: "America/Santiago" },
  { loc: "Arica, Paso Fronterizo", tz: "America/Santiago" },
  { loc: "Isla de Pascua, Hanga Roa", tz: "Pacific/Easter" },
];

export function generateDemoDevices(count: number = 200): CreateDeviceRequest[] {
  const devices: CreateDeviceRequest[] = [];
  for (let i = 0; i < count; i++) {
    const type = DEVICE_TYPES[i % DEVICE_TYPES.length];
    const locObj = LOCATIONS_AND_TZ[i % LOCATIONS_AND_TZ.length];
    const padded = String(i + 1).padStart(3, "0");
    devices.push({
      name: `${type} #${padded} - ${locObj.loc.split(",")[0]}`,
      location: locObj.loc,
      timezone: locObj.tz,
    });
  }
  return devices;
}

export const DEMO_DEVICES: CreateDeviceRequest[] = generateDemoDevices(200);

export const deviceApi = {
  getDevices: async (): Promise<Device[]> => {
    const response = await apiClient.get<Device[]>("/device");
    return response.data;
  },

  getDevice: async (id: string): Promise<Device> => {
    const response = await apiClient.get<Device>(`/device/${id}`);
    return response.data;
  },

  createDevice: async (device: CreateDeviceRequest): Promise<Device> => {
    const response = await apiClient.post<Device>("/device", device);
    return response.data;
  },

  deleteDevice: async (id: string): Promise<void> => {
    await apiClient.delete(`/device/${id}`);
  },

  seedDemoDevices: async (
    targetCount: number = 200,
    onProgress?: (loaded: number, total: number) => void,
  ): Promise<Device[]> => {
    const devicesToSeed = generateDemoDevices(targetCount);
    const results: Device[] = [];
    const concurrency = 10;

    for (let i = 0; i < devicesToSeed.length; i += concurrency) {
      const chunk = devicesToSeed.slice(i, i + concurrency);
      const chunkResults = await Promise.allSettled(
        chunk.map((device) => deviceApi.createDevice(device)),
      );

      for (const res of chunkResults) {
        if (res.status === "fulfilled") {
          results.push(res.value);
        }
      }

      if (onProgress) {
        onProgress(Math.min(i + concurrency, devicesToSeed.length), devicesToSeed.length);
      }
    }

    return results;
  },

  deleteAllDevices: async (
    deviceIds: string[],
    onProgress?: (deleted: number, total: number) => void,
  ): Promise<void> => {
    const concurrency = 15;
    for (let i = 0; i < deviceIds.length; i += concurrency) {
      const chunk = deviceIds.slice(i, i + concurrency);
      await Promise.allSettled(
        chunk.map((id) => deviceApi.deleteDevice(id)),
      );
      if (onProgress) {
        onProgress(Math.min(i + concurrency, deviceIds.length), deviceIds.length);
      }
    }
  },
};
