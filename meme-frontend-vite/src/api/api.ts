import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3001',
});
const token = localStorage.getItem('jwt');
export const createMeme = (formData: FormData) =>
  API.post('/memes/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`,
    },
  });
// Before each request, pull the token from localStorage:
API.interceptors.request.use(config => {
  const token = localStorage.getItem('jwt');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});
//export const getMemes = () => API.get('/memes');
export const getS3Memes = () => API.get('http://localhost:3001/memes/from-s3', {
  headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
});
export const getUserMemes = () => API.get('http://localhost:3001/memes/my-memes', {
  headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
});
export const deleteMeme = (key: string) => API.delete(`/memes/${key}`) ;
