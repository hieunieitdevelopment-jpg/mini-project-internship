const { Client } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const escapeSqlArray = (rows) => {
  return rows
    .map((r, i) => {
      // Escape strings and handle nulls
      const vals = Object.values(r).map((val) => {
        if (val === null || val === undefined) return "NULL";
        if (typeof val === "string") return `'${val.replace(/'/g, "''")}'`;
        if (typeof val === "boolean") return val ? "TRUE" : "FALSE";
        if (val instanceof Date) return `'${val.toISOString().split('T')[0]}'`;
        return val;
      });
      return `(${vals.join(", ")})`;
    })
    .join(",\n");
};

async function generateSeed() {
  const client = new Client({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "123456",
    database: process.env.DB_NAME || "address_db",
    port: process.env.DB_PORT || 5432,
  });

  await client.connect();
  const filePath = path.join(__dirname, "seed_real.sql");
  const stream = fs.createWriteStream(filePath);

  stream.write(`-- ============================================
-- SEED DATA: Dữ liệu hành chính toàn quốc & Lịch sử sáp nhập
-- Database (Giữ nguyên ID gốc)
-- ============================================
SET client_encoding = 'UTF8';
SET session_replication_role = 'replica'; -- Tắt trigger khóa ngoại tạm thời nếu có


`);

  // 1. Xuất Tỉnh
  console.log("Exporting Provinces...");
  const provinces = await client.query(
    `SELECT id, name, code, level, parent_id, is_active FROM administrative_units WHERE level = 'province' ORDER BY is_active DESC, name`
  );
  if (provinces.rows.length > 0) {
    stream.write(`-- ============================================
-- TỈNH
-- ============================================
INSERT INTO administrative_units (id, name, code, level, parent_id, is_active) VALUES
${escapeSqlArray(provinces.rows)};\n\n`);
  }

  // 2. Xuất Huyện và Xã của từng Huyện
  console.log("Exporting Districts & Wards...");
  const districts = await client.query(
    `SELECT id, name, code, level, parent_id, is_active FROM administrative_units WHERE level = 'district' ORDER BY parent_id, name`
  );

  for (const district of districts.rows) {
    stream.write(`-- ============================================
-- HUYỆN: ${district.name}
-- ============================================
INSERT INTO administrative_units (id, name, code, level, parent_id, is_active) VALUES
${escapeSqlArray([district])};\n\n`);

    const oldWards = await client.query(
      `SELECT id, name, code, level, parent_id, is_active FROM administrative_units WHERE level = 'ward' AND parent_id = $1 AND is_active = FALSE ORDER BY name`,
      [district.id]
    );

    if (oldWards.rows.length > 0) {
      stream.write(`-- XÃ CŨ (trước sáp nhập) - is_active = FALSE
INSERT INTO administrative_units (id, name, code, level, parent_id, is_active) VALUES
${escapeSqlArray(oldWards.rows)};\n\n`);
    }

    const newWards = await client.query(
      `SELECT id, name, code, level, parent_id, is_active FROM administrative_units WHERE level = 'ward' AND parent_id = $1 AND is_active = TRUE ORDER BY name`,
      [district.id]
    );

    if (newWards.rows.length > 0) {
      stream.write(`-- XÃ MỚI (đang hoạt động) - is_active = TRUE
INSERT INTO administrative_units (id, name, code, level, parent_id, is_active) VALUES
${escapeSqlArray(newWards.rows)};\n\n`);
    }
  }

  // Khôi phục role constraint
  stream.write(`\nSET session_replication_role = 'origin';\n\n`);

  // 3. Xuất Administrative Changes
  console.log("Exporting Changes...");
  const changes = await client.query(
    `SELECT id, resolution_number, description, change_type, effective_date FROM administrative_changes ORDER BY id`
  );
  if (changes.rows.length > 0) {
    stream.write(`-- ============================================
-- THAY ĐỔI HÀNH CHÍNH
-- ============================================
`);
    // Ghi từng lô 100 dòng để insert không bị quá lớn
    const chunkSize = 100;
    for (let i = 0; i < changes.rows.length; i += chunkSize) {
      const chunk = changes.rows.slice(i, i + chunkSize);
      stream.write(`INSERT INTO administrative_changes (id, resolution_number, description, change_type, effective_date) VALUES\n${escapeSqlArray(chunk)};\n`);
    }
    stream.write(`\n`);
  }

  // 4. Xuất Mappings
  console.log("Exporting Mappings...");
  const mappings = await client.query(
    `SELECT id, change_id, old_unit_id, new_unit_id FROM administrative_change_mappings ORDER BY id`
  );
  if (mappings.rows.length > 0) {
    stream.write(`-- ============================================
-- MAPPING CŨ → MỚI
-- ============================================
`);
    const chunkSize = 500;
    for (let i = 0; i < mappings.rows.length; i += chunkSize) {
      const chunk = mappings.rows.slice(i, i + chunkSize);
      stream.write(`INSERT INTO administrative_change_mappings (id, change_id, old_unit_id, new_unit_id) VALUES\n${escapeSqlArray(chunk)};\n`);
    }
  }

  // Reset sequences based on max ID
  stream.write(`\n-- ============================================
-- RESET SEQUENCES
-- ============================================
SELECT setval('administrative_units_id_seq', (SELECT COALESCE(MAX(id), 1) FROM administrative_units));
SELECT setval('administrative_changes_id_seq', (SELECT COALESCE(MAX(id), 1) FROM administrative_changes));
SELECT setval('administrative_change_mappings_id_seq', (SELECT COALESCE(MAX(id), 1) FROM administrative_change_mappings));
\n`);

  stream.end();
  await client.end();
  console.log(" export completed to database/seed_real.sql");
}

generateSeed().catch((err) => {
  console.error("Error generating seed:", err);
  process.exit(1);
});
