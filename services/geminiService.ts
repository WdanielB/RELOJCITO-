
import { SystemStatus } from "../types.ts";

const MOCK_MESSAGES = [
  "FLUJO DE PLASMA ESTABLE",
  "NÚCLEO TÉRMICO OPERATIVO",
  "SINCRONÍA ORBITAL AL 98.4%",
  "ENLACE NEURAL ACTIVO",
  "MATRIZ DE DATOS ENCRIPTADA",
  "SISTEMA DE ENFRIAMIENTO OK",
  "PROTOCOLOS DE SEGURIDAD ACTIVOS",
  "FRECUENCIA DE RELOJ SINCRONIZADA",
  "NODO DE ENERGÍA CARGANDO",
  "CONEXIÓN SATELITAL NOMINAL"
];

const STABILITIES = ["ESTABLE", "ÓPTIMO", "NOMINAL", "SINCRO"];

export const getSystemStatus = async (): Promise<SystemStatus> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * MOCK_MESSAGES.length);
      const randomLoad = 15 + Math.random() * 45;
      const randomStability = STABILITIES[Math.floor(Math.random() * STABILITIES.length)];
      
      resolve({
        message: MOCK_MESSAGES[randomIndex],
        load: randomLoad,
        stability: randomStability,
        neuralLink: "ACTIVE_SYNC"
      });
    }, 500);
  });
};
