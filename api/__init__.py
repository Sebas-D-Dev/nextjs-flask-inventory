from flask import Flask
from api.inventory_assignments.routes import inventory_bp
from api.db.database import get_db, close_db

app = Flask(__name__)

# Register the blueprint AFTER initializing the app
app.register_blueprint(inventory_bp, url_prefix="/api/inventory_assignments")
app.teardown_appcontext(close_db)