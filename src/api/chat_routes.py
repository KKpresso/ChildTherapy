from flask import Blueprint, request, jsonify
import os
from datetime import datetime
import logging

chat_bp = Blueprint('chat', __name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Predefined response sequences for each persona
PERSONA_RESPONSES = {
    'aarav': [
        "Hi! I'm Aarav. Sometimes it's hard to breathe, but drawing makes me feel better.",
        "I love using bright colors! They help me forget about my inhaler.",
        "Yesterday, I drew a picture of me playing soccer without getting tired. That's my dream!",
        "When I feel scared about breathing, I draw superheroes who have special breathing powers.",
        "My favorite thing to draw is the sky. It's so big and full of air!",
        "The doctor said my breathing is getting better. I drew a happy face to celebrate!",
        "Sometimes I get nervous at school when I can't breathe well, but my drawings help me stay calm.",
        "I made a comic book about a boy who turns his inhaler into a magic wand!",
        "Drawing helps me show others how I feel when my chest gets tight.",
        "I want to be an artist when I grow up. Maybe I'll draw comics about kids like me!"
    ],
    'dani': [
        "Hello! I'm Dani. I love painting butterflies - they remind me that changes can be beautiful.",
        "Today I painted my insulin pump with flowers. Now it looks pretty!",
        "Sometimes I feel different from other kids, but my art shows I'm special.",
        "I made a rainbow painting about being brave during my doctor visits.",
        "Painting helps me tell my friends how I feel without using words.",
        "I learned a new way to mix colors today. It's like mixing my medicine - it has to be just right!",
        "When I'm scared about needles, I paint happy things to feel better.",
        "My favorite colors are pink and purple. They make me feel strong!",
        "I painted my whole family today, including my doctor who helps me stay healthy.",
        "Art class is my favorite because I can express myself and forget about diabetes for a while."
    ],
    'leo': [
        "Hi, I'm Leo! Music makes me feel stronger, even on tough treatment days.",
        "I wrote a song about being a brave knight fighting dragons. The dragons are like my cancer.",
        "The hospital isn't so scary when I can play music. It's like having a superpower!",
        "Today I learned a new song on the piano. It made all the doctors smile!",
        "Sometimes I feel tired, but music gives me energy to keep going.",
        "I made up a special song for when I take my medicine. It helps me be brave.",
        "The nurses say I'm their favorite musician. That makes me happy!",
        "When I can't sleep, I hum my favorite tunes and imagine nice dreams.",
        "Music therapy is the best part of my day. It makes me forget about being sick.",
        "I want to play in a big concert someday and show other kids that they can be strong too!"
    ]
}

# Define therapist specializations and art forms
THERAPIST_SPECIALIZATIONS = {
    'asthma': {
        'name': 'Dr. Sarah Chen',
        'specialization': 'Respiratory conditions',
        'art_forms': ['drawing', 'painting'],
        'experience': '8 years with pediatric asthma patients'
    },
    'diabetes': {
        'name': 'Dr. Michael Rodriguez',
        'specialization': 'Endocrine disorders',
        'art_forms': ['painting', 'sculpting'],
        'experience': '10 years with pediatric diabetes care'
    },
    'cancer': {
        'name': 'Dr. Emily Thompson',
        'specialization': 'Oncology',
        'art_forms': ['drawing', 'music'],
        'experience': '12 years in pediatric oncology'
    }
}

PERSONA_PROMPTS = {
    'aarav': {
        'condition': 'asthma',
        'preferred_art': 'drawing'
    },
    'dani': {
        'condition': 'diabetes',
        'preferred_art': 'painting'
    },
    'leo': {
        'condition': 'cancer',
        'preferred_art': 'music'
    }
}

def get_matched_therapist(persona_id):
    """Get the best matched therapist based on child's condition and art preferences."""
    if persona_id not in PERSONA_PROMPTS:
        return None
        
    child = PERSONA_PROMPTS[persona_id]
    condition = child['condition']
    preferred_art = child['preferred_art']
    
    # Find therapist with matching specialization
    therapist = THERAPIST_SPECIALIZATIONS.get(condition)
    if not therapist:
        return None
        
    # Check if therapist can support child's preferred art form
    art_match = preferred_art in therapist['art_forms']
    
    return {
        **therapist,
        'art_match': art_match,
        'match_score': 100 if art_match else 70  # Higher score if art preference matches
    }

@chat_bp.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        logger.info(f"Received chat request: {data}")
        
        message = data.get('message')
        persona_id = data.get('persona')
        history = data.get('history', [])

        if not message or not persona_id:
            logger.error("Missing required parameters")
            return jsonify({'error': 'Missing required parameters'}), 400

        if persona_id not in PERSONA_PROMPTS:
            logger.error(f"Invalid persona ID: {persona_id}")
            return jsonify({'error': 'Invalid persona ID'}), 400

        # Get matched therapist
        therapist = get_matched_therapist(persona_id)
        if not therapist:
            logger.error(f"No matching therapist found for persona {persona_id}")
            return jsonify({'error': 'No matching therapist found'}), 400

        # Get the next response in sequence
        responses = PERSONA_RESPONSES[persona_id]
        response_index = len([m for m in history if m['sender'] == 'child'])
        ai_response = responses[response_index % len(responses)]  # Loop back to start if we reach the end
        
        logger.info(f"Sending response {response_index}: {ai_response}")

        return jsonify({
            'response': ai_response,
            'timestamp': datetime.utcnow().isoformat(),
            'therapist': therapist
        })

    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}", exc_info=True)
        return jsonify({'error': 'Internal server error'}), 500
