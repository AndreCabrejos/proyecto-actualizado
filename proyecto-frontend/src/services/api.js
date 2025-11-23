import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Agrega el token a cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Maneja errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  registrar: async (datosUsuario) => {
    const response = await api.post('/auth/register', datosUsuario);
    return response.data;
  },

  iniciarSesion: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  obtenerUsuarioActual: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const canalesAPI = {
  obtenerTodos: async () => {
    const response = await api.get('/canales');
    return response.data;
  },

  obtenerPorId: async (id) => {
    const response = await api.get(`/canales/${id}`);
    return response.data;
  },

  crearOActualizar: async (datosCanal) => {
    const response = await api.post('/canales', datosCanal);
    return response.data;
  },

  obtenerMiCanal: async () => {
    const response = await api.get('/canales/me/data');
    return response.data;
  },
};

export const monedasAPI = {
  actualizarMonedas: async (userId, delta) => {
    const response = await api.post(`/users/${userId}/monedas`, { delta });
    return response.data;
  },
};

export const regalosAPI = {
  obtenerTodos: async () => {
    const response = await api.get('/regalos');
    return response.data;
  },

  enviarRegalo: async (datosRegalo) => {
    const response = await api.post('/regalos/enviar', datosRegalo);
    return response.data;
  },
};

export const nivelesAPI = {
  obtenerTodos: async () => {
    const response = await api.get('/viewer-levels');
    return response.data;
  },
};

export const guardarSesion = (token, usuario) => {
  localStorage.setItem('token', token);
  localStorage.setItem('currentUser', JSON.stringify(usuario));
};

export const cerrarSesion = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
};

export const obtenerUsuarioLocal = () => {
  const usuario = localStorage.getItem('currentUser');
  return usuario ? JSON.parse(usuario) : null;
};

export const haySesionActiva = () => {
  return !!localStorage.getItem('token');
};

export default api;
