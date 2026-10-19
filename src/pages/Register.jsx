import { Eye, EyeOff, Loader2, Lock, Mail, Phone, User } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { Alert, Field } from '../components/ui.jsx';
import AuthShell from './AuthShell.jsx';

const strength = (pw) => {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Za-z]/.test(pw) && /\d/.test(pw)) s++;
  if (pw.length >= 12 || (/[A-Z]/.test(pw) && /[^A-Za-z0-9]/.test(pw))) s++;
  return s; // 0..3
};
const STRENGTH_LABEL = ['Too weak', 'Weak', 'Good', 'Strong'];

export default function Register() {
  const { user, register } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/portal'} replace />;

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); };

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = 'Enter your full name';
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit mobile number';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    else if (!/[A-Za-z]/.test(form.password) || !/\d/.test(form.password)) e.password = 'Use both letters and numbers';
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    setServerError('');
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    try {
      const { name, phone, email, password } = form;
      await register({ name, phone, email, password }); // redirect via <Navigate> above
    } catch (err) {
      if (err.fieldErrors) setErrors(err.fieldErrors); else setServerError(err.message);
      setLoading(false);
    }
  };

  const score = strength(form.password);

  return (
    <AuthShell
      title="Create your account"
      subtitle="It takes less than a minute. No payment needed."
      footer={<>Already registered? <Link to="/login">Log in</Link></>}
    >
      <form onSubmit={submit} noValidate className="form">
        {serverError && <Alert>{serverError}</Alert>}
        <Field label="Full name" error={errors.name}>
          <div className="input-icon"><User size={18} />
            <input value={form.name} autoComplete="name" placeholder="Rahmat Ali" onChange={(e) => set('name', e.target.value)} />
          </div>
        </Field>
        <div className="form-row">
          <Field label="Phone number" error={errors.phone}>
            <div className="input-icon"><Phone size={18} />
              <input value={form.phone} inputMode="numeric" autoComplete="tel" placeholder="9876543210"
                onChange={(e) => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} />
            </div>
          </Field>
          <Field label="Email" optional error={errors.email}>
            <div className="input-icon"><Mail size={18} />
              <input type="email" value={form.email} autoComplete="email" placeholder="you@gmail.com" onChange={(e) => set('email', e.target.value)} />
            </div>
          </Field>
        </div>
        <Field label="Password" error={errors.password} hint="At least 8 characters with letters and numbers">
          <div className="input-icon"><Lock size={18} />
            <input type={show ? 'text' : 'password'} value={form.password} autoComplete="new-password" placeholder="Create a password"
              onChange={(e) => set('password', e.target.value)} />
            <button type="button" className="eye" onClick={() => setShow((s) => !s)} aria-label="Toggle password">
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </Field>
        {form.password && (
          <div className="meter" aria-live="polite">
            <div className="meter-bars">{[1, 2, 3].map((n) => <span key={n} className={score >= n ? `on s${score}` : ''} />)}</div>
            <small>{STRENGTH_LABEL[score]}</small>
          </div>
        )}
        <Field label="Confirm password" error={errors.confirm}>
          <div className="input-icon"><Lock size={18} />
            <input type={show ? 'text' : 'password'} value={form.confirm} autoComplete="new-password" placeholder="Re-enter your password"
              onChange={(e) => set('confirm', e.target.value)} />
          </div>
        </Field>
        <button className="btn btn-primary btn-lg btn-block" disabled={loading}>
          {loading ? <><Loader2 className="spin" size={18} /> Creating account…</> : 'Create account'}
        </button>
      </form>
    </AuthShell>
  );
}
