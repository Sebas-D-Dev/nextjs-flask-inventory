from flask import Blueprint, jsonify, request
from api.db.database import get_db
import sqlite3

inventory_bp = Blueprint("inventory", __name__, url_prefix="/api/inventory_assignments")

# Get all inventory assignments
@inventory_bp.route("/", methods=["GET"])
def get_inventory_assignments():
    try:
        db = get_db()
        db.row_factory = sqlite3.Row  # Add this line if not already set globally
        cursor = db.cursor()
        cursor.execute("SELECT * FROM inventory_assignments")
        rows = cursor.fetchall()
        inventory_assignments_list = [dict(row) for row in rows]  # Convert each row to dict
        return jsonify({"inventory_assignments": inventory_assignments_list}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch inventory assignments: {str(e)}"}), 500
    
# Get a specific inventory assignment by ID
@inventory_bp.route("/<int:assignment_id>", methods=["GET"])
def get_inventory_assignment_by_id(assignment_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM inventory_assignments WHERE id = ?", (assignment_id,))
        row = cursor.fetchone()
        
        if row:
            return jsonify({"software": dict(row)}), 200
        else:
            return jsonify({"error": "Inventory assignment not found"}), 404
    except Exception as e:
        return jsonify({"error": f"Failed to fetch inventory assignment: {str(e)}"}), 500
    
# Create a new inventory assignment
@inventory_bp.route("/", methods=["POST"])
def create_inventory_assignment():
    try:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO inventory_assignments (employee_id, asset_id, assigned_date) VALUES (?, ?, ?)",
            (data['employee_id'], data['asset_id'], data['assigned_date'])
        )
        db.commit()
        new_id = cursor.lastrowid
        return jsonify({"id": new_id, "message": "Inventory assignment created successfully"}), 201
    except Exception as e:
        return jsonify({"error": f"Failed to create inventory assignment: {str(e)}"}), 500
    
# Update an existing inventory assignment
@inventory_bp.route("/<int:assignment_id>", methods=["PUT", "PATCH"])
def update_inventory_assignment(assignment_id):
    try:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "UPDATE inventory_assignments SET employee_id = ?, asset_id = ?, assigned_date = ? WHERE id = ?",
            (data['employee_id'], data['asset_id'], data['assigned_date'], assignment_id)
        )
        db.commit()
        
        if cursor.rowcount == 0:
            return jsonify({"error": "Inventory assignment not found"}), 404
        
        return jsonify({"message": "Inventory assignment updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to update inventory assignment: {str(e)}"}), 500
    
# Delete an inventory assignment
@inventory_bp.route("/<int:assignment_id>", methods=["DELETE"])
def delete_inventory_assignment(assignment_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("DELETE FROM inventory_assignments WHERE id = ?", (assignment_id,))
        db.commit()
        
        if cursor.rowcount == 0:
            return jsonify({"error": "Inventory assignment not found"}), 404
        
        return jsonify({"message": "Inventory assignment deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to delete inventory assignment: {str(e)}"}), 500