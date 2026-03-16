const fuzzyService = require("../services/fuzzy.service");

// API tim kiem gan dung (fuzzy search)
exports.fuzzySearch = async (req, res) => {
  try {
    const { q, level } = req.query;

    if (!q) {
      return res
        .status(400)
        .json({ success: false, message: "Cần truyền q" });
    }

    // validate
    const allowedLevels = ["province", "district", "ward"];
    if (level && !allowedLevels.includes(level)) {
      return res.status(400).json({
        success: false,
        message: "Level không hợp lệ",
      });
    }

    const data = await fuzzyService.fuzzySearch(q.trim(), level || null);
    console.log(`fuzzy search: q="${q}", found ${data.length} results`);

    res.json({ success: true, data });
  } catch (err) {
    console.log("fuzzy search loi:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
