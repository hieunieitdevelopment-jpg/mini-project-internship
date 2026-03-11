export const searchAddress = async (keyword) => {
  const response = await fetch(`/api/address/search?keyword=${keyword}`);
  return response.json();
};