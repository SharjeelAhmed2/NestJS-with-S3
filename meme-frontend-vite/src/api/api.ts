import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3001',
});

export const createMeme = (formData: FormData) =>
  API.post('/memes/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const getMemes = () => API.get('/memes');
