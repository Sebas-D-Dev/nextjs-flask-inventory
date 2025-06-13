from flask import Blueprint, jsonify, request
from api.db.database import get_db
import sqlite3

hardware_bp = Blueprint("hardware", __name__, url_prefix="/api/hardware")

# Get all hardware entries
@hardware_bp.route("/", methods=["GET"])
def get_all_hardware():
    try:
        db = get_db()
        db.row_factory = sqlite3.Row  # Add this line if not already set globally
        cursor = db.cursor()
        cursor.execute("SELECT * FROM hardware")
        rows = cursor.fetchall()
        hardware_list = [dict(row) for row in rows]  # Convert each row to dict
        return jsonify({"hardware": hardware_list}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch hardware: {str(e)}"}), 500

# Get hardware by ID
@hardware_bp.route("/<int:hardware_id>", methods=["GET"])
def get_hardware_by_id(hardware_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM hardware WHERE id = ?", (hardware_id,))
        row = cursor.fetchone()
        if row:
            return jsonify({"hardware": row}), 200
        else:
            return jsonify({"error": "Hardware not found"}), 404
    except Exception as e:
        return jsonify({"error": f"Failed to fetch hardware: {str(e)}"}), 500

# Create new hardware entry
@hardware_bp.route("/", methods=["POST"])
def create_hardware():
    try:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO hardware (name, model) VALUES (?, ?)",
            (data['name'], data['model'])
        )
        db.commit()
        new_id = cursor.lastrowid
        return jsonify({"id": new_id, "message": "Hardware created successfully"}), 201
    except Exception as e:
        return jsonify({"error": f"Failed to create hardware: {str(e)}"}), 500

# Update hardware entry
@hardware_bp.route("/<int:hardware_id>", methods=["PUT", "PATCH"])
def update_hardware(hardware_id):
    try:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "UPDATE hardware SET name = ?, model = ? WHERE id = ?",
            (data['name'], data['model'], hardware_id)
        )
        db.commit()
        if cursor.rowcount == 0:
            return jsonify({"error": "Hardware not found"}), 404
        return jsonify({"message": "Hardware updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to update hardware: {str(e)}"}), 500

# Delete hardware entry
@hardware_bp.route("/<int:hardware_id>", methods=["DELETE"])
def delete_hardware(hardware_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("DELETE FROM hardware WHERE id = ?", (hardware_id,))
        db.commit()
        if cursor.rowcount == 0:
            return jsonify({"error": "Hardware not found"}), 404
        return jsonify({"message": "Hardware deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to delete hardware: {str(e)}"}), 500