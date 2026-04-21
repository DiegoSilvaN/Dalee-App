import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../api/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ArrowLeft, Star, MapPin, Clock, Scissors, ChevronRight, Info } from 'lucide-react';
import { formatCLP } from '../../utils/format';
import Button from '../../components/ui/Button';

export default function BusinessDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bizSnap = await getDoc(doc(db, "businesses", id));
        if (bizSnap.exists()) {
          setBusiness({ id: bizSnap.id, ...bizSnap.data() });
        } else {
          navigate(-1);
          return;
        }
        const srvQuery = query(collection(db, "services"), where("businessId", "==", id));
        const srvSnap = await getDocs(srvQuery);
        setServices(srvSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error("Error cargando el detalle:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-surface">
      <div className="animate-pulse text-primary font-black text-xl">Dalee...</div>
    </div>
  );

  if (!business) return <div className="p-10 text-center font-bold">Local no encontrado.</div>;

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-32">
      {/* Imagen de cabecera */}
      <div className="relative h-72 bg-[var(--surface)]">
        {business.images?.[0] ? (
          <img
            src={business.images[0]}
            className="w-full h-full object-cover"
            alt={business.name}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          // CORRECCIÓN: placeholder sin via.placeholder.com — inicial del negocio
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-8xl font-black text-[var(--primary)]/20">
              {business.name?.charAt(0) || 'D'}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* Información del Negocio */}
      <div className="p-6 -mt-10 relative bg-white rounded-t-[40px] shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-black text-text-1 leading-tight">{business.name}</h1>
            <div className="flex items-center gap-2 mt-2 text-text-2">
              <MapPin size={16} className="text-primary" />
              <p className="text-sm font-medium">{business.address}, {business.comuna}</p>
            </div>
          </div>
          <div className="bg-warning/10 text-warning px-3 py-2 rounded-2xl flex items-center gap-1 border border-warning/20">
            <Star size={18} className="fill-current" />
            <span className="font-bold">{business.rating || 'N/A'}</span>
          </div>
        </div>

        {/* Cápsulas de info */}
        <div className="flex gap-3 mb-8 overflow-x-auto no-scrollbar">
          {business.category && (
            <div className="bg-[var(--surface)] px-4 py-3 rounded-2xl flex items-center gap-2 shrink-0">
              <Scissors size={16} className="text-[var(--primary)]" />
              <span className="text-sm font-bold text-[var(--text-1)]">{business.category}</span>
            </div>
          )}
          <div className="bg-[var(--surface)] px-4 py-3 rounded-2xl flex items-center gap-2 shrink-0">
            <Clock size={16} className="text-[var(--primary)]" />
            <span className="text-sm font-bold text-[var(--text-1)]">Abre a las 09:00</span>
          </div>
        </div>

        {/* Servicios */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-xl text-[var(--text-1)]">Servicios</h3>
            <span className="text-xs font-bold text-[var(--text-2)] uppercase tracking-widest">
              {services.length} disponibles
            </span>
          </div>

          <div className="space-y-3">
            {services.length > 0 ? services.map(srv => (
              <div
                key={srv.id}
                className="group flex justify-between items-center p-5 bg-[var(--surface)] rounded-3xl border-2 border-transparent hover:border-[var(--primary)]/30 transition-all cursor-default"
              >
                <div className="flex-1">
                  <p className="font-bold text-lg text-[var(--text-1)] group-hover:text-[var(--primary)] transition-colors">
                    {srv.name}
                  </p>
                  <p className="text-sm text-[var(--text-2)] font-medium">{srv.duration} minutos de dedicación</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-black text-lg text-[var(--primary)]">{formatCLP(srv.price)}</span>
                  <div className="p-2 bg-[var(--bg)] rounded-xl shadow-sm">
                    <ChevronRight size={18} className="text-[var(--text-2)]" />
                  </div>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center py-10 text-[var(--text-2)] bg-[var(--surface)] rounded-3xl border border-dashed border-[var(--border)]">
                <Info className="mb-2 opacity-20" size={40} />
                <p className="font-medium">No hay servicios listados aún.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Botón flotante — CORRECCIÓN: dark mode con bg-[var(--bg)] */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)] to-transparent z-20">
        <Button
          className="w-full py-5 text-lg rounded-2xl"
          onClick={() => navigate(`/reserva/${id}`)}
        >
          Agendar una hora ahora
        </Button>
      </div>
    </div>
  );
}