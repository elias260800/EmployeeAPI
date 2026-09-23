import React from "react";
import type { Device } from "../types/device.types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
} from "@mui/material";

export interface DeviceTableContentProps {
  devices: Device[];
  onDelete?: (id: string, name: string) => void;
  maxHeight?: number | string;
  ariaLabel?: string;
}

export const DeviceTableContent: React.FC<DeviceTableContentProps> = ({
  devices,
  onDelete,
  maxHeight,
  ariaLabel = "tabla de dispositivos",
}) => {
  return (
    <TableContainer sx={{ maxHeight }}>
      <Table stickyHeader aria-label={ariaLabel} size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Nombre del Dispositivo</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Ubicación</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Zona Horaria (IANA)</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {devices.map((device) => (
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
  );
};
