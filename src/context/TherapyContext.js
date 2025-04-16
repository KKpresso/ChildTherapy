import React, { createContext, useContext, useState, useEffect } from 'react';

const TherapyContext = createContext();

export const useTherapyContext = () => {
  const context = useContext(TherapyContext);
  if (!context) {
    throw new Error('useTherapyContext must be used within a TherapyProvider');
  }
  return context;
};

export const TherapyProvider = ({ children }) => {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [therapyStats, setTherapyStats] = useState({
    totalSessions: 0,
    artTherapyTypes: [],
    childrenProgress: []
  });

  const updateSessionData = (newMessage) => {
    const { persona, message, response, timestamp } = newMessage;
    
    // Update current session
    if (!currentSession) {
      const newSessionId = Date.now().toString();
      setCurrentSession({
        id: newSessionId,
        persona,
        startTime: timestamp,
        messages: []
      });
    }

    // Add message to current session
    setCurrentSession(prev => ({
      ...prev,
      messages: [...prev.messages, { type: 'therapist', content: message, timestamp }]
    }));

    // Add AI response
    if (response) {
      setCurrentSession(prev => ({
        ...prev,
        messages: [...prev.messages, { type: 'child', content: response, timestamp }]
      }));
    }
  };

  const analyzeEmotions = (text) => {
    // Simple emotion analysis - replace with more sophisticated analysis
    const emotions = {
      anxiety: text.toLowerCase().includes('anxious') || text.toLowerCase().includes('worried'),
      fear: text.toLowerCase().includes('scared') || text.toLowerCase().includes('afraid'),
      happiness: text.toLowerCase().includes('happy') || text.toLowerCase().includes('better'),
      sadness: text.toLowerCase().includes('sad') || text.toLowerCase().includes('upset')
    };
    return Object.keys(emotions).filter(emotion => emotions[emotion])[0] || 'neutral';
  };

  const updateTherapyStats = () => {
    // Calculate stats based on all sessions
    const allSessions = [...sessions];
    if (currentSession) {
      allSessions.push(currentSession);
    }

    const stats = {
      totalSessions: allSessions.length,
      artTherapyTypes: calculateArtTherapyTypes(allSessions),
      childrenProgress: calculateChildrenProgress(allSessions)
    };

    setTherapyStats(stats);
  };

  const calculateArtTherapyTypes = (sessions) => {
    const artTypes = {};
    sessions.forEach(session => {
      session.messages.forEach(msg => {
        if (msg.content.toLowerCase().includes('draw')) {
          artTypes.drawing = (artTypes.drawing || 0) + 1;
        } else if (msg.content.toLowerCase().includes('paint')) {
          artTypes.painting = (artTypes.painting || 0) + 1;
        } else if (msg.content.toLowerCase().includes('sculpt')) {
          artTypes.sculpting = (artTypes.sculpting || 0) + 1;
        }
      });
    });
    return Object.entries(artTypes).map(([name, sessions]) => ({ name, sessions }));
  };

  const calculateChildrenProgress = (sessions) => {
    const progress = {};
    sessions.forEach(session => {
      const { persona } = session;
      if (!progress[persona]) {
        progress[persona] = {
          id: persona,
          name: persona.charAt(0).toUpperCase() + persona.slice(1),
          sessions: 0,
          positiveInteractions: 0,
          lastSession: session.startTime
        };
      }
      progress[persona].sessions += 1;
      
      // Calculate positive interactions based on emotion analysis
      session.messages.forEach(msg => {
        if (msg.type === 'child' && analyzeEmotions(msg.content) === 'happiness') {
          progress[persona].positiveInteractions += 1;
        }
      });
    });

    return Object.values(progress).map(child => ({
      ...child,
      progress: Math.round((child.positiveInteractions / child.sessions) * 100)
    }));
  };

  // Update stats whenever sessions change
  useEffect(() => {
    updateTherapyStats();
  }, [sessions, currentSession]);

  const endCurrentSession = () => {
    if (currentSession) {
      setSessions(prev => [...prev, currentSession]);
      setCurrentSession(null);
    }
  };

  return (
    <TherapyContext.Provider value={{
      sessions,
      currentSession,
      therapyStats,
      updateSessionData,
      endCurrentSession
    }}>
      {children}
    </TherapyContext.Provider>
  );
};
