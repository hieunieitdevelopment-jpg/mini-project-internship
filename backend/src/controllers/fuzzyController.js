const fuzzyService = require("../services/fuzzy.service");

/**
 * API tìm kiếm gần đúng đơn vị hành chính (Fuzzy Search)
 * GET /api/v1/address/fuzzy-search?q=keyword&level=ward
 *
 * Query params:
 *   - q (bắt buộc): từ khóa tìm kiếm, VD: "phu lok", "ea tam"
 *   - level (tuỳ chọn): 'province' | 'district' | 'ward'
 *
 * Trả về: kết quả chi tiết kèm score tương đồng và mapping cũ↔mới
 */
exports.fuzzySearch = async (req, res) => {
  try {
    const { q, level } = req.query;

    // Validate keyword
    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cần truyền từ khóa tìm kiếm (q)",
      });
    }

    // Validate level nếu có
    const validLevels = ["province", "district", "ward"];
    if (level && !validLevels.includes(level)) {
      return res.status(400).json({
        success: false,
        message: "Level không hợp lệ. Chọn: province, district, hoặc ward",
      });
    }

    const result = await fuzzyService.fuzzySearch(q.trim(), level || null);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Lỗi fuzzy search:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ",
    });
  }
};
