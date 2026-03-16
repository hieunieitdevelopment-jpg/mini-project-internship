const { client } = require("../config/db");

// tim kiem don vi hanh chinh bang ILIKE (cho suggest)
exports.searchByKeyword = async (conditions, params, limit = 10) => {
  const sql = `
    SELECT u.id, u.name, u.code, u.level, u.is_active,
           p.name AS parent_name,
           gp.name AS grandparent_name
    FROM administrative_units u
    LEFT JOIN administrative_units p ON u.parent_id = p.id
    LEFT JOIN administrative_units gp ON p.parent_id = gp.id
    WHERE ${conditions.join(" AND ")}
    ORDER BY u.name
    LIMIT ${limit}
  `;

  const result = await client.query(sql, params);
  return result.rows;
};

// fuzzy search bang similarity + ILIKE (cho fuzzy)
exports.fuzzySearch = async (conditions, values, limit = 20) => {
  const sql = `
    SELECT
      u.id, u.name, u.code, u.level, u.is_active,
      p.name AS parent_name,
      gp.name AS grandparent_name,
      similarity(unaccent(u.name), unaccent($1)) AS score,

      m.id AS mapping_id,
      ac.change_type,
      ac.resolution_number,
      ac.description AS change_desc,
      ac.effective_date,

      mapped.id AS mapped_id,
      mapped.name AS mapped_name,
      mapped.code AS mapped_code,
      mapped.level AS mapped_level,
      mapped.is_active AS mapped_is_active,
      mp.name AS mapped_parent_name,
      mgp.name AS mapped_grandparent_name

    FROM administrative_units u
    LEFT JOIN administrative_units p ON u.parent_id = p.id
    LEFT JOIN administrative_units gp ON p.parent_id = gp.id

    LEFT JOIN administrative_change_mappings m
      ON (m.old_unit_id = u.id OR m.new_unit_id = u.id)
    LEFT JOIN administrative_changes ac ON m.change_id = ac.id

    LEFT JOIN administrative_units mapped
      ON mapped.id = CASE
        WHEN m.old_unit_id = u.id THEN m.new_unit_id
        WHEN m.new_unit_id = u.id THEN m.old_unit_id
      END
    LEFT JOIN administrative_units mp ON mapped.parent_id = mp.id
    LEFT JOIN administrative_units mgp ON mp.parent_id = mgp.id

    WHERE ${conditions.join(" AND ")}
    ORDER BY score DESC, u.name
    LIMIT ${limit}
  `;

  const result = await client.query(sql, values);
  return result.rows;
};
