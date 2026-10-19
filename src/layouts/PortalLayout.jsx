import { LayoutDashboard, LogOut, Plus } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import Logo from '../components/Logo.jsx';

export default function PortalLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const initials = user.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="portal">
      <header className="topbar">
        <div className="container topbar-inner">
          <Logo to="/portal" />
          <nav className="topbar-nav">
            <NavLink to="/portal" end><LayoutDashboard size={16} /> My requests</NavLink>
            <NavLink to="/portal/new"><Plus size={16} /> Book a service</NavLink>
          </nav>
          <div className="user-chip">
            <span className="avatar">{initials}</span>
            <div className="user-meta">
              <strong>{user.name}</strong>
              <span>{user.phone}</span>
            </div>
            <button className="icon-btn" title="Log out" onClick={() => { logout(); navigate('/'); }}>
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>
      <main className="container portal-main"><Outlet /></main>
    </div>
  );
}
