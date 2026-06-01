import React, { useState } from 'react';
import './Clientes.css';

function Clientes({ clientes, setClientes }) {
  // Mensaje de éxito temporal
  const [successMessage, setSuccessMessage] = useState('');

  // Búsqueda y Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

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
              
              {/* Barra de Filtros */}
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

    </div>
  );
}

export default Clientes;
