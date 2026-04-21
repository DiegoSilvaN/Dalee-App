import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

const demoBusinesses = [
  {
    id: "barberia-maestro",
    name: "Barbería El Maestro",
    category: "Barbería",
    comuna: "Providencia",
    address: "Av. Providencia 1234",
    rating: 4.9,
    minPrice: 8000,
    images: ["https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80"],
    schedule: { lun: { open: "09:00", close: "20:00", active: true }, mar: { open: "09:00", close: "20:00", active: true } }
  },
  {
    id: "salon-lumiere",
    name: "Salón Lumière",
    category: "Peluquería",
    comuna: "Las Condes",
    address: "Apoquindo 5555",
    rating: 4.8,
    minPrice: 15000,
    images: ["https://images.unsplash.com/photo-1521590832167-7bfc17484d20?w=800&q=80"],
    schedule: { lun: { open: "10:00", close: "19:00", active: true }, mar: { open: "10:00", close: "19:00", active: true } }
  },
  {
    id: "fade-studio",
    name: "Fade Studio CPT",
    category: "Barbería",
    comuna: "Santiago Centro",
    address: "Moneda 900",
    rating: 4.7,
    minPrice: 10000,
    images: ["https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&q=80"],
    schedule: { lun: { open: "11:00", close: "21:00", active: true } }
  },
  {
    id: "nails-nunoa",
    name: "Nails & Beauty Ñuñoa",
    category: "Manicura",
    comuna: "Ñuñoa",
    address: "Irarrázaval 3000",
    rating: 4.9,
    minPrice: 12000,
    images: ["https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80"],
    schedule: { lun: { open: "10:00", close: "20:00", active: true } }
  },
  {
    id: "estetica-donna",
    name: "Clínica Estética Donna",
    category: "Estética",
    comuna: "Vitacura",
    address: "Vitacura 4000",
    rating: 5.0,
    minPrice: 25000,
    images: ["https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80"],
    schedule: { lun: { open: "09:00", close: "18:00", active: true } }
  },
  {
    id: "barba-roja",
    name: "La Barba Roja",
    category: "Barbería",
    comuna: "Maipú",
    address: "Pajaritos 1500",
    rating: 4.6,
    minPrice: 7000,
    images: ["https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80"],
    schedule: { lun: { open: "10:00", close: "22:00", active: true } }
  }
];

export const seedDatabase = async () => {
  if (localStorage.getItem("dalee_seeded")) return;
  for (const biz of demoBusinesses) {
    await setDoc(doc(db, "businesses", biz.id), biz);
  }
  localStorage.setItem("dalee_seeded", "true");
  console.log("Datos demo inyectados correctamente.");
};