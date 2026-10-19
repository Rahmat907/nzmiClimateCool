import {
  ArrowRight, BadgeCheck, Building2, CalendarClock, CheckCircle2, ClipboardList, Clock, Fan, Hammer,
  Headset, Mail, MapPin, Phone, Settings, ShieldCheck, UserPlus, Wind, Wrench,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { BRAND } from '../brand.js';
import Logo from '../components/Logo.jsx';
import PublicNavbar from '../components/PublicNavbar.jsx';

const SERVICES = [
  { icon: Hammer, title: 'Installation', text: 'Professional mounting, piping, wiring and commissioning for new air conditioners, done neatly and safely.' },
  { icon: Wrench, title: 'Repair', text: 'Not cooling, leaking, noisy or tripping? Our technicians diagnose the fault and fix it properly.' },
  { icon: Settings, title: 'Routine servicing', text: 'Deep cleaning, gas and performance checks to keep your AC efficient and your bills lower.' },
];

const AC_TYPES = [
  { icon: Wind, title: 'Split AC', text: 'Wall-mounted indoor and outdoor units for homes and offices.' },
  { icon: Fan, title: 'Window AC', text: 'Compact single-unit systems, installed and serviced quickly.' },
  { icon: Building2, title: 'VRF systems', text: 'Multi-zone commercial systems handled by experienced teams.' },
];

const STEPS = [
  { icon: UserPlus, title: 'Create your account', text: 'Sign up with your mobile number in under a minute.' },
  { icon: ClipboardList, title: 'Raise a request', text: 'Choose the service and AC type, then share your address.' },
  { icon: CalendarClock, title: 'We schedule your visit', text: 'Our team reviews the request and arranges a technician.' },
  { icon: CheckCircle2, title: 'Track until done', text: 'Follow live status updates right from your account.' },
];

const WHY = [
  { icon: BadgeCheck, title: 'Certified technicians', text: 'Trained professionals who respect your home and your time.' },
  { icon: Clock, title: 'Transparent tracking', text: 'Know exactly where your request stands, at any hour.' },
  { icon: ShieldCheck, title: 'All AC types covered', text: 'From a single window unit to full VRF installations.' },
  { icon: Headset, title: 'Responsive support', text: 'A real team that picks up when you need help.' },
];

export default function Landing() {
  return (
    <div className="landing">
      <PublicNavbar />

      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="pill"><BadgeCheck size={16} /> Trusted AC care for homes &amp; businesses</span>
            <h1>Expert AC installation, repair &amp; servicing at your doorstep</h1>
            <p>Raise a request in under a minute, track it live, and get your AC running at its best.</p>
            <div className="hero-cta">
              <Link className="btn btn-accent btn-lg" to="/portal/new">Book a service <ArrowRight size={18} /></Link>
              <a className="btn btn-ghost-light btn-lg" href="#how">How it works</a>
            </div>
            <ul className="hero-points">
              <li><CheckCircle2 size={18} /> Split, Window &amp; VRF</li>
              <li><CheckCircle2 size={18} /> Live request tracking</li>
              <li><CheckCircle2 size={18} /> Quick online booking</li>
            </ul>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="mock">
              <div className="mock-head">
                <div>
                  <small>Service request</small>
                  <strong>TKT-000128</strong>
                </div>
                <span className="badge IN_PROGRESS"><i className="dot" />In progress</span>
              </div>
              <div className="mock-row"><Wrench size={16} /> Repair · Split AC</div>
              <div className="mock-row"><MapPin size={16} /> Boring Road, Patna 800001</div>
              <ol className="steps mock-steps">
                <li className="done"><span className="step-dot">✓</span><span>Requested</span></li>
                <li className="done"><span className="step-dot">2</span><span>In progress</span></li>
                <li><span className="step-dot">3</span><span>Completed</span></li>
              </ol>
            </div>
            <div className="float-card"><ShieldCheck size={18} /> Verified technician</div>
          </div>
        </div>
      </section>

      <section className="section" id="services">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Services</span>
            <h2>Everything your AC needs</h2>
            <p>One place to book, manage and follow every AC job.</p>
          </div>
          <div className="grid-3">
            {SERVICES.map(({ icon: Icon, title, text }) => (
              <article className="feature" key={title}>
                <span className="feature-icon"><Icon size={22} /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt" id="ac-types">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Supported systems</span>
            <h2>Whatever you have, we handle it</h2>
          </div>
          <div className="grid-3">
            {AC_TYPES.map(({ icon: Icon, title, text }) => (
              <article className="feature outline" key={title}>
                <span className="feature-icon accent"><Icon size={22} /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="how">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">How it works</span>
            <h2>From request to resolved in four steps</h2>
          </div>
          <div className="grid-4">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <article className="step-card" key={title}>
                <span className="step-num">{i + 1}</span>
                <Icon size={24} />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt" id="why">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Why {BRAND.name}</span>
            <h2>Service you can rely on</h2>
          </div>
          <div className="grid-4">
            {WHY.map(({ icon: Icon, title, text }) => (
              <article className="why" key={title}>
                <span className="feature-icon"><Icon size={22} /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container cta-inner">
          <div>
            <h2>Ready for a cooler, quieter, healthier AC?</h2>
            <p>Create a free account and raise your first request today.</p>
          </div>
          <Link className="btn btn-accent btn-lg" to="/register">Create free account <ArrowRight size={18} /></Link>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <Logo light />
            <p>{BRAND.tagline}. Fast booking, clear tracking, reliable technicians.</p>
          </div>
          <div>
            <h4>Company</h4>
            <a href="#services">Services</a>
            <a href="#how">How it works</a>
            <Link to="/login">Log in</Link>
          </div>
          <div>
            <h4>Contact</h4>
            <span><Phone size={15} /> {BRAND.phone}</span>
            <span><Mail size={15} /> {BRAND.email}</span>
            <span><Clock size={15} /> {BRAND.hours}</span>
          </div>
        </div>
        <div className="container footer-bottom">© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</div>
      </footer>
    </div>
  );
}
