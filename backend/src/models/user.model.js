const { client } = require("../config/db");

// tìm user theo email khi đăng nhập
exports.findByEmail = async (email) => {
  const sql = "SELECT * FROM users WHERE email = $1";
  const result = await client.query(sql, [email]);
  return result.rows[0] || null;
};

// tìm user theo id trong auth middleware (sau khi verify JWT token, lấy thông tin user từ userId trong token)
exports.findById = async (id) => {
  const sql = "SELECT id, username, email, role, is_active, created_at FROM users WHERE id = $1";
  const result = await client.query(sql, [id]);
  return result.rows[0] || null;
};

// khi user đăng ký tài khoản mới
exports.createUser = async ({username, email, hashedPassword}) => {
  const sql = "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, role, is_active, created_at";
  const result = await client.query(sql, [username, email, hashedPassword]);
  return result.rows[0];
};

// admin lấy danh sách tất cả user để quản lý (hiển thị trong trang admin)
exports.getAllUsers = async () => {
  const sql = "SELECT id, username, email, role, is_active, created_at FROM users ORDER BY created_at DESC";
  const result = await client.query(sql);
  return result.rows;
};

// admin khóa hoặc mở khóa tài khoản user
exports.updateUserStatus = async (id, is_active) => {
  const sql = "UPDATE users SET is_active = $1 WHERE id = $2 RETURNING id, username, email, role, is_active, created_at";
  const result = await client.query(sql, [is_active, id]);
  return result.rows[0];
};


// kiểm tra xem email đã tồn tại trong database chưa (dùng trong bước đăng ký)
exports.emailExists = async (email) => {
  const sql = "SELECT * FROM users WHERE email = $1";
  const result = await client.query(sql, [email]);
  return result.rows.length > 0;
};

// kiểm tra xem username đã tồn tại chưa để thêm số (username tự tạo từ email prefix)
exports.usernameExists = async (username) => {
  const sql = "SELECT * FROM users WHERE username = $1";
  const result = await client.query(sql, [username]);
  return result.rows.length > 0;
};

// cập nhật mật khẩu user khi đã dăng nhập
exports.updatePassword = async (id, hashedPassword) => {
  const sql = "UPDATE users SET password = $1 WHERE id = $2 RETURNING id, username, email, role, is_active, created_at";
  const result = await client.query(sql, [hashedPassword, id]);
  return result.rows[0];
};

// tìm user theo id có trả password ( dùng khi đổi mật khẩu)
exports.findByIdWithPassword = async (id) => {
    const sql = "SELECT id, username, email, password, role, is_active, created_at FROM users WHERE id = $1";
    const result = await client.query(sql, [id]);
    return result.rows[0] || null;
};
// tìm user theo google_id (dùng khi đăng nhập bằng Google)
exports.findByGoogleId = async (googleId) => {
    const sql = "SELECT id, username, email, avatar, google_id, role, is_active, created_at FROM users WHERE google_id = $1";
    const result = await client.query(sql, [googleId]);
    return result.rows[0] || null;
};
// gộp tài khoản Google vào user đã có sẵn email (cập nhật google_id và avatar)
exports.updateGoogleId = async (id, googleId, avatar) => {
    const sql = "UPDATE users SET google_id = $1, avatar = $2 WHERE id = $3 RETURNING id, username, email, avatar, google_id, role, is_active, created_at";
    const result = await client.query(sql, [googleId, avatar, id]);
    return result.rows[0];
};
// tạo tài khoản mới từ Google (không có password)
exports.createGoogleUser = async ({ username, email, google_id, avatar }) => {
    const sql = "INSERT INTO users (username, email, google_id, avatar) VALUES ($1, $2, $3, $4) RETURNING id, username, email, avatar, google_id, role, is_active, created_at";
    const result = await client.query(sql, [username, email, google_id, avatar]);
    return result.rows[0];
};