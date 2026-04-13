const dropdownService = require("../services/dropdown.service");
const AppError = require("../utils/AppError");

// lay tat ca tinh/thanh pho
exports.getProvinces = async (req, res, next) => {
  try {
    let isActive = true;
    if (req.query.active === "false") isActive = false;
    else if (req.query.active === "all") isActive = null;
    const data = await dropdownService.getProvinces(isActive);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// lay quan/huyen theo tinh
exports.getDistricts = async (req, res, next) => {
  try {
    let isActive = true;
    if (req.query.active === "false") isActive = false;
    else if (req.query.active === "all") isActive = null;
    const { provinceId } = req.params;
    const data = await dropdownService.getDistricts(parseInt(provinceId), isActive);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// lay xa/phuong theo huyen
exports.getWards = async (req, res, next) => {
  try {
    const { districtId } = req.params;
    let isActive = true;
    if (req.query.active === "false") isActive = false;
    else if (req.query.active === "all") isActive = null;
    const data = await dropdownService.getWards(parseInt(districtId), isActive);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// lay xa/phuong theo tinh (bo qua huyen, dung cho tab moi -> cu)
exports.getWardsByProvince = async (req, res, next) => {
  try {
    const { provinceId } = req.params;
    let isActive = true;
    if (req.query.active === "false") isActive = false;
    else if (req.query.active === "all") isActive = null;
    const data = await dropdownService.getWardsByProvince(parseInt(provinceId), isActive);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
