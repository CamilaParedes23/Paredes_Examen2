import axios from 'axios';

// Configuración base de axios
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para requests
apiClient.interceptors.request.use(
  (config) => {
    console.log('Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses
apiClient.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// Servicio para Purchase Orders
export const purchaseOrderService = {
  // Obtener todas las órdenes con filtros
  getAllOrders: (filters = {}) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.append(key, value);
      }
    });

    return apiClient.get(`/purchase-orders?${params.toString()}`);
  },

  // Obtener orden por ID
  getOrderById: (id) => {
    return apiClient.get(`/purchase-orders/${id}`);
  },

  // Crear nueva orden
  createOrder: (order) => {
    return apiClient.post('/purchase-orders', order);
  },

  // Actualizar orden existente
  updateOrder: (id, order) => {
    return apiClient.put(`/purchase-orders/${id}`, order);
  },

  // Eliminar orden
  deleteOrder: (id) => {
    return apiClient.delete(`/purchase-orders/${id}`);
  },

  // Generar número de orden
  generateOrderNumber: () => {
    return apiClient.get('/purchase-orders/generate-order-number');
  },

  // Health check
  healthCheck: () => {
    return apiClient.get('/purchase-orders/health');
  }
};

// Enums
export const ORDER_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED'
};

export const CURRENCY = {
  USD: 'USD',
  EUR: 'EUR'
};

export const STATUS_LABELS = {
  DRAFT: 'Borrador',
  SUBMITTED: 'Enviado',
  APPROVED: 'Aprobado',
  REJECTED: 'Rechazado',
  CANCELLED: 'Cancelado'
};

export const CURRENCY_LABELS = {
  USD: 'Dólares (USD)',
  EUR: 'Euros (EUR)'
};

export default apiClient;
