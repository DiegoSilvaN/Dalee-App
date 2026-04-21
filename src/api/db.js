import { db } from './firebase';
import { collection, query, where, getDocs, doc, getDoc, addDoc } from 'firebase/firestore';

export const getBusiness = async (id) => {
  const snap = await getDoc(doc(db, "businesses", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const getAvailableSlots = async (businessId, date) => {
  // Simulación del motor: genera bloques de 30 minutos desde las 10:00 hasta las 19:00
  const q = query(
    collection(db, "bookings"),
    where("businessId", "==", businessId),
    where("date", "==", date),
    where("status", "in", ["pending", "confirmed"])
  );
  
  const snapshot = await getDocs(q);
  const occupied = snapshot.docs.map(d => d.data().startTime);

    // Intentar leer el horario del negocio para ese día
  // Días: lun=1, mar=2, mie=3, jue=4, vie=5, sab=6, dom=0
  const dayMap = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'];
  const dayOfWeek = new Date(date + 'T12:00:00').getDay();
  const dayKey = dayMap[dayOfWeek];

  let openHour = 10;
  let closeHour = 20;

  try {
    const bizSnap = await getDoc(doc(db, "businesses", businessId));
    if (bizSnap.exists()) {
      const schedule = bizSnap.data().schedule;
      if (schedule?.[dayKey]?.open) {
        openHour = parseInt(schedule[dayKey].open.split(':')[0], 10);
      }
      if (schedule?.[dayKey]?.close) {
        // CORRECCIÓN: el último slot disponible es 30 min antes del cierre
        closeHour = parseInt(schedule[dayKey].close.split(':')[0], 10) - 1;
      }
    }
  } catch (err) {
    console.error("Error leyendo horario del negocio:", err);
  }

  const slots = [];
  for (let h = openHour; h <= closeHour; h++) {
    for (let m of ['00', '30']) {
      const time = `${h.toString().padStart(2, '0')}:${m}`;
      slots.push({ time, available: !occupied.includes(time) });
    }
  }
  return slots;
};

export const createBooking = async (bookingData) => {
  return await addDoc(collection(db, "bookings"), bookingData);
};