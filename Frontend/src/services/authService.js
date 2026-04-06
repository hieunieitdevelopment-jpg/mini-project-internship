import axios from "axios";

const API = import.meta.env.VITE_API_URL || "/api/v1/auth";
const GOOGLE_AUTH_CALLBACK_URL =
  import.meta.env.VITE_GOOGLE_AUTH_CALLBACK_URL || `${API}/google/callback`;

export const login = async (data) => {
  return axios.post(`${API}/login`, data);
};

export const register = async (data) => {
  return axios.post(`${API}/register`, data);
}; 

export const googleAuth = async (idToken) => {
  return axios.post(GOOGLE_AUTH_CALLBACK_URL, { idToken });
};