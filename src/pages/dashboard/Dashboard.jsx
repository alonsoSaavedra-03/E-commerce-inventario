import React, { useState } from 'react';
import './Dashboard.css';
import Pedidos from './sections/pedidos/Pedidos';
import Clientes from './sections/clientes/Clientes';
import Configuracion from './sections/configuracion/Configuracion';
import Productos from './sections/productos/Productos';


function Dashboard() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Estados de datos compartidos
  const [productos, setProductos] = useState([
  { id: 1, nproducto: 'P001', nombre: 'Teclado Mecánico RGB', precio: 45, categoria: 'Electrónicos', estado: 'Disponible' },
  { id: 2, nproducto: 'P002', nombre: 'Mouse Ergonómico Inalámbrico', precio: 25, categoria: 'Electrónicos', estado: 'Disponible' },
  { id: 3, nproducto: 'P003', nombre: 'Monitor Gamer 27" FHD', precio: 180, categoria: 'Electrónicos', estado: 'Agotado' },
  { id: 4, nproducto: 'P004', nombre: 'Auriculares Bluetooth Pro', precio: 60, categoria: 'Accesorios', estado: 'Disponible' },
  { id: 5, nproducto: 'P005', nombre: 'Cable HDMI 4K 2m', precio: 8, categoria: 'Accesorios', estado: 'Disponible' }
]);

  const [movimientos, setMovimientos] = useState([
    { id: 1, sku: 'PROD-0041', producto: 'Teclado Mecánico RGB', tipo: 'Entrada', cantidad: '+50 uds', fecha: 'Hoy, 14:32', responsable: 'Carlos M.', badgeClass: 'bg-success text-white' },
    { id: 2, sku: 'PROD-0108', producto: 'Mouse Ergonómico Inalámbrico', tipo: 'Salida', cantidad: '-15 uds', fecha: 'Hoy, 12:15', responsable: 'Sandra R.', badgeClass: 'bg-warning text-dark' },
    { id: 3, sku: 'PROD-0254', producto: 'Monitor Gamer 27\'\' FHD', tipo: 'Salida', cantidad: '-5 uds', fecha: 'Ayer, 18:40', responsable: 'Sandra R.', badgeClass: 'bg-warning text-dark' },
    { id: 4, sku: 'PROD-0887', producto: 'Auriculares Bluetooth Pro', tipo: 'Entrada', cantidad: '+100 uds', fecha: 'Ayer, 10:20', responsable: 'Carlos M.', badgeClass: 'bg-success text-white' },
    { id: 5, sku: 'PROD-0021', producto: 'Cable HDMI 4K 2m', tipo: 'Ajuste', cantidad: '-2 uds (dañado)', fecha: '28 May, 16:10', responsable: 'Admin', badgeClass: 'bg-danger text-white' }
  ]);

  const [pedidos, setPedidos] = useState([
    { id: 1, codigo: 'PED-1024', cliente: 'Juan Pérez', metodo: 'Tarjeta', estado: 'Entregado', fecha: 'Hoy, 15:30', total: 115.00, items: '2x Teclado, 1x Mouse', itemsList: [{ productId: 1, quantity: 2 }, { productId: 2, quantity: 1 }] },
    { id: 2, codigo: 'PED-1023', cliente: 'María Gómez', metodo: 'Efectivo', estado: 'Pendiente', fecha: 'Hoy, 11:15', total: 45.00, items: '1x Teclado', itemsList: [{ productId: 1, quantity: 1 }] }
  ]);

  const [clientes, setClientes] = useState([
    { id: 1, nombre: 'Juan Pérez', email: 'juan@email.com', telefono: '987654321', estado: 'Activo', fechaRegistro: '12 May, 2026' },
    { id: 2, nombre: 'María Gómez', email: 'maria@email.com', telefono: '912345678', estado: 'Activo', fechaRegistro: '20 May, 2026' },
    { id: 3, nombre: 'Carlos Mendoza', email: 'carlos@email.com', telefono: '955667788', estado: 'Inactivo', fechaRegistro: '28 May, 2026' }
  ]);

  // Función para registrar un nuevo pedido y descontar stock
  const handleCrearPedido = (nuevoPedido, cartItems) => {
    setPedidos([nuevoPedido, ...pedidos]);

    setProductos(prevProducts =>
      prevProducts.map(p => {
        const cartItem = cartItems.find(item => item.product.id === p.id);
        if (cartItem) {
          return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
        }
        return p;
      })
    );

    const nuevosMovimientos = cartItems.map((item, idx) => ({
      id: Date.now() + idx,
      sku: item.product.sku,
      producto: item.product.name,
      tipo: 'Salida',
      amount: item.quantity,
      cantidad: `-${item.quantity} uds`,
      fecha: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      responsable: 'Admin',
      badgeClass: 'bg-warning text-dark'
    }));

    setMovimientos(prev => [...nuevosMovimientos, ...prev]);
  };

  // Función para cancelar un pedido y devolver el stock
  const handleCancelarPedido = (orderId, orderCode, itemsList) => {
    setPedidos(prev => prev.filter(p => p.id !== orderId));

    if (itemsList && itemsList.length > 0) {
      setProductos(prevProducts =>
        prevProducts.map(p => {
          const item = itemsList.find(i => i.productId === p.id);
          if (item) {
            return { ...p, stock: p.stock + item.quantity };
          }
          return p;
        })
      );

      const nuevosMovimientos = itemsList.map((item, idx) => {
        const prod = productos.find(p => p.id === item.productId);
        return {
          id: Date.now() + idx,
          sku: prod ? prod.sku : 'PROD-xxxx',
          producto: prod ? prod.name : 'Producto',
          tipo: 'Entrada',
          cantidad: `+${item.quantity} uds (Canc.)`,
          fecha: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          responsable: 'Admin',
          badgeClass: 'bg-success text-white'
        };
      });

      setMovimientos(prev => [...nuevosMovimientos, ...prev]);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'productos':
        return(
          <Productos 
            productos={productos} 
            setProductos={setProductos}
            
          />
          );
      case 'pedidos':
        return (
          <Pedidos 
            pedidos={pedidos} 
            setPedidos={setPedidos} 
            productos={productos}
            onCrearPedido={handleCrearPedido}
            onCancelarPedido={handleCancelarPedido}
          />
        );
      case 'clientes':
        return (
          <Clientes 
            clientes={clientes} 
            setClientes={setClientes} 
          />
        );
      case 'configuracion':
        return <Configuracion />;
      case 'inicio':
      default:
        return (
          <div className="page-container container-fluid py-4 fade-in-up">
            
            {/* Banner de Bienvenida Premium */}
            <div className="welcome-banner-premium p-4 p-md-5 mb-4 text-white rounded">
              <div className="col-12 col-md-9 p-0 position-relative">
                <span className="badge bg-white bg-opacity-25 mb-3 text-uppercase fw-semibold" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                  Estado del Sistema: Óptimo
                </span>
                <h2 className="welcome-banner-title mb-2">¡Hola, Administrador!</h2>
                <p className="lead mb-0 opacity-75" style={{ fontSize: '15px', maxWidth: '600px' }}>
                  Tu panel de control para productos, clientes y pedidos en un solo lugar. 
                  Controla existencias, gestiona solicitudes y revisa estadísticas en tiempo real.
                </p>
              </div>
            </div>

            {/* Grid de Estadísticas - Paleta de colores del login */}
            <div className="row g-4 mb-4">
              
              {/* Productos Activos */}
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="card stat-card-premium p-4 h-100 text-white border-0">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="stat-card-label text-theme-sand text-uppercase">Productos activos</span>
                    <div className="stat-icon-wrapper text-theme-primary">
                      <i className="bi bi-box-seam fs-5"></i>
                    </div>
                  </div>
                  <span className="stat-card-value text-theme-gold mb-2 d-block">
                    {productos.filter(p => p.stock > 0).length} / {productos.length}
                  </span>
                  <div className="d-flex align-items-center gap-1" style={{ fontSize: '12px' }}>
                    <span className="text-success fw-bold">100%</span>
                    <span className="text-theme-sand opacity-75">con stock activo</span>
                  </div>
                </div>
              </div>

              {/* Clientes Registrados */}
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="card stat-card-premium p-4 h-100 text-white border-0">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="stat-card-label text-theme-sand text-uppercase">Clientes registrados</span>
                    <div className="stat-icon-wrapper text-theme-primary">
                      <i className="bi bi-people fs-5"></i>
                    </div>
                  </div>
                  <span className="stat-card-value text-theme-gold mb-2 d-block">
                    {clientes.length}
                  </span>
                  <div className="d-flex align-items-center gap-1" style={{ fontSize: '12px' }}>
                    <span className="text-success fw-bold">↑ Total</span>
                    <span className="text-theme-sand opacity-75">en base de datos</span>
                  </div>
                </div>
              </div>

              {/* Pedidos Hoy */}
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="card stat-card-premium p-4 h-100 text-white border-0">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="stat-card-label text-theme-sand text-uppercase">Pedidos hoy</span>
                    <div className="stat-icon-wrapper text-theme-primary">
                      <i className="bi bi-cart3 fs-5"></i>
                    </div>
                  </div>
                  <span className="stat-card-value text-theme-gold mb-2 d-block">{pedidos.length}</span>
                  <div className="d-flex align-items-center gap-1" style={{ fontSize: '12px' }}>
                    <span className="text-success fw-bold">↑ Actual</span>
                    <span className="text-theme-sand opacity-75">en tiempo real</span>
                  </div>
                </div>
              </div>

              {/* Stock Disponible */}
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="card stat-card-premium p-4 h-100 text-white border-0">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="stat-card-label text-theme-sand text-uppercase">Stock disponible</span>
                    <div className="stat-icon-wrapper text-theme-primary">
                      <i className="bi bi-shield-check fs-5"></i>
                    </div>
                  </div>
                  <span className="stat-card-value text-theme-gold mb-2 d-block">
                    {productos.reduce((sum, p) => sum + p.stock, 0)} uds
                  </span>
                  <div className="d-flex align-items-center gap-1" style={{ fontSize: '12px' }}>
                    <span className="text-success fw-bold">Óptimo</span>
                    <span className="text-theme-sand opacity-75">en inventario</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Layout en columnas (Tabla y Paneles Auxiliares) */}
            <div className="row g-4">
              
              {/* Columna Izquierda: Tabla de movimientos */}
              <div className="col-12 col-lg-8">
                <div className="card bg-theme-card border-theme p-4 h-100 card-section-container">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="fs-5 fw-semibold text-white mb-0">Movimientos Recientes de Inventario</h3>
                    <i className="bi bi-clock-history text-secondary fs-5"></i>
                  </div>
                  <div className="table-responsive">
                    <table className="table align-middle mb-0">
                      <thead>
                        <tr>
                          <th>SKU</th>
                          <th>Producto</th>
                          <th>Movimiento</th>
                          <th>Cant.</th>
                          <th>Fecha</th>
                          <th>Responsable</th>
                        </tr>
                      </thead>
                      <tbody>
                        {movimientos.map((mov) => (
                          <tr key={mov.id} className="table-row-hover">
                            <td className="text-theme-sand font-monospace" style={{ fontSize: '13px' }}>{mov.sku}</td>
                            <td className="fw-medium text-white">{mov.producto}</td>
                            <td>
                              <span className={`badge badge-pill-modern ${mov.badgeClass}`}>
                                {mov.tipo}
                              </span>
                            </td>
                            <td className="fw-semibold text-white">{mov.cantidad}</td>
                            <td className="text-secondary" style={{ fontSize: '13px' }}>{mov.fecha}</td>
                            <td className="text-white">{mov.responsable}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Acciones y Alertas */}
              <div className="col-12 col-lg-4">
                <div className="d-flex flex-column gap-4">
                  
                  {/* Accesos Rápidos */}
                  <div className="card bg-theme-card border-theme p-4 card-section-container">
                    <h3 className="fs-5 fw-semibold text-white mb-3">Acciones Rápidas</h3>
                    <div className="d-flex flex-column gap-2">
                      <button className="btn btn-outline-light border-0 quick-action-btn-premium text-start p-3 d-flex align-items-center gap-3 w-100" onClick={() => alert('Función de registrar entrada/salida en desarrollo.')}>
                        <span className="quick-action-icon-box d-flex align-items-center justify-content-center">
                          <i className="bi bi-box-seam"></i>
                        </span>
                        <span className="fw-medium text-white">Registrar Entrada / Salida</span>
                      </button>
                      <button className="btn btn-outline-light border-0 quick-action-btn-premium text-start p-3 d-flex align-items-center gap-3 w-100" onClick={() => setActiveTab('pedidos')}>
                        <span className="quick-action-icon-box d-flex align-items-center justify-content-center">
                          <i className="bi bi-cart3"></i>
                        </span>
                        <span className="fw-medium text-white">Generar Nuevo Pedido</span>
                      </button>
                      <button className="btn btn-outline-light border-0 quick-action-btn-premium text-start p-3 d-flex align-items-center gap-3 w-100" onClick={() => alert('Exportando reporte PDF del estado actual del inventario...')}>
                        <span className="quick-action-icon-box d-flex align-items-center justify-content-center">
                          <i className="bi bi-file-earmark-pdf"></i>
                        </span>
                        <span className="fw-medium text-white">Exportar Reporte PDF</span>
                      </button>
                    </div>
                  </div>

                  {/* Stock Crítico */}
                  <div className="card bg-theme-card border-theme p-4 card-section-container">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h3 className="fs-5 fw-semibold text-danger mb-0">Stock Crítico</h3>
                      <i className="bi bi-exclamation-triangle-fill text-danger fs-5"></i>
                    </div>
                    <div className="d-flex flex-column gap-2">
                      {productos.filter(p => p.stock <= 5).length === 0 ? (
                        <div className="text-center py-4 text-secondary fs-13">
                          <i className="bi bi-check-circle-fill text-success fs-5 d-block mb-2"></i>
                          Todo el stock está en niveles óptimos.
                        </div>
                      ) : (
                        productos.filter(p => p.stock <= 5).map((alertItem) => (
                          <div 
                            key={alertItem.id} 
                            className="stock-alert-item-premium d-flex align-items-center justify-content-between p-3 border-0"
                          >
                            <div className="d-flex flex-column">
                              <span className="fw-medium text-white fs-14">{alertItem.name}</span>
                              <span className="text-secondary fs-11">{alertItem.sku}</span>
                            </div>
                            <span className="badge bg-danger bg-opacity-75 text-white fw-bold px-2 py-1 fs-12">
                              {alertItem.stock} uds
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        );
    }
  };

  const getHeaderTitle = () => {
    switch (activeTab) {

      case 'productos':
        return { main: 'Gestión de Productos', sub: 'Listado de productos ' };
      case 'pedidos':
        return { main: 'Gestión de Pedidos', sub: 'Listado de ventas y estados de entrega' };
      case 'clientes':
        return { main: 'Gestión de Clientes', sub: 'Control de clientes registrados y estados de cuenta' };
      case 'configuracion':
        return { main: 'Configuración', sub: 'Ajustes del sistema y credenciales de XAMPP' };
      case 'inicio':
      default:
        return { main: 'Panel de Resumen', sub: 'Control de inventario en tiempo real para tu negocio' };
    }
  };

  const headerInfo = getHeaderTitle();

  return (
    <div className="dashboard-container d-flex bg-theme-main">
      
      {/* Backdrop de fondo oscuro en Móviles cuando el Sidebar está abierto */}
      {isSidebarOpen && (
        <div 
          className="d-lg-none position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50"
          style={{ zIndex: '1040' }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Barra Lateral (Sidebar) - Adaptable a Escritorio y Móvil */}
      <aside 
        className={`dashboard-sidebar border-end border-theme-light p-4 text-white d-flex flex-column overflow-hidden ${
          isSidebarOpen ? 'sidebar-mobile-open' : 'd-none d-lg-flex'
        }`}
      >
        
        {/* Decoraciones de Círculos en el Sidebar (Estilo Login) */}
        <div className="position-absolute rounded-circle sidebar-circle-1" />
        <div className="position-absolute rounded-circle sidebar-circle-2" />

        {/* Logotipo */}
        <div className="d-flex align-items-center gap-3 pb-4 mb-4 border-bottom border-theme-light position-relative sidebar-logo-container">
          <div className="rounded-3 d-flex align-items-center justify-content-center text-theme-sand sidebar-logo-box">
            <i className="bi bi-graph-up-arrow fs-5"></i>
          </div>
          <div className="d-flex flex-column">
            <span className="fw-bold tracking-wide lh-sm" style={{ fontSize: '18px' }}>Stock Flow</span>
            <span className="text-theme-sand fw-semibold tracking-wider" style={{ fontSize: '10px', letterSpacing: '1.5px' }}>Inventarios</span>
          </div>
        </div>

        {/* Menú de Navegación */}
        <nav className="nav flex-column gap-2 flex-grow-1 position-relative" style={{ zIndex: 10 }}>
          <button 
            className={`btn border-0 text-start d-flex align-items-center gap-3 px-3 py-2 text-white w-100 nav-item-btn ${activeTab === 'inicio' ? 'active' : ''}`}
            onClick={() => { setActiveTab('inicio'); setIsSidebarOpen(false); }}
          >
            <i className="bi bi-grid-fill fs-5"></i>
            <span>Inicio</span>
          </button>
          <button 
            className={`btn border-0 text-start d-flex align-items-center gap-3 px-3 py-2 text-white w-100 nav-item-btn ${activeTab === 'pedidos' ? 'active' : ''}`}
            onClick={() => { setActiveTab('productos'); setIsSidebarOpen(false); }}
          >
            <i className="bi bi-box-seam fs-5"></i>
            <span>Productos</span>
          </button>

          <button 
            className={`btn border-0 text-start d-flex align-items-center gap-3 px-3 py-2 text-white w-100 nav-item-btn ${activeTab === 'pedidos' ? 'active' : ''}`}
            onClick={() => { setActiveTab('pedidos'); setIsSidebarOpen(false); }}
          >
            <i className="bi bi-cart3 fs-5"></i>
            <span>Pedidos</span>
          </button>

          <button 
            className={`btn border-0 text-start d-flex align-items-center gap-3 px-3 py-2 text-white w-100 nav-item-btn ${activeTab === 'clientes' ? 'active' : ''}`}
            onClick={() => { setActiveTab('clientes'); setIsSidebarOpen(false); }}
          >
            <i className="bi bi-people fs-5"></i>
            <span>Clientes</span>
          </button>

          <button 
            className={`btn border-0 text-start d-flex align-items-center gap-3 px-3 py-2 text-white w-100 nav-item-btn ${activeTab === 'configuracion' ? 'active' : ''}`}
            onClick={() => { setActiveTab('configuracion'); setIsSidebarOpen(false); }}
          >
            <i className="bi bi-gear fs-5"></i>
            <span>Configuración</span>
          </button>
        </nav>

        {/* Info del Administrador al pie */}
        <div className="d-flex align-items-center gap-3 pt-3 mt-auto border-top border-theme-light position-relative sidebar-footer-user">
          <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white border border-2 border-theme-light user-avatar-circle">
            AD
          </div>
          <div className="d-flex flex-column min-w-0">
            <span className="fw-semibold text-white text-truncate" style={{ fontSize: '14px' }}>Administrador</span>
            <span className="text-theme-sand text-truncate" style={{ fontSize: '11px' }}>admin@empresa.com</span>
          </div>
        </div>

      </aside>

      {/* Panel Principal de Contenido */}
      <div className="main-wrapper">
        
        {/* Cabecera / Navbar */}
        <header className="navbar navbar-expand bg-theme-card border-bottom border-theme px-4 py-3 dashboard-navbar">
          <div className="container-fluid p-0 d-flex justify-content-between align-items-center">
            
            {/* Izquierda: Botón hamburguesa (móvil) y Títulos */}
            <div className="d-flex align-items-center">
              <button 
                className="btn btn-outline-secondary border-0 text-white d-lg-none me-3 px-2 py-1"
                onClick={() => setIsSidebarOpen(true)}
              >
                <i className="bi bi-list fs-3"></i>
              </button>
              <div className="d-flex flex-column">
                <h1 className="h4 fw-bold text-white mb-0">{headerInfo.main}</h1>
                <span className="text-secondary d-none d-sm-inline" style={{ fontSize: '13px' }}>{headerInfo.sub}</span>
              </div>
            </div>
            
            {/* Derecha: Acciones */}
            <div className="d-flex align-items-center gap-3">
              
              {/* Buscador (oculto en pantallas pequeñas) */}
              <div className="bg-theme-input border-theme rounded px-2 py-1 d-none d-md-flex align-items-center navbar-search-box">
                <i className="bi bi-search text-secondary me-2"></i>
                <input 
                  type="text" 
                  placeholder="Buscar..." 
                  className="bg-transparent border-0 text-white w-100" 
                  style={{ outline: 'none', fontSize: '14px' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Notificaciones */}
              <button 
                className="btn btn-link text-secondary p-2 position-relative border-0 navbar-notification-btn rounded" 
                title="Notificaciones" 
                onClick={() => alert('No tienes notificaciones pendientes.')}
              >
                <i className="bi bi-bell text-secondary fs-5"></i>
                <span className="position-absolute top-1 start-50 translate-middle-y rounded-circle bg-danger border border-2 border-theme-card" style={{ width: '8px', height: '8px' }}></span>
              </button>

              {/* Botón Salir */}
              <button 
                className="btn border border-danger border-opacity-50 text-danger px-3 py-2 d-flex align-items-center gap-2 navbar-logout-btn-premium" 
                style={{ fontSize: '13px', backgroundColor: 'rgba(220, 53, 69, 0.15)' }} 
                onClick={() => alert('Cerrando sesión...')}
              >
                <i className="bi bi-box-arrow-right"></i>
                <span className="d-none d-sm-inline">Salir</span>
              </button>

            </div>

          </div>
        </header>

        {/* Sección Activa */}
        <main className="main-content-scrollable">
          {renderContent()}
        </main>

      </div>

    </div>
  );
}

export default Dashboard;
