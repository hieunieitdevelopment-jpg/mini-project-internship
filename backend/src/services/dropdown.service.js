const dropdownModel = require("../models/dropdown.model");

// lay danh sach tinh/thanh pho cho dropdown
exports.getProvinces = async () => {
  const rows = await dropdownModel.findProvinces();
  console.log(`dropdown provinces: ${rows.length} tinh`);
  return rows;
};

// lay danh sach quan/huyen theo tinh
exports.getDistricts = async (provinceId) => {
  const rows = await dropdownModel.findDistricts(provinceId);
  console.log(`dropdown districts: provinceId=${provinceId}, found ${rows.length}`);
  return rows;
};

// lay danh sach xa/phuong theo huyen
exports.getWards = async (districtId, isActive = true) => {
  const rows = await dropdownModel.findWards(districtId, isActive);
  console.log(`dropdown wards: districtId=${districtId}, active=${isActive}, found ${rows.length}`);
  return rows;
};

// lay danh sach xa/phuong theo tinh (bo qua huyen)
exports.getWardsByProvince = async (provinceId, isActive = true) => {
  const rows = await dropdownModel.findWardsByProvince(provinceId, isActive);
  console.log(`dropdown wards by province: provinceId=${provinceId}, active=${isActive}, found ${rows.length}`);
  return rows;
};
