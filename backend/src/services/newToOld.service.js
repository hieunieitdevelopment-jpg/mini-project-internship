const mappingModel = require("../models/changeMapping.model");
const { client } = require("../config/db");

// Tra cuu nguoc: don vi moi -> tim don vi cu
exports.convertNewToOld = async (province, district, ward) => {
  const conditions = [];
  const values = [];
  let i = 1;

  // Tìm các tỉnh cũ đã sáp nhập vào tỉnh được chọn
  let mergedProvinceNames = [];
  if (province) {
    const mergedRes = await client.query(`
      SELECT DISTINCT old_unit.name 
      FROM administrative_change_mappings m
      JOIN administrative_units old_unit ON m.old_unit_id = old_unit.id
      JOIN administrative_units new_unit ON m.new_unit_id = new_unit.id
      WHERE old_unit.level = 'province' 
        AND new_unit.level = 'province'
        AND unaccent(new_unit.name) ILIKE unaccent($1)
    `, [`%${province}%`]);
    mergedProvinceNames = mergedRes.rows.map(r => r.name);
  }

  if (province) {
    // Tìm cả grandparent là tỉnh gốc HOẶC là tỉnh cũ đã sáp nhập vào
    if (mergedProvinceNames.length > 0) {
      const allProvincePatterns = [province, ...mergedProvinceNames];
      const provinceConditions = allProvincePatterns.map((_, idx) => 
        `unaccent(COALESCE(real_new_gp.name, new_gp.name)) ILIKE unaccent($${i + idx})`
      );
      conditions.push(`(${provinceConditions.join(' OR ')})`);
      allProvincePatterns.forEach(p => values.push(`%${p}%`));
      i += allProvincePatterns.length;
    } else {
      conditions.push(`unaccent(COALESCE(real_new_gp.name, new_gp.name)) ILIKE unaccent($${i})`);
      values.push(`%${province}%`);
      i++;
    }
  }

  if (district) {
    if (!ward) {
      // khong chon xa -> tim ca huyen va cac xa thuoc huyen
      conditions.push(`(unaccent(COALESCE(real_new_p.name, new_p.name)) ILIKE unaccent($${i}) OR unaccent(new_unit.name) ILIKE unaccent($${i}))`);
    } else {
      // co chon xa -> chi tim theo parent thoi
      conditions.push(`unaccent(COALESCE(real_new_p.name, new_p.name)) ILIKE unaccent($${i})`);
    }
    values.push(`%${district}%`);
    i++;
  }

  if (ward) {
    conditions.push(`unaccent(new_unit.name) ILIKE unaccent($${i})`);
    values.push(`%${ward}%`);
    i++;
  }

  let rows = await mappingModel.findNewToOld(conditions, values);
  
  if (rows.length === 0 && ward && district && province) {
    // Inherited Fallback cho Ward: Xã không đổi, nhưng Huyện hoặc Tỉnh đổi logic
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
        AND unaccent(COALESCE(n_d.name, d.name)) ILIKE unaccent($2)
        AND unaccent(COALESCE(n_p.name, p.name)) ILIKE unaccent($3)
        AND w.level = 'ward'
        AND (m_p.id IS NOT NULL OR m_d.id IS NOT NULL)
    `;
    const inheritedRes = await client.query(query, [`%${ward}%`, `%${district}%`, `%${province}%`]);

    if (inheritedRes.rows.length > 0) {
      const r = inheritedRes.rows[0];
      return [{
        new_unit: {
          id: r.w_id, name: r.w_name, code: r.w_code, level: r.w_level,
          parent: r.new_parent_name, grandparent: r.new_gp_name,
        },
        old_unit: {
          id: r.w_id, name: r.w_name, code: r.w_code, level: r.w_level,
          parent: r.old_parent_name, grandparent: r.old_gp_name,
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
        AND unaccent(COALESCE(n_p.name, p.name)) ILIKE unaccent($2)
        AND d.level = 'district'
    `;
    const inheritedRes = await client.query(query, [`%${district}%`, `%${province}%`]);

    if (inheritedRes.rows.length > 0) {
      const r = inheritedRes.rows[0];
      return [{
        new_unit: {
          id: r.d_id, name: r.d_name, code: r.d_code, level: r.d_level,
          parent: r.new_gp_name, grandparent: null,
        },
        old_unit: {
          id: r.d_id, name: r.d_name, code: r.d_code, level: r.d_level,
          parent: r.old_gp_name, grandparent: null,
        },
        change: {
          type: r.change_type, resolution_number: r.resolution_number,
          description: r.change_desc, effective_date: r.effective_date,
        },
      }];
    }
  }

  if (rows.length === 0 && ward && district) {
    // Fallback: district
    const distConditions = [
      `unaccent(new_unit.name) ILIKE unaccent($1)`,
      `unaccent(COALESCE(real_new_p.name, new_p.name)) ILIKE unaccent($2)`
    ];
    rows = await mappingModel.findNewToOld(distConditions, [`%${district}%`, `%${province}%`]);
  }

  if (rows.length === 0 && province && !ward && !district) {
    // Fallback: province — chỉ khi user chỉ chọn mỗi tỉnh, không chọn ward/district
    const provConditions = [
      `unaccent(new_unit.name) ILIKE unaccent($1)`,
      `new_unit.level = 'province'`
    ];
    rows = await mappingModel.findNewToOld(provConditions, [`%${province}%`]);
  }

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
