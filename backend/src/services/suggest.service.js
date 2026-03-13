const { client } = require("../config/db");
exports.suggestAddress = async (keyword, limit) => {

  const query = `
    SELECT name, 'province' AS type
    FROM provinces
    WHERE name ILIKE $1

    UNION

    SELECT name, 'district' AS type
    FROM districts
    WHERE name ILIKE $1

    UNION

    SELECT name, 'ward' AS type
    FROM wards
    WHERE name ILIKE $1

    LIMIT $2
  `;

  const values = [
    `%${keyword}%`,
    limit
  ];

  const result = await client.query(query, values);

  return result.rows;
};