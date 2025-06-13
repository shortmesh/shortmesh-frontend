// material-ui
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MainCard from 'components/MainCard';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import { CopyOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignalMessenger } from '@fortawesome/free-brands-svg-icons';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
// Add import for available avatars
import avatar1 from 'assets/images/users/avatar-1.png';
import avatar2 from 'assets/images/users/avatar-2.png';
import avatar3 from 'assets/images/users/avatar-3.png';
import avatar4 from 'assets/images/users/avatar-4.png';
import avatar5 from 'assets/images/users/avatar-5.png';
// ...add more as needed...

const platformIcons = {
  WhatsApp: <WhatsAppOutlined style={{ color: '#25D366' }} />,
  Signal: <FontAwesomeIcon icon={faSignalMessenger} style={{ color: '#3A76F0' }} />
};

const availableAvatars = [
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5
  // ...add more as needed...
];

export default function Settings() {
  const username = localStorage.getItem('username') || 'User';
  let platforms = [];
  try {
    platforms = JSON.parse(localStorage.getItem('platforms') || '[]');
  } catch {}
  const apiKey = localStorage.getItem('token') || '';

  // Avatar state
  const initialAvatar = localStorage.getItem('avatar') || avatar1;
  const [selectedAvatar, setSelectedAvatar] = useState(initialAvatar);
  const [copiedKey, setCopiedKey] = useState('');

  const handleCopy = (key) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 1500);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  // Handle avatar change
  const handleAvatarChange = (avatar) => {
    setSelectedAvatar(avatar);
    localStorage.setItem('avatar', avatar);
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid size={12}>
        <Typography variant="h5">Settings</Typography>
      </Grid>

      {/* User Info */}
      <Grid size={12}>
        <MainCard>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar src={selectedAvatar} sx={{ mr: 2 }} />
            <Box>
              <Typography variant="h6">{username}</Typography>
              <Typography variant="body2" color="text.secondary">
                Account Info
              </Typography>
            </Box>
          </Box>
          {/* Avatar selection */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Change Avatar
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {availableAvatars.map((av, idx) => (
                <Avatar
                  key={av}
                  src={av}
                  sx={{
                    width: 48,
                    height: 48,
                    border: selectedAvatar === av ? '2px solid #1976d2' : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'border 0.2s',
                    boxShadow: selectedAvatar === av ? 2 : 0
                  }}
                  onClick={() => handleAvatarChange(av)}
                />
              ))}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" color="error" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </MainCard>
      </Grid>

      <Grid size={12}>
        <MainCard title="Connected Platforms">
          {platforms.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No platforms connected.
            </Typography>
          ) : (
            <List>
              {platforms.map((name) => (
                <ListItem key={name} sx={{ pl: 0 }}>
                  <Avatar sx={{ mr: 2, bgcolor: 'transparent' }}>{platformIcons[name] || name[0]}</Avatar>
                  <ListItemText primary={name} />
                </ListItem>
              ))}
            </List>
          )}
        </MainCard>
      </Grid>

      <Grid size={12}>
        <MainCard title="API Keys">
          {!apiKey ? (
            <Typography variant="body2" color="text.secondary">
              No API keys found.
            </Typography>
          ) : (
            <List>
              <ListItem
                key={apiKey}
                secondaryAction={
                  <IconButton edge="end" aria-label="copy" onClick={() => handleCopy(apiKey)}>
                    <CopyOutlined />
                  </IconButton>
                }
                sx={{ pl: 0 }}
              >
                <ListItemText primary={apiKey} secondary={copiedKey === apiKey ? 'Copied!' : null} sx={{ wordBreak: 'break-all' }} />
              </ListItem>
            </List>
          )}
        </MainCard>
      </Grid>

      <Grid size={12}>
        <Divider sx={{ my: 3 }} />
        <Typography variant="caption" color="text.secondary">
          Manage your account, connected platforms, and API keys here. For support, contact developers@smswithoutborders.com
        </Typography>
      </Grid>
    </Grid>
  );
}
