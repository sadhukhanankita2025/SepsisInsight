// API Configuration
// This file centralizes all API calls and uses environment variables

const getAPIBase = () => {
  // During development on localhost
  if (window.location.localhost || window.location.port === '5173' || window.location.port === '3000') {
    return import.meta.env.VITE_API_URL || 'http://localhost:5000';
  }
  
  // During production on Netlify, use Railway backend URL
  return import.meta.env.VITE_API_URL || '';
};

export const API_BASE = getAPIBase();

export const API_ENDPOINTS = {
  health: `${API_BASE}/api/health`,
  predictAudio: `${API_BASE}/predict`,
  downloadAudioReport: `${API_BASE}/download-report`,
  predictClinical: `${API_BASE}/predict-clinical`,
  downloadClinicalReport: `${API_BASE}/download-clinical-report`,
};

export default API_ENDPOINTS;
