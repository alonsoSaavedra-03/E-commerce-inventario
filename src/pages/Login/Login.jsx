import { useState } from "react";
import { IconBox, IconUsers, IconShoppingCart, IconChartBar, IconArrowRight, IconMail, IconLock } from "@tabler/icons-react";
import { useNavigate } from 'react-router-dom';
import { users } from '../../data/users';
import Swal from 'sweetalert2';
import "./Login.css";

const stats = [
  { icon: <IconBox size={28} />, value: "1240", label: "Productos activos" },
  { icon: <IconUsers size={28} />, value: "384", label: "Clientes registrados" },
  { icon: <IconShoppingCart size={28} />, value: "56", label: "Pedidos hoy" },
  { icon: <IconChartBar size={28} />, value: "98%", label: "Stock disponible" },
];

const descItems = [
  "Control de inventario en tiempo real",
  "Gestión de clientes y pedidos",
  "Reportes y estadísticas",
];

export default function Login() {
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [remember, setRemember]   = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused]   = useState(false);
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
  
    const found = users.find(
      u => u.email === email && u.password === password
    );
  
    if (found) {
      Swal.fire({
        icon: 'success',
        title: `¡Bienvenido!`,
        text: `Ingresando como ${found.rol}...`,
        timer: 1500,
        showConfirmButton: false,
        background: '#272622',
        color: '#fbfaf8',
        iconColor: '#13a37f',
      }).then(() => {
        localStorage.setItem('user', JSON.stringify(found));
        navigate('/dashboard');
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Credenciales incorrectas',
        text: 'El correo o contraseña no son válidos.',
        confirmButtonText: 'Intentar de nuevo',
        background: '#272622',
        color: '#fbfaf8',
        iconColor: '#e74c3c',
        confirmButtonColor: '#13a37f',
      });
    }
  };

  return (
    <div className="login-wrapper">

      {/* ── Panel izquierdo ── */}
      <div className="login-left">
        <div className="login-left-circle1" />
        <div className="login-left-circle2" />

        {/* Logo */}
        <div className="login-brand">
          <div className="login-brand-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect x="3" y="17" width="5" height="8" rx="1.5" fill="var(--color-primary)" />
              <rect x="11" y="11" width="5" height="14" rx="1.5" fill="var(--color-primary)" />
              <rect x="19" y="5" width="5" height="20" rx="1.5" fill="var(--color-primary)" />
              <polyline points="5.5,15 13.5,9 21.5,3 26,0" stroke="var(--bg-sidebar)" strokeWidth="2" strokeLinecap="round" fill="none" />
              <circle cx="26" cy="0" r="2" fill="var(--color-primary)" />
            </svg>
          </div>
          <div>
            <div className="login-brand-name">Stock Flow</div>
            <div className="login-brand-sub">INVENTARIOS</div>
          </div>
        </div>

        {/* Stats */}
        <div className="login-stats">
          {stats.map((s, i) => (
            <div className="login-stat-card" key={i}>
              {s.icon}
              <div className="login-stat-num">{s.value}</div>
              <div className="login-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Descripción */}
        <div className="login-desc">
          <div className="login-desc-title">
            Tu panel de control para productos, clientes y pedidos en un solo lugar.
          </div>
          {descItems.map((item, i) => (
            <div className="login-desc-item" key={i}>
              <span className="login-desc-dot" />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* ── Panel derecho ── */}
      <div className="login-right">
        <div className="login-form-box">
          <h1 className="login-title">Iniciar sesión</h1>
          <p className="login-subtitle">Ingresa tus credenciales para continuar</p>

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="login-field">
              <label className="login-label">Correo electrónico:</label>
              <div className={`login-input-wrap ${emailFocused ? "focused" : ""}`}>
                <IconMail size={20} />
                <input
                  type="email"
                  placeholder="Correo@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="login-field">
              <label className="login-label">Contraseña:</label>
              <div className={`login-input-wrap ${passFocused ? "focused" : ""}`}>
                <IconLock size={20} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPassFocused(true)}
                  onBlur={() => setPassFocused(false)}
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Recordarme */}
            <div className="login-remember" onClick={() => setRemember(!remember)}>
              <div className={`login-checkbox ${remember ? "checked" : ""}`}>
                {remember && <span className="login-checkbox-tick">✓</span>}
              </div>
              <span className="login-remember-label">Recordarme</span>
            </div>

            {/* Botón */}
            <button type="submit" className="login-btn">
              Ingrese al Sistema <IconArrowRight size={20} />
            </button>

          </form>

          <p className="login-help">
            ¿Problemas para ingresar? Contacta al administrador del sistema.
          </p>
        </div>
      </div>

    </div>
  );
}