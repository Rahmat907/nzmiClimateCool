import { AlertCircle, CheckCircle2, Hammer, Loader2, Settings, Wrench, X } from 'lucide-react';
import { useEffect } from 'react';

export const SERVICE_LABELS = { INSTALLATION: 'Installation', REPAIR: 'Repair', SERVICE: 'Servicing' };
export const AC_LABELS = { SPLIT: 'Split AC', WINDOW: 'Window AC', VRF: 'VRF System' };
export const STATUS_LABELS = { OPEN: 'Open', IN_PROGRESS: 'In progress', COMPLETED: 'Completed', CANCELLED: 'Cancelled' };
export const SERVICE_ICONS = { INSTALLATION: Hammer, REPAIR: Wrench, SERVICE: Settings };

const opts = { day: 'numeric', month: 'short', year: 'numeric' };
export const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', opts);
export const fmtDateTime = (d) =>
  new Date(d).toLocaleString('en-IN', { ...opts, hour: 'numeric', minute: '2-digit' });

export function StatusBadge({ status }) {
  return (
    <span className={`badge ${status}`}>
      <i className="dot" />
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export function Spinner({ label = 'Loading…', full = false }) {
  return (
    <div className={full ? 'spinner full' : 'spinner'}>
      <Loader2 className="spin" size={22} />
      <span>{label}</span>
    </div>
  );
}

export function Field({ label, error, hint, optional, children }) {
  return (
    <label className="field">
      <span className="field-label">
        {label}
        {optional && <em> (optional)</em>}
      </span>
      {children}
      {error ? <span className="field-error">{error}</span> : hint ? <span className="hint">{hint}</span> : null}
    </label>
  );
}

export function Alert({ type = 'error', children }) {
  const Icon = type === 'success' ? CheckCircle2 : AlertCircle;
  return (
    <div className={`alert ${type}`} role={type === 'error' ? 'alert' : 'status'}>
      <Icon size={18} />
      <div>{children}</div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, children }) {
  return (
    <div className="empty-state">
      {Icon && <span className="empty-icon"><Icon size={26} /></span>}
      <h3>{title}</h3>
      {children && <p>{children}</p>}
    </div>
  );
}

export function Modal({ title, children, actions, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
        <h3>{title}</h3>
        <div className="modal-body">{children}</div>
        <div className="modal-actions">{actions}</div>
      </div>
    </div>
  );
}
