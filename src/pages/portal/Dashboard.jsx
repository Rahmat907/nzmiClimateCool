import { CalendarClock, CheckCircle2, ChevronRight, ClipboardList, MapPin, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api.js';
import { useAuth } from '../../auth/AuthContext.jsx';
import {
  AC_LABELS, Alert, EmptyState, SERVICE_ICONS, SERVICE_LABELS, Spinner, StatusBadge, fmtDate,
} from '../../components/ui.jsx';

const FILTERS = [
  ['ALL', 'All'], ['OPEN', 'Open'], ['IN_PROGRESS', 'In progress'], ['COMPLETED', 'Completed'], ['CANCELLED', 'Cancelled'],
];

export default function Dashboard() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    api.myTickets().then(setTickets).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const counts = useMemo(() => {
    const c = { ALL: tickets.length, OPEN: 0, IN_PROGRESS: 0, COMPLETED: 0, CANCELLED: 0 };
    tickets.forEach((t) => { c[t.status] += 1; });
    return c;
  }, [tickets]);

  const shown = filter === 'ALL' ? tickets : tickets.filter((t) => t.status === filter);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Hello, {user.name.split(' ')[0]} 👋</h1>
          <p>Manage your AC service requests in one place.</p>
        </div>
        <Link to="/portal/new" className="btn btn-primary btn-lg"><Plus size={18} /> Book a service</Link>
      </div>

      <div className="summary">
        <div className="summary-card">
          <span className="summary-icon blue"><ClipboardList size={20} /></span>
          <div><strong>{counts.ALL}</strong><span>Total requests</span></div>
        </div>
        <div className="summary-card">
          <span className="summary-icon amber"><CalendarClock size={20} /></span>
          <div><strong>{counts.OPEN + counts.IN_PROGRESS}</strong><span>Active</span></div>
        </div>
        <div className="summary-card">
          <span className="summary-icon green"><CheckCircle2 size={20} /></span>
          <div><strong>{counts.COMPLETED}</strong><span>Completed</span></div>
        </div>
      </div>

      {error && <Alert>{error}</Alert>}

      <div className="tabs" role="tablist">
        {FILTERS.map(([key, label]) => (
          <button key={key} role="tab" aria-selected={filter === key} className={filter === key ? 'tab active' : 'tab'} onClick={() => setFilter(key)}>
            {label} <span className="tab-count">{counts[key]}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner />
      ) : shown.length === 0 ? (
        <div className="card">
          <EmptyState icon={ClipboardList} title={tickets.length ? 'No requests in this view' : 'No service requests yet'}>
            {tickets.length ? 'Try another filter.' : 'Book your first AC installation, repair or service in a minute.'}
          </EmptyState>
          {!tickets.length && (
            <div className="center"><Link to="/portal/new" className="btn btn-primary"><Plus size={18} /> Book a service</Link></div>
          )}
        </div>
      ) : (
        <div className="ticket-list">
          {shown.map((t) => {
            const Icon = SERVICE_ICONS[t.serviceType];
            return (
              <Link to={`/portal/tickets/${t._id}`} className="ticket-card" key={t._id}>
                <span className="ticket-icon"><Icon size={22} /></span>
                <div className="ticket-main">
                  <div className="ticket-top">
                    <strong>{SERVICE_LABELS[t.serviceType]} · {AC_LABELS[t.acType]}</strong>
                    <StatusBadge status={t.status} />
                  </div>
                  <div className="ticket-meta">
                    <span>{t.ticketNumber}</span>
                    <span><MapPin size={14} /> {t.address}, {t.pincode}</span>
                    <span>{fmtDate(t.createdAt)}</span>
                  </div>
                </div>
                <ChevronRight size={20} className="chev" />
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
