const unitModel = require("../models/administrativeUnit.model");

// Tim kiem gan dung bang pg_trgm (trigram)
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

  const rows = await unitModel.fuzzySearch(conditions, values, 20);

  // format ket qua tra ve
  const data = rows.map((r) => {
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
