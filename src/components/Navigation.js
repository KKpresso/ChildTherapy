import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@mui/material';
import {
  People as PeopleIcon,
  ChildCare as ChildIcon,
  SupervisorAccount as SupervisorIcon,
  Palette as ArtIcon,
  Event as SessionIcon,
  Assignment as AssignmentIcon,
  Chat as ChatIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const menuItems = [
  { text: 'Therapists', icon: <PeopleIcon />, path: '/therapists' },
  { text: 'Children', icon: <ChildIcon />, path: '/children' },
  { text: 'Guardians', icon: <PeopleIcon />, path: '/guardians' },
  { text: 'Supervisors', icon: <SupervisorIcon />, path: '/supervisors' },
  { text: 'Art Therapy', icon: <ArtIcon />, path: '/art-therapy' },
  { text: 'Sessions', icon: <SessionIcon />, path: '/sessions' },
  { text: 'Assignments', icon: <AssignmentIcon />, path: '/assignments' },
];

function Navigation() {
  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Child Therapist Database
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <List>
          {menuItems.map((item) => (
            <ListItem button key={item.text} component={RouterLink} to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
          <ListItem button component={RouterLink} to="/interactions">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Interaction Dashboard" />
          </ListItem>
          <ListItem button component={RouterLink} to="/chat">
            <ListItemIcon>
              <ChatIcon />
            </ListItemIcon>
            <ListItemText primary="Virtual Patients" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}

export default Navigation;
