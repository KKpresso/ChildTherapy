from app import app
from models import db, Child, Guardian, Therapist

def init_database():
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Create initial therapist
        therapist = Therapist(
            name="Dr. Sarah Chen",
            specialization="Respiratory conditions",
            art_forms=["drawing", "painting"],
            experience_years=8
        )
        db.session.add(therapist)
        
        # Create initial children
        aarav = Child(
            name="Aarav Shah",
            age=6,
            medical_condition="asthma",
            emotional_traits=["anxious", "creative"],
            favorite_art_form="drawing",
            assigned_therapist_id=1
        )
        
        dani = Child(
            name="Dani Johnson",
            age=5,
            medical_condition="diabetes",
            emotional_traits=["expressive", "sensitive"],
            favorite_art_form="painting",
            assigned_therapist_id=1
        )
        
        leo = Child(
            name="Leo Thomas",
            age=7,
            medical_condition="cancer",
            emotional_traits=["resilient", "musical"],
            favorite_art_form="music",
            assigned_therapist_id=1
        )
        
        db.session.add_all([aarav, dani, leo])
        db.session.commit()

if __name__ == '__main__':
    init_database()
    print("Database initialized successfully!")
