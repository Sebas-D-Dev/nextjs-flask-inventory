from flask import Blueprint, jsonify
from api.db.database import get_db

device_bp = Blueprint("devices", __name__)

@device_bp.route("/api/devices", methods=["GET"])
def get_devices():
    try:
        db = get_db()
        cursor = db.cursor()

        cursor.execute("""
            SELECT device_id, device_name, device_type, hardware_description, purchase_date, serial_number
            FROM devices
        """)
        rows = cursor.fetchall()

        devices = [
            {
                "device_id": row["device_id"],
                "device_name": row["device_name"],
                "device_type": row["device_type"],
                "hardware_description": row["hardware_description"],
                "purchase_date": row["purchase_date"],
                "serial_number": row["serial_number"]
            }
            for row in rows
        ]

        return jsonify({"devices": devices})

    except Exception as e:
        return jsonify({"error": f"Failed to fetch devices: {str(e)}"}), 500