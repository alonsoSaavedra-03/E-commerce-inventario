import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import './Productos.css';

function Productos({ productos, setProductos }) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);

  // Formulario
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [estado, setEstado] = useState('Disponible');

  const [searchQuery, setSearchQuery] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleOpenModal = () => {
    setNombre('');
    setPrecio('');
    setCategoria('');
    setEstado('Disponible');
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  // AGREGAR PRODUCTO
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre || !precio || !categoria) {
      alert('Completa todos los campos');
      return;
    }

    if (isEditMode) {
      // EDITAR
      const updated = productos.map(p =>
        p.id === productoEditando.id
          ? { ...p, nombre, precio, categoria, estado }
          : p
      );
      setProductos(updated);
      setSuccessMessage('Producto actualizado');
    } else {
      // NUEVO
      const newProducto = {
        id: Date.now(),
        nombre,
        precio,
        categoria,
        estado
      };
      setProductos([newProducto, ...productos]);
      setSuccessMessage('Producto agregado');
    }

    setIsModalOpen(false);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // EDITAR
  const handleEdit = (producto) => {
    setProductoEditando(producto);
    setNombre(producto.nombre);
    setPrecio(producto.precio);
    setCategoria(producto.categoria);
    setEstado(producto.estado);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // ELIMINAR
  const handleDelete = (id, nombre) => {
    if (window.confirm(`¿Seguro que quieres eliminar el producto "${nombre}"?`)) {
      setProductos(productos.filter(p => p.id !== id));
    }
  };

  // FILTRO
  const filteredProductos = productos.filter(p =>
    p.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container-fluid py-4 fade-in-up">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-white">Productos</h2>

        <button className="btn btn-primary-theme" onClick={handleOpenModal}>
          ➕ Agregar Producto
        </button>
      </div>

      {/* BUSCADOR */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control bg-theme-input text-white"
          placeholder="Buscar productos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* MENSAJE */}
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      {/* TABLA */}
      <div className="card bg-theme-card p-4">
        <h5 className="text-white mb-3">Directorio de Productos</h5>

        <table className="table">
          <thead>
            <tr>
              <th>N°</th>
              <th>Producto</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filteredProductos.map((p, index) => (
              <tr key={p.id}>
                <td>{index + 1}</td>
                <td>{p.nombre}</td>
                <td>S/ {p.precio}</td>
                <td>{p.categoria}</td>

                <td>
                  <span className={p.estado === 'Disponible' ? 'badge bg-success' : 'badge bg-danger'}>
                    {p.estado}
                  </span>
                </td>

                <td>
                  <button onClick={() => handleEdit(p)} className="btn-icon">
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(p.id, p.nombre)} className="btn-icon">
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && createPortal(
        <div className="producto-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="producto-modal-card" onClick={(e) => e.stopPropagation()}>

            <form onSubmit={handleSubmit}>
              <div className="producto-modal-header">
                <h5>{isEditMode ? 'Editar Producto' : 'Agregar Producto'}</h5>
              </div>

              <div className="producto-modal-body">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />

                <input
                  type="number"
                  placeholder="Precio"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Categoría"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                />

                <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                  <option>Disponible</option>
                  <option>Agotado</option>
                </select>
              </div>

              <div className="producto-modal-footer">
                <button type="submit">Guardar</button>
              </div>
            </form>

          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default Productos;