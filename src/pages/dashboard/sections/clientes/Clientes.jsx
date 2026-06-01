import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import './Clientes.css';

function Clientes({ clientes, setClientes }) {
  // Estado para controlar la visibilidad del Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados para el formulario de Nuevo Cliente
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [estado, setEstado] = useState('Activo');

  // Mensaje de éxito temporal
  const [successMessage, setSuccessMessage] = useState('');

  // Búsqueda y Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

  // Abrir modal y reiniciar formulario
  const handleOpenModal = () => {
    setNombre('');
    setEmail('');
    setTelefono('');
    setEstado('Activo');
    setIsModalOpen(true);
  };

  // Registrar un cliente y cerrar modal
  const handleAddClientSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim() || !email.trim() || !telefono.trim()) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    // Verificar si el correo ya existe en el estado de clientes
    const emailExists = clientes.some(c => c.email.toLowerCase() === email.trim().toLowerCase());
    if (emailExists) {
      alert('El correo electrónico ingresado ya está registrado.');
      return;
    }

    const nextId = clientes.length > 0 ? Math.max(...clientes.map(c => c.id)) + 1 : 1;
    const nuevoCliente = {
      id: nextId,
      nombre: nombre.trim(),
      email: email.trim(),
      telefono: telefono.trim(),
      estado: estado,
      fechaRegistro: 'Hoy, ' + new Date().toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })
    };

    setClientes([nuevoCliente, ...clientes]);
    setIsModalOpen(false);

    // Mostrar éxito
    setSuccessMessage(`¡Cliente "${nuevoCliente.nombre}" registrado correctamente!`);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  // Eliminar un cliente de la lista
  const handleDeleteClient = (clientId, clientName) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar permanentemente al cliente "${clientName}"?`)) {
      setClientes(clientes.filter(c => c.id !== clientId));
      setSuccessMessage(`Cliente "${clientName}" eliminado.`);
      setTimeout(() => setSuccessMessage(''), 4000);
    }
  };

  // Alternar el estado (Activo/Inactivo) de un cliente
  const toggleClientStatus = (clientId) => {
    const updatedClientes = clientes.map(c => {
      if (c.id === clientId) {
        const newStatus = c.estado === 'Activo' ? 'Inactivo' : 'Activo';
        return { ...c, estado: newStatus };
      }
      return c;
    });
    setClientes(updatedClientes);
  };

  // Filtrado de clientes
  const filteredClientes = clientes.filter(c => {
    const matchesSearch = c.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.telefono.includes(searchQuery);
    const matchesStatus = statusFilter === 'Todos' || c.estado === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container-fluid py-4 fade-in-up">
      
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-semibold text-white mb-1">Gestión de Clientes</h2>
          <p className="text-secondary mb-0">Controla el directorio de contactos y modifica sus estados.</p>
        </div>
      </div>

      {/* Alerta de éxito */}
      {successMessage && (
        <div className="alert alert-success bg-success bg-opacity-10 border border-success border-opacity-25 text-success alert-dismissible fade show mb-4 rounded-3 d-flex align-items-center gap-2" role="alert">
          <i className="bi bi-check-circle-fill fs-5"></i>
          <div>{successMessage}</div>
        </div>
      )}

      <div className="row g-4">
        
        {/* Columna: Listado de Clientes a Ancho Completo */}
        <div className="col-12">
          <div className="card bg-theme-card border-theme p-4 h-100 card-section-container">
            
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
              <h3 className="fs-5 fw-semibold text-white mb-0">Directorio de Clientes</h3>
              
              {/* Barra de Filtros e Input de Búsqueda */}
              <div className="d-flex flex-wrap align-items-center gap-2 w-100 w-sm-auto">
                <input 
                  type="text" 
                  className="form-control form-control-sm bg-theme-input border-theme text-white fs-13 py-1 px-2"
                  placeholder="Buscar por nombre o correo..." 
                  style={{ maxWidth: '220px' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                
                <select
                  className="form-select form-select-sm bg-theme-input border-theme text-white fs-13 py-1 cursor-pointer w-120px"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="Todos">Todos (Estado)</option>
                  <option value="Activo">🟢 Activo</option>
                  <option value="Inactivo">🔴 Inactivo</option>
                </select>

                {/* Botón para abrir modal de registro */}
                <button
                  type="button"
                  className="btn btn-primary-theme btn-sm d-flex align-items-center gap-2 fs-13 py-2 px-3 fw-medium"
                  onClick={handleOpenModal}
                >
                  <i className="bi bi-person-plus-fill"></i>
                  Agregar Cliente
                </button>
              </div>
            </div>
            
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Fecha Registro</th>
                    <th>Estado</th>
                    <th className="text-end">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClientes.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center text-secondary py-5">
                        <i className="bi bi-people-fill fs-1 mb-2 d-block"></i>
                        No se encontraron clientes registrados.
                      </td>
                    </tr>
                  ) : (
                    filteredClientes.map((cli) => (
                      <tr key={cli.id} className="table-row-hover">
                        <td className="text-white fw-semibold">{cli.nombre}</td>
                        <td className="text-secondary fs-13">{cli.email}</td>
                        <td className="text-white fs-13">{cli.telefono}</td>
                        <td className="text-secondary fs-13">{cli.fechaRegistro}</td>
                        <td>
                          <button
                            type="button"
                            className={`btn btn-sm border-0 fw-semibold rounded-pill px-3 fs-11 ${
                              cli.estado === 'Activo' ? 'bg-success text-white' : 'bg-secondary text-white'
                            }`}
                            onClick={() => toggleClientStatus(cli.id)}
                            title="Haz clic para alternar estado"
                          >
                            {cli.estado === 'Activo' ? '🟢 Activo' : '🔴 Inactivo'}
                          </button>
                        </td>
                        <td className="text-end">
                          <button 
                            className="btn btn-outline-danger border-0 p-1 rounded" 
                            title="Eliminar Cliente"
                            onClick={() => handleDeleteClient(cli.id, cli.nombre)}
                          >
                            <i className="bi bi-trash3 fs-5"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>

      </div>

      {/* Modal Flotante Centrado: Registrar Cliente */}
      {isModalOpen && createPortal(
        <div className="client-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="client-modal-card" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleAddClientSubmit}>
              {/* Cabecera */}
              <div className="client-modal-header text-white">
                <button 
                  type="button" 
                  className="btn-close btn-close-white position-absolute top-0 end-0 m-3" 
                  aria-label="Close"
                  onClick={() => setIsModalOpen(false)}
                />
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-person-plus-fill text-theme-sand fs-4"></i>
                  <h4 className="m-0 fw-bold fs-5">Registrar Nuevo Cliente</h4>
                </div>
              </div>

              {/* Cuerpo del Modal */}
              <div className="client-modal-body text-white d-flex flex-column gap-3">
                {/* Nombre */}
                <div>
                  <label className="text-secondary fw-semibold mb-1 fs-12">Nombre Completo *</label>
                  <input 
                    type="text" 
                    className="form-control bg-theme-input border-theme text-white" 
                    placeholder="Ej. Rosa Torres" 
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-secondary fw-semibold mb-1 fs-12">Correo Electrónico *</label>
                  <input 
                    type="email" 
                    className="form-control bg-theme-input border-theme text-white" 
                    placeholder="Ej. rosa@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label className="text-secondary fw-semibold mb-1 fs-12">Teléfono *</label>
                  <input 
                    type="tel" 
                    className="form-control bg-theme-input border-theme text-white" 
                    placeholder="Ej. 966332211" 
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    required
                  />
                </div>

                {/* Estado */}
                <div>
                  <label className="text-secondary fw-semibold mb-1 fs-12">Estado Inicial</label>
                  <select 
                    className="form-select bg-theme-input border-theme text-white" 
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                  >
                    <option value="Activo" className="bg-dark text-white">🟢 Activo</option>
                    <option value="Inactivo" className="bg-dark text-white">🔴 Inactivo</option>
                  </select>
                </div>
              </div>

              {/* Pie de Página */}
              <div className="client-modal-footer d-flex justify-content-end gap-2">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary fs-13 py-2 px-3 text-white border-secondary border-opacity-25"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary-theme fs-13 py-2 px-3 d-flex align-items-center gap-2"
                >
                  <i className="bi bi-check-circle"></i>
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}

export default Clientes;
