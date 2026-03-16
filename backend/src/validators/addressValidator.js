const { query } = require("express-validator");

const convertOldToNewValidator = [
  query("province")
    .trim()
    .notEmpty()
    .withMessage("province is required")
    .bail()
    .isLength({ min: 2 })
    .withMessage("province must be at least 2 characters")
];

const searchValidator = [
  query("q")
    .trim()
    .notEmpty()
    .withMessage("q is required")
    .bail()
    .isLength({ min: 2 })
    .withMessage("q must be at least 2 characters")
];

module.exports = {
  convertOldToNewValidator,
  searchValidator
};