import React from 'react';

function Configuracion() {
  return (
    <div className="container-fluid py-4 fade-in-up">
      <div className="card bg-theme-card border-theme p-5 text-center d-flex flex-column align-items-center justify-content-center">
        <div className="rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px', backgroundColor: 'rgba(19, 163, 127, 0.1)', color: 'var(--color-primary)' }}>
          <i className="bi bi-gear fs-3"></i>
        </div>
        <h3 className="fw-medium text-white mb-2" style={{ fontSize: '20px' }}>Configuración</h3>
        <p className="text-secondary mx-auto mb-0" style={{ maxWidth: '420px', fontSize: '14px' }}>
          Falta desarrollar
        </p>
      </div>
    </div>
  );
}

export default Configuracion;
