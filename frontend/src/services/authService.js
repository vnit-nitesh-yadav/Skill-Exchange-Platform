import axios from 'axios';
import API_URL from '../api';

const AUTH_URL = `${API_URL}/api/auth`;

export const register = async (userData) => {
    return await axios.post(`${AUTH_URL}/register`, userData);
};

export const login = async (userData) => {
    const response = await axios.post(`${AUTH_URL}/login`, userData);
    localStorage.setItem('token', response.data.token);
    return response;
};

export const logout = () => {
    localStorage.removeItem('token');
};
