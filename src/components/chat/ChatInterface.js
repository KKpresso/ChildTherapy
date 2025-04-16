import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Chip,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SaveIcon from '@mui/icons-material/Save';
import { useTherapyContext } from '../../context/TherapyContext';

const personas = [
  {
    id: 'aarav',
    name: 'Aarav Shah',
    age: 6,
    condition: 'asthma',
    preferredArt: 'drawing'
  },
  {
    id: 'dani',
    name: 'Dani Johnson',
    age: 5,
    condition: 'diabetes',
    preferredArt: 'painting'
  },
  {
    id: 'leo',
    name: 'Leo Thomas',
    age: 7,
    condition: 'cancer',
    preferredArt: 'music'
  }
];

const ChatInterface = () => {
  const { updateSessionData } = useTherapyContext();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedPersona, setSelectedPersona] = useState(personas[0]);
  const [error, setError] = useState(null);
  const [matchedTherapist, setMatchedTherapist] = useState(null);
  const messagesEndRef = useRef(null);
  
  // Notes state
  const [sessionNotes, setSessionNotes] = useState('');
  const [emotionalState, setEmotionalState] = useState('neutral');
  const [artEngagement, setArtEngagement] = useState('moderate');
  const [noteSaved, setNoteSaved] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handlePersonaSelect = (persona) => {
    setSelectedPersona(persona);
    setMessages([]);
    setMatchedTherapist(null);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setError(null);
    const timestamp = new Date().toISOString();
    
    // Add therapist message
    const therapistMessage = {
      id: Date.now(),
      text: newMessage,
      sender: 'therapist',
      timestamp
    };
    
    setMessages(prev => [...prev, therapistMessage]);
    setNewMessage('');

    try {
      const response = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newMessage,
          persona: selectedPersona.id,
          history: messages
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      
      // Update matched therapist info
      if (data.therapist && !matchedTherapist) {
        setMatchedTherapist(data.therapist);
      }

      // Add AI response
      const aiMessage = {
        id: Date.now() + 1,
        text: data.response,
        sender: 'child',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Update therapy context
      updateSessionData({
        persona: selectedPersona.id,
        message: newMessage,
        response: data.response,
        timestamp,
        therapist: data.therapist
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to get response from the virtual patient. Please try again.');
      
      // Remove the last message if we couldn't get a response
      setMessages(prev => prev.slice(0, -1));
    }
  };

  const handleSaveNotes = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          childId: selectedPersona.id,
          sessionNotes,
          emotionalState,
          artEngagement,
          artForm: selectedPersona.preferredArt,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save notes');
      }

      const data = await response.json();
      console.log('Notes saved:', data);
      
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 3000);
    } catch (error) {
      console.error('Error saving notes:', error);
      setError('Failed to save notes. Please try again.');
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', gap: 2 }}>
      {/* Main chat area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6">
            Current Patient: {selectedPersona.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Age: {selectedPersona.age} | Condition: {selectedPersona.condition}
          </Typography>
        </Paper>

        {matchedTherapist && (
          <Paper elevation={3} sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Avatar sx={{ bgcolor: 'primary.dark' }}>
                  {matchedTherapist.name.split(' ').map(n => n[0]).join('')}
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h6">{matchedTherapist.name}</Typography>
                <Typography variant="body2">
                  Specialization: {matchedTherapist.specialization}
                </Typography>
                <Typography variant="body2">
                  Experience: {matchedTherapist.experience}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {matchedTherapist.art_forms.map((art) => (
                    <Chip
                      key={art}
                      label={art}
                      size="small"
                      sx={{ mr: 1, bgcolor: selectedPersona.preferredArt === art ? 'success.main' : 'primary.main' }}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item>
                <Chip
                  label={`${matchedTherapist.match_score}% Match`}
                  color={matchedTherapist.match_score === 100 ? "success" : "primary"}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Paper>
        )}

        {error && (
          <Paper elevation={3} sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
            <Typography>{error}</Typography>
          </Paper>
        )}

        <Paper 
          elevation={3} 
          sx={{ 
            p: 2,
            flexGrow: 1,
            maxHeight: '50vh',
            overflow: 'auto',
            bgcolor: 'background.default'
          }}
        >
          <List>
            {messages.map((message) => (
              <ListItem
                key={message.id}
                sx={{
                  flexDirection: message.sender === 'therapist' ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  mb: 2
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ 
                    bgcolor: message.sender === 'therapist' ? 'primary.main' : 'secondary.main',
                    ml: message.sender === 'therapist' ? 2 : 0,
                    mr: message.sender === 'therapist' ? 0 : 2
                  }}>
                    {message.sender === 'therapist' ? 'T' : selectedPersona.name[0]}
                  </Avatar>
                </ListItemAvatar>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    maxWidth: '70%',
                    bgcolor: message.sender === 'therapist' ? 'primary.light' : 'secondary.light',
                    color: message.sender === 'therapist' ? 'primary.contrastText' : 'secondary.contrastText'
                  }}
                >
                  <Typography variant="body1">{message.text}</Typography>
                  <Typography variant="caption" color="inherit" sx={{ opacity: 0.7 }}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </Typography>
                </Paper>
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </List>
        </Paper>

        <Paper elevation={3} sx={{ p: 2, bgcolor: 'background.paper' }}>
          <Grid container spacing={2}>
            <Grid item xs>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
            </Grid>
            <Grid item>
              <IconButton 
                color="primary" 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                sx={{ 
                  height: '100%',
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  }
                }}
              >
                <SendIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Select Patient
          </Typography>
          <Grid container spacing={2}>
            {personas.map((persona) => (
              <Grid item xs={12} sm={4} key={persona.id}>
                <Card 
                  elevation={selectedPersona.id === persona.id ? 8 : 1}
                  sx={{ 
                    cursor: 'pointer',
                    bgcolor: selectedPersona.id === persona.id ? 'primary.light' : 'background.paper',
                    '&:hover': {
                      bgcolor: 'primary.light',
                    }
                  }}
                  onClick={() => handlePersonaSelect(persona)}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {persona.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Age: {persona.age}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Condition: {persona.condition}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Preferred Art: {persona.preferredArt}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>

      {/* Notes Panel */}
      <Paper 
        elevation={3} 
        sx={{ 
          width: '300px',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          height: '100%'
        }}
      >
        <Typography variant="h6" gutterBottom>
          Session Notes
        </Typography>
        
        <FormControl fullWidth size="small">
          <InputLabel>Emotional State</InputLabel>
          <Select
            value={emotionalState}
            label="Emotional State"
            onChange={(e) => setEmotionalState(e.target.value)}
          >
            <MenuItem value="very_positive">Very Positive</MenuItem>
            <MenuItem value="positive">Positive</MenuItem>
            <MenuItem value="neutral">Neutral</MenuItem>
            <MenuItem value="anxious">Anxious</MenuItem>
            <MenuItem value="distressed">Distressed</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Art Engagement</InputLabel>
          <Select
            value={artEngagement}
            label="Art Engagement"
            onChange={(e) => setArtEngagement(e.target.value)}
          >
            <MenuItem value="high">High Engagement</MenuItem>
            <MenuItem value="moderate">Moderate</MenuItem>
            <MenuItem value="low">Low Engagement</MenuItem>
            <MenuItem value="resistant">Resistant</MenuItem>
          </Select>
        </FormControl>

        <TextField
          multiline
          rows={15}
          fullWidth
          variant="outlined"
          placeholder="Enter session notes here..."
          value={sessionNotes}
          onChange={(e) => setSessionNotes(e.target.value)}
          sx={{ flexGrow: 1 }}
        />

        <Button
          fullWidth
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSaveNotes}
          disabled={!sessionNotes.trim()}
        >
          Save Notes
        </Button>

        <Snackbar
          open={noteSaved}
          autoHideDuration={3000}
          onClose={() => setNoteSaved(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert severity="success" sx={{ width: '100%' }}>
            Notes saved successfully!
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default ChatInterface;
