import axios from "axios";

const API = import.meta.env.VITE_API_URL || "/api/v1/auth";
const GOOGLE_AUTH_CALLBACK_URL =
  import.meta.env.VITE_GOOGLE_AUTH_CALLBACK_URL || `${API}/google/callback`;

const api = axios.create({
  baseURL: API,
  withCredentials: true
});

export const login = async (data) => {
  return api.post(`/login`, data);
};

export const register = async (data) => {
  return api.post(`/register`, data);
}; 

export const googleAuth = async (idToken) => {
  return api.post(`/google/callback`, { idToken });
};

export const getMe = async () => {
  return api.get(`/me`);
};

export const logout = async () => {
  return api.post(`/logout`);
};