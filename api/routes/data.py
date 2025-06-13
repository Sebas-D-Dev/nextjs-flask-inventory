from flask import Blueprint, jsonify, request
from api.db.database import get_db

data_bp = Blueprint("data", __name__, url_prefix="/api/data")

@data_bp.route("/", methods=["GET"])
def get_all_data():
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM data")
        rows = cursor.fetchall()
        data = [{"id": row[0], "name": row[1], "value": row[2]} for row in rows]
        return jsonify({"data": data}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch data: {str(e)}"}), 500

# Get all data entries
@data_bp.route("/<int:data_id>", methods=["GET"])
def get_data_by_id(data_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM data WHERE id = ?", (data_id,))
        row = cursor.fetchone()
        
        if row:
            return jsonify({"data": row}), 200
        else:
            return jsonify({"error": "Data not found"}), 404

    except Exception as e:
        return jsonify({"error": f"Failed to fetch data: {str(e)}"}), 500

# Create a new data entry
@data_bp.route("/", methods=["POST"])
def create_data():
    try:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()
        cursor.execute("INSERT INTO data (name, value) VALUES (?, ?)", (data['name'], data['value']))
        db.commit()
        new_id = cursor.lastrowid
        return jsonify({"id": new_id, "message": "Data created successfully"}), 201
    except Exception as e:
        return jsonify({"error": f"Failed to create data: {str(e)}"}), 500
    
# Update an existing data entry
@data_bp.route("/<int:data_id>", methods=["PUT", "PATCH"])
def update_data(data_id):
    try:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()
        cursor.execute("UPDATE data SET name = ?, value = ? WHERE id = ?", (data['name'], data['value'], data_id))
        db.commit()
        
        if cursor.rowcount == 0:
            return jsonify({"error": "Data not found"}), 404
        
        return jsonify({"message": "Data updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to update data: {str(e)}"}), 500

# Delete a data entry
@data_bp.route("/<int:data_id>", methods=["DELETE"])
def delete_data(data_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("DELETE FROM data WHERE id = ?", (data_id,))
        db.commit()
        
        if cursor.rowcount == 0:
            return jsonify({"error": "Data not found"}), 404
        
        return jsonify({"message": "Data deleted successfully"}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to delete data: {str(e)}"}), 500