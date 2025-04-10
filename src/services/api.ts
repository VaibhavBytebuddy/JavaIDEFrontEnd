import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const getFiles = () => api.get('/files');
export const saveFile = (file: { filename: string; content: string }) => 
  api.post('/files', file);
export const updateFile = (id: number, file: { filename: string; content: string }) => 
  api.put(`/files/${id}`, file);
export const executeCode = (code: string) => 
  api.post('/execute', { code });