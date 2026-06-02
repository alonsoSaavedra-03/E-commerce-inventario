import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './Pedidos.css';

// ─── Datos de muestra ───────────────────────────────────────────────────────
const PEDIDOS_INICIALES = [
  { id: 'PED-001', cliente: 'Juan Pérez',    fecha: '2026-05-25', total: 150.00, estado: 'Entregado', entrega: 'Envío a Domicilio' },
  { id: 'PED-002', cliente: 'María Gómez',   fecha: '2026-05-26', total:  85.50, estado: 'Pendiente', entrega: 'Retiro en Tienda'  },
  { id: 'PED-003', cliente: 'Carlos Ruiz',   fecha: '2026-05-27', total: 320.00, estado: 'Enviado',   entrega: 'Envío Express'     },
  { id: 'PED-004', cliente: 'Ana Torres',    fecha: '2026-05-28', total:  45.00, estado: 'Cancelado', entrega: 'Envío a Domicilio' },
  { id: 'PED-005', cliente: 'Luis Mendoza',  fecha: '2026-05-29', total: 210.75, estado: 'Pendiente', entrega: 'Envío Express'     },
  { id: 'PED-006', cliente: 'Sara Fuentes',  fecha: '2026-05-30', total:  99.90, estado: 'Entregado', entrega: 'Retiro en Tienda'  },
];

const FORM_VACIO = { id: '', cliente: '', fecha: '', total: '', estado: 'Pendiente', entrega: '' };

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getBadgeClass = (estado) => ({
  'Entregado': 'badge-estado-entregado',
  'Pendiente':  'badge-estado-pendiente',
  'Enviado':    'badge-estado-enviado',
  'Cancelado':  'badge-estado-cancelado',
}[estado] ?? 'badge-estado-default');

const getEstadoIcon = (estado) => ({
  'Entregado': 'bi-check-circle-fill',
  'Pendiente':  'bi-clock-fill',
  'Enviado':    'bi-truck',
  'Cancelado':  'bi-x-circle-fill',
}[estado] ?? 'bi-circle');

