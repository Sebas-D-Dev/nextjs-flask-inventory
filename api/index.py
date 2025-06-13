from flask import Flask
from flask_cors import CORS
import os

from api.routes.employee import employee_bp
from api.routes.hardware import hardware_bp
from api.routes.software import software_bp
from api.routes.data import data_bp
from api.routes.audio_video import audio_video_bp
from api.routes.department import department_bp
from api.routes.inventory_assignments import inventory_bp
from api.routes.user import user_bp

app = Flask(__name__)
app.secret_key = "your-very-secret-key"  # Use a strong, random value in production

# Determine environment
ENV = os.getenv("FLASK_ENV", "development")
if ENV == "production":
    # Only allow frontend domain in production
    CORS(app, origins=["https://nextjs-flask-inventory.vercel.app"])
else:
    # Allow localhost and frontend domain in development
    CORS(app, origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://nextjs-flask-inventory.vercel.app"
    ])

app.register_blueprint(employee_bp)
app.register_blueprint(hardware_bp)
app.register_blueprint(software_bp)
app.register_blueprint(data_bp)
app.register_blueprint(audio_video_bp)
app.register_blueprint(department_bp)
app.register_blueprint(inventory_bp)
app.register_blueprint(user_bp)

if __name__ == "__main__":
    debug_mode = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    port = int(os.getenv("FLASK_PORT", 5328))
    app.run(debug=debug_mode, port=port)