import { ChevronDown, ChevronUp, RefreshCw, Search } from 'lucide-react';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { api } from '../../api.js';
import {
  AC_LABELS, Alert, SERVICE_LABELS, STATUS_LABELS, Spinner, StatusBadge, fmtDateTime,
} from '../../components/ui.jsx';

const STATUSES = ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
const NEXT = { OPEN: ['IN_PROGRESS', 'CANCELLED'], IN_PROGRESS: ['COMPLETED', 'CANCELLED'], COMPLETED: [], CANCELLED: [] };
const ACTION_LABEL = { IN_PROGRESS: 'Start work', COMPLETED: 'Mark completed', CANCELLED: 'Cancel ticket' };

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({});
  const [status, setStatus] = useState('');
  const [pincode, setPincode] = useState('');
  const [q, setQ] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [list, st] = await Promise.all([api.allTickets({ status, pincode, q }), api.stats()]);
      setTickets(list);
      setStats(st);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [status, pincode, q]);

  useEffect(() => {
    const t = setTimeout(load, 250); // debounce typing
    return () => clearTimeout(t);
  }, [load]);

  const change = async (id, next) => {
    try {
      await api.updateStatus(id, next);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const total = STATUSES.reduce((n, s) => n + (stats[s] || 0), 0);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Service tickets</h1>
          <p>Review requests from customers and move them through the workflow.</p>
        </div>
        <button className="btn btn-outline" onClick={load}><RefreshCw size={16} /> Refresh</button>
      </div>

      <div className="stat-grid">
        <button className={status === '' ? 'stat sel' : 'stat'} onClick={() => setStatus('')}>
          <span>All tickets</span><strong>{total}</strong>
        </button>
        {STATUSES.map((s) => (
          <button key={s} className={`stat ${s} ${status === s ? 'sel' : ''}`} onClick={() => setStatus(status === s ? '' : s)}>
            <span>{STATUS_LABELS[s]}</span><strong>{stats[s] ?? 0}</strong>
          </button>
        ))}
      </div>

      <div className="filters">
        <div className="input-icon grow"><Search size={18} />
          <input placeholder="Search by name, phone or ticket number" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="input-icon pin">
          <input placeholder="Pincode" value={pincode} maxLength={6} inputMode="numeric" onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))} />
        </div>
      </div>

      {error && <Alert>{error}</Alert>}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr><th>Ticket</th><th>Customer</th><th>Location</th><th>Service</th><th>Status</th><th>Created</th><th /></tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <Fragment key={t._id}>
                <tr className={open === t._id ? 'row-open' : ''}>
                  <td><strong>{t.ticketNumber}</strong></td>
                  <td>{t.customerName}<div className="muted">{t.phone}{t.email ? ` · ${t.email}` : ''}</div></td>
                  <td className="cell-addr">{t.address}<div className="muted">PIN {t.pincode}</div></td>
                  <td>{SERVICE_LABELS[t.serviceType]}<div className="muted">{AC_LABELS[t.acType]}</div></td>
                  <td>
                    <StatusBadge status={t.status} />
                    {NEXT[t.status].length > 0 && (
                      <select className="select-mini" value="" onChange={(e) => e.target.value && change(t._id, e.target.value)}>
                        <option value="">Update…</option>
                        {NEXT[t.status].map((n) => <option key={n} value={n}>{ACTION_LABEL[n]}</option>)}
                      </select>
                    )}
                  </td>
                  <td className="muted">{fmtDateTime(t.createdAt)}</td>
                  <td>
                    <button className="icon-btn" onClick={() => setOpen(open === t._id ? null : t._id)} aria-label="Details">
                      {open === t._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </td>
                </tr>
                {open === t._id && (
                  <tr className="row-detail">
                    <td colSpan="7">
                      <div className="expand">
                        <div>
                          <h4>Issue described</h4>
                          <p>{t.description || <span className="muted">No description provided.</span>}</p>
                        </div>
                        <div>
                          <h4>Activity</h4>
                          <ul className="mini-log">
                            {t.statusHistory.map((h, i) => (
                              <li key={i}><StatusBadge status={h.status} /> <span className="muted">{fmtDateTime(h.at)} · by {h.by}</span></li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {loading && <tr><td colSpan="7"><Spinner /></td></tr>}
            {!loading && tickets.length === 0 && <tr><td colSpan="7" className="empty-cell">No tickets found</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
