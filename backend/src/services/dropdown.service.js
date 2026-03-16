const { client } = require("../config/db");

/**
 * Lấy danh sách tỉnh/thành phố
 */
exports.getProvinces = async () => {
  const query = `
    SELECT id, name, code
    FROM administrative_units
    WHERE level = 'province' AND is_active = TRUE
    ORDER BY name
  `;
  const result = await client.query(query);
  return result.rows;
};

/**
 * Lấy danh sách huyện/quận theo tỉnh
 */
exports.getDistricts = async (provinceId) => {
  const query = `
    SELECT id, name, code
    FROM administrative_units
    WHERE level = 'district' AND parent_id = $1 AND is_active = TRUE
    ORDER BY name
  `;
  const result = await client.query(query, [provinceId]);
  return result.rows;
};

/**
 * Lấy danh sách xã/phường theo huyện
 */
exports.getWards = async (districtId) => {
  const query = `
    SELECT id, name, code, is_active
    FROM administrative_units
    WHERE level = 'ward' AND parent_id = $1
    ORDER BY name
  `;
  const result = await client.query(query, [districtId]);
  return result.rows;
};
