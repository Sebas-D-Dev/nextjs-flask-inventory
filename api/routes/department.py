from flask import Blueprint, jsonify, request
from api.db.database import get_db
import sqlite3

department_bp = Blueprint("departments", __name__, url_prefix="/api/departments")

# Get all departments
@department_bp.route("/", methods=["GET"])
def get_departments():
    try:
        db = get_db()
        db.row_factory = sqlite3.Row  # Add this line if not already set globally
        cursor = db.cursor()
        cursor.execute("SELECT * FROM departments")
        rows = cursor.fetchall()
        departments_list = [dict(row) for row in rows]  # Convert each row to dict
        return jsonify({"departments": departments_list}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch departments: {str(e)}"}), 500
    
# Get a specific department by ID
@department_bp.route("/<int:department_id>", methods=["GET"])
def get_department_by_id(department_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM departments WHERE id = ?", (department_id,))
        row = cursor.fetchone()
        if row:
            return jsonify({"software": dict(row)}), 200
        else:
            return jsonify({"error": "Department not found"}), 404
    except Exception as e:
        return jsonify({"error": f"Failed to fetch department: {str(e)}"}), 500
    
# Create a new department
@department_bp.route("/", methods=["POST"])
def create_department():
    try:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()
        cursor.execute("INSERT INTO departments (name, description) VALUES (?, ?)", (data['name'], data['description']))
        db.commit()
        new_id = cursor.lastrowid
        return jsonify({"id": new_id, "message": "Department created successfully"}), 201
    except Exception as e:
        return jsonify({"error": f"Failed to create department: {str(e)}"}), 500
    
# Update a department
@department_bp.route("/<int:department_id>", methods=["PUT", "PATCH"])
def update_department(department_id):
    try:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()
        cursor.execute("UPDATE departments SET name = ?, description = ? WHERE id = ?", (data['name'], data['description'], department_id))
        db.commit()
        
        if cursor.rowcount == 0:
            return jsonify({"error": "Department not found"}), 404
        
        return jsonify({"message": "Department updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to update department: {str(e)}"}), 500
    
# Delete a department
@department_bp.route("/<int:department_id>", methods=["DELETE"])
def delete_department(department_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("DELETE FROM departments WHERE id = ?", (department_id,))
        db.commit()
        
        if cursor.rowcount == 0:
            return jsonify({"error": "Department not found"}), 404
        
        return jsonify({"message": "Department deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to delete department: {str(e)}"}), 500