// ─── Modal (renderizado en portal) ───────────────────────────────────────────
function PedidoModal({ formData, onChange, onSubmit, onClose }) {
  return ReactDOM.createPortal(
    <div className="pedidos-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="pedidos-modal-dialog" role="dialog" aria-modal="true">

        {/* Header */}
        <div className="pedidos-modal-header">
          <div className="d-flex align-items-center gap-3">
            <div className="pedidos-modal-icon">
              <i className="bi bi-cart-plus-fill"></i>
            </div>
            <div>
              <h5 className="mb-0 fw-bold text-white">Crear Nuevo Pedido</h5>
              <span className="text-secondary" style={{ fontSize: '13px' }}>Completa los campos para registrar</span>
            </div>
          </div>
          <button className="pedidos-modal-close" onClick={onClose} aria-label="Cerrar">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={onSubmit}>
          <div className="pedidos-modal-body">
            <div className="row g-3">

              {/* N° Pedido */}
              <div className="col-md-6">
                <label className="pedidos-form-label">
                  <i className="bi bi-hash me-1"></i> N° Pedido
                </label>
                <input
                  type="text"
                  className="form-control pedidos-input"
                  name="id"
                  value={formData.id}
                  onChange={onChange}
                  required
                  placeholder="Ej: PED-007"
                />
              </div>

              {/* Fecha */}
              <div className="col-md-6">
                <label className="pedidos-form-label">
                  <i className="bi bi-calendar3 me-1"></i> Fecha
                </label>
                <input
                  type="date"
                  className="form-control pedidos-input"
                  name="fecha"
                  value={formData.fecha}
                  onChange={onChange}
                  required
                />
              </div>

              {/* Cliente */}
              <div className="col-12">
                <label className="pedidos-form-label">
                  <i className="bi bi-person me-1"></i> Cliente
                </label>
                <input
                  type="text"
                  className="form-control pedidos-input"
                  name="cliente"
                  value={formData.cliente}
                  onChange={onChange}
                  required
                  placeholder="Nombre completo del cliente"
                />
              </div>

              {/* Total */}
              <div className="col-md-6">
                <label className="pedidos-form-label">
                  <i className="bi bi-currency-dollar me-1"></i> Total ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-control pedidos-input"
                  name="total"
                  value={formData.total}
                  onChange={onChange}
                  required
                  placeholder="0.00"
                />
              </div>

              {/* Estado */}
              <div className="col-md-6">
                <label className="pedidos-form-label">
                  <i className="bi bi-tag me-1"></i> Estado
                </label>
                <select
                  className="form-select pedidos-input"
                  name="estado"
                  value={formData.estado}
                  onChange={onChange}
                >
                  <option value="Pendiente">🕐 Pendiente</option>
                  <option value="Enviado">🚚 Enviado</option>
                  <option value="Entregado">✅ Entregado</option>
                  <option value="Cancelado">❌ Cancelado</option>
                </select>
              </div>

              {/* Entrega */}
              <div className="col-12">
                <label className="pedidos-form-label">
                  <i className="bi bi-geo-alt me-1"></i> Tipo de Entrega
                </label>
                <input
                  type="text"
                  className="form-control pedidos-input"
                  name="entrega"
                  value={formData.entrega}
                  onChange={onChange}
                  required
                  placeholder="Ej: Envío a Domicilio, Retiro en Tienda…"
                />
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="pedidos-modal-footer">
            <button type="button" className="btn pedidos-btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn pedidos-btn-save">
              <i className="bi bi-floppy me-2"></i>
              Guardar Pedido
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
function Pedidos() {
  const [pedidos, setPedidos]       = useState(PEDIDOS_INICIALES);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal]   = useState(false);
  const [formData, setFormData]     = useState(FORM_VACIO);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCrear = (e) => {
    e.preventDefault();
    setPedidos(prev => [{ ...formData, total: parseFloat(formData.total) }, ...prev]);
    setShowModal(false);
    setFormData(FORM_VACIO);
  };

  const handleDelete = (id) => setPedidos(prev => prev.filter(p => p.id !== id));

  // Métricas resumen
  const totalVentas   = pedidos.reduce((s, p) => s + parseFloat(p.total || 0), 0);
  const countPendient = pedidos.filter(p => p.estado === 'Pendiente').length;
  const countEnviado  = pedidos.filter(p => p.estado === 'Enviado').length;

  const filteredPedidos = pedidos.filter(p =>
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.entrega.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid py-4 fade-in-up">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h2 className="text-white fw-bold mb-1 d-flex align-items-center gap-2">
            <i className="bi bi-cart3 text-theme-primary"></i>
            Pedidos
          </h2>
          <p className="text-secondary mb-0 fs-14">Gestiona y monitorea todos los pedidos de la tienda</p>
        </div>
        <button className="btn pedidos-btn-create" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-lg me-2"></i>
          Crear nuevo pedido
        </button>
      </div>

      {/* ── Tarjetas de resumen ─────────────────────────────────── */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="pedidos-stat-card">
            <div className="pedidos-stat-icon pedidos-stat-icon--total">
              <i className="bi bi-receipt"></i>
            </div>
            <div className="pedidos-stat-value">{pedidos.length}</div>
            <div className="pedidos-stat-label">Total Pedidos</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="pedidos-stat-card">
            <div className="pedidos-stat-icon pedidos-stat-icon--pendiente">
              <i className="bi bi-clock-fill"></i>
            </div>
            <div className="pedidos-stat-value text-warning">{countPendient}</div>
            <div className="pedidos-stat-label">Pendientes</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="pedidos-stat-card">
            <div className="pedidos-stat-icon pedidos-stat-icon--enviado">
              <i className="bi bi-truck"></i>
            </div>
            <div className="pedidos-stat-value" style={{ color: 'var(--color-primary)' }}>{countEnviado}</div>
            <div className="pedidos-stat-label">En Camino</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="pedidos-stat-card">
            <div className="pedidos-stat-icon pedidos-stat-icon--ventas">
              <i className="bi bi-currency-dollar"></i>
            </div>
            <div className="pedidos-stat-value text-theme-gold">${totalVentas.toFixed(2)}</div>
            <div className="pedidos-stat-label">Total en Ventas</div>
          </div>
        </div>
      </div>

      {/* ── Tabla principal ─────────────────────────────────────── */}
      <div className="card bg-theme-card border-theme pedidos-table-card">
        <div className="card-body p-4">

          {/* Search */}
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
            <div className="pedidos-search-wrapper">
              <i className="bi bi-search pedidos-search-icon"></i>
              <input
                type="text"
                className="form-control pedidos-search-input"
                placeholder="Buscar por pedido, cliente, estado…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <span className="text-secondary fs-13">
              {filteredPedidos.length} resultado{filteredPedidos.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table align-middle mb-0 pedidos-table">
              <thead>
                <tr>
                  <th>N° Pedido</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Entrega</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredPedidos.length > 0 ? (
                  filteredPedidos.map((pedido, idx) => (
                    <tr key={pedido.id} className="pedidos-table-row" style={{ animationDelay: `${idx * 40}ms` }}>
                      <td>
                        <span className="pedidos-order-id">{pedido.id}</span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="pedidos-avatar">
                            {pedido.cliente.charAt(0)}
                          </div>
                          <span className="fw-medium text-white">{pedido.cliente}</span>
                        </div>
                      </td>
                      <td className="text-secondary fs-13">{pedido.fecha}</td>
                      <td>
                        <span className="pedidos-total">${parseFloat(pedido.total).toFixed(2)}</span>
                      </td>
                      <td>
                        <span className={`pedidos-badge ${getBadgeClass(pedido.estado)}`}>
                          <i className={`bi ${getEstadoIcon(pedido.estado)} me-1`}></i>
                          {pedido.estado}
                        </span>
                      </td>
                      <td className="text-secondary fs-13">
                        <i className="bi bi-geo-alt me-1 text-theme-primary"></i>
                        {pedido.entrega}
                      </td>
                      <td className="text-end">
                        <button className="btn pedidos-action-btn pedidos-action-btn--edit me-2" title="Editar">
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button
                          className="btn pedidos-action-btn pedidos-action-btn--delete"
                          title="Eliminar"
                          onClick={() => handleDelete(pedido.id)}
                        >
                          <i className="bi bi-trash3"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      <div className="pedidos-empty-state">
                        <i className="bi bi-inbox fs-1 d-block mb-3 text-secondary opacity-50"></i>
                        <p className="text-secondary mb-0">No se encontraron pedidos.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* ── Modal Portal ────────────────────────────────────────── */}
      {showModal && (
        <PedidoModal
          formData={formData}
          onChange={handleInputChange}
          onSubmit={handleCrear}
          onClose={() => { setShowModal(false); setFormData(FORM_VACIO); }}
        />
      )}

    </div>
  );
}

export default Pedidos;
