from flask import Blueprint, jsonify, request
from api.db.database import get_db
import sqlite3

software_bp = Blueprint("software", __name__, url_prefix="/api/software")

# Get all software entries
@software_bp.route("/", methods=["GET"])
def get_all_software():
    try:
        db = get_db()
        db.row_factory = sqlite3.Row  # Add this line if not already set globally
        cursor = db.cursor()
        cursor.execute("SELECT * FROM software")
        rows = cursor.fetchall()
        software_list = [dict(row) for row in rows]  # Convert each row to dict
        return jsonify({"software": software_list}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch software: {str(e)}"}), 500

# Get software by ID
@software_bp.route("/<int:software_id>", methods=["GET"])
def get_software_by_id(software_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM software WHERE id = ?", (software_id,))
        row = cursor.fetchone()
        if row:
            return jsonify({"software": row}), 200
        else:
            return jsonify({"error": "Software not found"}), 404
    except Exception as e:
        return jsonify({"error": f"Failed to fetch software: {str(e)}"}), 500

# Create new software entry
@software_bp.route("/", methods=["POST"])
def create_software():
    try:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO software (name, version) VALUES (?, ?)",
            (data['name'], data['version'])
        )
        db.commit()
        new_id = cursor.lastrowid
        return jsonify({"id": new_id, "message": "Software created successfully"}), 201
    except Exception as e:
        return jsonify({"error": f"Failed to create software: {str(e)}"}), 500

# Update software entry
@software_bp.route("/<int:software_id>", methods=["PUT", "PATCH"])
def update_software(software_id):
    try:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "UPDATE software SET name = ?, version = ? WHERE id = ?",
            (data['name'], data['version'], software_id)
        )
        db.commit()
        if cursor.rowcount == 0:
            return jsonify({"error": "Software not found"}), 404
        return jsonify({"message": "Software updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to update software: {str(e)}"}), 500

# Delete software entry
@software_bp.route("/<int:software_id>", methods=["DELETE"])
def delete_software(software_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("DELETE FROM software WHERE id = ?", (software_id,))
        db.commit()
        if cursor.rowcount == 0:
            return jsonify({"error": "Software not found"}), 404
        return jsonify({"message": "Software deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to delete software: {str(e)}"}), 500