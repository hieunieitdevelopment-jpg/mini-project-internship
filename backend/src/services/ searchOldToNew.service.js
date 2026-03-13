const { client } = require("../config/db");

exports.convertOldToNew = async (province, district, ward) => {

    const query = `
        SELECT
            old_province,
            old_district,
            old_ward,
            new_province,
            new_district,
            new_ward,
            change_type,
            effective_date
        FROM address_changes
        WHERE old_province ILIKE $1
        AND old_district ILIKE $2
        AND old_ward ILIKE $3
    `;

    const values = [
    `%${province}%`,
    `%${district}%`,
    `%${ward}%`
  ];

  const result = await client.query(query, values);

  return result.rows;
}