const { client } = require("../config/db");

/**
 * Gợi ý đơn vị hành chính (Suggest / Autocomplete)
 * Mục đích: gợi ý nhanh khi user đang gõ
 * Dùng ILIKE + unaccent để tìm tên bắt đầu hoặc chứa keyword
 *
 * @param {string} keyword - Từ khóa (VD: "Phú", "krong")
 * @param {string|null} level - 'province' | 'district' | 'ward'
 * @returns {Array} - Danh sách gợi ý ngắn gọn
 */
exports.suggestUnits = async (keyword, level) => {
  const conditions = [];
  const values = [];
  let paramIndex = 1;

  // Tìm tên chứa keyword (bỏ dấu)
  conditions.push(`unaccent(u.name) ILIKE unaccent($${paramIndex})`);
  values.push(`%${keyword}%`);
  paramIndex++;

  // Filter theo cấp nếu có
  if (level) {
    conditions.push(`u.level = $${paramIndex}`);
    values.push(level);
    paramIndex++;
  }

  const query = `
    SELECT
      u.id,
      u.name,
      u.code,
      u.level,
      u.is_active,
      parent.name AS parent_name,
      grandparent.name AS grandparent_name
    FROM administrative_units u
    LEFT JOIN administrative_units parent ON u.parent_id = parent.id
    LEFT JOIN administrative_units grandparent ON parent.parent_id = grandparent.id
    WHERE ${conditions.join(" AND ")}
    ORDER BY u.name ASC
    LIMIT 10
  `;

  const result = await client.query(query, values);

  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    code: row.code,
    level: row.level,
    is_active: row.is_active,
    parent: row.parent_name || null,
    grandparent: row.grandparent_name || null,
  }));
};
