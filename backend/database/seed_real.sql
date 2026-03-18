-- ============================================
-- SEED DATA: Huyện Krông Năng, tỉnh Đắk Lắk
-- Theo NQ 1660/NQ-UBTVQH15 (16/6/2025)
-- Hiệu lực: 01/07/2025
-- ============================================
SET client_encoding = 'UTF8';
-- Xóa dữ liệu cũ (nếu có)
DELETE FROM administrative_change_mappings;
DELETE FROM administrative_changes;
DELETE FROM administrative_units;

-- Reset sequence
ALTER SEQUENCE administrative_units_id_seq RESTART WITH 1;
ALTER SEQUENCE administrative_changes_id_seq RESTART WITH 1;
ALTER SEQUENCE administrative_change_mappings_id_seq RESTART WITH 1;

-- ============================================
-- TỈNH
-- ============================================
INSERT INTO administrative_units (name, code, level, parent_id, is_active) VALUES
('Đắk Lắk', '66', 'province', NULL, TRUE);
-- id = 1

-- ============================================
-- HUYỆN KRÔNG NĂNG
-- ============================================
INSERT INTO administrative_units (name, code, level, parent_id, is_active) VALUES
('Huyện Krông Năng', '650', 'district', 1, TRUE);
-- id = 2

-- ============================================
-- 12 XÃ CŨ (trước sáp nhập) - is_active = FALSE
-- ============================================
INSERT INTO administrative_units (name, code, level, parent_id, is_active) VALUES
('Thị trấn Krông Năng', '24580', 'ward', 2, FALSE),         -- id = 3
('Xã ĐLiê Ya', '24583', 'ward', 2, FALSE),                  -- id = 4
('Xã Ea Tóh', '24586', 'ward', 2, FALSE),                   -- id = 5
('Xã Ea Tam', '24589', 'ward', 2, FALSE),                   -- id = 6
('Xã Phú Lộc', '24592', 'ward', 2, FALSE),                  -- id = 7
('Xã Tam Giang', '24595', 'ward', 2, FALSE),                -- id = 8
('Xã Ea Puk', '24598', 'ward', 2, FALSE),                   -- id = 9
('Xã Ea Dăh', '24601', 'ward', 2, FALSE),                   -- id = 10
('Xã Ea Hồ', '24604', 'ward', 2, FALSE),                    -- id = 11
('Xã Phú Xuân', '24607', 'ward', 2, FALSE),                 -- id = 12
('Xã Cư Klông', '24610', 'ward', 2, FALSE),                 -- id = 13
('Xã Ea Tân', '24613', 'ward', 2, FALSE);                   -- id = 14

-- ============================================
-- 4 XÃ MỚI (sau sáp nhập) - is_active = TRUE
-- ============================================
INSERT INTO administrative_units (name, code, level, parent_id, is_active) VALUES
('Xã Krông Năng', '24700', 'ward', 2, TRUE),                -- id = 15 (TT Krông Năng + Phú Lộc + Ea Hồ)
('Xã Dliê Ya', '24701', 'ward', 2, TRUE),                   -- id = 16 (Ea Tóh + Ea Tân + ĐLiê Ya)
('Xã Tam Giang', '24702', 'ward', 2, TRUE),                 -- id = 17 (Ea Tam + Cư Klông + Tam Giang)
('Xã Phú Xuân', '24703', 'ward', 2, TRUE);                  -- id = 18 (Ea Puk + Ea Dăh + Phú Xuân)

-- ============================================
-- THAY ĐỔI HÀNH CHÍNH
-- NQ 1660/NQ-UBTVQH15 ngày 16/6/2025
-- ============================================

-- Change 1: TT Krông Năng + Phú Lộc + Ea Hồ → Xã Krông Năng
INSERT INTO administrative_changes
(resolution_number, description, change_type, effective_date)
VALUES
('1660/NQ-UBTVQH15',
 'Sáp nhập toàn bộ DT và dân số của TT Krông Năng, xã Phú Lộc và xã Ea Hồ thành xã Krông Năng mới.',
 'merge',
 '2025-07-01');
-- id = 1

-- Change 2: Ea Tóh + Ea Tân + ĐLiê Ya → Xã Dliê Ya
INSERT INTO administrative_changes
(resolution_number, description, change_type, effective_date)
VALUES
('1660/NQ-UBTVQH15',
 'Sáp nhập toàn bộ DT và dân số của xã Ea Tóh, xã Ea Tân và xã ĐLiê Ya thành xã Dliê Ya mới.',
 'merge',
 '2025-07-01');
-- id = 2

-- Change 3: Ea Tam + Cư Klông + Tam Giang → Xã Tam Giang
INSERT INTO administrative_changes
(resolution_number, description, change_type, effective_date)
VALUES
('1660/NQ-UBTVQH15',
 'Sáp nhập toàn bộ DT và dân số của xã Ea Tam, xã Cư Klông và xã Tam Giang thành xã Tam Giang mới.',
 'merge',
 '2025-07-01');
-- id = 3

-- Change 4: Ea Puk + Ea Dăh + Phú Xuân → Xã Phú Xuân
INSERT INTO administrative_changes
(resolution_number, description, change_type, effective_date)
VALUES
('1660/NQ-UBTVQH15',
 'Sáp nhập toàn bộ DT và dân số của xã Ea Puk, xã Ea Dăh và xã Phú Xuân thành xã Phú Xuân mới.',
 'merge',
 '2025-07-01');
-- id = 4

-- ============================================
-- MAPPING CŨ → MỚI
-- ============================================

-- Change 1: TT Krông Năng(3) + Phú Lộc(7) + Ea Hồ(11) → Xã Krông Năng(15)
INSERT INTO administrative_change_mappings (change_id, old_unit_id, new_unit_id) VALUES
(1, 3, 15),
(1, 7, 15),
(1, 11, 15);

-- Change 2: Ea Tóh(5) + Ea Tân(14) + ĐLiê Ya(4) → Xã Dliê Ya(16)
INSERT INTO administrative_change_mappings (change_id, old_unit_id, new_unit_id) VALUES
(2, 5, 16),
(2, 14, 16),
(2, 4, 16);

-- Change 3: Ea Tam(6) + Cư Klông(13) + Tam Giang(8) → Xã Tam Giang(17)
INSERT INTO administrative_change_mappings (change_id, old_unit_id, new_unit_id) VALUES
(3, 6, 17),
(3, 13, 17),
(3, 8, 17);

-- Change 4: Ea Puk(9) + Ea Dăh(10) + Phú Xuân(12) → Xã Phú Xuân(18)
INSERT INTO administrative_change_mappings (change_id, old_unit_id, new_unit_id) VALUES
(4, 9, 18),
(4, 10, 18),
(4, 12, 18);

-- ============================================
-- DONE: Tổng cộng
-- 1 tỉnh, 1 huyện (Krông Năng)
-- 12 xã cũ (inactive) + 4 xã mới (active)
-- 4 thay đổi hành chính, 12 mappings
-- ============================================
