from flask import Blueprint, jsonify
from api.db.database import get_db

employee_bp = Blueprint("employees", __name__)

@employee_bp.route("/api/employees", methods=["GET"])
def get_employees():
    try:
        db = get_db()
        cursor = db.cursor()

        cursor.execute("SELECT employee_id, first_name, last_name, department, email, phone FROM employees")
        rows = cursor.fetchall()

        employees = [
            {
                "id": row["employee_id"],
                "name": f"{row['first_name']} {row['last_name']}",
                "department": row["department"],
                "email": row["email"],
                "phone": row["phone"]
            }
            for row in rows
        ]

        return jsonify({"employees": employees})

    except Exception as e:
        return jsonify({"error": f"Failed to fetch employees: {str(e)}"}), 500