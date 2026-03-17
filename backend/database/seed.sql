-- ============================================
-- SEED DATA: Đơn vị hành chính
-- ============================================

-- === TỈNH ===
INSERT INTO administrative_units (name, code, level, parent_id, is_active) VALUES
('Đắk Lắk', '66', 'province', NULL, TRUE);


-- === HUYỆN thuộc Đắk Lắk ===
INSERT INTO administrative_units (name, code, level, parent_id, is_active) VALUES
('Krông Năng', '649', 'district', 1, TRUE),
('Buôn Hồ', '644', 'district', 1, TRUE);


-- === PHƯỜNG thuộc Krông Năng ===
INSERT INTO administrative_units (name, code, level, parent_id, is_active) VALUES
('Phú Lộc', '24400', 'ward', 2, FALSE),
('Ea Tam', '24401', 'ward', 2, FALSE),



-- === PHƯỜNG thuộc Buôn Hồ ===
INSERT INTO administrative_units (name, code, level, parent_id, is_active) VALUES
('Thống Nhất', '24500', 'ward', 3, FALSE),
('Đoàn Kết', '24501', 'ward', 3, TRUE);



-- ============================================
-- SEED DATA: Thay đổi hành chính
-- ============================================

INSERT INTO administrative_changes
(resolution_number, description, change_type, effective_date)
VALUES
('NQ-1234/2024',
 'Sáp nhập xã Phú Lộc và Ea Tam thành xã Phú Lộc mới thuộc huyện Krông Năng',
 'merge',
 '2025-07-01'),

('NQ-1235/2024',
 'Đổi tên phường Thống Nhất thành phường Đoàn Kết thuộc thị xã Buôn Hồ',
 'rename',
 '2025-07-01');



-- ============================================
-- SEED DATA: Mapping cũ → mới
-- ============================================

-- merge
INSERT INTO administrative_change_mappings (change_id, old_unit_id, new_unit_id) VALUES
(1, 4, 6),
(1, 5, 6);

-- rename
INSERT INTO administrative_change_mappings (change_id, old_unit_id, new_unit_id) VALUES
(2, 7, 8);