export interface Device {
  id: string;
  name: string;
  location: string;
  timezone: string;
}

export interface CreateDeviceRequest {
  name: string;
  location: string;
  timezone: string;
}

export interface DeviceFilterParams {
  search?: string;
  location?: string;
  timezone?: string;
}
