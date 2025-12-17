
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

console.log("AOD_CORE: Iniciando montaje de React...");

try {
  const container = document.getElementById('root');
  if (container) {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("AOD_CORE: Renderizado inicial completado.");
  } else {
    console.error("AOD_CORE: No se encontró el elemento #root");
  }
} catch (err) {
  console.error("AOD_CORE: Error durante el montaje:", err);
  const debug = document.getElementById('debug-overlay');
  if (debug) {
    debug.style.display = 'block';
    debug.innerHTML += `<div>[MOUNT_ERROR]: ${err.message}</div>`;
  }
}
