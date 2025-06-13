from flask import Blueprint, jsonify, request
from api.db.database import get_db

employee_bp = Blueprint("employees", __name__, url_prefix="/api/employees")

# Get all employees
@employee_bp.route("/", methods=["GET"])
def get_employees():
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM employees")
        rows = cursor.fetchall()
        employee_list = [dict(r) for r in rows]
        return jsonify({"employees": employee_list}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch employees: {str(e)}"}), 500

# Get a specific employee by ID
@employee_bp.route("/<int:employee_id>", methods=["GET"])
def get_employee_by_id(employee_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM employees WHERE id = ?", (employee_id,))
        row = cursor.fetchone()
        if row:
            return jsonify({"employee": dict(row)}), 200
        else:
            return jsonify({"error": "Employee not found"}), 404
    except Exception as e:
        return jsonify({"error": f"Failed to fetch employee: {str(e)}"}), 500

# Create a new employee
@employee_bp.route("/", methods=["POST"])
def create_employee():
    try:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()
        cursor.execute("INSERT INTO employees (name, position, department_id) VALUES (?, ?, ?)", 
                       (data['name'], data['position'], data['department_id']))
        db.commit()
        new_id = cursor.lastrowid
        return jsonify({"id": new_id, "message": "Employee created successfully"}), 201
    except Exception as e:
        return jsonify({"error": f"Failed to create employee: {str(e)}"}), 500

# Update an existing employee
@employee_bp.route("/<int:employee_id>", methods=["PUT", "PATCH"])
def update_employee(employee_id):
    try:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()
        cursor.execute("UPDATE employees SET name = ?, position = ?, department_id = ? WHERE id = ?", 
                       (data['name'], data['position'], data['department_id'], employee_id))
        db.commit()
        
        if cursor.rowcount == 0:
            return jsonify({"error": "Employee not found"}), 404
        
        return jsonify({"message": "Employee updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to update employee: {str(e)}"}), 500

# Delete an employee
@employee_bp.route("/<int:employee_id>", methods=["DELETE"])
def delete_employee(employee_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("DELETE FROM employees WHERE id = ?", (employee_id,))
        db.commit()
        
        if cursor.rowcount == 0:
            return jsonify({"error": "Employee not found"}), 404
        
        return jsonify({"message": "Employee deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to delete employee: {str(e)}"}), 500