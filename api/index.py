from flask import Flask
from flask_cors import CORS
from api.inventory_assignments.routes import inventory_bp
from api.employees.routes import employee_bp
from api.departments.routes import department_bp

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

app.register_blueprint(department_bp)
app.register_blueprint(employee_bp)
app.register_blueprint(inventory_bp)

if __name__ == "__main__":
    import os
    debug_mode = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    app.run(debug=debug_mode, port=5328)  # Ensure correct port usage