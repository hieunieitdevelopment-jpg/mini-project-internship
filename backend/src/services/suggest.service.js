const { client } = require("../config/db");

// Goi y don vi hanh chinh - dung ILIKE de tim nhanh
exports.suggestUnits = async (keyword, level) => {
  const conditions = [];
  const params = [];
  let idx = 1;

  // tim ten chua keyword (bo dau)
  conditions.push(`unaccent(u.name) ILIKE unaccent($${idx})`);
  params.push(`%${keyword}%`);
  idx++;

  if (level) {
    conditions.push(`u.level = $${idx}`);
    params.push(level);
    idx++;
  }

  // query lay ten + ten cha + ten ong
  const sql = `
    SELECT u.id, u.name, u.code, u.level, u.is_active,
           p.name AS parent_name,
           gp.name AS grandparent_name
    FROM administrative_units u
    LEFT JOIN administrative_units p ON u.parent_id = p.id
    LEFT JOIN administrative_units gp ON p.parent_id = gp.id
    WHERE ${conditions.join(" AND ")}
    ORDER BY u.name
    LIMIT 10
  `;

  const result = await client.query(sql, params);

  // map ket qua
  return result.rows.map((r) => ({
    id: r.id,
    name: r.name,
    code: r.code,
    level: r.level,
    is_active: r.is_active,
    parent: r.parent_name || null,
    grandparent: r.grandparent_name || null,
  }));
};
