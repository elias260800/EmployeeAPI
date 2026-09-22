import { apiClient } from "../../../api/client";
import type { CreateDeviceRequest, Device } from "../types/device.types";

export const DEMO_DEVICES: CreateDeviceRequest[] = [
  {
    name: "Terminal Acceso Principal - Edificio A",
    location: "Santiago Centro, Piso 1",
    timezone: "America/Santiago",
  },
  {
    name: "Terminal Entrada Bodega y Despacho",
    location: "Pudahuel, Centro Logístico",
    timezone: "America/Santiago",
  },
  {
    name: "Reloj Biométrico Planta Norte",
    location: "Antofagasta, Sector Industrial",
    timezone: "America/Santiago",
  },
  {
    name: "Terminal Sucursal Valparaíso",
    location: "Valparaíso, Casa Matriz Costa",
    timezone: "America/Santiago",
  },
];

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

  seedDemoDevices: async (): Promise<Device[]> => {
    const results: Device[] = [];
    for (const demo of DEMO_DEVICES) {
      try {
        const created = await deviceApi.createDevice(demo);
        results.push(created);
      } catch {
        // Ignorar conflictos si ya existe un dispositivo con el mismo nombre
      }
    }
    return results;
  },
};
