import { Building2, Fan, Hammer, Loader2, Send, Settings, Wind, Wrench } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api.js';
import { useAuth } from '../../auth/AuthContext.jsx';
import { Alert, Field } from '../../components/ui.jsx';

const SERVICE_OPTIONS = [
  { value: 'INSTALLATION', icon: Hammer, title: 'Installation', text: 'New AC set-up' },
  { value: 'REPAIR', icon: Wrench, title: 'Repair', text: 'Fix a problem' },
  { value: 'SERVICE', icon: Settings, title: 'Servicing', text: 'Cleaning & check-up' },
];
const AC_OPTIONS = [
  { value: 'SPLIT', icon: Wind, title: 'Split AC', text: 'Wall-mounted' },
  { value: 'WINDOW', icon: Fan, title: 'Window AC', text: 'Single unit' },
  { value: 'VRF', icon: Building2, title: 'VRF system', text: 'Commercial' },
];

function Choice({ options, value, onChange }) {
  return (
    <div className="choices">
      {options.map(({ value: v, icon: Icon, title, text }) => (
        <button type="button" key={v} className={value === v ? 'choice selected' : 'choice'} onClick={() => onChange(v)} aria-pressed={value === v}>
          <Icon size={22} />
          <strong>{title}</strong>
          <span>{text}</span>
        </button>
      ))}
    </div>
  );
}

export default function NewRequest() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    serviceType: '', acType: '', description: '',
    customerName: user.name, phone: user.phone, email: user.email || '', address: '', pincode: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); };
  const digits = (k, max) => (e) => set(k, e.target.value.replace(/\D/g, '').slice(0, max));

  const validate = () => {
    const e = {};
    if (!form.serviceType) e.serviceType = 'Please choose a service';
    if (!form.acType) e.acType = 'Please choose your AC type';
    if (!form.customerName.trim()) e.customerName = 'Contact name is required';
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit mobile number';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = 'Pincode must be 6 digits';
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    setServerError('');
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);
    try {
      const ticket = await api.createTicket(form);
      navigate(`/portal/tickets/${ticket._id}`, { state: { created: true } });
    } catch (err) {
      if (err.fieldErrors) setErrors(err.fieldErrors); else setServerError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Book a service</h1>
          <p>Tell us what you need and where. We will take it from there.</p>
        </div>
      </div>

      <div className="book-grid">
        <form className="card form" onSubmit={submit} noValidate>
          {serverError && <Alert>{serverError}</Alert>}

          <section>
            <h3 className="form-title"><span>1</span> Service details</h3>
            <label className="field-label">What do you need? *</label>
            <Choice options={SERVICE_OPTIONS} value={form.serviceType} onChange={(v) => set('serviceType', v)} />
            {errors.serviceType && <span className="field-error">{errors.serviceType}</span>}

            <label className="field-label gap">Type of AC *</label>
            <Choice options={AC_OPTIONS} value={form.acType} onChange={(v) => set('acType', v)} />
            {errors.acType && <span className="field-error">{errors.acType}</span>}

            <div className="gap">
              <Field label="Describe the issue or requirement" optional error={errors.description} hint={`${form.description.length}/500`}>
                <textarea rows="3" maxLength={500} value={form.description} placeholder="e.g. AC is running but not cooling since yesterday"
                  onChange={(e) => set('description', e.target.value)} />
              </Field>
            </div>
          </section>

          <section>
            <h3 className="form-title"><span>2</span> Contact &amp; location</h3>
            <div className="form-row">
              <Field label="Contact name *" error={errors.customerName}>
                <input value={form.customerName} onChange={(e) => set('customerName', e.target.value)} />
              </Field>
              <Field label="Phone number *" error={errors.phone}>
                <input value={form.phone} inputMode="numeric" onChange={digits('phone', 10)} />
              </Field>
            </div>
            <div className="gap">
              <Field label="Email" optional error={errors.email}>
                <input type="email" value={form.email} placeholder="you@gmail.com" onChange={(e) => set('email', e.target.value)} />
              </Field>
            </div>
            <div className="gap">
              <Field label="Service address *" error={errors.address}>
                <textarea rows="3" value={form.address} placeholder="House / flat no, street, landmark, city"
                  onChange={(e) => set('address', e.target.value)} />
              </Field>
            </div>
            <div className="gap form-row">
              <Field label="Pincode *" error={errors.pincode}>
                <input value={form.pincode} inputMode="numeric" placeholder="800001" onChange={digits('pincode', 6)} />
              </Field>
              <div />
            </div>
          </section>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/portal')}>Cancel</button>
            <button className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? <><Loader2 className="spin" size={18} /> Submitting…</> : <><Send size={18} /> Submit request</>}
            </button>
          </div>
        </form>

        <aside className="card side-info">
          <h3>What happens next?</h3>
          <ol className="next-list">
            <li><span>1</span><div><strong>We review your request</strong><p>Our team checks the details you share.</p></div></li>
            <li><span>2</span><div><strong>A visit is scheduled</strong><p>A technician is arranged for your address.</p></div></li>
            <li><span>3</span><div><strong>Track every update</strong><p>See live status in your account.</p></div></li>
          </ol>
        </aside>
      </div>
    </>
  );
}
