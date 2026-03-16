const suggestService = require("../services/suggest.service");

// API goi y don vi hanh chinh
// GET /api/v1/address/suggest?q=keyword&level=ward
exports.suggestUnits = async (req, res) => {
  try {
    const { q, level } = req.query;

    // check keyword
    if (!q || q.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Thiếu từ khóa tìm kiếm (q)",
      });
    }

    // check level hop le
    if (level && !["province", "district", "ward"].includes(level)) {
      return res.status(400).json({
        success: false,
        message: "level phải là province, district hoặc ward",
      });
    }

    const data = await suggestService.suggestUnits(q.trim(), level || null);

    return res.json({ success: true, data });
  } catch (err) {
    console.log("suggest error:", err.message);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
