const { client } = require("../config/db");

// lay danh sach tinh/thanh pho cho dropdown
exports.getProvinces = async () => {
  const sql = `
    SELECT id, name, code
    FROM administrative_units
    WHERE level = 'province' AND is_active = TRUE
    ORDER BY name
  `;

  const result = await client.query(sql);
  console.log(`dropdown provinces: ${result.rows.length} tinh`);

  return result.rows;
};


// lay danh sach quan/huyen theo tinh
exports.getDistricts = async (provinceId) => {
  const sql = `
    SELECT id, name, code
    FROM administrative_units
    WHERE level = 'district' AND parent_id = $1 AND is_active = TRUE
    ORDER BY name
  `;

  const result = await client.query(sql, [provinceId]);
  console.log(`dropdown districts: provinceId=${provinceId}, found ${result.rows.length}`);

  return result.rows;
};


// lay danh sach xa/phuong theo huyen
exports.getWards = async (districtId) => {
  const sql = `
    SELECT id, name, code
    FROM administrative_units
    WHERE level = 'ward' AND parent_id = $1 AND is_active = TRUE
    ORDER BY name
  `;

  const result = await client.query(sql, [districtId]);
  console.log(`dropdown wards: districtId=${districtId}, found ${result.rows.length}`);

  return result.rows;
};
