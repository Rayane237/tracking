import axios from 'axios';

// Use environment variable or fallback to production Railway URL
export const API_URL = import.meta.env.VITE_API_URL || 'https://dubai-global-express-api-production.up.railway.app/api';

const http = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('dge_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getAssetUrl(url) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_URL.replace('/api', '')}${url}`;
}

export default http;

