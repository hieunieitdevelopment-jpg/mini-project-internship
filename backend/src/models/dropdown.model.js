const { client } = require("../config/db");

// lay tinh/thanh pho (is_active)
exports.findProvinces = async (isActive = true) => {
  let sql = `
    SELECT id, name, code, is_active
    FROM administrative_units
    WHERE level = 'province'
  `;
  if (isActive !== null) {
    sql += ` AND is_active = $1`;
  }
  sql += ` ORDER BY name`;
  const params = isActive !== null ? [isActive] : [];
  const result = await client.query(sql, params);
  return result.rows;
};

// lay quan/huyen theo tinh
exports.findDistricts = async (provinceId, isActive = true) => {
  let sql = `
    SELECT DISTINCT d.id, d.name, d.code, d.is_active
    FROM administrative_units d
    LEFT JOIN administrative_change_mappings map_gp ON map_gp.old_unit_id = d.parent_id
    WHERE d.level = 'district' AND (d.parent_id = $1 OR map_gp.new_unit_id = $1)
  `;
  if (isActive !== null) {
    sql += ` AND d.is_active = $2`;
  }
  sql += ` ORDER BY d.name`;
  const params = isActive !== null ? [provinceId, isActive] : [provinceId];
  const result = await client.query(sql, params);
  return result.rows;
};

// lay xa/phuong theo huyen
exports.findWards = async (districtId, isActive = true) => {
  let sql = `
    SELECT id, name, code, is_active
    FROM administrative_units
    WHERE level = 'ward' AND parent_id = $1
  `;
  if (isActive !== null) {
    sql += ` AND is_active = $2`;
  }
  sql += ` ORDER BY name`;
  const params = isActive !== null ? [districtId, isActive] : [districtId];
  const result = await client.query(sql, params);
  return result.rows;
};

// lay xa/phuong theo tinh (join qua huyen)
exports.findWardsByProvince = async (provinceId, isActive = true) => {
  let sql = `
    SELECT DISTINCT w.id, w.name, w.code, w.is_active
    FROM administrative_units w
    JOIN administrative_units d ON w.parent_id = d.id
    JOIN administrative_units p ON d.parent_id = p.id
    LEFT JOIN administrative_change_mappings map_gp ON map_gp.old_unit_id = p.id
    LEFT JOIN administrative_change_mappings map_w ON map_w.new_unit_id = w.id
    WHERE w.level = 'ward' AND (p.id = $1 OR (map_gp.new_unit_id = $1 AND map_w.id IS NOT NULL))
  `;
  if (isActive !== null) {
    sql += ` AND w.is_active = $2`;
  }
  sql += ` ORDER BY w.name`;
  const params = isActive !== null ? [provinceId, isActive] : [provinceId];
  const result = await client.query(sql, params);
  return result.rows;
};
