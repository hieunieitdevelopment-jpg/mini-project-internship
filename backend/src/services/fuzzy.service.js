const { client } = require("../config/db");

/**
 * Tìm kiếm gần đúng đơn vị hành chính (Fuzzy Search)
 * Mục đích: tìm kiếm dù user gõ sai/thiếu dấu, trả kết quả chi tiết kèm mapping cũ↔mới
 * Dùng pg_trgm (trigram similarity) + unaccent
 *
 * @param {string} keyword - Từ khóa (VD: "phu lok", "ea tam")
 * @param {string|null} level - 'province' | 'district' | 'ward'
 * @returns {Array} - Kết quả chi tiết kèm thông tin thay đổi hành chính
 */
exports.fuzzySearch = async (keyword, level) => {
  const conditions = [];
  const values = [];
  let paramIndex = 1;

  // Dùng trigram similarity để tìm gần đúng
  // similarity() trả giá trị 0-1, càng cao càng giống
  conditions.push(
    `(similarity(unaccent(u.name), unaccent($${paramIndex})) > 0.1 OR unaccent(u.name) ILIKE unaccent($${paramIndex + 1}))`
  );
  values.push(keyword, `%${keyword}%`);
  paramIndex += 2;

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
      grandparent.name AS grandparent_name,
      similarity(unaccent(u.name), unaccent($1)) AS score,

      -- Thông tin mapping cũ↔mới (nếu có)
      m.id AS mapping_id,
      ac.change_type,
      ac.resolution_number,
      ac.description AS change_description,
      ac.effective_date,

      -- Đơn vị được map tới
      mapped.id AS mapped_id,
      mapped.name AS mapped_name,
      mapped.code AS mapped_code,
      mapped.level AS mapped_level,
      mapped.is_active AS mapped_is_active,
      mapped_parent.name AS mapped_parent_name,
      mapped_grandparent.name AS mapped_grandparent_name

    FROM administrative_units u
    LEFT JOIN administrative_units parent ON u.parent_id = parent.id
    LEFT JOIN administrative_units grandparent ON parent.parent_id = grandparent.id

    -- LEFT JOIN mapping: tìm cả trường hợp đơn vị này là cũ hoặc mới
    LEFT JOIN administrative_change_mappings m
      ON (m.old_unit_id = u.id OR m.new_unit_id = u.id)
    LEFT JOIN administrative_changes ac ON m.change_id = ac.id

    -- Đơn vị được map tới (đối diện)
    LEFT JOIN administrative_units mapped
      ON mapped.id = CASE
        WHEN m.old_unit_id = u.id THEN m.new_unit_id
        WHEN m.new_unit_id = u.id THEN m.old_unit_id
        ELSE NULL
      END
    LEFT JOIN administrative_units mapped_parent ON mapped.parent_id = mapped_parent.id
    LEFT JOIN administrative_units mapped_grandparent ON mapped_parent.parent_id = mapped_grandparent.id

    WHERE ${conditions.join(" AND ")}
    ORDER BY score DESC, u.name ASC
    LIMIT 20
  `;

  const result = await client.query(query, values);

  // Format kết quả
  return result.rows.map((row) => ({
    unit: {
      id: row.id,
      name: row.name,
      code: row.code,
      level: row.level,
      is_active: row.is_active,
      parent: row.parent_name || null,
      grandparent: row.grandparent_name || null,
    },
    score: parseFloat(row.score).toFixed(2),
    // Thông tin mapping (null nếu không có thay đổi)
    mapping: row.mapping_id
      ? {
          mapped_unit: {
            id: row.mapped_id,
            name: row.mapped_name,
            code: row.mapped_code,
            level: row.mapped_level,
            is_active: row.mapped_is_active,
            parent: row.mapped_parent_name || null,
            grandparent: row.mapped_grandparent_name || null,
          },
          change: {
            type: row.change_type,
            resolution_number: row.resolution_number,
            description: row.change_description,
            effective_date: row.effective_date,
          },
        }
      : null,
  }));
};
