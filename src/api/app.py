from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
from chat_routes import chat_bp
from notes_routes import notes_bp
from models import init_db

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///therapy.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
init_db(app)

# Register blueprints
app.register_blueprint(chat_bp)
app.register_blueprint(notes_bp)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
