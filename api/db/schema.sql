-- Departments Table
CREATE TABLE IF NOT EXISTS departments (
    department_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

-- Employees Table
CREATE TABLE IF NOT EXISTS employees (
    employee_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    department_id INTEGER NOT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

-- Devices Table
CREATE TABLE IF NOT EXISTS devices (
    device_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    device_type TEXT NOT NULL
);

-- Inventory Table
CREATE TABLE IF NOT EXISTS inventory (
    inventory_id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id INTEGER NOT NULL,
    employee_id INTEGER NOT NULL,
    assigned_date DATE DEFAULT (DATE('now')),
    status TEXT DEFAULT 'assigned',
    notes TEXT,
    FOREIGN KEY (device_id) REFERENCES devices(device_id),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);


-- Sample Data
INSERT INTO departments (name) VALUES ('IT'), ('HR'), ('Finance');
INSERT INTO employees (name, department_id) VALUES ('Alice Smith', 1), ('Bob Johnson', 2), ('Carol Lee', 1);
INSERT INTO devices (name, description, device_type) VALUES
  ('Dell Laptop', 'Latitude 5420, 16GB RAM', 'Computer'),
  ('iPhone 13', 'Company mobile phone', 'Phone'),
  ('HP LaserJet', 'Office printer', 'Printer');
INSERT INTO inventory (device_id, employee_id, assigned_date, status, notes) VALUES
  (1, 1, '2025-06-01', 'assigned', 'Primary work laptop'),
  (2, 2, '2025-06-02', 'assigned', 'Personal work phone'),
  (3, 3, '2025-06-03', 'assigned', 'Shared department printer');


SELECT
    e.name AS employee_name,
    d.name AS device_name,
    d.device_type,
    d.description,
    i.assigned_date,
    i.status,
    i.notes,
    dep.name AS department_name
FROM inventory i
JOIN employees e ON i.employee_id = e.employee_id
JOIN devices d ON i.device_id = d.device_id
JOIN departments dep ON e.department_id = dep.department_id
WHERE e.name = 'Alice Smith';