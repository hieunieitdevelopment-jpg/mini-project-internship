import axios from "axios";

let API_URL = import.meta.env.VITE_API_URL || "/api/v1";
// Nếu VITE_API_URL đang có đuôi /auth (do cấu hình cũ), ta cắt đi để thành base url chuẩn
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
        // Xóa thông tin đăng nhập nếu refresh token cũng hết hạn
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export const listApiKeys = async () => {
  const response = await api.get(`/api-keys`);
  return response.data;
};

export const createApiKey = async (name) => {
  const response = await api.post(`/api-keys`, { name });
  return response.data;
};

export const revokeApiKey = async (id) => {
  const response = await api.delete(`/api-keys/${id}`);
  return response.data;
};

export const getUsageStats = async () => {
  const response = await api.get(`/api-keys/usage`);
  return response.data;
};

export const getDailyStats = async (id) => {
  const response = await api.get(`/api-keys/${id}/usage/daily`);
  return response.data;
};
