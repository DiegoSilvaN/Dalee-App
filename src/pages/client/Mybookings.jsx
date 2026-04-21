import React, { useState, useEffect } from 'react';
import { db, auth } from '../../api/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Calendar, MapPin, Tag } from 'lucide-react';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(
      collection(db, "bookings"),
      where("clientId", "==", auth.currentUser.uid),
      // CORRECCIÓN: ordenar por fecha descendente (más recientes primero)
      orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (snap) =>
      setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );
  }, []);

  const statusLabel = (status) => {
    const map = { pending: 'Pendiente', confirmed: 'Confirmada', cancelled: 'Cancelada' };
    return map[status] || status;
  };

  const statusClass = (status) => {
    if (status === 'confirmed') return 'bg-green-100 text-green-700';
    if (status === 'cancelled') return 'bg-red-100 text-red-600';
    return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      <header className="p-6 bg-[var(--bg)] sticky top-0 z-10 border-b border-[var(--border)] flex items-center gap-4">
        <button
          onClick={() => navigate('/explorar')}
          className="p-2 hover:bg-[var(--surface)] rounded-full"
        >
          <ArrowLeft size={22} className="text-[var(--text-1)]" />
        </button>
        <h2 className="text-2xl font-black text-[var(--text-1)]">Mis Reservas</h2>
      </header>

      <div className="p-6 space-y-4">
        {bookings.length > 0 ? bookings.map(b => (
          <div key={b.id} className="bg-[var(--bg)] p-5 rounded-2xl shadow-sm border border-[var(--border)]">
            <div className="flex justify-between items-start mb-3">
              <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${statusClass(b.status)}`}>
                {statusLabel(b.status)}
              </span>
              <span className="text-[var(--primary)] font-black text-sm">{b.code}</span>
            </div>
            <h3 className="font-bold text-lg text-[var(--text-1)]">{b.businessName}</h3>
            <div className="mt-3 space-y-2">
              <p className="flex items-center text-sm text-[var(--text-2)]">
                <Calendar className="w-4 h-4 mr-2" />
                {b.date} a las {b.startTime}
              </p>
              <p className="flex items-center text-sm text-[var(--text-2)]">
                <Tag className="w-4 h-4 mr-2" />
                {b.serviceName}
              </p>
            </div>
          </div>
        )) : (
          <div className="flex flex-col items-center mt-24 gap-4">
            <p className="text-center text-[var(--text-2)]">Aún no has agendado nada, po.</p>
            <button
              onClick={() => navigate('/explorar')}
              className="bg-[var(--primary)] text-white px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-transform"
            >
              Buscar un local
            </button>
          </div>
        )}
      </div>
    </div>
  );
}