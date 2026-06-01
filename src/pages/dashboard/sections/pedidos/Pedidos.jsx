import React from 'react';
import './Pedidos.css';

function Pedidos() {
  return (
    <div className="container-fluid py-4 fade-in-up">
      <div className="card bg-theme-card border-theme p-5 text-center d-flex flex-column align-items-center justify-content-center">
        <div className="rounded-circle d-flex align-items-center justify-content-center mb-3 pedidos-icon-wrapper-circle">
          <i className="bi bi-cart3 fs-3"></i>
        </div>
        <h3 className="fw-medium text-white mb-2">Pedidos</h3>
        <p className="text-secondary mx-auto mb-0 fs-14">
          Falta desarrollar
        </p>
      </div>
    </div>
  );
}

export default Pedidos;
