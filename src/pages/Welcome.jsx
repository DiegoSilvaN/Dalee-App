import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const { loginAsClient } = useAuth();
  const navigate = useNavigate();

  const handleStart = async () => {
    await loginAsClient();
    navigate('/explorar');
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center p-6 bg-surface">
      <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-primary/20">
        <span className="text-white text-5xl font-black">EE</span>
      </div>
      <h1 className="text-4xl font-black text-text-1 mb-2 tracking-tight">Dalee</h1>
      <p className="text-text-2 text-center mb-12 max-w-[250px]">
        Reserva tu hora en segundos, sin vueltas, po.
      </p>
      
      <button 
        onClick={handleStart}
        className="w-full max-w-xs bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md"
      >
        Buscar mi próxima hora
      </button>
      
      <button 
        onClick={() => navigate('/login-negocio')}
        className="mt-6 text-primary font-semibold text-sm"
      >
        Soy dueño de un negocio
      </button>
    </div>
  );
}