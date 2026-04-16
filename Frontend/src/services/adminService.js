import axios from "axios";

let API_URL = import.meta.env.VITE_API_URL || "/api/v1";
if (API_URL.endsWith('/auth')) {
  API_URL = API_URL.replace('/auth', '');
}

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(`${API_URL}/auth/refresh-token`, {}, { withCredentials: true });
        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export const getDashboardStats = async () => {
    const response = await api.get(`/admin/dashboard`);
    return response.data;
};

export const getAllUsers = async () => {
    const response = await api.get(`/admin/users`);
    return response.data;
};

export const toggleUserStatus = async (userId, isActive) => {
    const response = await api.put(`/admin/users/${userId}/status`, { isActive });
    return response.data;
};

export const getAllApiKeys = async () => {
    const response = await api.get(`/admin/api-keys`);
    return response.data;
};

export const revokeKeyGlobal = async (keyId) => {
    const response = await api.delete(`/admin/api-keys/${keyId}`);
    return response.data;
};

export const deleteUser = async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
};
