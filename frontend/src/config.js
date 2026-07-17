export const SERVER_URL = import.meta.env.PROD 
  ? "https://career-fair-loyh.onrender.com" 
  : (import.meta.env.VITE_SERVER_URL || "http://localhost:5000");
