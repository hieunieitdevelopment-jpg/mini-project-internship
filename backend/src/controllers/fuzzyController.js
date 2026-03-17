const fuzzyService = require("../services/fuzzy.service");

// API tim kiem gan dung (fuzzy search)
// middleware da validate q, level, direction
exports.fuzzySearch = async (req, res, next) => {
  try {
    const { q, level, direction } = req.query;
    const data = await fuzzyService.fuzzySearch(q.trim(), level || null, direction || null);
    console.log(`fuzzy search: q="${q}", found ${data.length} results`);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
