const dropdownModel = require("../models/dropdown.model");

// lay danh sach tinh/thanh pho cho dropdown
exports.getProvinces = async (isActive = true) => {
  const rows = await dropdownModel.findProvinces(isActive);
  console.log(`dropdown provinces: ${rows.length} tinh`);
  return rows;
};

// lay danh sach quan/huyen theo tinh
exports.getDistricts = async (provinceId, isActive = true) => {
  const rows = await dropdownModel.findDistricts(provinceId, isActive);
  console.log(`dropdown districts: provinceId=${provinceId}, active=${isActive}, found ${rows.length}`);
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
