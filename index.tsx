
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const startApp = () => {
  try {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      console.error("No se encontró el elemento root");
      return;
    }

    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("App iniciada correctamente.");
  } catch (error) {
    console.error("Fallo crítico en el renderizado:", error);
  }
};

// Asegurar que el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
