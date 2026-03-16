
-- Bảng lưu đơn vị hành chính
CREATE TABLE administrative_units (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE,
    level VARCHAR(50) NOT NULL, -- province / district / ward
    parent_id INT REFERENCES administrative_units(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng lưu thông tin thay đổi hành chính
CREATE TABLE administrative_changes (
    id SERIAL PRIMARY KEY,
    change_type VARCHAR(50) NOT NULL, -- merge, split, rename
    resolution_number VARCHAR(100),
    description TEXT,
    effective_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng mapping đơn vị cũ -> đơn vị mới
CREATE TABLE administrative_change_mappings (
    id SERIAL PRIMARY KEY,
    change_id INT REFERENCES administrative_changes(id) ON DELETE CASCADE,
    old_unit_id INT REFERENCES administrative_units(id),
    new_unit_id INT REFERENCES administrative_units(id)
);

