import React, { useState } from 'react';
import { auth } from '../../api/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function LoginBusiness() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // AuthContext detecta el cambio de auth y redirige automáticamente
      navigate('/admin/agenda');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Credenciales incorrectas, po. Revisa tu correo o contraseña.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Demasiados intentos. Espera un momento antes de intentar de nuevo.');
      } else {
        setError('Error al iniciar sesión. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center p-6 bg-surface">
      <Link to="/" className="absolute top-6 left-6 p-2 bg-white rounded-full shadow-sm text-text-2 hover:text-primary transition-colors">
        <ArrowLeft size={24} />
      </Link>

      <div className="max-w-md w-full mx-auto bg-white p-8 rounded-3xl shadow-sm border border-border">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
          <Lock className="text-primary w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black text-text-1 mb-2">Portal Negocios</h2>
        <p className="text-text-2 mb-8">Ingresa con las credenciales de tu local.</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-4 top-[38px] text-text-2 w-5 h-5" />
            <Input 
              label="Correo Electrónico" 
              type="email" 
              placeholder="contacto@mipeluqueria.cl"
              style={{ paddingLeft: '2.5rem' }}
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-4 top-[38px] text-text-2 w-5 h-5" />
            <Input 
              label="Contraseña" 
              type="password" 
              placeholder="••••••••"
              style={{ paddingLeft: '2.5rem' }}
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          {error && (<p className="text-danger text-sm font-bold bg-danger/10 p-3 rounded-lg">{error}</p>)}

          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Entrar al Panel'}
          </Button>
        </form>
      </div>
    </div>
  );
}