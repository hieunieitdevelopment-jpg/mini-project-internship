import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// === Dropdown APIs ===

// lay danh sach tinh
export const fetchProvinces = async () => {
  const res = await api.get("/provinces");
  return res.data.data;
};

// lay danh sach huyen theo tinh
export const fetchDistricts = async (provinceId) => {
  const res = await api.get(`/provinces/${provinceId}/districts`);
  return res.data.data;
};

// lay danh sach xa theo huyen
// active=false -> lay xa cu, active=true -> lay xa moi
export const fetchWards = async (districtId, active = true) => {
  const res = await api.get(`/districts/${districtId}/wards`, {
    params: { active },
  });
  return res.data.data;
};

// lay danh sach xa theo tinh (bo qua huyen, dung cho tab moi -> cu)
export const fetchWardsByProvince = async (provinceId, active = true) => {
  const res = await api.get(`/provinces/${provinceId}/wards`, {
    params: { active },
  });
  return res.data.data;
};

// === Mapping APIs ===

// tra cuu cu -> moi
export const fetchOldToNew = async (province, district, ward) => {
  const params = { direction: "old-to-new" };
  if (province) params.province = province;
  if (district) params.district = district;
  if (ward) params.ward = ward;

  const res = await api.get("/mappings", { params });
  return res.data.data;
};

// tra cuu moi -> cu
export const fetchNewToOld = async (province, district, ward) => {
  const params = { direction: "new-to-old" };
  if (province) params.province = province;
  if (district) params.district = district;
  if (ward) params.ward = ward;

  const res = await api.get("/mappings", { params });
  return res.data.data;
};

// === Quick Search APIs ===

// goi y don vi hanh chinh (autocomplete)
export const fetchSuggest = async (q, direction) => {
  const params = { q };
  if (direction) params.direction = direction;
  const res = await api.get("/units/suggest", { params });
  return res.data.data;
};

// tim kiem fuzzy kem mapping
export const fetchFuzzySearch = async (q, direction) => {
  const params = { q };
  if (direction) params.direction = direction;
  const res = await api.get("/units/search", { params });
  return res.data.data;
};

export default api;
