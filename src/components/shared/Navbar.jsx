import { useNavigate, Link } from 'react-router-dom';
import { Home, Calendar, User, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { role } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border px-6 py-3 flex justify-between items-center z-50">
      {role === 'client' ? (
        <>
          <Link to="/explorar" className="flex flex-col items-center text-primary"><Home size={24}/><span className="text-[10px] font-bold">Explorar</span></Link>
          <Link to="/mis-reservas" className="flex flex-col items-center text-text-2"><Calendar size={24}/><span className="text-[10px] font-bold">Mis Horas</span></Link>
          <Link to="/perfil" className="flex flex-col items-center text-text-2"><User size={24}/><span className="text-[10px] font-bold">Perfil</span></Link>
        </>
      ) : (
        <>
          <Link to="/admin/agenda" className="flex flex-col items-center text-primary"><Calendar size={24}/><span className="text-[10px] font-bold">Agenda</span></Link>
          <Link to="/admin/servicios" className="flex flex-col items-center text-text-2"><Home size={24}/><span className="text-[10px] font-bold">Servicios</span></Link>
          <Link to="/admin/configuracion" className="flex flex-col items-center text-text-2"><SettingsIcon size={24}/><span className="text-[10px] font-bold">Ajustes</span></Link>
        </>
      )}
    </nav>
  );
}