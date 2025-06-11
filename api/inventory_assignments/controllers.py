from flask import jsonify
from .models import fetch_all_inventory_assignments, add_inventory_assignment_record, update_inventory_assignment_record, delete_inventory_assignment_record

def get_inventory_assignments():
    try:
        inventory_data = fetch_all_inventory_assignments()
        return jsonify({"inventory_assignments": inventory_data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def add_inventory_assignment(data):
    try:
        device_id = data.get("device_id")
        employee_id = data.get("employee_id")
        status = data.get("status")
        notes = data.get("notes", "")

        if not device_id or not employee_id or not status:
            return jsonify({"error": "Device ID, Employee ID, and Status are required"}), 400

        response = add_inventory_assignment_record(device_id, employee_id, status, notes)
        return jsonify(response), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def update_inventory_assignment(inventory_id, data):
    try:
        status = data.get("status")
        notes = data.get("notes", "")

        if not status:
            return jsonify({"error": "Status is required"}), 400

        response = update_inventory_assignment_record(inventory_id, status, notes)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def delete_inventory_assignment(inventory_id):
    try:
        response = delete_inventory_assignment_record(inventory_id)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500