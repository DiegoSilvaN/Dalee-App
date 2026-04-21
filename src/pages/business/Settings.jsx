import React, { useState, useEffect } from 'react';
import { db } from '../../api/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { uploadBusinessImage } from '../../api/storage';
import { Camera, Save, Clock, ShieldCheck, Loader2 } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const DAYS = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];

export default function Settings({ businessId }) {
  const [bizData, setBizData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

    useEffect(() => {
    const fetchBiz = async () => {
      if (!businessId) return;
      try {
        const snap = await getDoc(doc(db, "businesses", businessId));
        if (snap.exists()) setBizData(snap.data());
      } catch (err) {
        console.error("Error cargando configuración:", err);
      }
    };
    fetchBiz();
  }, [businessId]);

  const handleUpdate = async () => {
    if (!bizData) return;
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      await updateDoc(doc(db, "businesses", businessId), bizData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Error guardando:", err);
      setError('No se pudo guardar. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadBusinessImage(businessId, file);
      if (url) {
        const newImages = [...(bizData.images || []), url];
        setBizData(prev => ({ ...prev, images: newImages }));
      }
    } catch (err) {
      console.error("Error subiendo imagen:", err);
    } finally {
      setUploading(false);
    }
  };

  const updateSchedule = (day, field, value) => {
    setBizData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: { ...prev.schedule?.[day], [field]: value }
      }
    }));
  };

  if (!bizData) return (
    <div className="p-10 text-center font-bold text-[var(--text-1)]">Cargando...</div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 pb-20 bg-[var(--surface)] min-h-screen">
      <header className="flex justify-between items-center border-b border-[var(--border)] pb-6">
        <h1 className="text-3xl font-black text-[var(--text-1)]">Configuración</h1>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-green-600 text-sm font-bold">¡Guardado!</span>
          )}
          {error && (
            <span className="text-red-500 text-sm font-bold">{error}</span>
          )}
          <Button onClick={handleUpdate} disabled={saving}>
            {saving
              ? <Loader2 className="animate-spin w-4 h-4" />
              : <Save className="w-4 h-4" />
            }
            Guardar
          </Button>
        </div>
      </header>

      <section className="bg-[var(--bg)] p-6 rounded-2xl border border-[var(--border)]">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-[var(--text-1)]">
          <Camera className="text-[var(--primary)] w-5 h-5" /> Perfil e Imágenes
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Input
              label="Nombre del Negocio"
              value={bizData.name || ''}
              onChange={e => setBizData({ ...bizData, name: e.target.value })}
            />
            <Input
              label="Dirección"
              value={bizData.address || ''}
              onChange={e => setBizData({ ...bizData, address: e.target.value })}
            />
            <Input
              label="Comuna"
              value={bizData.comuna || ''}
              onChange={e => setBizData({ ...bizData, comuna: e.target.value })}
            />
          </div>
          <div className="space-y-4">
            <label className="text-xs font-bold text-[var(--text-2)] uppercase">Fotos del Local</label>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              <label className="w-24 h-24 border-2 border-dashed border-[var(--primary)]/30 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-[var(--primary)]/5 shrink-0 transition-colors">
                {uploading
                  ? <Loader2 className="animate-spin text-[var(--primary)]" />
                  : <>
                      <Camera className="text-[var(--primary)]" />
                      <span className="text-[10px] font-bold text-[var(--primary)] mt-1">Subir</span>
                    </>
                }
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
              </label>
              {bizData.images?.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt="Local"
                  className="w-24 h-24 object-cover rounded-xl border border-[var(--border)] shrink-0"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Horario */}
      <section className="bg-[var(--bg)] p-6 rounded-2xl border border-[var(--border)]">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-[var(--text-1)]">
          <Clock className="text-[var(--primary)] w-5 h-5" /> Horario
        </h3>
        <div className="space-y-2">
          {DAYS.map(day => (
            <div key={day} className="flex items-center justify-between p-3 bg-[var(--surface)] rounded-xl">
              <span className="capitalize font-bold w-12 text-[var(--text-1)]">{day}</span>
              <div className="flex items-center gap-4">
                <input
                  type="time"
                  value={bizData.schedule?.[day]?.open || "09:00"}
                  className="bg-transparent font-bold text-[var(--primary)] outline-none"
                  onChange={e => updateSchedule(day, 'open', e.target.value)}
                />
                <span className="text-[var(--text-2)]">a</span>
                <input
                  type="time"
                  value={bizData.schedule?.[day]?.close || "20:00"}
                  className="bg-transparent font-bold text-[var(--primary)] outline-none"
                  onChange={e => updateSchedule(day, 'close', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}