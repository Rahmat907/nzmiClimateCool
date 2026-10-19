import { ArrowLeft, Check, Mail, MapPin, Phone, User, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { api } from '../../api.js';
import {
  AC_LABELS, Alert, Modal, SERVICE_ICONS, SERVICE_LABELS, Spinner, StatusBadge, fmtDateTime,
} from '../../components/ui.jsx';

const STEPS = [
  { key: 'OPEN', label: 'Requested' },
  { key: 'IN_PROGRESS', label: 'In progress' },
  { key: 'COMPLETED', label: 'Completed' },
];
const EVENT_LABEL = {
  OPEN: 'Request submitted',
  IN_PROGRESS: 'Work started',
  COMPLETED: 'Service completed',
  CANCELLED: 'Request cancelled',
};

export default function TicketDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.getTicket(id).then(setTicket).catch((e) => setError(e.message));
  }, [id]);

  const cancel = async () => {
    setBusy(true);
    try {
      setTicket(await api.cancelTicket(id));
      setConfirm(false);
    } catch (e) {
      setError(e.message);
      setConfirm(false);
    } finally {
      setBusy(false);
    }
  };

  if (!ticket && !error) return <Spinner />;
  if (!ticket) return (
    <>
      <Link to="/portal" className="back"><ArrowLeft size={16} /> Back to requests</Link>
      <Alert>{error}</Alert>
    </>
  );

  const Icon = SERVICE_ICONS[ticket.serviceType];
  const idx = STEPS.findIndex((s) => s.key === ticket.status);

  return (
    <>
      <Link to="/portal" className="back"><ArrowLeft size={16} /> Back to requests</Link>

      {location.state?.created && (
        <Alert type="success">
          <strong>Request submitted!</strong> Your ticket number is <strong>{ticket.ticketNumber}</strong>. We will contact you shortly.
        </Alert>
      )}
      {error && <Alert>{error}</Alert>}

      <div className="detail-head card">
        <span className="ticket-icon big"><Icon size={26} /></span>
        <div className="detail-title">
          <small>{ticket.ticketNumber}</small>
          <h1>{SERVICE_LABELS[ticket.serviceType]} · {AC_LABELS[ticket.acType]}</h1>
          <span className="muted">Raised on {fmtDateTime(ticket.createdAt)}</span>
        </div>
        <StatusBadge status={ticket.status} />
      </div>

      <div className="detail-grid">
        <div className="stack">
          <div className="card">
            <h3 className="card-title">Progress</h3>
            {ticket.status === 'CANCELLED' ? (
              <Alert type="error">This request was cancelled.</Alert>
            ) : (
              <ol className="steps">
                {STEPS.map((s, i) => (
                  <li key={s.key} className={i <= idx ? 'done' : ''}>
                    <span className="step-dot">{i < idx || ticket.status === 'COMPLETED' ? <Check size={14} /> : i + 1}</span>
                    <span>{s.label}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="card">
            <h3 className="card-title">Activity</h3>
            <ul className="timeline">
              {[...ticket.statusHistory].reverse().map((h, i) => (
                <li key={i}>
                  <span className={`tl-dot ${h.status}`} />
                  <div>
                    <strong>{EVENT_LABEL[h.status]}</strong>
                    <span>{fmtDateTime(h.at)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="stack">
          <div className="card">
            <h3 className="card-title">Request details</h3>
            <dl className="details">
              <div><dt><User size={15} /> Contact</dt><dd>{ticket.customerName}</dd></div>
              <div><dt><Phone size={15} /> Phone</dt><dd>{ticket.phone}</dd></div>
              {ticket.email && <div><dt><Mail size={15} /> Email</dt><dd>{ticket.email}</dd></div>}
              <div><dt><MapPin size={15} /> Address</dt><dd>{ticket.address}<br />PIN {ticket.pincode}</dd></div>
              {ticket.description && <div><dt>Issue</dt><dd>{ticket.description}</dd></div>}
            </dl>
          </div>

          {ticket.status === 'OPEN' && (
            <button className="btn btn-danger-outline btn-block" onClick={() => setConfirm(true)}>
              <XCircle size={18} /> Cancel this request
            </button>
          )}
        </div>
      </div>

      {confirm && (
        <Modal
          title="Cancel this request?"
          onClose={() => setConfirm(false)}
          actions={
            <>
              <button className="btn btn-outline" onClick={() => setConfirm(false)}>Keep request</button>
              <button className="btn btn-danger" onClick={cancel} disabled={busy}>{busy ? 'Cancelling…' : 'Yes, cancel'}</button>
            </>
          }
        >
          <p>{ticket.ticketNumber} will be cancelled and our team will not visit. This cannot be undone.</p>
        </Modal>
      )}
    </>
  );
}
