const { client } = require("../config/db");

exports.getUnitById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT u.id, u.name, u.code, u.level, u.is_active as active,
             p.name as parent, gp.name as grandparent
      FROM administrative_units u
      LEFT JOIN administrative_units p ON u.parent_id = p.id
      LEFT JOIN administrative_units gp ON p.parent_id = gp.id
      WHERE u.id = $1
    `;
    const result = await client.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Unit not found" });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};
