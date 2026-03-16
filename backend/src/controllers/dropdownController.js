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
    const { provinceId } = req.query;

    if (!provinceId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu provinceId",
      });
    }

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
    const { districtId } = req.query;

    if (!districtId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu districtId",
      });
    }

    const data = await dropdownService.getWards(parseInt(districtId));

    res.json({ success: true, data });
  } catch (err) {
    console.log("loi lay xa:", err.message);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
