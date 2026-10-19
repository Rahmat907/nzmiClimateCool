import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import Logo from './Logo.jsx';

export default function PublicNavbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="pubnav">
      <div className="container pubnav-inner">
        <Logo />
        <nav className={open ? 'pubnav-links open' : 'pubnav-links'}>
          <a href="/#services" onClick={close}>Services</a>
          <a href="/#ac-types" onClick={close}>AC types</a>
          <a href="/#how" onClick={close}>How it works</a>
          <a href="/#why" onClick={close}>Why us</a>
          <div className="pubnav-actions">
            {user ? (
              <Link className="btn btn-primary" to={user.role === 'admin' ? '/admin' : '/portal'} onClick={close}>
                Go to {user.role === 'admin' ? 'dashboard' : 'my account'}
              </Link>
            ) : (
              <>
                <Link className="btn btn-outline" to="/login" onClick={close}>Log in</Link>
                <Link className="btn btn-primary" to="/register" onClick={close}>Get started</Link>
              </>
            )}
          </div>
        </nav>
        <button className="pubnav-toggle" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}
