const { client } = require("../config/db");

// Tim kiem gan dung bang pg_trgm (trigram)
// Khac voi suggest: cai nay tim duoc ca khi go sai chinh ta
// VD: go "phu lok" van tim duoc "Phu Loc"
exports.fuzzySearch = async (keyword, level) => {
  const conditions = [];
  const values = [];
  let i = 1;

  // dung similarity() de tinh diem tuong dong + ILIKE de bat them
  conditions.push(
    `(similarity(unaccent(u.name), unaccent($${i})) > 0.1 OR unaccent(u.name) ILIKE unaccent($${i + 1}))`
  );
  values.push(keyword, `%${keyword}%`);
  i += 2;

  // filter theo level neu co truyen
  if (level) {
    conditions.push(`u.level = $${i}`);
    values.push(level);
    i++;
  }

  const sql = `
    SELECT
      u.id, u.name, u.code, u.level, u.is_active,
      p.name AS parent_name,
      gp.name AS grandparent_name,
      similarity(unaccent(u.name), unaccent($1)) AS score,

      -- lay thong tin mapping cu/moi
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

    -- join voi bang mapping (tim ca 2 chieu: unit la cu hoac moi)
    LEFT JOIN administrative_change_mappings m
      ON (m.old_unit_id = u.id OR m.new_unit_id = u.id)
    LEFT JOIN administrative_changes ac ON m.change_id = ac.id

    -- lay don vi "doi dien" trong mapping
    LEFT JOIN administrative_units mapped
      ON mapped.id = CASE
        WHEN m.old_unit_id = u.id THEN m.new_unit_id
        WHEN m.new_unit_id = u.id THEN m.old_unit_id
      END
    LEFT JOIN administrative_units mp ON mapped.parent_id = mp.id
    LEFT JOIN administrative_units mgp ON mp.parent_id = mgp.id

    WHERE ${conditions.join(" AND ")}
    ORDER BY score DESC, u.name
    LIMIT 20
  `;

  const result = await client.query(sql, values);

  // format ket qua tra ve
  const data = result.rows.map((r) => {
    const item = {
      unit: {
        id: r.id,
        name: r.name,
        code: r.code,
        level: r.level,
        is_active: r.is_active,
        parent: r.parent_name || null,
        grandparent: r.grandparent_name || null,
      },
      score: parseFloat(r.score).toFixed(2),
      mapping: null,
    };

    // neu co mapping thi them thong tin
    if (r.mapping_id) {
      item.mapping = {
        mapped_unit: {
          id: r.mapped_id,
          name: r.mapped_name,
          code: r.mapped_code,
          level: r.mapped_level,
          is_active: r.mapped_is_active,
          parent: r.mapped_parent_name || null,
          grandparent: r.mapped_grandparent_name || null,
        },
        change: {
          type: r.change_type,
          resolution_number: r.resolution_number,
          description: r.change_desc,
          effective_date: r.effective_date,
        },
      };
    }

    return item;
  });

  return data;
};
