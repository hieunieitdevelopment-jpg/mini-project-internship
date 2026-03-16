const { client } = require("../config/db");

/**
 * Tra cứu ngược: đơn vị hành chính mới → cũ
 * Từ tên đơn vị MỚI, tìm xem đơn vị CŨ nào đã bị thay thế
 */
exports.convertNewToOld = async (province, district, ward) => {
  // province → match ông (grandparent) của new_unit
  // district → match cha (parent) của new_unit
  // ward → match chính new_unit
  const conditions = [];
  const values = [];
  let paramIndex = 1;

  if (province) {
    conditions.push(`unaccent(new_grandparent.name) ILIKE unaccent($${paramIndex})`);
    values.push(`%${province}%`);
    paramIndex++;
  }

  if (district) {
    conditions.push(`unaccent(new_parent.name) ILIKE unaccent($${paramIndex})`);
    values.push(`%${district}%`);
    paramIndex++;
  }

  if (ward) {
    conditions.push(`unaccent(new_unit.name) ILIKE unaccent($${paramIndex})`);
    values.push(`%${ward}%`);
    paramIndex++;
  }

  const query = `
    SELECT
      new_unit.id AS new_id,
      new_unit.name AS new_name,
      new_unit.code AS new_code,
      new_unit.level AS new_level,

      old_unit.id AS old_id,
      old_unit.name AS old_name,
      old_unit.code AS old_code,
      old_unit.level AS old_level,

      ac.change_type,
      ac.resolution_number,
      ac.description AS change_description,
      ac.effective_date,

      -- Cha/ông đơn vị cũ
      old_parent.name AS old_parent_name,
      old_grandparent.name AS old_grandparent_name,

      -- Cha/ông đơn vị mới
      new_parent.name AS new_parent_name,
      new_grandparent.name AS new_grandparent_name

    FROM administrative_change_mappings m
    JOIN administrative_units old_unit ON m.old_unit_id = old_unit.id
    JOIN administrative_units new_unit ON m.new_unit_id = new_unit.id
    JOIN administrative_changes ac ON m.change_id = ac.id

    LEFT JOIN administrative_units old_parent ON old_unit.parent_id = old_parent.id
    LEFT JOIN administrative_units old_grandparent ON old_parent.parent_id = old_grandparent.id

    LEFT JOIN administrative_units new_parent ON new_unit.parent_id = new_parent.id
    LEFT JOIN administrative_units new_grandparent ON new_parent.parent_id = new_grandparent.id

    WHERE new_unit.is_active = TRUE
    ${conditions.length > 0 ? "AND " + conditions.join(" AND ") : ""}

    ORDER BY ac.effective_date DESC
  `;

  const result = await client.query(query, values);

  return result.rows.map(row => ({
    new_unit: {
      id: row.new_id,
      name: row.new_name,
      code: row.new_code,
      level: row.new_level,
      parent: row.new_parent_name || null,
      grandparent: row.new_grandparent_name || null
    },
    old_unit: {
      id: row.old_id,
      name: row.old_name,
      code: row.old_code,
      level: row.old_level,
      parent: row.old_parent_name || null,
      grandparent: row.old_grandparent_name || null
    },
    change: {
      type: row.change_type,
      resolution_number: row.resolution_number,
      description: row.change_description,
      effective_date: row.effective_date
    }
  }));
};