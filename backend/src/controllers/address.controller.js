exports.convertOldToNew = (req, res) => {
  res.json({ message: "Convert old address to new address" });
};

exports.convertNewToOld = (req, res) => {
  res.json({ message: "Convert new address to old address" });
};

exports.suggestAddress = (req, res) => {
  res.json({ message: "Suggest address" });
};

exports.fuzzySearch = (req, res) => {
  res.json({ message: "Fuzzy search address" });
};