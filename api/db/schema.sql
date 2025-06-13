DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS hardware;
DROP TABLE IF EXISTS software;
DROP TABLE IF EXISTS data;
DROP TABLE IF EXISTS computers;
DROP TABLE IF EXISTS printers;
DROP TABLE IF EXISTS devices;
DROP TABLE IF EXISTS audio_video;
DROP TABLE IF EXISTS inventory_assignments;
-- Departments Table: Stores department details
CREATE TABLE departments (
    department_id INTEGER PRIMARY KEY AUTOINCREMENT,
    department_name TEXT NOT NULL UNIQUE,
    department_type TEXT,
    department_note TEXT
);
-- Employees Table: Stores employee details
CREATE TABLE employees (
    employee_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    note TEXT
);
--Users Table: Stores user credentials and roles
-- Security Level: 1 (low) to 4 (high)
-- 1: Basic user, 2: Intern, 3: Admin, 4: Super admin
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_role TEXT NOT NULL CHECK(
        user_role IN ('basic', 'intern', 'admin', 'super_admin')
    ),
    security_level INTEGER NOT NULL CHECK(security_level IN (1, 2, 3, 4)),
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    employee_id INTEGER,
    FOREIGN KEY(employee_id) REFERENCES employees(employee_id) ON DELETE
    SET NULL
);
-- Hardware Assets Table: Stores hardware asset details
CREATE TABLE hardware (
    device_id INTEGER PRIMARY KEY AUTOINCREMENT,
    serial_number TEXT UNIQUE NOT NULL,
    device_name TEXT NOT NULL,
    device_type TEXT NOT NULL,
    purchase_date DATE NOT NULL,
    warranty_expiration DATE,
    status TEXT CHECK(
        status IN (
            'active',
            'inactive',
            'maintenance',
            'decommissioned'
        )
    ) NOT NULL,
    assignee INTEGER,
    note TEXT,
    FOREIGN KEY(assignee) REFERENCES employees(employee_id) ON DELETE
    SET NULL
);
-- Sub Tables for Hardware Assets: Computers, Printers, Devices, Audio/Video Equipment
-- Computers Table: Stores computer asset details
CREATE TABLE computers (
    device_id INTEGER NOT NULL,
    serial_number TEXT UNIQUE NOT NULL,
    device_type TEXT NOT NULL CHECK(
        device_type IN ('desktop', 'laptop', 'server', 'AIO')
    ),
    computer_model TEXT NOT NULL,
    computer_brand TEXT NOT NULL,
    cpu TEXT,
    ram TEXT,
    operating_system TEXT,
    FOREIGN KEY(device_id) REFERENCES hardware(device_id) ON DELETE CASCADE,
    FOREIGN KEY(serial_number) REFERENCES hardware(serial_number) ON DELETE CASCADE
);
-- Printers Table: Stores printer asset details
CREATE TABLE printers (
    device_id INTEGER NOT NULL,
    serial_number TEXT UNIQUE NOT NULL,
    mac_address TEXT UNIQUE NOT NULL,
    ip_address TEXT,
    printer_model TEXT NOT NULL,
    printer_brand TEXT NOT NULL,
    FOREIGN KEY(device_id) REFERENCES hardware(device_id) ON DELETE CASCADE,
    FOREIGN KEY(serial_number) REFERENCES hardware(serial_number) ON DELETE CASCADE
);
-- Devices Table: Stores other device asset details
CREATE TABLE devices (
    device_id INTEGER NOT NULL,
    serial_number TEXT UNIQUE NOT NULL,
    device_type TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    FOREIGN KEY(device_id) REFERENCES hardware(device_id) ON DELETE CASCADE,
    FOREIGN KEY(serial_number) REFERENCES hardware(serial_number) ON DELETE CASCADE
);
-- Audio/Video Equipment Table: Stores audio/video equipment details
CREATE TABLE audio_video (
    device_id INTEGER NOT NULL,
    serial_number TEXT UNIQUE NOT NULL,
    equipment_type TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    FOREIGN KEY(device_id) REFERENCES hardware(device_id) ON DELETE CASCADE,
    FOREIGN KEY(serial_number) REFERENCES hardware(serial_number) ON DELETE CASCADE
);
-- Software Assets Table: Stores software asset details
CREATE TABLE software (
    software_id INTEGER PRIMARY KEY AUTOINCREMENT,
    software_brand TEXT NOT NULL,
    software_name TEXT NOT NULL,
    version TEXT NOT NULL,
    license_key TEXT UNIQUE NOT NULL,
    purchase_date DATE,
    expiration_date DATE,
    status TEXT CHECK(
        status IN (
            'active',
            'inactive',
            'maintenance',
            'decommissioned'
        )
    ) NOT NULL,
    assignee INTEGER,
    FOREIGN KEY(assignee) REFERENCES employees(employee_id) ON DELETE
    SET NULL
);
-- Data Assets Table: Stores data asset details
CREATE TABLE data (
    data_id INTEGER PRIMARY KEY AUTOINCREMENT,
    data_name TEXT NOT NULL,
    data_type TEXT NOT NULL,
    storage_location TEXT NOT NULL,
    access_level TEXT CHECK(
        access_level IN (
            'public',
            'internal',
            'confidential',
            'restricted'
        )
    ) NOT NULL,
    members_list TEXT,
    -- Comma-separated list of employee IDs
    created_date DATE NOT NULL DEFAULT CURRENT_DATE,
    last_modified_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT CHECK(
        status IN (
            'active',
            'inactive',
            'archived',
            'decommissioned'
        )
    ) NOT NULL
);
-- Inventory Assignments Table: Tracks device assignments
CREATE TABLE inventory_assignments (
    assignment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id INTEGER NOT NULL,
    employee_id INTEGER NOT NULL,
    assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
    return_date DATE,
    FOREIGN KEY(device_id) REFERENCES hardware(device_id) ON DELETE CASCADE,
    FOREIGN KEY(employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
);
-- Indexes for faster queries
CREATE INDEX idx_department_name ON departments(department_name);
CREATE INDEX idx_employee_email ON employees(email);
CREATE INDEX idx_user_username ON users(username);
CREATE INDEX idx_hardware_serial ON hardware(serial_number);
CREATE INDEX idx_software_license ON software(license_key);
CREATE INDEX idx_data_name ON data(data_name);
CREATE INDEX idx_inventory_device ON inventory_assignments(device_id);
-- Sample data insertion for all tables
INSERT INTO departments (
        department_name,
        department_type,
        department_note
    )
VALUES (
        'IT',
        'Technology',
        'Information Technology Department'
    ),
    (
        'HR',
        'Human Resources',
        'Human Resources Department'
    ),
    ('Finance', 'Finance', 'Finance Department');
INSERT INTO employees (first_name, last_name, email, phone, note)
VALUES (
        'John',
        'Doe',
        'john.doe@example.com',
        '123-456-7890',
        'IT Department'
    ),
    (
        'Jane',
        'Smith',
        'jane.smith@example.com',
        '987-654-3210',
        'HR Department'
    ),
    (
        'Alice',
        'Johnson',
        'alice.johnson@example.com',
        '555-123-4567',
        'Finance Department'
    );
INSERT INTO users (username, password, user_role, security_level)
VALUES (
        'user1',
        'scrypt:32768:8:1$U8hJ9yVxJUUCJrXf$5fa60c2d950346be75db37a733db93d72c55591d26477c88b00b96e7e058c97935b3307b0de49b1f41ddc7fdd1a5be1ff43514c68d909007217ccc665fb2ed47',
        'intern',
        2
    ),
    (
        'admin',
        'scrypt:32768:8:1$hCiEtfqornuTb8aP$2b219d2559dcb854d00ee78b0aada18534ebc883ba803bfb2e932cab10395e7852ae9c8476f2bf6653c839d2ca3ca72bc81713369dc307d5942281e697843cd9',
        'admin',
        3
    ),
    (
        'superadmin',
        'scrypt:32768:8:1$Wacwj3uuFjuekDJs$561b5d00326455be223aa955ab7413947377f9590709529016a7cfc717cdc27d342909e188b50fad43adb3b102d4108000aac497e9b9163b68c39be263e3c907',
        'super_admin',
        4
    );
INSERT INTO hardware (
        serial_number,
        device_name,
        device_type,
        purchase_date,
        warranty_expiration,
        status,
        assignee,
        note
    )
VALUES (
        'SN123456',
        'Dell Laptop',
        'laptop',
        '2023-01-15',
        '2024-01-15',
        'active',
        1,
        'Dell XPS 13'
    ),
    (
        'SN654321',
        'HP Printer',
        'printer',
        '2022-05-20',
        '2023-05-20',
        'active',
        2,
        'HP LaserJet Pro M404dn'
    ),
    (
        'SN789012',
        'Cisco Switch',
        'device',
        '2021-10-10',
        NULL,
        'inactive',
        NULL,
        'Cisco Catalyst 2960X'
    );
INSERT INTO computers (
        device_id,
        serial_number,
        device_type,
        computer_model,
        computer_brand,
        cpu,
        ram,
        operating_system
    )
VALUES (
        1,
        'SN123456',
        'laptop',
        'XPS 13',
        'Dell',
        'Intel Core i7',
        '16GB',
        'Windows 10'
    );
INSERT INTO printers (
        device_id,
        serial_number,
        mac_address,
        ip_address,
        printer_model,
        printer_brand
    )
VALUES (
        2,
        'SN654321',
        '00:1A:2B:3C:4D:5E',
        '192.168.1.100',
        'LaserJet Pro M404dn',
        'HP'
    );
INSERT INTO devices (
        device_id,
        serial_number,
        device_type,
        brand,
        model
    )
VALUES (
        3,
        'SN789012',
        'switch',
        'Cisco',
        'Catalyst 2960X'
    );
INSERT INTO audio_video (
        device_id,
        serial_number,
        equipment_type,
        brand,
        model
    )
VALUES (
        3,
        'SN789012',
        'projector',
        'Epson',
        'PowerLite 1781W'
    );
INSERT INTO software (
        software_brand,
        software_name,
        version,
        license_key,
        purchase_date,
        expiration_date,
        status,
        assignee
    )
VALUES (
        'Microsoft',
        'Office 365',
        '2023',
        'ABC123XYZ',
        '2023-01-01',
        '2024-01-01',
        'active',
        1
    ),
    (
        'Adobe',
        'Photoshop',
        '2022',
        'DEF456UVW',
        '2022-06-15',
        NULL,
        'active',
        2
    );
INSERT INTO data (
        data_name,
        data_type,
        storage_location,
        access_level,
        members_list,
        created_date,
        last_modified_date,
        status
    )
VALUES (
        'Employee Records',
        'database',
        'internal server',
        'confidential',
        '1,2',
        '2023-01-01',
        '2023-01-15',
        'active'
    ),
    (
        'Financial Reports',
        'spreadsheet',
        'cloud storage',
        'restricted',
        '3',
        '2022-05-20',
        '2022-06-01',
        'archived'
    );
INSERT INTO inventory_assignments (
        device_id,
        employee_id,
        assigned_date,
        return_date
    )
VALUES (1, 1, '2023-01-15', NULL),
    (2, 2, '2022-05-20', '2023-05-20'),
    (3, 3, '2021-10-10', NULL);