from flask import Blueprint, request, jsonify
from datetime import datetime
from models import db, TherapySession, ProgressNote
import logging

notes_bp = Blueprint('notes', __name__)
logger = logging.getLogger(__name__)

@notes_bp.route('/api/notes', methods=['POST'])
def save_notes():
    try:
        data = request.json
        logger.info(f"Received notes data: {data}")
        
        # Extract data from request
        child_id = data.get('childId')
        session_notes = data.get('sessionNotes')
        emotional_state = data.get('emotionalState')
        art_engagement = data.get('artEngagement')
        
        if not all([child_id, session_notes]):
            return jsonify({'error': 'Missing required fields'}), 400

        # Create therapy session record
        session = TherapySession(
            child_id=child_id,
            therapist_id=1,  # TODO: Get from auth context
            session_date=datetime.utcnow(),
            art_form_used=data.get('artForm', 'unknown'),
            emotional_response={'state': emotional_state},
            session_notes=session_notes
        )
        db.session.add(session)
        
        # Create progress note
        progress_note = ProgressNote(
            child_id=child_id,
            session_id=session.id,
            note_text=session_notes,
            progress_indicators={
                'emotional_state': emotional_state,
                'art_engagement': art_engagement,
                'timestamp': datetime.utcnow().isoformat()
            }
        )
        db.session.add(progress_note)
        
        # Commit both records
        db.session.commit()
        
        return jsonify({
            'message': 'Notes saved successfully',
            'sessionId': session.id,
            'timestamp': datetime.utcnow().isoformat()
        })

    except Exception as e:
        logger.error(f"Error saving notes: {str(e)}", exc_info=True)
        db.session.rollback()
        return jsonify({'error': 'Failed to save notes'}), 500

@notes_bp.route('/api/notes/<child_id>', methods=['GET'])
def get_notes(child_id):
    try:
        # Get the latest session notes for the child
        notes = ProgressNote.query.filter_by(child_id=child_id)\
            .order_by(ProgressNote.created_at.desc())\
            .limit(10)\
            .all()
            
        return jsonify([{
            'id': note.id,
            'text': note.note_text,
            'indicators': note.progress_indicators,
            'created_at': note.created_at.isoformat()
        } for note in notes])

    except Exception as e:
        logger.error(f"Error retrieving notes: {str(e)}", exc_info=True)
        return jsonify({'error': 'Failed to retrieve notes'}), 500
