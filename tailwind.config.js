/** @type {import('tailwindcss').Config} */
export default {
  // Le dice a Tailwind dónde buscar las clases para compilarlas
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Activa el modo oscuro manual por clases (el que controlamos con nuestro toggle)
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        // Conectamos los colores de Tailwind con tus variables de CSS (en index.css)
        primary: "var(--primary)",
        "primary-light": "#ECEBFF", // Fondo suave para badges o botones ghost
        "primary-dark": "#5249D8",  // Color para el botón al hacer hover
        bg: "var(--bg)",
        surface: "var(--surface)",
        "text-1": "var(--text-1)",
        "text-2": "var(--text-2)",
        border: "var(--border)",
        
        // Colores de estado duro para éxito, advertencias y errores
        success: "#10B981", 
        warning: "#F59E0B", 
        danger: "#EF4444",  
      },
      fontFamily: {
        // Forzamos Inter como la tipografía base de la app
        sans: ['Inter', 'sans-serif'], 
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"), // El plugin para las transiciones fluidas
  ],
}