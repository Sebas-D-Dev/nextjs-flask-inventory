from flask import Blueprint, request, jsonify, session
from api.db.database import get_db
from api.utils.security import hash_password, verify_password

user_bp = Blueprint("user", __name__, url_prefix="/api")

ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin"
SUPERADMIN_USERNAME = "superadmin"
SUPERADMIN_PASSWORD = "superadmin"

# Initialize the database with an admin user if it doesn't exist
def init_admin_user():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT COUNT(*) FROM users WHERE user_role = 'admin'")
    count = cursor.fetchone()[0]
    if count == 0:
        hashed_pw = hash_password(ADMIN_PASSWORD)
        cursor.execute(
            "INSERT INTO users (username, password, user_role, security_level) VALUES (?, ?, ?, ?)",
            (ADMIN_USERNAME, hashed_pw, "admin", 3)
        )
        db.commit()
    cursor.close()

def init_superadmin_user():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT COUNT(*) FROM users WHERE user_role = 'super_admin'")
    count = cursor.fetchone()[0]
    if count == 0:
        hashed_pw = hash_password(SUPERADMIN_PASSWORD)
        cursor.execute(
            "INSERT INTO users (username, password, user_role, security_level) VALUES (?, ?, ?, ?)",
            (SUPERADMIN_USERNAME, hashed_pw, "super_admin", 4)
        )
        db.commit()
    cursor.close()

# Helper function to get user role by user_id
def get_user_role(user_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT user_role FROM users WHERE user_id = ?", (user_id,))
    row = cursor.fetchone()
    cursor.close()
    if row:
        return row[0]
    return None

@user_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    db = get_db()
    cursor = db.cursor()
    hashed_pw = hash_password(password)
    cursor.execute(
        "INSERT INTO users (username, password, user_role, security_level) VALUES (?, ?, ?, ?)",
        (username, hashed_pw, "intern", 2)
    )
    db.commit()
    cursor.close()
    return jsonify({"message": "User registered!"}), 201

@user_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT user_id, password, user_role FROM users WHERE username = ?", (username,))
    user = cursor.fetchone()
    cursor.close()
    if user and verify_password(user[1], password):
        session["user_id"] = user[0]
        session["role"] = user[2]
        return jsonify({"success": True, "role": user[2]}), 200
    return jsonify({"success": False, "error": "Invalid credentials"}), 401

@user_bp.route("/users", methods=["GET"])
def get_users():
    user_id = session.get("user_id")
    role = get_user_role(user_id)
    if role not in ("intern", "admin", "super_admin"):
        return jsonify({"error": "Unauthorized"}), 403

    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT user_id, username, user_role, security_level FROM users")
    users = cursor.fetchall()
    cursor.close()
    
    user_list = []
    for user in users:
        user_dict = {
            "user_id": user[0],
            "username": user[1],
            "role": user[2],
            "security_level": user[3]
        }
        user_list.append(user_dict)
    
    return jsonify(user_list), 200

@user_bp.route("/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    current_user_id = session.get("user_id")
    role = get_user_role(current_user_id)
    if role not in ("admin", "super_admin"):
        return jsonify({"error": "Unauthorized"}), 403

    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM users WHERE user_id = ?", (user_id,))
    db.commit()
    deleted = cursor.rowcount
    cursor.close()

    if deleted == 0:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"message": "User deleted successfully"}), 200

# Call these functions at app startup or DB init
# init_admin_user()
# init_superadmin_user()

# Example: Protect other endpoints (inventory, employees, departments, etc.)
# In each relevant route, use the same pattern:
# - Allow GET, POST, PUT/PATCH for role in ("intern", "admin", "super_admin")
# - Allow DELETE only for role in ("admin", "super_admin")