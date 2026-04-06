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
    .withMessage("provinceId phải là số nguyên dương")
    .toInt(),
  handleValidation,
];

// validate districtId param
const validateDistrictId = [
  param("districtId")
    .notEmpty()
    .withMessage("districtId không được để trống")
    .isInt({ min: 1 })
    .withMessage("districtId phải là số nguyên dương")
    .toInt(),
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
    .withMessage("Email không hợp lệ")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Mật khẩu không được để trống")
    .isLength({ min: 8 })
    .withMessage("Mật khẩu tối thiểu 8 ký tự")
    .matches(/[a-z]/)
    .withMessage("Mật khẩu phải có ít nhất 1 chữ cái thường")
    .matches(/[A-Z]/)
    .withMessage("Mật khẩu phải có ít nhất 1 chữ cái hoa")
    .matches(/[0-9]/)
    .withMessage("Mật khẩu phải có ít nhất 1 số")
    .matches(/[!@#$%^&*]/)
    .withMessage("Mật khẩu phải có ít nhất 1 ký tự đặc biệt"),
  handleValidation,
];

const validateLogin = [
  body("email")
    .notEmpty()
    .withMessage("Email không được để trống")
    .isEmail()
    .withMessage("Email không hợp lệ")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Mật khẩu không được để trống"),
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
    .custom((value, { req }) => {
      if (value === req.body.oldPassword) {
        throw new Error("Mật khẩu mới phải khác mật khẩu cũ");
      }
      return true;
    })
    .isLength({ min: 8 })
    .withMessage("Mật khẩu tối thiểu 8 ký tự")
    .matches(/[a-z]/)
    .withMessage("Mật khẩu phải có ít nhất 1 chữ cái thường")
    .matches(/[A-Z]/)
    .withMessage("Mật khẩu phải có ít nhất 1 chữ cái hoa")
    .matches(/[0-9]/)
    .withMessage("Mật khẩu phải có ít nhất 1 số")
    .matches(/[!@#$%^&*]/)
    .withMessage("Mật khẩu phải có ít nhất 1 ký tự đặc biệt"),
  handleValidation,
];

// quên mật khẩu + reset:
const validateResetRequest = [
  body("email")
    .notEmpty()
    .withMessage("Email không được để trống")
    .isEmail()
    .withMessage("Email không hợp lệ")
    .normalizeEmail(),
  handleValidation,
];

const validateResetPassword = [
  body("token")
    .notEmpty()
    .withMessage("Token không được để trống"),
  body("newPassword")
    .notEmpty()
    .withMessage("Mật khẩu mới không được để trống")
    .isLength({ min: 8 })
    .withMessage("Mật khẩu tối thiểu 8 ký tự")
    .matches(/[a-z]/)
    .withMessage("Mật khẩu phải có ít nhất 1 chữ cái thường")
    .matches(/[A-Z]/)
    .withMessage("Mật khẩu phải có ít nhất 1 chữ cái hoa")
    .matches(/[0-9]/)
    .withMessage("Mật khẩu phải có ít nhất 1 số")
    .matches(/[!@#$%^&*]/)
    .withMessage("Mật khẩu phải có ít nhất 1 ký tự đặc biệt"),
  handleValidation,
];





const validateBatch = (req, res, next) => {
  const { direction, items } = req.body;

  // kiểm tra direction
  if (!direction || !["old-to-new", "new-to-old"].includes(direction)){
    return res.status(400).json({
      success: false,
      message: "direction phải là 'old-to-new' hoặc 'new-to-old'",
    });

  }
  // kiểm mảng items phải là mảng
  if (!items || !Array.isArray(items) || items.length === 0 ){
    return res.status(400).json({
      success:false,
      message: "items phải là mảng và không được rỗng"
    });
  }

  if (items.length > 500 ){
    return res.status(400).json({
      success: false,
      message: `Tối đa 500 items mỗi lần. Bạn gửi ${items.length} items`
    });
  }

  for (let i = 0; i < items.length; i++ ) {
    const item = items[i];
    if (!item.province && !item.district && !item.ward){
      return res.status(400).json({
        success: false,
        message: `Item thứ ${i + 1} phải có ít nhất 1 trong: province, district, ward`
      })
    }
  }

  next();
};

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
  //  Batch Conversion
  validateBatch,

};