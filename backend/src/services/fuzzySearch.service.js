const { client } = require("../config/db");

const fuzzySearch = async (keyword) => {

  const result = await client.query(
    `
    SELECT
      new_address,
      old_address,
      year_changed
    FROM address_convert
    WHERE
      new_address ILIKE $1
    ORDER BY year_changed DESC
    `,
    [`%${keyword}%`]
  );

  return result.rows;

};

module.exports = { fuzzySearch };