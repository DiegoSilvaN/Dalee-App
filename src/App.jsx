import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Importación de Páginas
import Welcome from './pages/Welcome';
import Explore from './pages/client/Explore';
import MyBookings from './pages/client/MyBookings';
import Agenda from './pages/business/Agenda';
import Settings from './pages/business/Settings';
import Services from './pages/business/Services';
import LoginBusiness from './pages/business/LoginBusiness';
import BookingFlow from './pages/client/BookingFlow';
import BusinessDetail from './pages/client/BusinessDetail';

function PrivateRoute({ children, requiredRole }) {
  const { user, role, loading } = useAuth();

  if (loading) return null;

  // Si no hay usuario, redirigir al inicio
  if (!user) return <Navigate to="/" replace />;

  // Si se requiere un rol específico y no coincide, redirigir según el rol real
  if (requiredRole && role !== requiredRole) {
    return <Navigate to={role === 'business' ? '/admin/agenda' : '/explorar'} replace />;
  }

  return children;
}


function App() {
  const { user, role, loading } = useAuth();

  if (loading) return (
    <div className="h-screen flex items-center justify-center font-bold text-primary">
      Dalee...
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        {/* Flujo Público / Bienvenida */}
        <Route
          path="/"
          element={
            !user
              ? <Welcome />
              : (role === 'client' ? <Navigate to="/explorar" replace /> : <Navigate to="/admin/agenda" replace />)
          }
        />
        <Route path="/login-negocio" element={<LoginBusiness />} />

        {/* Flujo Cliente — protegido, solo rol 'client' */}
        <Route path="/explorar" element={
          <PrivateRoute requiredRole="client"><Explore /></PrivateRoute>
        } />
        <Route path="/reserva/:businessId" element={
          <PrivateRoute requiredRole="client"><BookingFlow /></PrivateRoute>
        } />
        <Route path="/mis-reservas" element={
          <PrivateRoute requiredRole="client"><MyBookings /></PrivateRoute>
        } />
        <Route path="/negocio/:id" element={
          <PrivateRoute requiredRole="client"><BusinessDetail /></PrivateRoute>
        } />

        {/* Flujo Negocio (Admin) — protegido, solo rol 'business' */}
        <Route path="/admin/agenda" element={
          <PrivateRoute requiredRole="business"><Agenda businessId={user?.uid} /></PrivateRoute>
        } />
        <Route path="/admin/servicios" element={
          <PrivateRoute requiredRole="business"><Services businessId={user?.uid} /></PrivateRoute>
        } />
        <Route path="/admin/configuracion" element={
          <PrivateRoute requiredRole="business"><Settings businessId={user?.uid} /></PrivateRoute>
        } />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;