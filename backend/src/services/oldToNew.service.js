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

  // district -> match cha (parent) hoac chinh don vi do
  if (district) {
    if (!ward) {
      // khong chon xa -> tim ca huyen va cac xa thuoc huyen
      conditions.push(`(unaccent(old_p.name) ILIKE unaccent($${i}) OR unaccent(old_unit.name) ILIKE unaccent($${i}))`);
    } else {
      // co chon xa -> chi tim theo parent thoi
      conditions.push(`unaccent(old_p.name) ILIKE unaccent($${i})`);
    }
    values.push(`%${district}%`);
    i++;
  }

  // ward -> match chinh don vi
  if (ward) {
    conditions.push(`unaccent(old_unit.name) ILIKE unaccent($${i})`);
    values.push(`%${ward}%`);
    i++;
  }

  let rows = await mappingModel.findOldToNew(conditions, values);
  
  if (rows.length === 0 && ward && district && province) {
    // Inherited Fallback cho Ward: Xã không đổi, nhưng Huyện hoặc Tỉnh đổi
    const query = `
      SELECT w.id as w_id, w.name as w_name, w.code as w_code, w.level as w_level,
             d.name as old_parent_name, p.name as old_gp_name,
             c.description as change_desc, c.change_type, c.resolution_number, c.effective_date,
             COALESCE(n_d.name, d.name) as new_parent_name,
             COALESCE(n_p.name, p.name) as new_gp_name
      FROM administrative_units w
      JOIN administrative_units d ON w.parent_id = d.id
      JOIN administrative_units p ON d.parent_id = p.id
      LEFT JOIN administrative_change_mappings m_p ON m_p.old_unit_id = p.id
      LEFT JOIN administrative_change_mappings m_d ON m_d.old_unit_id = d.id
      LEFT JOIN administrative_changes c ON c.id = COALESCE(m_p.change_id, m_d.change_id)
      LEFT JOIN administrative_units n_p ON m_p.new_unit_id = n_p.id
      LEFT JOIN administrative_units n_d ON m_d.new_unit_id = n_d.id
      WHERE unaccent(w.name) ILIKE unaccent($1) 
        AND unaccent(d.name) ILIKE unaccent($2)
        AND unaccent(p.name) ILIKE unaccent($3)
        AND w.level = 'ward'
        AND (m_p.id IS NOT NULL OR m_d.id IS NOT NULL)
    `;
    const { client } = require("../config/db");
    const inheritedRes = await client.query(query, [`%${ward}%`, `%${district}%`, `%${province}%`]);

    if (inheritedRes.rows.length > 0) {
      const r = inheritedRes.rows[0];
      return [{
        old_unit: {
          id: r.w_id, name: r.w_name, code: r.w_code, level: r.w_level,
          parent: r.old_parent_name, grandparent: r.old_gp_name,
        },
        new_unit: {
          id: r.w_id, name: r.w_name, code: r.w_code, level: r.w_level,
          parent: r.new_parent_name, grandparent: r.new_gp_name,
        },
        change: {
          type: r.change_type, resolution_number: r.resolution_number,
          description: r.change_desc, effective_date: r.effective_date,
        },
      }];
    }
  }

  if (rows.length === 0 && !ward && district && province) {
    // Inherited Fallback cho District: Huyện không đổi, nhưng Tỉnh đổi
    const query = `
      SELECT d.id as d_id, d.name as d_name, d.code as d_code, d.level as d_level,
             p.name as old_gp_name,
             c.description as change_desc, c.change_type, c.resolution_number, c.effective_date,
             n_p.name as new_gp_name
      FROM administrative_units d
      JOIN administrative_units p ON d.parent_id = p.id
      JOIN administrative_change_mappings m_p ON m_p.old_unit_id = p.id
      JOIN administrative_changes c ON c.id = m_p.change_id
      JOIN administrative_units n_p ON m_p.new_unit_id = n_p.id
      WHERE unaccent(d.name) ILIKE unaccent($1) 
        AND unaccent(p.name) ILIKE unaccent($2)
        AND d.level = 'district'
    `;
    const { client } = require("../config/db");
    const inheritedRes = await client.query(query, [`%${district}%`, `%${province}%`]);

    if (inheritedRes.rows.length > 0) {
      const r = inheritedRes.rows[0];
      return [{
        old_unit: {
          id: r.d_id, name: r.d_name, code: r.d_code, level: r.d_level,
          parent: r.old_gp_name, grandparent: null,
        },
        new_unit: {
          id: r.d_id, name: r.d_name, code: r.d_code, level: r.d_level,
          parent: r.new_gp_name, grandparent: null,
        },
        change: {
          type: r.change_type, resolution_number: r.resolution_number,
          description: r.change_desc, effective_date: r.effective_date,
        },
      }];
    }
  }

  if (rows.length === 0 && ward && district) {
    // Fallback search: try finding mappings for the District
    const distConditions = [
      `unaccent(old_unit.name) ILIKE unaccent($1)`,
      `unaccent(old_p.name) ILIKE unaccent($2)`
    ];
    rows = await mappingModel.findOldToNew(distConditions, [`%${district}%`, `%${province}%`]);
  }

  if (rows.length === 0 && province) {
    // Fallback search: try finding mappings for the Province
    const provConditions = [
      `unaccent(old_unit.name) ILIKE unaccent($1)`,
      `old_unit.level = 'province'`
    ];
    rows = await mappingModel.findOldToNew(provConditions, [`%${province}%`]);
  }

  return rows.map((r) => ({
    old_unit: {
      id: r.old_id,
      name: r.old_name,
      code: r.old_code,
      level: r.old_level,
      parent: r.old_parent_name || null,
      grandparent: r.old_grandparent_name || null,
    },
    new_unit: {
      id: r.new_id,
      name: r.new_name,
      code: r.new_code,
      level: r.new_level,
      is_active: r.new_is_active,
      parent: r.new_parent_name || null,
      grandparent: r.new_grandparent_name || null,
    },
    change: {
      type: r.change_type,
      resolution_number: r.resolution_number,
      description: r.change_desc,
      effective_date: r.effective_date,
    },
  }));
};
