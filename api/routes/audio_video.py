from flask import Blueprint, jsonify, request
from api.db.database import get_db

audio_video_bp = Blueprint("audio_video", __name__, url_prefix="/api/audio_video")

# Get all audio/video entries
@audio_video_bp.route("/", methods=["GET"])
def get_all_audio_video():
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM audio_video")
        rows = cursor.fetchall()
        audio_video_list = [dict(row) for row in rows]  # Convert each row to dict
        return jsonify({"audio_video": audio_video_list}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch audio/video entries: {str(e)}"}), 500
    
# Get audio/video by ID
@audio_video_bp.route("/<int:audio_video_id>", methods=["GET"])
def get_audio_video_by_id(audio_video_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM audio_video WHERE id = ?", (audio_video_id,))
        row = cursor.fetchone()
        if row:
            return jsonify({"audio_video": dict(row)}), 200
        else:
            return jsonify({"error": "Audio/Video entry not found"}), 404
    except Exception as e:
        return jsonify({"error": f"Failed to fetch audio/video entry: {str(e)}"}), 500
    
# Create new audio/video entry
@audio_video_bp.route("/", methods=["POST"])
def create_audio_video():
    try:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO audio_video (title, description, file_path) VALUES (?, ?, ?)",
            (data['title'], data['description'], data['file_path'])
        )
        db.commit()
        new_id = cursor.lastrowid
        return jsonify({"id": new_id, "message": "Audio/Video entry created successfully"}), 201
    except Exception as e:
        return jsonify({"error": f"Failed to create audio/video entry: {str(e)}"}), 500
    
# Update audio/video entry
@audio_video_bp.route("/<int:audio_video_id>", methods=["PUT", "PATCH"])
def update_audio_video(audio_video_id):
    try:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "UPDATE audio_video SET title = ?, description = ?, file_path = ? WHERE id = ?",
            (data['title'], data['description'], data['file_path'], audio_video_id)
        )
        db.commit()
        
        if cursor.rowcount == 0:
            return jsonify({"error": "Audio/Video entry not found"}), 404
        
        return jsonify({"message": "Audio/Video entry updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to update audio/video entry: {str(e)}"}), 500
    
# Delete audio/video entry
@audio_video_bp.route("/<int:audio_video_id>", methods=["DELETE"])
def delete_audio_video(audio_video_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("DELETE FROM audio_video WHERE id = ?", (audio_video_id,))
        db.commit()
        
        if cursor.rowcount == 0:
            return jsonify({"error": "Audio/Video entry not found"}), 404
        
        return jsonify({"message": "Audio/Video entry deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to delete audio/video entry: {str(e)}"}), 500