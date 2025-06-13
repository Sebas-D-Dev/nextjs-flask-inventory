from flask import Blueprint

bp = Blueprint('routes', __name__)

from api.routes.employee import employee_bp
from api.routes.hardware import hardware_bp
from api.routes.software import software_bp
from api.routes.data import data_bp
from api.routes.audio_video import audio_video_bp
from api.routes.department import department_bp
from api.routes.inventory_assignments import inventory_bp
from api.routes.user import user_bp

# Register blueprints
bp.register_blueprint(employee_bp)
bp.register_blueprint(hardware_bp)
bp.register_blueprint(software_bp)
bp.register_blueprint(data_bp)
bp.register_blueprint(audio_video_bp)
bp.register_blueprint(department_bp)
bp.register_blueprint(inventory_bp)

# Optionally, export all blueprints as a list for easy import elsewhere
all_blueprints = [
    employee_bp,
    hardware_bp,
    software_bp,
    audio_video_bp,
    data_bp,
    department_bp,
    inventory_bp,
    user_bp
]

# The above code imports the necessary blueprints and registers them with the main blueprint.
# This allows the main application to handle routes defined in these blueprints.
# This structure helps keep the code organized and modular, making it easier to maintain and extend.