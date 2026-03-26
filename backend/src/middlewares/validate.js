const { query, param, body, validationResult } = require("express-validator");

// middleware xu ly ket qua validation
// neu co loi -> tra ve 400 voi message, khong chay controller
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    console.log("validation failed:", messages);
    return res.status(400).json({
      success: false,
      message: messages.join(", "),
      errors: errors.array(),
    });
  }
  next();
};

// Dropdown validation

// validate provinceId param
const validateProvinceId = [
  param("provinceId")
    .notEmpty()
    .withMessage("provinceId không được để trống")
    .isInt({ min: 1 })
    .withMessage("provinceId phải là số nguyên dương"),
  handleValidation,
];

// validate districtId param
const validateDistrictId = [
  param("districtId")
    .notEmpty()
    .withMessage("districtId không được để trống")
    .isInt({ min: 1 })
    .withMessage("districtId phải là số nguyên dương"),
  handleValidation,
];

// validate active query param (optional)
const validateActiveQuery = [
  query("active")
    .optional()
    .isIn(["true", "false"])
    .withMessage("active phải là true hoặc false"),
  handleValidation,
];

// Unit search validation 

// validate suggest query params
const validateSuggest = [
  query("q")
    .notEmpty()
    .withMessage("Thiếu từ khóa tìm kiếm (q)")
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Từ khóa phải từ 1-100 ký tự"),
  query("level")
    .optional()
    .isIn(["province", "district", "ward"])
    .withMessage("level phải là province, district hoặc ward"),
  query("direction")
    .optional()
    .isIn(["old-to-new", "new-to-old"])
    .withMessage("direction phải là old-to-new hoặc new-to-old"),
  handleValidation,
];

// validate fuzzy search query params
const validateFuzzySearch = [
  query("q")
    .notEmpty()
    .withMessage("Thiếu từ khóa tìm kiếm (q)")
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Từ khóa phải từ 1-100 ký tự"),
  query("level")
    .optional()
    .isIn(["province", "district", "ward"])
    .withMessage("level phải là province, district hoặc ward"),
  query("direction")
    .optional()
    .isIn(["old-to-new", "new-to-old"])
    .withMessage("direction phải là old-to-new hoặc new-to-old"),
  handleValidation,
];

// Mapping validation

// validate mapping query params
const validateMapping = [
  query("direction")
    .notEmpty()
    .withMessage("Thiếu direction (old-to-new hoặc new-to-old)")
    .isIn(["old-to-new", "new-to-old"])
    .withMessage("direction phải là old-to-new hoặc new-to-old"),
  query("province")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Tên tỉnh tối đa 100 ký tự"),
  query("district")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Tên huyện tối đa 100 ký tự"),
  query("ward")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Tên xã tối đa 100 ký tự"),
  handleValidation,
];

// auth
const validateRegister = [
  body("email")
    .notEmpty()
    .withMessage("Email không được để trống")
    .isEmail()
    .withMessage("Email không hợp lệ"),
  body("password")
    .notEmpty()
    .withMessage("Mật khẩu không được để trống")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải từ 6 ký tự"),
  handleValidation,
];

const validateLogin = [
  body("email")
    .notEmpty()
    .withMessage("Email không được để trống")
    .isEmail()
    .withMessage("Email không hợp lệ"),
  body("password")
    .notEmpty()
    .withMessage("Mật khẩu không được để trống")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải từ 6 ký tự"),
  handleValidation,
];

// đổi mật khảu khi đăng nhập

const validateChangePassword = [
  body("oldPassword")
    .notEmpty()
    .withMessage("Mật khẩu cũ không được để trống"),
  body("newPassword")
    .notEmpty()
    .withMessage("Mật khẩu mới không được để trống")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu mới tối thiểu 6 ký tự"),
  handleValidation,
];

// quên mật khẩu + reset:
const validateResetRequest = [
  body("email")
    .notEmpty()
    .withMessage("Email không được để trống")
    .isEmail()
    .withMessage("Email không hợp lệ"),
  handleValidation,
];

const validateResetPassword = [
  body("token")
    .notEmpty()
    .withMessage("Token không được để trống"),
  body("newPassword")
    .notEmpty()
    .withMessage("Mật khẩu mới không được để trống")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu mới tối thiểu 6 ký tự"),
  handleValidation,
];



module.exports = {
  validateProvinceId,
  validateDistrictId,
  validateActiveQuery,
  validateSuggest,
  validateFuzzySearch,
  validateMapping,
  // auth validation
  validateRegister,
  validateLogin,
  validateChangePassword,
  validateResetRequest,
  validateResetPassword,

};
