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

//export const getMemes = () => API.get('/memes');
export const getS3Memes = () => API.get('/memes/from-s3');