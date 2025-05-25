import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3001', // backend URL
});

export const createMeme = (meme: { title: string; imageUrl: string }) =>
  API.post('/memes', meme);

export const getMemes = () => API.get('/memes');