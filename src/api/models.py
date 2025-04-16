from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Child(db.Model):
    __tablename__ = 'children'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    medical_condition = db.Column(db.String(100), nullable=False)
    emotional_traits = db.Column(db.JSON)  # Store as JSON array
    favorite_art_form = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    guardian_id = db.Column(db.Integer, db.ForeignKey('guardians.id'))
    assigned_therapist_id = db.Column(db.Integer, db.ForeignKey('therapists.id'))
    sessions = db.relationship('TherapySession', backref='child', lazy=True)
    progress_notes = db.relationship('ProgressNote', backref='child', lazy=True)

class Guardian(db.Model):
    __tablename__ = 'guardians'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    children = db.relationship('Child', backref='guardian', lazy=True)

class Therapist(db.Model):
    __tablename__ = 'therapists'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    specialization = db.Column(db.String(100), nullable=False)
    art_forms = db.Column(db.JSON)  # Store as JSON array
    experience_years = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    assigned_children = db.relationship('Child', backref='therapist', lazy=True)
    sessions = db.relationship('TherapySession', backref='therapist', lazy=True)
    feedback_received = db.relationship('SupervisorFeedback', backref='therapist', lazy=True)

class TherapySession(db.Model):
    __tablename__ = 'therapy_sessions'
    
    id = db.Column(db.Integer, primary_key=True)
    child_id = db.Column(db.Integer, db.ForeignKey('children.id'), nullable=False)
    therapist_id = db.Column(db.Integer, db.ForeignKey('therapists.id'), nullable=False)
    session_date = db.Column(db.DateTime, nullable=False)
    art_form_used = db.Column(db.String(50), nullable=False)
    session_notes = db.Column(db.Text)
    emotional_response = db.Column(db.JSON)  # Store emotional indicators as JSON
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    progress_notes = db.relationship('ProgressNote', backref='session', lazy=True)
    supervisor_feedback = db.relationship('SupervisorFeedback', backref='session', lazy=True)

class ProgressNote(db.Model):
    __tablename__ = 'progress_notes'
    
    id = db.Column(db.Integer, primary_key=True)
    child_id = db.Column(db.Integer, db.ForeignKey('children.id'), nullable=False)
    session_id = db.Column(db.Integer, db.ForeignKey('therapy_sessions.id'), nullable=False)
    note_text = db.Column(db.Text, nullable=False)
    progress_indicators = db.Column(db.JSON)  # Store progress metrics as JSON
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class SupervisorFeedback(db.Model):
    __tablename__ = 'supervisor_feedback'
    
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('therapy_sessions.id'), nullable=False)
    therapist_id = db.Column(db.Integer, db.ForeignKey('therapists.id'), nullable=False)
    feedback_text = db.Column(db.Text, nullable=False)
    improvement_areas = db.Column(db.JSON)  # Store areas for improvement as JSON
    strengths = db.Column(db.JSON)  # Store observed strengths as JSON
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

def init_db(app):
    """Initialize the database and create tables"""
    db.init_app(app)
    with app.app_context():
        db.create_all()
