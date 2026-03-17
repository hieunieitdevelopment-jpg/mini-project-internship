const suggestService = require("../services/suggest.service");

// API goi y don vi hanh chinh
// middleware da validate q, level, direction
exports.suggestUnits = async (req, res, next) => {
  try {
    const { q, level, direction } = req.query;
    const data = await suggestService.suggestUnits(q.trim(), level || null, direction || null);
    return res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
