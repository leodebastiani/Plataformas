import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }),
};

export const userService = {
    getAll: () => api.get('/users'),
    create: (data: any) => api.post('/users', data),
    update: (id: string, data: any) => api.put(`/users/${id}`, data),
    delete: (id: string) => api.delete(`/users/${id}`),
    export: () => api.get('/users/export', { responseType: 'blob' }),
};

export const sectorService = {
    getAll: () => api.get('/sectors'),
    create: (data: any) => api.post('/sectors', data),
    update: (id: string, data: any) => api.put(`/sectors/${id}`, data),
    delete: (id: string) => api.delete(`/sectors/${id}`),
};

export const platformService = {
    getAll: (params?: any) => api.get('/platforms', { params }),
    create: (data: any) => api.post('/platforms', data),
    update: (id: string, data: any) => api.put(`/platforms/${id}`, data),
    delete: (id: string) => api.delete(`/platforms/${id}`),
    export: () => api.get('/platforms/export', { responseType: 'blob' }),
};

export const adminService = {
    toggleAdmin: (id: string) => api.patch(`/admin/users/${id}/toggle-admin`),
    getExpiringPlatforms: () => api.get('/admin/expiring-platforms'),
};

export default api;
