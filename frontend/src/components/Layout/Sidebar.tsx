import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  HiOutlineSquares2X2,
  HiOutlineCube,
  HiOutlineTag,
  HiOutlineTruck,
  HiOutlineArrowsRightLeft,
  HiArrowRightOnRectangle,
} from 'react-icons/hi2';
import './Sidebar.css';

const navItems = [
  { path: '/', label: 'Dashboard', icon: <HiOutlineSquares2X2 /> },
  { path: '/produtos', label: 'Produtos', icon: <HiOutlineCube /> },
  { path: '/categorias', label: 'Categorias', icon: <HiOutlineTag /> },
  { path: '/fornecedores', label: 'Fornecedores', icon: <HiOutlineTruck /> },
  { path: '/transacoes', label: 'Transações', icon: <HiOutlineArrowsRightLeft /> },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">📦</div>
        <div className="brand-text">
          <h1>Inventário</h1>
          <span>Sistema de Gestão</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{user?.nome?.charAt(0).toUpperCase()}</div>
          <div className="user-details">
            <span className="user-name">{user?.nome}</span>
            <span className="user-email">{user?.email}</span>
          </div>
        </div>
        <button className="logout-btn" onClick={logout} title="Sair">
          <HiArrowRightOnRectangle />
        </button>
      </div>
    </aside>
  );
}
