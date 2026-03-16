const mappingModel = require("../models/changeMapping.model");


// Tim kiem don vi cu -> moi
exports.convertOldToNew = async (province, district, ward) => {
  // xay dung dieu kien where dong
  const conditions = [];
  const values = [];
  let i = 1;

  // province -> match ong (grandparent)
  if (province) {
    conditions.push(`unaccent(old_gp.name) ILIKE unaccent($${i})`);
    values.push(`%${province}%`);
    i++;
  }

  // district -> match cha (parent)
  if (district) {
    conditions.push(`unaccent(old_p.name) ILIKE unaccent($${i})`);
    values.push(`%${district}%`);
    i++;
  }

  // ward -> match chinh don vi
  if (ward) {
    conditions.push(`unaccent(old_unit.name) ILIKE unaccent($${i})`);
    values.push(`%${ward}%`);
    i++;
  }

  const rows = await mappingModel.findOldToNew(conditions, values);

  return rows.map(r => ({
    old_unit: {
      id: r.old_id,
      name: r.old_name,
      code: r.old_code,
      level: r.old_level,
      parent: r.old_parent_name || null,
      grandparent: r.old_grandparent_name || null
    },
    new_unit: {
      id: r.new_id,
      name: r.new_name,
      code: r.new_code,
      level: r.new_level,
      is_active: r.new_is_active,
      parent: r.new_parent_name || null,
      grandparent: r.new_grandparent_name || null
    },
    change: {
      type: r.change_type,
      resolution_number: r.resolution_number,
      description: r.change_desc,
      effective_date: r.effective_date
    }
  }));
};