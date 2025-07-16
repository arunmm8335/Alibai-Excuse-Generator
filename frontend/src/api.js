import axios from 'axios';

// Determine baseURL: use env var if set, otherwise fallback to localhost
const baseURL = import.meta.env.VITE_API_URL ||
    (window?.location?.hostname === 'localhost' || window?.location?.hostname === '127.0.0.1'
        ? 'http://localhost:5000/api'
        : 'https://alibai-backend.onrender.com/api');

const api = axios.create({
    baseURL,
    // You can add default headers here if needed
});

export default api; 
