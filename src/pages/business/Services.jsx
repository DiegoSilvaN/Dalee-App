import React, { useState, useEffect } from 'react';
import { db } from '../../api/firebase';
import { collection, addDoc, onSnapshot, query, where, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Trash2, Clock, DollarSign } from 'lucide-react';
import { formatCLP } from '../../utils/format';

export default function Services({ businessId }) {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ name: '', price: '', duration: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const q = query(collection(db, "services"), where("businessId", "==", businessId));
    return onSnapshot(q, (snap) => setServices(snap.docs.map(d => ({id: d.id, ...d.data()}))));
  }, [businessId]);

  const addService = async () => {
    setError('');
    if (!newService.name.trim()) return setError('Escribe el nombre del servicio.');
    if (!newService.price || Number(newService.price) <= 0) return setError('El precio debe ser mayor a 0.');
    if (!newService.duration || Number(newService.duration) <= 0) return setError('Los minutos deben ser mayor a 0.');

    await addDoc(collection(db, "services"), {
      ...newService,
      // CORRECCIÓN: guardar como número, no como string
      price: Number(newService.price),
      duration: Number(newService.duration),
      businessId,
    });
    setNewService({ name: '', price: '', duration: '' });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto min-h-screen bg-[var(--surface)]">
      <h2 className="text-2xl font-black mb-6 text-[var(--text-1)]">Mis Servicios</h2>

      {/* Formulario agregar */}
      <div className="bg-[var(--bg)] p-4 rounded-2xl border border-[var(--border)] mb-8 space-y-4">
        <input
          type="text"
          placeholder="Nombre del servicio (Ej: Corte de Pelo)"
          className="w-full p-3 bg-[var(--surface)] rounded-xl outline-none text-[var(--text-1)] placeholder:text-[var(--text-2)] border border-transparent focus:border-[var(--primary)]"
          onChange={e => setNewService({ ...newService, name: e.target.value })}
          value={newService.name}
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Precio ($)"
            min="0"
            className="p-3 bg-[var(--surface)] rounded-xl outline-none text-[var(--text-1)] placeholder:text-[var(--text-2)] border border-transparent focus:border-[var(--primary)]"
            onChange={e => setNewService({ ...newService, price: e.target.value })}
            value={newService.price}
          />
          <input
            type="number"
            placeholder="Minutos"
            min="0"
            className="p-3 bg-[var(--surface)] rounded-xl outline-none text-[var(--text-1)] placeholder:text-[var(--text-2)] border border-transparent focus:border-[var(--primary)]"
            onChange={e => setNewService({ ...newService, duration: e.target.value })}
            value={newService.duration}
          />
        </div>
        {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
        <button
          onClick={addService}
          className="w-full bg-[var(--primary)] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Plus size={18} /> Añadir Servicio
        </button>
      </div>

      {/* Lista de servicios */}
      <div className="space-y-3">
        {services.length === 0 && (
          <p className="text-center text-[var(--text-2)] mt-8">Aún no tienes servicios, po.</p>
        )}
        {services.map(s => (
          <div key={s.id} className="flex justify-between items-center p-4 bg-[var(--bg)] border border-[var(--border)] rounded-xl">
            <div>
              <p className="font-bold text-[var(--text-1)]">{s.name}</p>
              <p className="text-xs text-[var(--text-2)] font-medium">
                {s.duration} min · {formatCLP(s.price)}
              </p>
            </div>
            <button
              onClick={() => deleteDoc(doc(db, "services", s.id))}
              className="text-red-400 p-2 hover:bg-red-50 rounded-lg transition-colors"
              title="Eliminar servicio"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}