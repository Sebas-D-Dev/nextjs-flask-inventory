-- Drop existing tables (if necessary)
DROP TABLE IF EXISTS inventory_assignments;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS devices;
DROP TABLE IF EXISTS departments;

-- Departments Table: Stores department details
CREATE TABLE departments (
    department_id INTEGER PRIMARY KEY AUTOINCREMENT,
    department_name TEXT NOT NULL UNIQUE,
    description TEXT
);

-- Employees Table: Stores employee details
CREATE TABLE employees (
    employee_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    department TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT
);

-- Devices Table: Stores device details
CREATE TABLE devices (
    device_id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_name TEXT NOT NULL,
    device_type TEXT CHECK(device_type IN ('Laptop', 'Desktop', 'Tablet', 'Printer', 'Other')),
    hardware_description TEXT,
    purchase_date DATE,
    serial_number TEXT UNIQUE NOT NULL
);

-- Inventory Assignments Table: Tracks device assignments
CREATE TABLE inventory_assignments (
    inventory_id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id INTEGER NOT NULL,
    employee_id INTEGER NOT NULL,
    assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT CHECK(status IN ('assigned', 'returned', 'maintenance', 'decommissioned')) NOT NULL,
    notes TEXT,

    FOREIGN KEY(device_id) REFERENCES devices(device_id) ON DELETE CASCADE,
    FOREIGN KEY(employee_id) REFERENCES employees(employee_id) ON DELETE SET NULL
);

-- Indexes for faster queries
CREATE INDEX idx_employee_id ON employees(employee_id);
CREATE INDEX idx_device_id ON devices(device_id);
CREATE INDEX idx_inventory_device ON inventory_assignments(device_id);
CREATE INDEX idx_inventory_employee ON inventory_assignments(employee_id);

-- Sample Data Insertion (optional)
INSERT INTO departments (department_name, description) VALUES
('IT', 'Information Technology Department'),
('HR', 'Human Resources Department'),
('Finance', 'Finance Department');
INSERT INTO employees (first_name, last_name, department, email, phone) VALUES
('John', 'Doe', 'IT', 'john.doe@example.com', '123-456-7890'),
('Jane', 'Smith', 'HR', 'jane.smith@example.com', '987-654-3210'),
('Alice', 'Johnson', 'Finance', 'alice.johnson@example.com', '555-123-4567');
INSERT INTO devices (device_name, device_type, hardware_description, purchase_date, serial_number) VALUES
('Dell XPS 13', 'Laptop', '13-inch ultrabook with Intel i7', '2023-01-15', 'SN123456789'),
('HP LaserJet Pro', 'Printer', 'Laser printer with duplex printing', '2022-11-20', 'SN987654321'),
('Apple iPad Pro', 'Tablet', '12.9-inch tablet with M1 chip', '2023-03-10', 'SN1122334455');
INSERT INTO inventory_assignments (device_id, employee_id, assigned_date, status, notes) VALUES
(1, 1, '2023-01-16', 'assigned', 'Assigned to John Doe'),
(2, 2, '2022-11-21', 'assigned', 'Assigned to Jane Smith'),
(3, 3, '2023-03-11', 'assigned', 'Assigned to Alice Johnson');
-- Ensure foreign key constraints are enforced
PRAGMA foreign_keys = ON;