// Central API configuration
// Set VITE_API_BASE_URL in your .env file for production
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001').replace(/\/$/, '')

export default API_BASE_URL
