const { client } = require("../config/db");


// Tìm kiếm đơn vị hành chính cũ → mới
// Hỗ trợ tìm theo tên tỉnh, huyện, xã (có thể chỉ truyền 1 hoặc nhiều)
exports.convertOldToNew = async (province, district, ward) => {
  // Xây dựng điều kiện WHERE động
  // province → match ông (grandparent) của old_unit
  // district → match cha (parent) của old_unit
  // ward → match chính old_unit
  const conditions = [];
  const values = [];
  let paramIndex = 1;

  if (province) {
    conditions.push(`unaccent(old_grandparent.name) ILIKE unaccent($${paramIndex})`);
    values.push(`%${province}%`);
    paramIndex++;
  }

  if (district) {
    conditions.push(`unaccent(old_parent.name) ILIKE unaccent($${paramIndex})`);
    values.push(`%${district}%`);
    paramIndex++;
  }

  if (ward) {
    conditions.push(`unaccent(old_unit.name) ILIKE unaccent($${paramIndex})`);
    values.push(`%${ward}%`);
    paramIndex++;
  }

  const query = `
    SELECT
      old_unit.id AS old_id,
      old_unit.name AS old_name,
      old_unit.code AS old_code,
      old_unit.level AS old_level,

      new_unit.id AS new_id,
      new_unit.name AS new_name,
      new_unit.code AS new_code,
      new_unit.level AS new_level,
      new_unit.is_active AS new_is_active,

      ac.change_type,
      ac.resolution_number,
      ac.description AS change_description,
      ac.effective_date,

      -- Lấy tên tỉnh/huyện cha của đơn vị cũ
      old_parent.name AS old_parent_name,
      old_grandparent.name AS old_grandparent_name,

      -- Lấy tên tỉnh/huyện cha của đơn vị mới
      new_parent.name AS new_parent_name,
      new_grandparent.name AS new_grandparent_name

    FROM administrative_change_mappings m
    JOIN administrative_units old_unit ON m.old_unit_id = old_unit.id
    JOIN administrative_units new_unit ON m.new_unit_id = new_unit.id
    JOIN administrative_changes ac ON m.change_id = ac.id

    -- JOIN cha/ông của đơn vị cũ
    LEFT JOIN administrative_units old_parent ON old_unit.parent_id = old_parent.id
    LEFT JOIN administrative_units old_grandparent ON old_parent.parent_id = old_grandparent.id

    -- JOIN cha/ông của đơn vị mới
    LEFT JOIN administrative_units new_parent ON new_unit.parent_id = new_parent.id
    LEFT JOIN administrative_units new_grandparent ON new_parent.parent_id = new_grandparent.id

    WHERE old_unit.is_active = FALSE
    ${conditions.length > 0 ? "AND " + conditions.join(" AND ") : ""}

    ORDER BY ac.effective_date DESC
  `;

  const result = await client.query(query, values);

  // Format kết quả dễ đọc hơn
  return result.rows.map(row => ({
    old_unit: {
      id: row.old_id,
      name: row.old_name,
      code: row.old_code,
      level: row.old_level,
      parent: row.old_parent_name || null,
      grandparent: row.old_grandparent_name || null
    },
    new_unit: {
      id: row.new_id,
      name: row.new_name,
      code: row.new_code,
      level: row.new_level,
      is_active: row.new_is_active,
      parent: row.new_parent_name || null,
      grandparent: row.new_grandparent_name || null
    },
    change: {
      type: row.change_type,
      resolution_number: row.resolution_number,
      description: row.change_description,
      effective_date: row.effective_date
    }
  }));
};