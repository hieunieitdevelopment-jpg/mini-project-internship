-- Bật extension cho fuzzy search (trigram) và bỏ dấu tiếng Việt
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Bảng lưu đơn vị hành chính
CREATE TABLE administrative_units (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE,
    level VARCHAR(50) NOT NULL CHECK (level IN ('province', 'district', 'ward')),
    parent_id INT REFERENCES administrative_units(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index cho dropdown, filter, fuzzy search
CREATE INDEX idx_units_parent ON administrative_units(parent_id);
CREATE INDEX idx_units_level_active ON administrative_units(level, is_active);
CREATE INDEX idx_units_name_trgm ON administrative_units USING GIN (name gin_trgm_ops);

-- Bảng lưu thông tin thay đổi hành chính
CREATE TABLE administrative_changes (
    id SERIAL PRIMARY KEY,
    change_type VARCHAR(50) NOT NULL CHECK (change_type IN ('merge', 'split', 'rename')),
    resolution_number VARCHAR(100),
    description TEXT,
    effective_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng mapping đơn vị cũ -> đơn vị mới
CREATE TABLE administrative_change_mappings (
    id SERIAL PRIMARY KEY,
    change_id INT NOT NULL REFERENCES administrative_changes(id) ON DELETE CASCADE,
    old_unit_id INT NOT NULL REFERENCES administrative_units(id),
    new_unit_id INT NOT NULL REFERENCES administrative_units(id),
    UNIQUE(change_id, old_unit_id, new_unit_id)
);
