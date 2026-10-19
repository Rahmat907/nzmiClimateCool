import { ClipboardList, LogOut } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import Logo from '../components/Logo.jsx';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="admin">
      <aside className="sidebar">
        <Logo to="/admin" light />
        <span className="side-label">Manage</span>
        <nav>
          <NavLink to="/admin" end><ClipboardList size={18} /> Service tickets</NavLink>
        </nav>
        <div className="side-foot">
          <div>
            <strong>{user.name}</strong>
            <span>Administrator</span>
          </div>
          <button className="icon-btn light" title="Log out" onClick={() => { logout(); navigate('/'); }}>
            <LogOut size={18} />
          </button>
        </div>
      </aside>
      <main className="admin-main"><Outlet /></main>
    </div>
  );
}
