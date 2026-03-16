const suggestService = require("../services/suggest.service");

/**
 * API gợi ý đơn vị hành chính
 * GET /api/v1/address/suggest?q=keyword&level=ward
 *
 * Query params:
 *   - q (bắt buộc): từ khóa tìm kiếm, VD: "phu loc", "ea tam"
 *   - level (tuỳ chọn): 'province' | 'district' | 'ward'
 */
exports.suggestUnits = async (req, res) => {
  try {
    const { q, level } = req.query;

    // Kiểm tra keyword có được truyền không
    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cần truyền từ khóa tìm kiếm (q)",
      });
    }

    // Validate level nếu có truyền
    const validLevels = ["province", "district", "ward"];
    if (level && !validLevels.includes(level)) {
      return res.status(400).json({
        success: false,
        message: "Level không hợp lệ. Chọn: province, district, hoặc ward",
      });
    }

    // Gọi service để tìm kiếm
    const result = await suggestService.suggestUnits(q.trim(), level || null);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Lỗi suggest:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ",
    });
  }
};
