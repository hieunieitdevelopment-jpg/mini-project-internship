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
exports.findWards = async (districtId) => {
  const sql = `
    SELECT id, name, code
    FROM administrative_units
    WHERE level = 'ward' AND parent_id = $1 AND is_active = TRUE
    ORDER BY name
  `;
  const result = await client.query(sql, [districtId]);
  return result.rows;
};
