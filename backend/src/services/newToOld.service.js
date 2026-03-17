const mappingModel = require("../models/changeMapping.model");

// Tra cuu nguoc: don vi moi -> tim don vi cu
exports.convertNewToOld = async (province, district, ward) => {
  const conditions = [];
  const values = [];
  let i = 1;

  if (province) {
    conditions.push(`unaccent(new_gp.name) ILIKE unaccent($${i})`);
    values.push(`%${province}%`);
    i++;
  }

  if (district) {
    if (!ward) {
      // khong chon xa -> tim ca huyen va cac xa thuoc huyen
      conditions.push(`(unaccent(new_p.name) ILIKE unaccent($${i}) OR unaccent(new_unit.name) ILIKE unaccent($${i}))`);
    } else {
      // co chon xa -> chi tim theo parent thoi
      conditions.push(`unaccent(new_p.name) ILIKE unaccent($${i})`);
    }
    values.push(`%${district}%`);
    i++;
  }

  if (ward) {
    conditions.push(`unaccent(new_unit.name) ILIKE unaccent($${i})`);
    values.push(`%${ward}%`);
    i++;
  }

  const rows = await mappingModel.findNewToOld(conditions, values);

  // format lai ket qua
  return rows.map((r) => ({
    new_unit: {
      id: r.new_id,
      name: r.new_name,
      code: r.new_code,
      level: r.new_level,
      parent: r.new_parent_name || null,
      grandparent: r.new_grandparent_name || null,
    },
    old_unit: {
      id: r.old_id,
      name: r.old_name,
      code: r.old_code,
      level: r.old_level,
      parent: r.old_parent_name || null,
      grandparent: r.old_grandparent_name || null,
    },
    change: {
      type: r.change_type,
      resolution_number: r.resolution_number,
      description: r.change_desc,
      effective_date: r.effective_date,
    },
  }));
};
