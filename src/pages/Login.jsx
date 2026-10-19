import { Eye, EyeOff, Loader2, Lock, Phone } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { homeFor, useAuth } from '../auth/AuthContext.jsx';
import { Alert, Field } from '../components/ui.jsx';
import AuthShell from './AuthShell.jsx';

export default function Login() {
  const { user, login } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname;
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={homeFor(user, from)} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!phone || !password) return setError('Enter your phone number and password');
    setLoading(true);
    try {
      await login(phone, password); // redirect happens via the <Navigate> above
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to book services and track your requests."
      footer={<>New to CoolCare? <Link to="/register">Create an account</Link></>}
    >
      <form onSubmit={submit} noValidate className="form">
        {error && <Alert>{error}</Alert>}
        <Field label="Phone number">
          <div className="input-icon">
            <Phone size={18} />
            <input
              value={phone} inputMode="numeric" autoComplete="username" placeholder="10-digit mobile number"
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            />
          </div>
        </Field>
        <Field label="Password">
          <div className="input-icon">
            <Lock size={18} />
            <input
              type={show ? 'text' : 'password'} value={password} autoComplete="current-password" placeholder="Your password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" className="eye" onClick={() => setShow((s) => !s)} aria-label="Toggle password">
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </Field>
        <button className="btn btn-primary btn-lg btn-block" disabled={loading}>
          {loading ? <><Loader2 className="spin" size={18} /> Logging in…</> : 'Log in'}
        </button>
      </form>
    </AuthShell>
  );
}
