const suggestService = require("../services/suggest.service");

// API goi y don vi hanh chinh
// GET /api/v1/address/suggest?q=keyword&level=ward
exports.suggestUnits = async (req, res, next) => {
  try {
    const { q, level } = req.query;

    // check keyword
    if (!q || q.trim() === "") {
      const error = new Error("Thiếu từ khóa tìm kiếm (q)");
      error.statusCode = 400;
      return next(error);
    }

    // check level hop le
    if (level && !["province", "district", "ward"].includes(level)) {
      const error = new Error("level phải là province, district hoặc ward");
      error.statusCode = 400;
      return next(error);
    }

    const data = await suggestService.suggestUnits(q.trim(), level || null);

    return res.json({ success: true, data });
  } catch (err) {
    console.log("suggest error:", err.message);
    next(err);
  }
};
