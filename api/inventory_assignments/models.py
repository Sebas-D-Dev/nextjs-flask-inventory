import sqlite3

DB_PATH = "api/db/inventory.db"

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# Fetch all inventory assignments
def fetch_all_inventory_assignments():
    conn = get_db_connection()
    inventory = conn.execute("""
        SELECT ia.inventory_id, d.device_name, d.device_type, e.first_name || ' ' || e.last_name AS employee_name,
               ia.assigned_date, ia.status, ia.notes
        FROM inventory_assignments ia
        JOIN devices d ON ia.device_id = d.device_id
        JOIN employees e ON ia.employee_id = e.employee_id
    """).fetchall()
    conn.close()
    return [dict(row) for row in inventory]

# Add new inventory assignment
def add_inventory_assignment_record(device_id, employee_id, status, notes=""):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT INTO inventory_assignments (device_id, employee_id, status, notes)
        VALUES (?, ?, ?, ?)
    """, (device_id, employee_id, status, notes))
    
    conn.commit()
    conn.close()
    return {"message": "Inventory assignment added successfully!"}

# Update an inventory assignment
def update_inventory_assignment_record(inventory_id, status, notes=""):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        UPDATE inventory_assignments 
        SET status = ?, notes = ?
        WHERE inventory_id = ?
    """, (status, notes, inventory_id))
    
    conn.commit()
    conn.close()
    return {"message": "Inventory assignment updated successfully!"}

# Delete an inventory assignment
def delete_inventory_assignment_record(inventory_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM inventory_assignments WHERE inventory_id = ?", (inventory_id,))
    
    conn.commit()
    conn.close()
    return {"message": "Inventory assignment deleted successfully!"}