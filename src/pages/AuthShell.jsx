import { BadgeCheck, Clock, ShieldCheck } from 'lucide-react';
import Logo from '../components/Logo.jsx';

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="auth">
      <aside className="auth-side">
        <Logo light />
        <div className="auth-side-copy">
          <h2>Cool comfort, without the hassle.</h2>
          <p>Book installation, repair or servicing in a minute and follow every step until your AC is running perfectly.</p>
          <ul>
            <li><BadgeCheck size={20} /> Certified, background-verified technicians</li>
            <li><Clock size={20} /> Live status tracking for every request</li>
            <li><ShieldCheck size={20} /> Split, Window and VRF systems covered</li>
          </ul>
        </div>
        <small>© {new Date().getFullYear()} Nazmi Climate Cool. All rights reserved.</small>
      </aside>
      <section className="auth-main">
        <div className="auth-card">
          <h1>{title}</h1>
          <p className="auth-sub">{subtitle}</p>
          {children}
          <p className="auth-foot">{footer}</p>
        </div>
      </section>
    </div>
  );
}
