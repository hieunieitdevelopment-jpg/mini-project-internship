const { client } = require("../config/db");

const searchNewToOld = async (keyword) => {

  const result = await client.query(
    `
    SELECT
      new_address,
      old_address,
      year_changed
    FROM address_convert
    WHERE new_address ILIKE $1
    `,
    [`%${keyword}%`]
  );

  return result.rows;

};

module.exports = { searchNewToOld };