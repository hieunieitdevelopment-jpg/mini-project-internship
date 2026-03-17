const dropdownService = require("../services/dropdown.service");

// lay tat ca tinh/thanh pho
exports.getProvinces = async (req, res) => {
  try {
    const data = await dropdownService.getProvinces();
    res.json({ success: true, data });
  } catch (err) {
    console.log("loi lay tinh:", err.message);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// lay quan/huyen theo tinh
exports.getDistricts = async (req, res) => {
  try {
    const { provinceId } = req.params;

    const data = await dropdownService.getDistricts(parseInt(provinceId));

    res.json({ success: true, data });
  } catch (err) {
    console.log("loi lay huyen:", err.message);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// lay xa/phuong theo huyen
exports.getWards = async (req, res) => {
  try {
    const { districtId } = req.params;

    const data = await dropdownService.getWards(parseInt(districtId));

    res.json({ success: true, data });
  } catch (err) {
    console.log("loi lay xa:", err.message);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
