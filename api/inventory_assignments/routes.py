from flask import Blueprint, request, jsonify
from .controllers import get_inventory_assignments, add_inventory_assignment, update_inventory_assignment, delete_inventory_assignment

inventory_bp = Blueprint("inventory", __name__)

@inventory_bp.route("/api/inventory_assignments", methods=["GET"])
def get_all_inventory():
    try:
        return get_inventory_assignments()
    except Exception as e:
        return jsonify({"error": f"Failed to fetch inventory assignments: {str(e)}"}), 500

@inventory_bp.route("/api/inventory_assignments", methods=["POST"])
def create_inventory_assignment():
    try:
        data = request.get_json()
        return add_inventory_assignment(data)
    except Exception as e:
        return jsonify({"error": f"Failed to add inventory assignment: {str(e)}"}), 500

@inventory_bp.route("/api/inventory_assignments/<int:inventory_id>", methods=["PUT", "PATCH"])
def modify_inventory_assignment(inventory_id):
    try:
        data = request.get_json()
        return update_inventory_assignment(inventory_id, data)
    except Exception as e:
        return jsonify({"error": f"Failed to update inventory assignment: {str(e)}"}), 500

@inventory_bp.route("/api/inventory_assignments/<int:inventory_id>", methods=["DELETE"])
def remove_inventory_assignment(inventory_id):
    try:
        return delete_inventory_assignment(inventory_id)
    except Exception as e:
        return jsonify({"error": f"Failed to delete inventory assignment: {str(e)}"}), 500