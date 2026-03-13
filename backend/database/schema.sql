CREATE TABLE provinces (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE
);

CREATE TABLE districts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE , 
    province_id INT REFERENCES provinces(id) ON DELETE CASCADE
);

CREATE TABLE wards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE, 
    district_id INT REFERENCES districts(id) ON DELETE CASCADE
);

CREATE TABLE address_changes (
  id SERIAL PRIMARY KEY,
  
  old_province VARCHAR(255),
  old_district VARCHAR(255),
  old_ward VARCHAR(255),

  new_province VARCHAR(255),
  new_district VARCHAR(255),
  new_ward VARCHAR(255),

  change_type VARCHAR(50),
  effective_date DATE
);