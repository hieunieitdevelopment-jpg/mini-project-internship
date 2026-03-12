import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const login = async (data) => {
  return axios.post(`${API}/login`, data);
};

export const register = async (data) => {
  return axios.post(`${API}/register`, data);
};