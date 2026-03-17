const unitModel = require("../models/administrativeUnit.model");

// Goi y don vi hanh chinh - dung ILIKE de tim nhanh
exports.suggestUnits = async (keyword, level, direction) => {
  const conditions = [];
  const params = [];
  let idx = 1;

  // tim ten chua keyword (bo dau)
  conditions.push(`unaccent(u.name) ILIKE unaccent($${idx})`);
  params.push(`%${keyword}%`);
  idx++;

  if (level) {
    conditions.push(`u.level = $${idx}`);
    params.push(level);
    idx++;
  }

  // filter theo direction: cu->moi tim don vi cu (inactive), moi->cu tim don vi moi (active)
  if (direction === "old-to-new") {
    conditions.push(`u.is_active = FALSE`);
  } else if (direction === "new-to-old") {
    conditions.push(`u.is_active = TRUE`);
  }

  const rows = await unitModel.searchByKeyword(conditions, params, 10);

  // map ket qua
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    code: r.code,
    level: r.level,
    is_active: r.is_active,
    parent: r.parent_name || null,
    grandparent: r.grandparent_name || null,
  }));
};
