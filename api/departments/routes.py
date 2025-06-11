from flask import Blueprint, request, jsonify
from api.db.database import get_db

department_bp = Blueprint("departments", __name__, url_prefix="/api/departments")

@department_bp.route("", methods=["GET"])
def get_departments():
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT department_id, department_name FROM departments")
        rows = cursor.fetchall()

        departments = [
            {"department_id": row["department_id"], "name": row["department_name"]}
            for row in rows
        ]

        return jsonify({"departments": departments})

    except Exception as e:
        return jsonify({"error": f"Failed to fetch departments: {str(e)}"}), 500

@department_bp.route("", methods=["POST"])
def create_department():
    try:
        data = request.get_json()
        department_name = data.get("name")

        if not department_name:
            return jsonify({"error": "Department name is required"}), 400

        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO departments (department_name) VALUES (?)", (department_name,)
        )
        db.commit()

        new_id = cursor.lastrowid

        return jsonify({
            "department": {"department_id": new_id, "name": department_name}
        }), 201

    except Exception as e:
        return jsonify({"error": f"Failed to add department: {str(e)}"}), 500