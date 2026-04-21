import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../api/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Search, MapPin, Star } from 'lucide-react';
import { formatCLP } from '../../utils/format';

export default function Explore() {
  const [businesses, setBusinesses] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "businesses"), (snapshot) => {
      setBusinesses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const filtered = businesses.filter(b =>
    b.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      <header className="p-6 bg-[var(--bg)] sticky top-0 z-10 border-b border-[var(--border)]">
        <h1 className="text-2xl font-black text-[var(--text-1)] mb-4">Descubre</h1>
        <div className="relative">
          <Search className="absolute left-3 top-3 text-[var(--text-2)] w-5 h-5" />
          <input
            type="text"
            placeholder="¿Qué servicio buscas?"
            className="w-full pl-10 pr-4 py-3 bg-[var(--surface)] rounded-xl border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] outline-none text-[var(--text-1)]"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <main className="p-6 space-y-6">
        {filtered.length === 0 && (
          <p className="text-[var(--text-2)] text-center mt-12">
            {businesses.length === 0 ? 'Cargando negocios...' : 'No encontramos resultados, po.'}
          </p>
        )}

        {filtered.map(biz => (
          <div key={biz.id} className="bg-[var(--bg)] rounded-2xl overflow-hidden shadow-sm border border-[var(--border)]">
            <div className="h-40 bg-[var(--primary)]/10 flex items-center justify-center overflow-hidden">
              {biz.images?.[0] ? (
                <img
                  src={biz.images[0]}
                  className="w-full h-full object-cover"
                  alt={biz.name}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <span className="text-5xl font-black text-[var(--primary)]/30">
                  {biz.name?.charAt(0) || 'D'}
                </span>
              )}
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-[var(--text-1)]">{biz.name}</h3>
                <span className="flex items-center text-sm font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg">
                  <Star className="w-3 h-3 fill-current mr-1" />
                  {biz.rating || 'Nuevo'}
                </span>
              </div>
              <p className="text-[var(--text-2)] text-sm flex items-center mt-1">
                <MapPin className="w-3 h-3 mr-1" /> {biz.comuna || 'Santiago'}
              </p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-[var(--primary)] font-black">
                  {formatCLP(biz.minPrice || 8000)}
                </span>
                <button
                  onClick={() => navigate(`/reserva/${biz.id}`)}
                  className="bg-[var(--primary)] text-white px-4 py-2 rounded-xl font-bold text-sm hover:scale-105 transition-transform"
                >
                  Reservar
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
