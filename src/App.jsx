import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import PortalLayout from './layouts/PortalLayout.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AdminTickets from './pages/admin/AdminTickets.jsx';
import Dashboard from './pages/portal/Dashboard.jsx';
import NewRequest from './pages/portal/NewRequest.jsx';
import TicketDetail from './pages/portal/TicketDetail.jsx';

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/portal" element={<ProtectedRoute role="customer"><PortalLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="new" element={<NewRequest />} />
          <Route path="tickets/:id" element={<TicketDetail />} />
        </Route>

        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminTickets />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
