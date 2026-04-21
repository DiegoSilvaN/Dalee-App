import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../../api/firebase';
import { doc, getDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { getAvailableSlots } from '../../api/db';
import { formatCLP } from '../../utils/format';
import { ArrowLeft, CheckCircle, Calendar as CalIcon, Clock, Scissors } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function BookingFlow() {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [business, setBusiness] = useState(null);
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);

  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(false);
  // CORRECCIÓN: manejo de error en confirmación
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bizSnap = await getDoc(doc(db, "businesses", businessId));
        if (bizSnap.exists()) {
          setBusiness({ id: bizSnap.id, ...bizSnap.data() });
        } else {
          // Negocio no encontrado
          navigate('/', { replace: true });
        }

        const srvQuery = query(collection(db, "services"), where("businessId", "==", businessId));
        const srvSnap = await getDocs(srvQuery);
        setServices(srvSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Error cargando negocio:", err);
      }
    };
    fetchData();
  }, [businessId, navigate]);

  useEffect(() => {
    if (step === 2) {
      getAvailableSlots(businessId, selectedDate).then(setSlots).catch(console.error);
    }
  }, [selectedDate, step, businessId]);

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    const code = 'DA-' + Math.floor(1000 + Math.random() * 9000);

    try {
      await addDoc(collection(db, "bookings"), {
        businessId,
        businessName: business.name,
        clientId: auth.currentUser?.uid || 'anon',
        // CORRECCIÓN: usar displayName si existe, si no "Cliente Dalee"
        clientName: auth.currentUser?.displayName || "Cliente Dalee",
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        date: selectedDate,
        startTime: selectedTime,
        price: selectedService.price,
        status: "pending",
        code,
        createdAt: new Date().toISOString(),
      });
      setStep(4);
    } catch (err) {
      console.error("Error al confirmar reserva:", err);
      setError("Hubo un problema al confirmar tu hora. Intenta de nuevo, po.");
    } finally {
      setLoading(false);
    }
  };

  if (!business) return (
    <div className="h-screen flex justify-center items-center font-bold text-[var(--primary)]">
      Cargando local...
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--surface)] pb-24">
      {/* Header fijo */}
      <header className="bg-[var(--bg)] p-4 sticky top-0 z-10 border-b border-[var(--border)] flex items-center gap-4">
        {step < 4 && (
          <button
            onClick={() => step === 1 ? navigate(-1) : setStep(step - 1)}
            className="p-2 hover:bg-[var(--surface)] rounded-full"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        <div>
          <h2 className="font-black text-lg text-[var(--text-1)]">{business.name}</h2>
          {/* CORRECCIÓN: el paso 4 es pantalla de éxito, no se muestra "Paso 4 de 3" */}
          {step < 4 && <p className="text-xs text-[var(--text-2)]">Paso {step} de 3</p>}
        </div>
      </header>

      <main className="p-6">
        {/* PASO 1: Elegir Servicio */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Scissors className="text-[var(--primary)]" /> ¿Qué te harás hoy?
            </h3>
            <div className="space-y-3">
              {services.map(srv => (
                <div
                  key={srv.id}
                  onClick={() => { setSelectedService(srv); setStep(2); }}
                  className="bg-[var(--bg)] p-4 rounded-2xl border border-[var(--border)] flex justify-between items-center cursor-pointer hover:border-[var(--primary)] transition-all shadow-sm"
                >
                  <div>
                    <h4 className="font-bold text-lg text-[var(--text-1)]">{srv.name}</h4>
                    <p className="text-sm text-[var(--text-2)]">{srv.duration} min</p>
                  </div>
                  <span className="font-black text-[var(--primary)] bg-[var(--primary)]/10 px-3 py-1 rounded-lg">
                    {formatCLP(srv.price)}
                  </span>
                </div>
              ))}
              {services.length === 0 && (
                <p className="text-[var(--text-2)]">Este local aún no ha configurado sus servicios.</p>
              )}
            </div>
          </div>
        )}

        {/* PASO 2: Elegir Fecha y Hora */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-[var(--text-1)]">
              <CalIcon className="text-[var(--primary)]" /> ¿Cuándo vas?
            </h3>

            <input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(null); }}
              className="w-full p-4 bg-[var(--bg)] border border-[var(--border)] rounded-2xl mb-6 font-bold text-lg outline-none focus:border-[var(--primary)] shadow-sm text-[var(--text-1)]"
            />

            <h4 className="font-bold mb-4 flex items-center gap-2 text-[var(--text-1)]">
              <Clock className="text-[var(--text-2)] w-5 h-5" /> Horas Disponibles
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {slots.map(slot => (
                <button
                  key={slot.time}
                  disabled={!slot.available}
                  onClick={() => setSelectedTime(slot.time)}
                  className={`p-3 rounded-xl font-bold text-sm transition-all border-2 
                    ${!slot.available
                      ? 'bg-[var(--surface)] text-[var(--text-2)]/40 border-transparent cursor-not-allowed'
                      : selectedTime === slot.time
                        ? 'bg-[var(--primary)] border-[var(--primary)] text-white scale-105'
                        : 'bg-[var(--bg)] border-[var(--border)] text-[var(--text-1)] hover:border-[var(--primary)]/50'
                    }`}
                >
                  {slot.time}
                </button>
              ))}
              {slots.length === 0 && (
                <p className="col-span-3 text-[var(--text-2)] text-sm">
                  No hay horas disponibles para esta fecha.
                </p>
              )}
            </div>

            <Button
              className="w-full mt-8"
              disabled={!selectedTime}
              onClick={() => setStep(3)}
            >
              Continuar a Confirmación
            </Button>
          </div>
        )}

        {/* PASO 3: Resumen y Confirmación */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold mb-6 text-[var(--text-1)]">Resumen de tu Hora</h3>
            <div className="bg-[var(--bg)] p-6 rounded-3xl border border-[var(--border)] shadow-sm space-y-4 mb-8">
              <div className="flex justify-between border-b border-[var(--border)] pb-4">
                <span className="text-[var(--text-2)] font-medium">Servicio</span>
                <span className="font-bold text-[var(--text-1)]">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border)] pb-4">
                <span className="text-[var(--text-2)] font-medium">Fecha</span>
                <span className="font-bold text-[var(--text-1)]">{selectedDate}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border)] pb-4">
                <span className="text-[var(--text-2)] font-medium">Hora</span>
                <span className="font-bold text-[var(--text-1)]">{selectedTime}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-lg font-black text-[var(--text-1)]">Total a pagar en local</span>
                <span className="text-xl font-black text-[var(--primary)]">
                  {formatCLP(selectedService?.price)}
                </span>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-lg mb-4">
                {error}
              </p>
            )}

            <Button className="w-full py-4 text-lg" onClick={handleConfirm} disabled={loading}>
              {loading ? "Procesando..." : "Confirmar Reserva"}
            </Button>
          </div>
        )}

        {/* PASO 4: Éxito */}
        {step === 4 && (
          <div className="flex flex-col items-center justify-center text-center mt-10 animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="text-green-500 w-12 h-12" />
            </div>
            <h2 className="text-3xl font-black mb-2 text-[var(--text-1)]">¡Dalee!</h2>
            <p className="text-[var(--text-2)] mb-8">Tu hora está confirmada, po.</p>
            <Button onClick={() => navigate('/mis-reservas')} variant="outline">
              Ver mis reservas
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
