const { client } = require("../config/db");

// query mapping cu -> moi
exports.findOldToNew = async (conditions, values) => {
  const sql = `
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
      ac.description AS change_desc,
      ac.effective_date,

      old_p.name AS old_parent_name,
      old_gp.name AS old_grandparent_name,
      new_p.name AS new_parent_name,
      new_gp.name AS new_grandparent_name

    FROM administrative_change_mappings m
    JOIN administrative_units old_unit ON m.old_unit_id = old_unit.id
    JOIN administrative_units new_unit ON m.new_unit_id = new_unit.id
    JOIN administrative_changes ac ON m.change_id = ac.id

    LEFT JOIN administrative_units old_p ON old_unit.parent_id = old_p.id
    LEFT JOIN administrative_units old_gp ON old_p.parent_id = old_gp.id

    LEFT JOIN administrative_units new_p ON new_unit.parent_id = new_p.id
    LEFT JOIN administrative_units new_gp ON new_p.parent_id = new_gp.id

    WHERE old_unit.is_active = FALSE
    ${conditions.length > 0 ? "AND " + conditions.join(" AND ") : ""}

    ORDER BY ac.effective_date DESC
  `;

  const result = await client.query(sql, values);
  return result.rows;
};

// query mapping moi -> cu
exports.findNewToOld = async (conditions, values) => {
  const sql = `
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
      ac.description AS change_desc,
      ac.effective_date,

      old_p.name AS old_parent_name,
      old_gp.name AS old_grandparent_name,
      new_p.name AS new_parent_name,
      new_gp.name AS new_grandparent_name

    FROM administrative_change_mappings m
    JOIN administrative_units old_unit ON m.old_unit_id = old_unit.id
    JOIN administrative_units new_unit ON m.new_unit_id = new_unit.id
    JOIN administrative_changes ac ON m.change_id = ac.id

    LEFT JOIN administrative_units old_p ON old_unit.parent_id = old_p.id
    LEFT JOIN administrative_units old_gp ON old_p.parent_id = old_gp.id

    LEFT JOIN administrative_units new_p ON new_unit.parent_id = new_p.id
    LEFT JOIN administrative_units new_gp ON new_p.parent_id = new_gp.id

    WHERE new_unit.is_active = TRUE
    ${conditions.length > 0 ? "AND " + conditions.join(" AND ") : ""}

    ORDER BY ac.effective_date DESC
  `;

  const result = await client.query(sql, values);
  return result.rows;
};
