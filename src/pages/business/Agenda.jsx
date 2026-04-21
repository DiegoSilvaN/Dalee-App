import React, { useState, useEffect } from 'react';
import { db } from '../../api/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { Calendar, Clock, User, Check, X } from 'lucide-react';

export default function Agenda({ businessId }) {
  const [bookings, setBookings] = useState([]);
  const [today] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (!businessId) return;

    const q = query(
      collection(db, "bookings"),
      where("businessId", "==", businessId),
      where("date", "==", today)
    );
    return onSnapshot(q, (snap) => {
      // Ordenar por hora de inicio en el cliente
      const sorted = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
      setBookings(sorted);
    });
  }, [businessId, today]);

  const setStatus = (id, s) => 
    updateDoc(doc(db, "bookings", id), { status: s });

  const statusClass = (status) => {
    if (status === 'confirmed') return 'bg-green-100 text-green-700';
    if (status === 'cancelled') return 'bg-red-100 text-red-500 line-through';
    return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <div className="p-6 min-h-screen bg-[var(--surface)]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-[var(--text-1)]">Agenda de Hoy</h2>
        <span className="text-xs font-bold text-[var(--text-2)] bg-[var(--bg)] border border-[var(--border)] px-3 py-1 rounded-full">
          {bookings.length} reservas
        </span>
      </div>

      <div className="space-y-4">
        {bookings.length > 0 ? bookings.map(b => (
          <div
            key={b.id}
            className={`p-4 bg-[var(--bg)] rounded-2xl border border-[var(--border)] flex items-center justify-between
              ${b.status === 'cancelled' ? 'opacity-50' : ''}`}
          >
            <div className="flex items-center gap-4">
              {/* Hora destacada */}
              <div className="bg-[var(--primary)]/10 text-[var(--primary)] font-bold p-3 rounded-xl text-sm min-w-[60px] text-center">
                {b.startTime}
              </div>
              <div>
                <p className="font-bold text-[var(--text-1)] flex items-center gap-1">
                  <User size={14} className="text-[var(--text-2)]" /> {b.clientName}
                </p>
                <p className="text-xs text-[var(--text-2)]">{b.serviceName}</p>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md mt-1 inline-block ${statusClass(b.status)}`}>
                  {b.status === 'confirmed' ? 'Confirmada' : b.status === 'cancelled' ? 'Cancelada' : 'Pendiente'}
                </span>
              </div>
            </div>

            {/* Acciones — solo si no está cancelada */}
            {b.status !== 'cancelled' && (
              <div className="flex gap-2">
                <button
                  onClick={() => setStatus(b.id, 'confirmed')}
                  title="Confirmar"
                  className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <Check size={18} />
                </button>
                <button
                  onClick={() => setStatus(b.id, 'cancelled')}
                  title="Cancelar"
                  className="p-2 bg-red-100 text-red-500 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>
        )) : (
          <div className="flex flex-col items-center mt-24 text-[var(--text-2)]">
            <Clock size={48} className="opacity-20 mb-4" />
            <p className="font-medium">No hay reservas para hoy, po.</p>
          </div>
        )}
      </div>
    </div>
  );
}