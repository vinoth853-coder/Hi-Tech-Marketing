import axios from 'axios';
import { getCookie } from 'cookies-next';

const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

API.interceptors.request.use((req) => {
    const token = getCookie('token') ;
    req.headers.Authorization = token && `Bearer ${token}`;

    return req;
});

export default API;
