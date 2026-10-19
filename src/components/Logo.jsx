import { Snowflake } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BRAND } from '../brand.js';

export default function Logo({ to = '/', light = false }) {
  return (
    <Link to={to} className={light ? 'logo light' : 'logo'}>
      <span className="logo-mark"><Snowflake size={18} strokeWidth={2.4} /></span>
      <span>{BRAND.name}</span>
    </Link>
  );
}
