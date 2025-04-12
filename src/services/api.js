import axios from 'axios';
const api = axios.create({
    baseURL: '/api',
});
export const getFiles = () => api.get('/files');
export const saveFile = (file) => api.post('/files', file);
export const updateFile = (id, file) => api.put(`/files/${id}`, file);
export const executeCode = (code) => api.post('/execute', { code });
