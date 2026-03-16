const fuzzyService = require("../services/fuzzy.service");

// API tim kiem gan dung (fuzzy search)
exports.fuzzySearch = async (req, res, next) => {
  try {
    const { q, level } = req.query;

    if (!q) {
      const error = new Error("Cần truyền q");
      error.statusCode = 400;
      return next(error);
    }

    // validate
    const allowedLevels = ["province", "district", "ward"];
    if (level && !allowedLevels.includes(level)) {
      const error = new Error("Level không hợp lệ");
      error.statusCode = 400;
      return next(error);
    }

    const data = await fuzzyService.fuzzySearch(q.trim(), level || null);
    console.log(`fuzzy search: q="${q}", found ${data.length} results`);

    res.json({ success: true, data });
  } catch (err) {
    console.log("fuzzy search loi:", err);
    next(err);
  }
};
