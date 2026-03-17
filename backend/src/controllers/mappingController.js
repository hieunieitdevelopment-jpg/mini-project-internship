const oldToNewService = require("../services/oldToNew.service");
const newToOldService = require("../services/newToOld.service");

// GET /api/v1/mappings?direction=old-to-new|new-to-old&province=...&district=...&ward=...
exports.getMappings = async (req, res) => {
  try {
    const { direction, province, district, ward } = req.query;

    if (!province && !district && !ward) {
      return res.status(400).json({
        success: false,
        message: "Cần ít nhất 1 thông tin: province, district hoặc ward",
      });
    }

    let result;
    if (direction === "old-to-new") {
      result = await oldToNewService.convertOldToNew(province, district, ward);
    } else {
      result = await newToOldService.convertNewToOld(province, district, ward);
    }

    console.log(`mapping ${direction}: found ${result.length} results`);
    res.json({ success: true, data: result });
  } catch (err) {
    console.log("mapping error:", err.message);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
