import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Container } from '@mui/material';
import Navigation from './components/Navigation';
import { NotificationProvider } from './contexts/NotificationContext';
import { TherapyProvider } from './context/TherapyContext';

// Import pages
import Dashboard from './components/Dashboard';
import TherapistList from './components/therapists/TherapistList';
import ChildList from './components/children/ChildList';
import GuardianList from './components/guardians/GuardianList';
import SupervisorList from './components/supervisors/SupervisorList';
import ArtTherapyList from './components/art-therapy/ArtTherapyList';
import SessionList from './components/sessions/SessionList';
import ProgressDashboard from './components/progress/ProgressDashboard';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';
import NotificationCenter from './components/notifications/NotificationCenter';
import ChatInterface from './components/chat/ChatInterface';
import InteractionDashboard from './components/dashboard/InteractionDashboard';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <Router>
          <TherapyProvider>
            <Box sx={{ display: 'flex' }}>
              <Navigation>
                <NotificationCenter />
              </Navigation>
              <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
                <Container>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/therapists" element={<TherapistList />} />
                    <Route path="/children" element={<ChildList />} />
                    <Route path="/guardians" element={<GuardianList />} />
                    <Route path="/supervisors" element={<SupervisorList />} />
                    <Route path="/art-therapy" element={<ArtTherapyList />} />
                    <Route path="/sessions" element={<SessionList />} />
                    <Route path="/progress" element={<ProgressDashboard />} />
                    <Route path="/analytics" element={<AnalyticsDashboard />} />
                    <Route path="/interactions" element={<InteractionDashboard />} />
                    <Route path="/chat" element={<ChatInterface />} />
                  </Routes>
                </Container>
              </Box>
            </Box>
          </TherapyProvider>
        </Router>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
