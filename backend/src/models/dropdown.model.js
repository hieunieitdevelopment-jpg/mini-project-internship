const { client } = require("../config/db");

// lay tinh/thanh pho (is_active)
exports.findProvinces = async () => {
  const sql = `
    SELECT id, name, code
    FROM administrative_units
    WHERE level = 'province' AND is_active = TRUE
    ORDER BY name
  `;
  const result = await client.query(sql);
  return result.rows;
};

// lay quan/huyen theo tinh
exports.findDistricts = async (provinceId) => {
  const sql = `
    SELECT id, name, code
    FROM administrative_units
    WHERE level = 'district' AND parent_id = $1 AND is_active = TRUE
    ORDER BY name
  `;
  const result = await client.query(sql, [provinceId]);
  return result.rows;
};

// lay xa/phuong theo huyen
// isActive = true -> xa moi, false -> xa cu
exports.findWards = async (districtId, isActive = true) => {
  const sql = `
    SELECT id, name, code
    FROM administrative_units
    WHERE level = 'ward' AND parent_id = $1 AND is_active = $2
    ORDER BY name
  `;
  const result = await client.query(sql, [districtId, isActive]);
  return result.rows;
};

// lay xa/phuong theo tinh (join qua huyen)
exports.findWardsByProvince = async (provinceId, isActive = true) => {
  const sql = `
    SELECT w.id, w.name, w.code
    FROM administrative_units w
    JOIN administrative_units d ON w.parent_id = d.id
    WHERE w.level = 'ward' AND d.parent_id = $1 AND w.is_active = $2
    ORDER BY w.name
  `;
  const result = await client.query(sql, [provinceId, isActive]);
  return result.rows;
};
