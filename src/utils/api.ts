import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://testmagic-backend.onrender.com'
});
