import React from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useTherapyContext } from '../../context/TherapyContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const InteractionDashboard = () => {
  const { therapyStats } = useTherapyContext();

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Interaction Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Total Sessions</Typography>
            <Typography variant="h3">{therapyStats.totalSessions}</Typography>
          </Paper>
        </Grid>

        {/* Art Therapy Distribution */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2, height: '300px' }}>
            <Typography variant="h6">Art Therapy Types Distribution</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={therapyStats.artTherapyTypes}
                  dataKey="sessions"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {therapyStats.artTherapyTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Children Progress */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Virtual Children Progress
            </Typography>
            <List>
              {therapyStats.childrenProgress.map((child) => (
                <ListItem key={child.id} divider>
                  <ListItemAvatar>
                    <Avatar src={`/avatars/${child.id}.jpg`} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {child.name}
                        <Chip 
                          label={`${child.sessions} sessions`} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Positive Interactions
                          </Typography>
                          <Typography variant="body2" color="primary">
                            {child.positiveInteractions}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            sx={{
                              flexGrow: 1,
                              height: 8,
                              bgcolor: 'grey.200',
                              borderRadius: 1,
                              position: 'relative',
                              overflow: 'hidden'
                            }}
                          >
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                height: '100%',
                                bgcolor: 'primary.main',
                                width: `${child.progress}%`,
                                transition: 'width 0.5s ease-in-out'
                              }}
                            />
                          </Box>
                          <Typography variant="body2">
                            {child.progress}%
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                          Last Session: {new Date(child.lastSession).toLocaleDateString()}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InteractionDashboard;
