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

const platformIcons = {
  WhatsApp: <WhatsAppOutlined style={{ color: '#25D366' }} />,
  Signal: <FontAwesomeIcon icon={faSignalMessenger} style={{ color: '#3A76F0' }} />
};

export default function Settings() {
  const username = localStorage.getItem('username') || 'User';
  let platforms = [];
  try {
    platforms = JSON.parse(localStorage.getItem('platforms') || '[]');
  } catch {}
  const apiKey = localStorage.getItem('token') || '';

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

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid size={12}>
        <Typography variant="h5">Settings</Typography>
      </Grid>

      {/* User Info */}
      <Grid size={12}>
        <MainCard>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ mr: 2 }}>{username[0]?.toUpperCase()}</Avatar>
            <Box>
              <Typography variant="h6">{username}</Typography>
              <Typography variant="body2" color="text.secondary">
                Account Info
              </Typography>
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
          Manage your account, connected platforms, and API keys here. For support, contact admin@sherlockwisdom.com.
        </Typography>
      </Grid>
    </Grid>
  );
}
